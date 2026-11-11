-- Bhajan Library schema
-- Run this in the Supabase SQL editor

-- Categories
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  type text not null check (type in ('bhagwan', 'occasion', 'bhajan_type', 'theme', 'language', 'suitability')),
  created_at timestamptz not null default now(),
  unique (type, slug)
);

-- Bhajans
create table if not exists bhajans (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  alternate_title text,
  slug text not null unique,
  artist_version text,
  roman_lyrics text not null,
  devanagari_lyrics text,
  translation text,
  meaning text,
  audio_url text,
  pdf_url text,
  is_favourite boolean not null default false,
  display_order integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Many-to-many: bhajans ↔ categories
create table if not exists bhajan_categories (
  bhajan_id uuid not null references bhajans (id) on delete cascade,
  category_id uuid not null references categories (id) on delete cascade,
  primary key (bhajan_id, category_id)
);

-- Playlists
create table if not exists playlists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists playlist_items (
  id uuid primary key default gen_random_uuid(),
  playlist_id uuid not null references playlists (id) on delete cascade,
  bhajan_id uuid not null references bhajans (id) on delete cascade,
  position integer not null default 0,
  notes text,
  unique (playlist_id, bhajan_id)
);

-- Indexes
create index if not exists idx_bhajans_slug on bhajans (slug);
create index if not exists idx_bhajans_favourite on bhajans (is_favourite);
create index if not exists idx_categories_type on categories (type);
create index if not exists idx_bhajan_categories_category on bhajan_categories (category_id);
create index if not exists idx_playlist_items_playlist on playlist_items (playlist_id, position);

-- Auto-update updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists bhajans_updated_at on bhajans;
create trigger bhajans_updated_at
  before update on bhajans
  for each row execute function set_updated_at();

-- Full-text search helper (title, alternate, artist, lyrics, translation)
create or replace function search_bhajans(query text)
returns setof bhajans as $$
  select *
  from bhajans
  where
    title ilike '%' || query || '%'
    or alternate_title ilike '%' || query || '%'
    or artist_version ilike '%' || query || '%'
    or roman_lyrics ilike '%' || query || '%'
    or translation ilike '%' || query || '%'
    or meaning ilike '%' || query || '%'
  order by
    case when title ilike query || '%' then 0 else 1 end,
    title;
$$ language sql stable;

-- RLS
alter table categories enable row level security;
alter table bhajans enable row level security;
alter table bhajan_categories enable row level security;
alter table playlists enable row level security;
alter table playlist_items enable row level security;

-- Public read (remove these policies to make the library fully private)
create policy "Public read categories" on categories for select using (true);
create policy "Public read bhajans" on bhajans for select using (true);
create policy "Public read bhajan_categories" on bhajan_categories for select using (true);
create policy "Public read playlists" on playlists for select using (true);
create policy "Public read playlist_items" on playlist_items for select using (true);

-- Authenticated write
create policy "Auth insert categories" on categories for insert with check (auth.role() = 'authenticated');
create policy "Auth update categories" on categories for update using (auth.role() = 'authenticated');
create policy "Auth delete categories" on categories for delete using (auth.role() = 'authenticated');

create policy "Auth insert bhajans" on bhajans for insert with check (auth.role() = 'authenticated');
create policy "Auth update bhajans" on bhajans for update using (auth.role() = 'authenticated');
create policy "Auth delete bhajans" on bhajans for delete using (auth.role() = 'authenticated');

create policy "Auth insert bhajan_categories" on bhajan_categories for insert with check (auth.role() = 'authenticated');
create policy "Auth delete bhajan_categories" on bhajan_categories for delete using (auth.role() = 'authenticated');

create policy "Auth insert playlists" on playlists for insert with check (auth.role() = 'authenticated');
create policy "Auth update playlists" on playlists for update using (auth.role() = 'authenticated');
create policy "Auth delete playlists" on playlists for delete using (auth.role() = 'authenticated');

create policy "Auth insert playlist_items" on playlist_items for insert with check (auth.role() = 'authenticated');
create policy "Auth update playlist_items" on playlist_items for update using (auth.role() = 'authenticated');
create policy "Auth delete playlist_items" on playlist_items for delete using (auth.role() = 'authenticated');
