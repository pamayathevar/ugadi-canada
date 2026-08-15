-- Ugadi Rewards
-- Points are earned and redeemed only by trusted checkout/payment functions.

create type public.reward_tier as enum ('seedling', 'harvest', 'heritage');
create type public.reward_transaction_type as enum ('earned', 'redeemed', 'reversed', 'adjusted', 'expired');

create table public.reward_offers (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  description text,
  points_cost integer not null check (points_cost > 0),
  discount_cents integer not null check (discount_cents > 0),
  minimum_subtotal_cents integer not null default 0 check (minimum_subtotal_cents >= 0),
  active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create table public.reward_accounts (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  points_balance integer not null default 0 check (points_balance >= 0),
  lifetime_points integer not null default 0 check (lifetime_points >= 0),
  tier public.reward_tier not null default 'seedling',
  enrolled_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (lifetime_points >= points_balance)
);

alter table public.orders
  add column reward_offer_id uuid references public.reward_offers(id),
  add column reward_points_redeemed integer not null default 0 check (reward_points_redeemed >= 0),
  add column reward_discount_cents integer not null default 0 check (reward_discount_cents >= 0),
  add column reward_points_earned integer not null default 0 check (reward_points_earned >= 0),
  add constraint orders_reward_discount_within_subtotal check (reward_discount_cents <= subtotal_cents);

create table public.reward_transactions (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.reward_accounts(user_id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  offer_id uuid references public.reward_offers(id),
  transaction_type public.reward_transaction_type not null,
  points_delta integer not null check (points_delta <> 0),
  balance_after integer not null check (balance_after >= 0),
  note text,
  idempotency_key uuid not null unique default gen_random_uuid(),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  check (
    (transaction_type = 'earned' and points_delta > 0)
    or (transaction_type in ('redeemed', 'expired') and points_delta < 0)
    or transaction_type in ('reversed', 'adjusted')
  )
);

create index reward_offers_active_window_idx on public.reward_offers(active, starts_at, ends_at);
create index reward_transactions_user_created_idx on public.reward_transactions(user_id, created_at desc);
create index reward_transactions_order_idx on public.reward_transactions(order_id);

alter table public.reward_offers enable row level security;
alter table public.reward_accounts enable row level security;
alter table public.reward_transactions enable row level security;

create policy "active reward offers are public" on public.reward_offers for select
  using (
    (active and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at > now()))
    or public.is_staff()
  );
create policy "users read own reward account" on public.reward_accounts for select
  using (user_id = auth.uid() or public.is_staff());
create policy "users read own reward activity" on public.reward_transactions for select
  using (user_id = auth.uid() or public.is_staff());

create policy "staff manage reward offers" on public.reward_offers for all
  using (public.is_staff()) with check (public.is_staff());
create policy "staff manage reward accounts" on public.reward_accounts for all
  using (public.is_staff()) with check (public.is_staff());
create policy "staff manage reward transactions" on public.reward_transactions for all
  using (public.is_staff()) with check (public.is_staff());

insert into public.reward_offers (code, name, description, points_cost, discount_cents, minimum_subtotal_cents)
values
  ('MARKET5', '$5 market reward', 'A little thank-you for the next Ugadi order.', 500, 500, 2500),
  ('MARKET10', '$10 market reward', 'Make the season sweeter with $10 off the basket.', 900, 1000, 5000),
  ('HARVEST20', '$20 harvest reward', 'A generous reward for a full family shop.', 1600, 2000, 9000)
on conflict (code) do nothing;

-- A trusted checkout function must lock the reward account row, reprice the
-- basket, validate the offer and reserve points atomically. A paid-payment
-- webhook finalizes redemption and awards new points using idempotency_key.
