-- Al Ameed Coffee — initial schema
-- Run this once in the Supabase project's SQL Editor (or via `supabase db push`
-- once the CLI is linked). Safe to re-run: every statement is idempotent.
--
-- Two families of tables:
--   1. Catalog (branches, menu_items, rewards, menu_categories) — public
--      read-only from the app; write access is via the Supabase dashboard
--      only for now (no admin app yet).
--   2. User data (profiles, addresses, points_transactions, redemptions,
--      orders, notifications) — row-level security restricts every row to
--      its owner (auth.uid()).

-- ============================================================
-- CATALOG
-- ============================================================

create table if not exists branches (
  id text primary key,
  lat double precision not null,
  lng double precision not null,
  name_ar text not null,
  name_en text not null,
  address_ar text not null,
  address_en text not null,
  hours_weekdays_ar text not null,
  hours_weekdays_en text not null,
  hours_weekend_ar text not null,
  hours_weekend_en text not null,
  phone text not null,
  open_now boolean not null default true,
  image_url text
);

create table if not exists menu_categories (
  id text primary key,
  name_ar text not null,
  name_en text not null
);

create table if not exists menu_items (
  id text primary key,
  category_id text not null references menu_categories(id),
  name_ar text not null,
  name_en text not null,
  desc_ar text not null,
  desc_en text not null,
  price numeric(6,2) not null,
  image_url text
);

create table if not exists rewards (
  id text primary key,
  name_ar text not null,
  name_en text not null,
  cost integer not null,
  desc_ar text not null,
  desc_en text not null,
  emoji text not null,
  category_ar text not null,
  category_en text not null,
  image_url text
);

alter table branches enable row level security;
alter table menu_categories enable row level security;
alter table menu_items enable row level security;
alter table rewards enable row level security;

drop policy if exists "catalog is publicly readable" on branches;
create policy "catalog is publicly readable" on branches for select using (true);
drop policy if exists "catalog is publicly readable" on menu_categories;
create policy "catalog is publicly readable" on menu_categories for select using (true);
drop policy if exists "catalog is publicly readable" on menu_items;
create policy "catalog is publicly readable" on menu_items for select using (true);
drop policy if exists "catalog is publicly readable" on rewards;
create policy "catalog is publicly readable" on rewards for select using (true);

-- ============================================================
-- USER DATA
-- ============================================================

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name_ar text not null default '',
  name_en text not null default '',
  phone text,
  email text,
  referral_code text unique,
  date_of_birth date,
  gender text check (gender in ('male', 'female', '')) default '',
  marital_status text check (marital_status in ('single', 'married', '')) default '',
  city text default '',
  area text default '',
  -- Explicit flag, not derived from name_ar being non-empty — "Skip for
  -- now" on the complete-profile screen leaves every field blank but
  -- still counts as done, so a derived signal would keep bouncing a
  -- skipped user back to that screen on every app launch.
  profile_completed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('home', 'work', 'other')),
  line text not null,
  city text not null,
  area text not null,
  building text not null,
  floor text,
  created_at timestamptz not null default now()
);

-- Every points change (check-in, order, invite, redemption, signup gift)
-- is one row here — the balance is SUM(points), never a separately stored
-- counter, so it can't drift out of sync with its own history. See the
-- user_points_balance view below.
create table if not exists points_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label_ar text not null,
  label_en text not null,
  points integer not null,
  created_at timestamptz not null default now()
);

create table if not exists redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reward_id text not null references rewards(id),
  -- Snapshot of the reward at redemption time (name/emoji) so this still
  -- displays correctly even if the reward catalog changes later.
  name_ar text not null,
  name_en text not null,
  emoji text not null,
  ref text not null,
  points_transaction_id uuid references points_transactions(id),
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  items_ar text not null,
  items_en text not null,
  item_count integer not null,
  quantities jsonb not null,
  total numeric(7,2) not null,
  payment_method text not null check (payment_method in ('cash', 'card')),
  fulfillment text not null check (fulfillment in ('pickup', 'delivery')),
  branch_id text references branches(id),
  address_id uuid references addresses(id),
  location_ar text not null,
  location_en text not null,
  status text not null check (status in ('received', 'preparing', 'ready', 'completed')) default 'received',
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title_ar text not null,
  title_en text not null,
  body_ar text not null,
  body_en text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table addresses enable row level security;
alter table points_transactions enable row level security;
alter table redemptions enable row level security;
alter table orders enable row level security;
alter table notifications enable row level security;

drop policy if exists "own profile only" on profiles;
create policy "own profile only" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own addresses only" on addresses;
create policy "own addresses only" on addresses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Points history is an append-only ledger from the app's point of view —
-- earning/redeeming happens through dedicated RPCs (see below), not raw
-- inserts, so only SELECT is granted here.
drop policy if exists "read own points history" on points_transactions;
create policy "read own points history" on points_transactions for select using (auth.uid() = user_id);

drop policy if exists "read own redemptions" on redemptions;
create policy "read own redemptions" on redemptions for select using (auth.uid() = user_id);

drop policy if exists "own orders only" on orders;
create policy "own orders only" on orders for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own notifications only" on notifications;
create policy "own notifications only" on notifications for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Derived, always-correct points balance — never trust a stored counter.
create or replace view user_points_balance as
  select user_id, coalesce(sum(points), 0)::integer as balance
  from points_transactions
  group by user_id;

-- ============================================================
-- SIGNUP: create the profile row + registration-gift points automatically
-- ============================================================

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- Not new.email: when phone auth is simulated via a synthetic
  -- email+password (see lib/auth-store.tsx), auth.users.email is an
  -- internal placeholder, not a real address to show anywhere.
  insert into public.profiles (id, phone, referral_code)
  values (
    new.id,
    new.phone,
    'AMEED-' || upper(substring(new.id::text, 1, 6))
  );

  insert into public.points_transactions (user_id, label_ar, label_en, points)
  values (new.id, 'هدية التسجيل', 'Registration Gift', 20);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- CHECK-IN / REDEEM: award or spend points atomically via RPC instead of
-- letting the client insert points_transactions rows directly (a client
-- could double-submit or spend points it doesn't have).
-- ============================================================

create or replace function checkin(p_label_ar text, p_label_en text, p_points integer)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  insert into points_transactions (user_id, label_ar, label_en, points)
  values (auth.uid(), p_label_ar, p_label_en, p_points);
end;
$$;

create or replace function redeem_reward(p_reward_id text)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_reward rewards%rowtype;
  v_balance integer;
  v_tx_id uuid;
  v_redemption_id uuid;
  v_ref text;
begin
  select * into v_reward from rewards where id = p_reward_id;
  if not found then
    raise exception 'Unknown reward %', p_reward_id;
  end if;

  select balance into v_balance from user_points_balance where user_id = auth.uid();
  if coalesce(v_balance, 0) < v_reward.cost then
    raise exception 'Not enough points';
  end if;

  insert into points_transactions (user_id, label_ar, label_en, points)
  values (auth.uid(), 'استبدال: ' || v_reward.name_ar, 'Redeemed: ' || v_reward.name_en, -v_reward.cost)
  returning id into v_tx_id;

  v_ref := 'RD-' || floor(random() * 90000 + 10000)::text;

  insert into redemptions (user_id, reward_id, name_ar, name_en, emoji, ref, points_transaction_id)
  values (auth.uid(), v_reward.id, v_reward.name_ar, v_reward.name_en, v_reward.emoji, v_ref, v_tx_id)
  returning id into v_redemption_id;

  return v_redemption_id;
end;
$$;
