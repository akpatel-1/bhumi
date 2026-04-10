create extension IF not exists citext;

create type user_role as enum('admin', 'registrar', 'user');

create table if not exists users (
  id uuid primary key default gen_random_uuid (),
  email citext unique not null,
  password_hash text,
  role user_role not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_users_email on users (email);

create index idx_users_role on users (role);

create table if not exists refresh_tokens (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references users (id) on delete cascade,
  token_hash text unique not null,
  expires_at timestamptz not null,
  is_revoked boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_refresh_tokens_users on refresh_tokens (user_id);

create index idx_refresh_tokens_hash on refresh_tokens (token_hash);

create table if not exists applications (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references users (id) on delete cascade,
  pan_name text not null,
  phone text not null,
  address text not null,
  pincode text not null,
  district text not null,
  state text not null,
  pan_number text not null,
  pan_document_url text not null,
  status text not null default 'pending',
  rejection_reason text,
  submitted_at timestamptz default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references users (id),
  constraint application_status_check check (status in ('pending', 'approved', 'rejected')),
  constraint application_rejection_reason_check check (
    status != 'rejected'
    or rejection_reason is not null
  ),
  constraint pan_format_check check (pan_number ~ '^[A-Z]{5}[0-9]{4}[A-Z]$')
);

create unique index unique_pending_application on applications (user_id)
where
  status in ('pending', 'approved');


create table if not exists user_profiles (
  id uuid primary key default gen_random_uuid (),
  user_id uuid unique not null references users (id) on delete cascade,
  pan_name text,
  phone text,
  district text,
  state text,
  is_suspended boolean not null default false,
  suspension_reason text,
  created_at timestamptz default now()
);              

create table if not exists registrar_profiles(
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  district text not null,
  created_by uuid not null references users(id),
  created_at timestamptz not null default now(),
  unique(user_id)
);


