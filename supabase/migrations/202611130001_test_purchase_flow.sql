alter table public.invitations
  add column if not exists checkout_reference uuid unique;

create table if not exists public.purchase_requests (
  id bigint generated always as identity primary key,
  fingerprint_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists purchase_requests_rate_limit_idx
  on public.purchase_requests (fingerprint_hash, created_at desc);

alter table public.purchase_requests enable row level security;

comment on column public.invitations.checkout_reference is
  'Client-generated idempotency key. Replaced by the Stripe checkout/session id when payments are connected.';

comment on table public.purchase_requests is
  'Server-only rate-limit ledger for the temporary test-purchase flow.';

