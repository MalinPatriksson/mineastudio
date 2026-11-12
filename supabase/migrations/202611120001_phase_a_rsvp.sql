create extension if not exists pgcrypto;

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  public_token text not null unique default encode(gen_random_bytes(24), 'hex'),
  template_id text not null,
  title text not null,
  event_date date not null,
  invitation_data jsonb not null default '{}'::jsonb,
  enabled_features text[] not null default array['rsvp','map','calendar']::text[],
  animation text not null default 'soft' check (animation in ('none','soft','playful')),
  colorway text not null default 'signature' check (colorway in ('signature','soft','deep','beige','boy')),
  rsvp_mode text not null default 'form' check (rsvp_mode in ('form','sms','none')),
  rsvp_ask_party_size boolean not null default true,
  rsvp_ask_allergies boolean not null default true,
  rsvp_ask_message boolean not null default true,
  status text not null default 'draft' check (status in ('draft','pending_payment','published','expired','cancelled')),
  purchased_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rsvp_responses (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  guest_name text not null check (char_length(guest_name) between 2 and 100),
  attendance text not null check (attendance in ('yes','no')),
  party_size integer not null default 1 check (party_size between 1 and 20),
  allergies text check (char_length(allergies) <= 500),
  message text check (char_length(message) <= 1000),
  manage_token_hash text not null,
  request_fingerprint_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (invitation_id, manage_token_hash)
);

create index if not exists rsvp_responses_invitation_id_idx on public.rsvp_responses(invitation_id);
create index if not exists rsvp_responses_rate_limit_idx on public.rsvp_responses(request_fingerprint_hash, updated_at desc);
create index if not exists invitations_owner_id_idx on public.invitations(owner_id);
create index if not exists invitations_public_status_idx on public.invitations(public_token, status);

alter table public.invitations enable row level security;
alter table public.rsvp_responses enable row level security;

drop policy if exists "owners can read their invitations" on public.invitations;
create policy "owners can read their invitations"
on public.invitations for select to authenticated
using (owner_id = auth.uid());

drop policy if exists "owners can update their invitations" on public.invitations;
create policy "owners can update their invitations"
on public.invitations for update to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "owners can read rsvp responses" on public.rsvp_responses;
create policy "owners can read rsvp responses"
on public.rsvp_responses for select to authenticated
using (exists (
  select 1 from public.invitations
  where invitations.id = rsvp_responses.invitation_id
  and invitations.owner_id = auth.uid()
));

comment on column public.invitations.expires_at is 'Set to event_date plus the configured retention period, initially 90 days.';
comment on column public.rsvp_responses.manage_token_hash is 'SHA-256 hash of the guest edit token. Never store the raw token.';

