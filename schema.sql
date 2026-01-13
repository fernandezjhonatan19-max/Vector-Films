-- Enable necessary extensions
create extension if not exists "pgcrypto";

-- 1. Profiles Table (extends Auth)
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  email text unique,
  role text check (role in ('admin', 'member')) default 'member',
  title text default 'Team Member',
  avatar_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 2. Missions Table
create table public.missions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  points int not null,
  type text check (type in ('positive', 'negative')) not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 3. Actions Ledger (Activity Log)
create table public.actions_ledger (
  id uuid primary key default gen_random_uuid(),
  target_user_id uuid references public.profiles(id) not null,
  mission_id uuid references public.missions(id), -- Nullable if mission deleted, retain snapshot
  mission_title_snapshot text, -- Historical record of what the mission was
  points int not null,
  note text,
  created_by uuid references public.profiles(id) not null,
  month_tag text not null, -- Format 'YYYY-MM'
  created_at timestamptz default now()
);

-- 4. Monthly Archives (Closed Months)
create table public.monthly_archives (
  id uuid primary key default gen_random_uuid(),
  month_tag text unique not null,
  closed_by uuid references public.profiles(id),
  closed_at timestamptz default now()
);

-- 5. Monthly Archive Rows (Frozen results)
create table public.monthly_archive_rows (
  id uuid primary key default gen_random_uuid(),
  month_tag text not null references public.monthly_archives(month_tag) on delete cascade,
  user_id uuid references public.profiles(id) not null,
  points_total int not null,
  bonus_cop numeric not null,
  rank int not null
);

-- 6. Settings (Key-Value Store)
create table public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- Insert Default Settings
insert into public.settings (key, value) values
('app_config', '{"valor_punto_cop": 1000, "max_puntos_mensual": 5000, "dashboard_quote": "La creatividad es la inteligencia divirtiéndose.", "strict_penalty_mode": false, "allow_member_actions": false}'::jsonb)
on conflict do nothing;

-- RLS POLICIES --
alter table public.profiles enable row level security;
alter table public.missions enable row level security;
alter table public.actions_ledger enable row level security;
alter table public.monthly_archives enable row level security;
alter table public.monthly_archive_rows enable row level security;
alter table public.settings enable row level security;

-- Helper function to check if user is admin
create or replace function public.is_admin()
returns boolean as $$
declare
  _role text;
begin
  select role into _role from public.profiles where id = auth.uid();
  return _role = 'admin';
end;
$$ language plpgsql security definer;

-- Profiles Policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

create policy "Admins can update all profiles"
  on public.profiles for update
  using ( public.is_admin() );

-- Missions Policies
create policy "Anyone can read missions"
  on public.missions for select using (true);

create policy "Admins can manage missions"
  on public.missions for all
  using ( public.is_admin() );

-- Actions Ledger Policies
create policy "Everyone can read ledger"
  on public.actions_ledger for select using (true);

create policy "Admins can insert ledger"
  on public.actions_ledger for insert
  with check ( public.is_admin() );

create policy "Members can insert ledger if allowed"
  on public.actions_ledger for insert
  with check (
    (select (value->>'allow_member_actions')::boolean from public.settings where key='app_config') = true
    AND auth.uid() = created_by
  );

-- Monthly Archives Policies
create policy "Everyone can read archives"
  on public.monthly_archives for select using (true);

create policy "Admins can manage archives"
  on public.monthly_archives for all using (public.is_admin());

create policy "Everyone can read archive rows"
  on public.monthly_archive_rows for select using (true);

-- Settings Policies
create policy "Everyone can read settings"
  on public.settings for select using (true);

create policy "Admins can update settings"
  on public.settings for update using (public.is_admin());

-- STORAGE BUCKET setup (Run this in SQL Editor as well usually, or via UI)
-- Requires Storage extension enabled, usually default.
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict do nothing;

create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar"
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );

-- RPC: Close Month
create or replace function public.close_month(p_month_tag text)
returns void as $$
declare
  _config jsonb;
  _valor_punto numeric;
  _user_record record;
  _rank int := 1;
begin
  -- Check if already closed
  if exists (select 1 from public.monthly_archives where month_tag = p_month_tag) then
    raise exception 'Month % is already closed.', p_month_tag;
  end if;

  -- Get settings
  select value into _config from public.settings where key = 'app_config';
  _valor_punto := (_config->>'valor_punto_cop')::numeric;

  -- Create archive entry
  insert into public.monthly_archives (month_tag, closed_by)
  values (p_month_tag, auth.uid());

  -- Calculate and insert rows
  for _user_record in
    select 
      target_user_id, 
      sum(points) as total_points
    from public.actions_ledger
    where month_tag = p_month_tag
    group by target_user_id
    order by sum(points) desc
  loop
    insert into public.monthly_archive_rows (month_tag, user_id, points_total, bonus_cop, rank)
    values (
      p_month_tag,
      _user_record.target_user_id,
      _user_record.total_points,
      (_user_record.total_points * _valor_punto),
      _rank
    );
    _rank := _rank + 1;
  end loop;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on Signup (Optional but good for easy setup)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'member');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
