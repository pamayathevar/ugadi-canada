-- Catalogue Foundation v2
-- Generalizes the mango beta for fruits, vegetables, spices, pantry items and gifts.

create type public.catalog_availability as enum ('available', 'preorder', 'coming_soon', 'sold_out');
create type public.campaign_status as enum ('draft', 'scheduled', 'active', 'archived');
create type public.storage_zone as enum ('ambient', 'cool', 'refrigerated', 'frozen');
create type public.batch_status as enum ('expected', 'received', 'quality_hold', 'available', 'depleted', 'recalled');
create type public.inventory_reason as enum ('received', 'reserved', 'released', 'sold', 'damaged', 'adjustment', 'recalled');

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null,
  name_fr text,
  description_en text,
  description_fr text,
  image_path text,
  display_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country_code char(2) not null,
  region text,
  contact_name text,
  contact_email text,
  licence_or_registration text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.products
  add column primary_category_id uuid references public.categories(id),
  add column availability public.catalog_availability not null default 'available',
  add column country_of_origin text,
  add column region_of_origin text,
  add column storage public.storage_zone not null default 'ambient',
  add column featured boolean not null default false;

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text unique not null,
  name text not null,
  unit_label text not null,
  pack_quantity numeric(12,3),
  pack_unit text,
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'CAD' check (currency = 'CAD'),
  tax_code text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(product_id, unit_label)
);

create table public.inventory_batches (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.product_variants(id),
  supplier_id uuid references public.suppliers(id),
  lot_code text not null,
  status public.batch_status not null default 'expected',
  country_of_origin text not null,
  region_of_origin text,
  expected_at timestamptz,
  received_at timestamptz,
  best_before_date date,
  storage public.storage_zone not null,
  received_quantity integer not null default 0 check (received_quantity >= 0),
  reserved_quantity integer not null default 0 check (reserved_quantity >= 0),
  sold_quantity integer not null default 0 check (sold_quantity >= 0),
  damaged_quantity integer not null default 0 check (damaged_quantity >= 0),
  available_quantity integer generated always as
    (received_quantity - reserved_quantity - sold_quantity - damaged_quantity) stored,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(variant_id, lot_code),
  check (received_quantity >= reserved_quantity + sold_quantity + damaged_quantity)
);

create table public.inventory_movements (
  id bigint generated always as identity primary key,
  batch_id uuid not null references public.inventory_batches(id),
  order_id uuid references public.orders(id),
  reason public.inventory_reason not null,
  quantity_delta integer not null check (quantity_delta <> 0),
  note text,
  changed_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.product_compliance (
  product_id uuid primary key references public.products(id) on delete cascade,
  common_name_en text,
  common_name_fr text,
  ingredients_en text,
  ingredients_fr text,
  allergens_en text,
  allergens_fr text,
  storage_instructions_en text,
  storage_instructions_fr text,
  importer_name text,
  importer_address text,
  label_reviewed_at timestamptz,
  label_reviewed_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  status public.campaign_status not null default 'draft',
  eyebrow_en text,
  eyebrow_fr text,
  title_en text not null,
  title_fr text,
  description_en text,
  description_fr text,
  hero_image_path text,
  category_id uuid references public.categories(id),
  starts_at timestamptz,
  ends_at timestamptz,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create table public.campaign_products (
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  display_order integer not null default 0,
  primary key (campaign_id, product_id)
);

create index product_variants_product_idx on public.product_variants(product_id);
create index inventory_batches_variant_status_idx on public.inventory_batches(variant_id, status);
create index inventory_batches_lot_idx on public.inventory_batches(lot_code);
create index inventory_movements_batch_idx on public.inventory_movements(batch_id, created_at desc);
create index campaigns_status_window_idx on public.campaigns(status, starts_at, ends_at);

alter table public.categories enable row level security;
alter table public.suppliers enable row level security;
alter table public.product_variants enable row level security;
alter table public.inventory_batches enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.product_compliance enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_products enable row level security;

create policy "active categories are public" on public.categories for select
  using (active or public.is_staff());
create policy "active variants are public" on public.product_variants for select
  using (active and exists (select 1 from public.products p where p.id = product_id and p.active) or public.is_staff());
create policy "active campaigns are public" on public.campaigns for select
  using (
    (status = 'active' and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at > now()))
    or public.is_staff()
  );
create policy "active campaign products are public" on public.campaign_products for select
  using (
    exists (
      select 1 from public.campaigns c
      where c.id = campaign_id and c.status = 'active'
        and (c.starts_at is null or c.starts_at <= now())
        and (c.ends_at is null or c.ends_at > now())
    ) or public.is_staff()
  );
create policy "published compliance is public" on public.product_compliance for select
  using (exists (select 1 from public.products p where p.id = product_id and p.active) or public.is_staff());

create policy "staff manage categories" on public.categories for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage suppliers" on public.suppliers for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage variants" on public.product_variants for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage batches" on public.inventory_batches for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage movements" on public.inventory_movements for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage compliance" on public.product_compliance for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage campaigns" on public.campaigns for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage campaign products" on public.campaign_products for all using (public.is_staff()) with check (public.is_staff());

insert into public.categories (slug, name_en, name_fr, description_en, display_order)
values
  ('fresh-fruits', 'Fresh Fruits', 'Fruits frais', 'Seasonal fruit selected for flavour and careful local delivery.', 1),
  ('fresh-vegetables', 'Fresh Vegetables', 'Légumes frais', 'Indian kitchen essentials in practical fixed packs.', 2),
  ('spices-pantry', 'Spices & Pantry', 'Épices et garde-manger', 'Aromatic spices and trusted everyday staples.', 3),
  ('gift-boxes', 'Festival & Gift Boxes', 'Coffrets-cadeaux et fêtes', 'Seasonal collections for celebrations and sharing.', 4);

update public.products
set primary_category_id = (select id from public.categories where slug = 'fresh-fruits')
where primary_category_id is null;

insert into public.product_variants (product_id, sku, name, unit_label, price_cents)
select id, 'UG-' || upper(replace(slug, '-', '_')), name, unit_label, price_cents
from public.products
on conflict do nothing;

insert into public.inventory_batches (
  variant_id, lot_code, status, country_of_origin, storage, received_quantity, received_at, internal_notes
)
select v.id, 'LEGACY-' || left(p.id::text, 8),
  case when p.inventory > 0 then 'available'::public.batch_status else 'depleted'::public.batch_status end,
  coalesce(p.country_of_origin, 'India'), p.storage, p.inventory, now(),
  'Migrated from product-level inventory by Catalogue Foundation v2.'
from public.products p
join public.product_variants v on v.product_id = p.id
where p.inventory > 0
on conflict do nothing;

insert into public.campaigns (
  slug, status, eyebrow_en, title_en, description_en, category_id, display_order
)
select
  'mango-season-2026', 'active', 'THE SEASON''S FINEST · INDIA TO CANADA',
  'Mango season has landed.',
  'Exceptional Indian mangoes selected for flavour, handled with care and delivered across Toronto and the GTA.',
  id, 1
from public.categories where slug = 'fresh-fruits'
on conflict do nothing;

-- `products.inventory` remains during the beta compatibility window. New order
-- reservation functions should use inventory_batches and inventory_movements;
-- remove the legacy column only after all clients and admin reports migrate.
