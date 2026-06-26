create extension if not exists pgcrypto;

create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role text not null,
  avatar_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.social_accounts (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.people(id) on delete cascade,
  platform text not null check (platform in ('X', 'Facebook', 'Instagram')),
  handle text not null,
  profile_url text not null,
  avatar_url text,
  api_account_id text,
  access_token_encrypted text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references public.people(id) on delete cascade,
  social_account_id uuid not null references public.social_accounts(id) on delete cascade,
  platform text not null check (platform in ('X', 'Facebook', 'Instagram')),
  external_post_id text not null,
  post_url text not null,
  text text not null default '',
  media_url text,
  thumbnail_url text,
  media_type text check (media_type in ('image', 'video')),
  published_at timestamptz not null,
  fetched_at timestamptz not null default now(),
  raw_json jsonb not null default '{}'::jsonb,
  is_seen boolean not null default false,
  is_pinned boolean not null default false,
  is_flagged boolean not null default false,
  engagement_count integer not null default 0,
  tags text[] not null default '{}',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (platform, external_post_id)
);

create table if not exists public.fetch_logs (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  social_account_id uuid references public.social_accounts(id) on delete set null,
  status text not null,
  message text,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists people_set_updated_at on public.people;
create trigger people_set_updated_at
before update on public.people
for each row execute function public.set_updated_at();

drop trigger if exists social_accounts_set_updated_at on public.social_accounts;
create trigger social_accounts_set_updated_at
before update on public.social_accounts
for each row execute function public.set_updated_at();

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

create index if not exists social_accounts_person_id_idx on public.social_accounts(person_id);
create index if not exists posts_person_id_idx on public.posts(person_id);
create index if not exists posts_published_at_idx on public.posts(published_at desc);
create index if not exists posts_platform_idx on public.posts(platform);
create index if not exists posts_is_seen_idx on public.posts(is_seen);
create index if not exists fetch_logs_created_at_idx on public.fetch_logs(created_at desc);

alter table if exists public.social_accounts
  add column if not exists avatar_url text;

alter table if exists public.posts
  add column if not exists media_type text check (media_type in ('image', 'video'));
