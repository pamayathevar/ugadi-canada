create extension if not exists pgcrypto;

create type public.app_role as enum ('customer', 'support', 'admin', 'owner');
create type public.order_status as enum (
  'payment_pending', 'confirmed', 'packing', 'out_for_delivery', 'delivered', 'cancelled'
);
create type public.payment_status as enum ('created', 'authorized', 'paid', 'failed', 'refunded');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role public.app_role not null default 'customer',
  created_at timestamptz not null default now()
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text not null default 'Home',
  line1 text not null,
  line2 text,
  city text not null,
  province text not null default 'ON',
  postal_code text not null,
  latitude double precision,
  longitude double precision,
  delivery_notes text,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  variety text,
  description text,
  unit_label text not null,
  price_cents integer not null check (price_cents >= 0),
  inventory integer not null default 0 check (inventory >= 0),
  active boolean not null default true,
  image_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.delivery_zones (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  postal_prefixes text[] not null,
  delivery_fee_cents integer not null check (delivery_fee_cents >= 0),
  free_delivery_threshold_cents integer,
  active boolean not null default true
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity unique,
  user_id uuid not null references public.profiles(id),
  address_id uuid not null references public.addresses(id),
  status public.order_status not null default 'payment_pending',
  subtotal_cents integer not null check (subtotal_cents >= 0),
  delivery_fee_cents integer not null check (delivery_fee_cents >= 0),
  tax_cents integer not null check (tax_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  currency text not null default 'CAD' check (currency = 'CAD'),
  delivery_window_start timestamptz,
  delivery_window_end timestamptz,
  estimated_arrival_at timestamptz,
  driver_latitude double precision,
  driver_longitude double precision,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  product_name text not null,
  unit_label text not null,
  unit_price_cents integer not null check (unit_price_cents >= 0),
  quantity integer not null check (quantity > 0),
  unique(order_id, product_id)
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id),
  provider text not null check (provider in ('stripe', 'moneris')),
  provider_reference text unique,
  idempotency_key uuid not null unique default gen_random_uuid(),
  status public.payment_status not null default 'created',
  amount_cents integer not null check (amount_cents >= 0),
  raw_event_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_status_history (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  status public.order_status not null,
  note text,
  changed_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.products enable row level security;
alter table public.delivery_zones enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.order_status_history enable row level security;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('support', 'admin', 'owner')
  );
$$;

create policy "active products are public" on public.products for select using (active or public.is_staff());
create policy "users read own profile" on public.profiles for select using (id = auth.uid() or public.is_staff());
create policy "users update own profile" on public.profiles for update using (id = auth.uid());
create policy "users manage own addresses" on public.addresses for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users read own orders" on public.orders for select using (user_id = auth.uid() or public.is_staff());
create policy "users read own order items" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_staff()))
);
create policy "staff manage products" on public.products for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage zones" on public.delivery_zones for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage orders" on public.orders for all using (public.is_staff()) with check (public.is_staff());
create policy "staff read payments" on public.payments for select using (public.is_staff());
create policy "users read own history" on public.order_status_history for select using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_staff()))
);

-- Orders and payments are intentionally not client-insertable. An authenticated
-- server function must reprice the cart, reserve stock and create both records.

insert into public.delivery_zones (name, postal_prefixes, delivery_fee_cents, free_delivery_threshold_cents)
values
  ('Toronto', array['M'], 899, 7500),
  ('Mississauga', array['L4T','L4V','L4W','L4X','L4Y','L4Z','L5'], 1099, 9000);
