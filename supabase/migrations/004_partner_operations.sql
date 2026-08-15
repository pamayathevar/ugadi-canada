-- Partner Operations
-- Separates delivery providers and consignment retail stores from Ugadi staff.
-- Partner users receive membership-scoped access; trusted server actions own writes.

create type public.business_partner_kind as enum ('delivery_provider', 'retail_store');
create type public.partner_member_role as enum ('operator', 'driver', 'store_staff', 'manager');
create type public.delivery_route_status as enum ('draft', 'assigned', 'in_progress', 'completed', 'cancelled');
create type public.delivery_stop_status as enum ('ready', 'en_route', 'arrived', 'delivered', 'exception');
create type public.stock_transfer_status as enum ('draft', 'prepared', 'in_transit', 'received', 'cancelled');
create type public.partner_sale_status as enum ('recorded', 'verified', 'settled', 'voided');
create type public.replenishment_status as enum ('requested', 'approved', 'prepared', 'fulfilled', 'declined');

create table public.business_partners (
  id uuid primary key default gen_random_uuid(),
  kind public.business_partner_kind not null,
  legal_name text not null,
  display_name text not null,
  contact_email text,
  contact_phone text,
  active boolean not null default true,
  commercial_terms jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.partner_members (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.business_partners(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.partner_member_role not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(partner_id, user_id)
);

create table public.partner_locations (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.business_partners(id) on delete cascade,
  name text not null,
  address_line1 text not null,
  city text not null,
  province text not null default 'ON',
  postal_code text not null,
  latitude double precision,
  longitude double precision,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.delivery_routes (
  id uuid primary key default gen_random_uuid(),
  delivery_partner_id uuid not null references public.business_partners(id),
  driver_member_id uuid references public.partner_members(id),
  name text not null,
  status public.delivery_route_status not null default 'draft',
  vehicle_label text,
  scheduled_start_at timestamptz,
  scheduled_end_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (scheduled_end_at is null or scheduled_start_at is null or scheduled_end_at > scheduled_start_at),
  check (completed_at is null or started_at is not null)
);

create table public.delivery_stops (
  id uuid primary key default gen_random_uuid(),
  route_id uuid not null references public.delivery_routes(id) on delete cascade,
  order_id uuid not null references public.orders(id),
  stop_sequence integer not null check (stop_sequence > 0),
  status public.delivery_stop_status not null default 'ready',
  estimated_arrival_at timestamptz,
  arrived_at timestamptz,
  delivered_at timestamptz,
  proof_storage_path text,
  recipient_name text,
  exception_code text,
  exception_note text,
  updated_at timestamptz not null default now(),
  unique(route_id, stop_sequence),
  unique(order_id)
);

create table public.delivery_stop_events (
  id bigint generated always as identity primary key,
  stop_id uuid not null references public.delivery_stops(id) on delete cascade,
  status public.delivery_stop_status not null,
  note text,
  latitude double precision,
  longitude double precision,
  changed_by uuid not null references public.profiles(id),
  idempotency_key uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create table public.partner_stock_transfers (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.partner_locations(id),
  status public.stock_transfer_status not null default 'draft',
  expected_at timestamptz,
  sent_at timestamptz,
  received_at timestamptz,
  received_by uuid references public.profiles(id),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.partner_stock_transfer_items (
  id uuid primary key default gen_random_uuid(),
  transfer_id uuid not null references public.partner_stock_transfers(id) on delete cascade,
  batch_id uuid not null references public.inventory_batches(id),
  quantity_sent integer not null check (quantity_sent > 0),
  quantity_received integer check (quantity_received >= 0),
  unique(transfer_id, batch_id)
);

create table public.partner_inventory_positions (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.partner_locations(id),
  batch_id uuid not null references public.inventory_batches(id),
  quantity_received integer not null default 0 check (quantity_received >= 0),
  quantity_sold integer not null default 0 check (quantity_sold >= 0),
  quantity_damaged integer not null default 0 check (quantity_damaged >= 0),
  quantity_returned integer not null default 0 check (quantity_returned >= 0),
  quantity_on_hand integer generated always as
    (quantity_received - quantity_sold - quantity_damaged - quantity_returned) stored,
  updated_at timestamptz not null default now(),
  unique(location_id, batch_id),
  check (quantity_received >= quantity_sold + quantity_damaged + quantity_returned)
);

create table public.partner_sales (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.partner_locations(id),
  external_reference text,
  status public.partner_sale_status not null default 'recorded',
  sold_at timestamptz not null default now(),
  recorded_by uuid not null references public.profiles(id),
  idempotency_key uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create table public.partner_sale_items (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references public.partner_sales(id) on delete cascade,
  inventory_position_id uuid not null references public.partner_inventory_positions(id),
  quantity integer not null check (quantity > 0),
  retail_unit_price_cents integer not null check (retail_unit_price_cents >= 0),
  wholesale_unit_price_cents integer not null check (wholesale_unit_price_cents >= 0),
  unique(sale_id, inventory_position_id)
);

create table public.partner_replenishment_requests (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.partner_locations(id),
  variant_id uuid not null references public.product_variants(id),
  requested_quantity integer not null check (requested_quantity > 0),
  status public.replenishment_status not null default 'requested',
  requested_by uuid not null references public.profiles(id),
  internal_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index partner_members_user_idx on public.partner_members(user_id, active);
create index partner_locations_partner_idx on public.partner_locations(partner_id, active);
create index delivery_routes_partner_status_idx on public.delivery_routes(delivery_partner_id, status);
create index delivery_routes_driver_idx on public.delivery_routes(driver_member_id, scheduled_start_at);
create index delivery_stops_route_sequence_idx on public.delivery_stops(route_id, stop_sequence);
create index delivery_stop_events_stop_idx on public.delivery_stop_events(stop_id, created_at desc);
create index partner_inventory_location_idx on public.partner_inventory_positions(location_id);
create index partner_sales_location_sold_idx on public.partner_sales(location_id, sold_at desc);
create index replenishment_location_status_idx on public.partner_replenishment_requests(location_id, status);

alter table public.business_partners enable row level security;
alter table public.partner_members enable row level security;
alter table public.partner_locations enable row level security;
alter table public.delivery_routes enable row level security;
alter table public.delivery_stops enable row level security;
alter table public.delivery_stop_events enable row level security;
alter table public.partner_stock_transfers enable row level security;
alter table public.partner_stock_transfer_items enable row level security;
alter table public.partner_inventory_positions enable row level security;
alter table public.partner_sales enable row level security;
alter table public.partner_sale_items enable row level security;
alter table public.partner_replenishment_requests enable row level security;

create or replace function public.is_partner_member(target_partner_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.partner_members pm
    where pm.partner_id = target_partner_id and pm.user_id = auth.uid() and pm.active
  );
$$;

create or replace function public.can_access_delivery_route(target_route_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1
    from public.delivery_routes dr
    join public.partner_members pm on pm.partner_id = dr.delivery_partner_id
    where dr.id = target_route_id and pm.user_id = auth.uid() and pm.active
      and (pm.id = dr.driver_member_id or pm.role = 'manager')
  );
$$;

create policy "members read their partner" on public.business_partners for select
  using (public.is_staff() or public.is_partner_member(id));
create policy "members read partner membership" on public.partner_members for select
  using (public.is_staff() or public.is_partner_member(partner_id));
create policy "members read partner locations" on public.partner_locations for select
  using (public.is_staff() or public.is_partner_member(partner_id));
create policy "assigned drivers read routes" on public.delivery_routes for select
  using (public.is_staff() or public.can_access_delivery_route(id));
create policy "assigned drivers read stops" on public.delivery_stops for select
  using (public.is_staff() or public.can_access_delivery_route(route_id));
create policy "assigned drivers read stop events" on public.delivery_stop_events for select
  using (public.is_staff() or exists (
    select 1 from public.delivery_stops ds
    where ds.id = stop_id and public.can_access_delivery_route(ds.route_id)
  ));
create policy "members read stock transfers" on public.partner_stock_transfers for select
  using (public.is_staff() or exists (
    select 1 from public.partner_locations pl
    where pl.id = location_id and public.is_partner_member(pl.partner_id)
  ));
create policy "members read transfer items" on public.partner_stock_transfer_items for select
  using (public.is_staff() or exists (
    select 1 from public.partner_stock_transfers pst
    join public.partner_locations pl on pl.id = pst.location_id
    where pst.id = transfer_id and public.is_partner_member(pl.partner_id)
  ));
create policy "members read store inventory" on public.partner_inventory_positions for select
  using (public.is_staff() or exists (
    select 1 from public.partner_locations pl
    where pl.id = location_id and public.is_partner_member(pl.partner_id)
  ));
create policy "members read store sales" on public.partner_sales for select
  using (public.is_staff() or exists (
    select 1 from public.partner_locations pl
    where pl.id = location_id and public.is_partner_member(pl.partner_id)
  ));
create policy "members read store sale items" on public.partner_sale_items for select
  using (public.is_staff() or exists (
    select 1 from public.partner_sales ps
    join public.partner_locations pl on pl.id = ps.location_id
    where ps.id = sale_id and public.is_partner_member(pl.partner_id)
  ));
create policy "members read replenishment" on public.partner_replenishment_requests for select
  using (public.is_staff() or exists (
    select 1 from public.partner_locations pl
    where pl.id = location_id and public.is_partner_member(pl.partner_id)
  ));

create policy "staff manage business partners" on public.business_partners for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage partner members" on public.partner_members for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage partner locations" on public.partner_locations for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage delivery routes" on public.delivery_routes for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage delivery stops" on public.delivery_stops for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage delivery events" on public.delivery_stop_events for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage stock transfers" on public.partner_stock_transfers for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage transfer items" on public.partner_stock_transfer_items for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage partner inventory" on public.partner_inventory_positions for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage partner sales" on public.partner_sales for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage partner sale items" on public.partner_sale_items for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage replenishment" on public.partner_replenishment_requests for all using (public.is_staff()) with check (public.is_staff());

-- Production clients should call narrow server functions such as
-- update-delivery-stop, receive-partner-transfer, record-partner-sale and
-- request-replenishment. Those functions validate role, state transition,
-- quantities and idempotency before writing an immutable event or sale ledger.
