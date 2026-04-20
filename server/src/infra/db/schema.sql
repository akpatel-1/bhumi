-- Extensions
create extension if not exists citext;

-- Types
create type user_role as enum ('admin', 'registrar', 'user');
create type kyc_status as enum ('pending', 'approved', 'rejected');

-- Users table
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email citext unique not null,
  password_hash text,
  role user_role not null,
  created_at timestamptz not null default now(),
  constraint password_role_check check (
    (role = 'user' and password_hash is null)
    or (role <> 'user' and password_hash is not null)
  )
);

create index idx_users_email on users (email);
create index idx_users_role on users (role);

-- Refresh tokens table
create table if not exists refresh_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  token_hash text unique not null,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_refresh_tokens_users on refresh_tokens (user_id);
create index idx_refresh_tokens_hash on refresh_tokens (token_hash);

-- User KYC table
create table if not exists user_kyc (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  pan_name text not null,
  phone text not null,
  address text not null,
  pincode text not null,
  district citext not null,
  pan_number text not null,
  pan_document_key text not null,
  status kyc_status not null default 'pending',
  rejection_reason text,
  submitted_at timestamptz default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references users (id),
  constraint user_kyc_rejection_reason_check check (
    status != 'rejected' or rejection_reason is not null
  ),
  constraint pan_format_check check (pan_number ~ '^[A-Z]{5}[0-9]{4}[A-Z]$')
);

create unique index unique_pending_user_kyc on user_kyc (user_id)
where
  status in ('pending', 'approved');

-- User profiles table
create table if not exists user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references users (id) on delete cascade,
  pan_name text,
  phone text,
  district citext,
  is_suspended boolean not null default false,
  suspension_reason text,
  created_at timestamptz default now()
);

-- Registrar profiles table
create table if not exists registrar_profiles (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references users (id) on delete CASCADE,
  district citext not null,
  created_by uuid not null references users (id),
  created_at timestamptz not null default now(),
  unique (user_id),
);

