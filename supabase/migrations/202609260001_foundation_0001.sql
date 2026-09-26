begin;

create schema if not exists private;
revoke all on schema private from public;

create table public.organizations (
  id uuid primary key default extensions.uuid_generate_v4(),
  name text not null check (char_length(btrim(name)) between 2 and 160),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  status text not null default 'active' check (status in ('active', 'suspended', 'archived')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id) on delete set null,
  constraint organizations_slug_unique unique (slug)
);

create table public.branches (
  id uuid primary key default extensions.uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 2 and 160),
  code text not null check (code ~ '^[A-Z0-9_-]{2,32}$'),
  status text not null default 'active' check (status in ('active', 'suspended', 'archived')),
  address_line text,
  address_number text,
  address_complement text,
  neighborhood text,
  city text,
  state text,
  postal_code text,
  phone text,
  email text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id) on delete set null,
  constraint branches_organization_code_unique unique (organization_id, code)
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(btrim(full_name)) between 2 and 160),
  phone text,
  status text not null default 'active' check (status in ('active', 'suspended', 'invited')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.permissions (
  id uuid primary key default extensions.uuid_generate_v4(),
  key text not null check (key ~ '^[a-z][a-z0-9_.-]{2,100}$'),
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  constraint permissions_key_unique unique (key)
);

create table public.roles (
  id uuid primary key default extensions.uuid_generate_v4(),
  organization_id uuid references public.organizations(id) on delete cascade,
  key text not null check (key ~ '^[a-z][a-z0-9_.-]{2,100}$'),
  name text not null,
  description text,
  is_system boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index roles_system_key_unique
  on public.roles (key)
  where organization_id is null;

create unique index roles_organization_key_unique
  on public.roles (organization_id, key)
  where organization_id is not null;

create table public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

create table public.organization_members (
  id uuid primary key default extensions.uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role_id uuid references public.roles(id) on delete set null,
  status text not null default 'active' check (status in ('active', 'suspended', 'invited')),
  all_branches boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organization_members_unique unique (organization_id, user_id)
);

create table public.user_branch_access (
  organization_member_id uuid not null references public.organization_members(id) on delete cascade,
  branch_id uuid not null references public.branches(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (organization_member_id, branch_id)
);

create table public.clients (
  id uuid primary key default extensions.uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete restrict,
  client_type text not null check (client_type in ('individual', 'business')),
  display_name text not null check (char_length(btrim(display_name)) between 2 and 200),
  legal_name text,
  trade_name text,
  document_type text check (document_type in ('cpf', 'cnpj')),
  document_hash text,
  document_ciphertext text,
  email text,
  phone text,
  whatsapp text,
  notes text,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id) on delete set null
);

create unique index clients_document_hash_unique
  on public.clients (organization_id, document_hash)
  where document_hash is not null and deleted_at is null;

create table public.client_contacts (
  id uuid primary key default extensions.uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 2 and 160),
  department text,
  role_title text,
  email text,
  phone text,
  whatsapp text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id) on delete set null
);

create table public.addresses (
  id uuid primary key default extensions.uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  label text not null default 'principal',
  address_line text not null,
  address_number text,
  address_complement text,
  neighborhood text,
  city text not null,
  state text not null,
  postal_code text,
  country text not null default 'BR',
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id) on delete set null
);

create table public.device_types (
  id uuid primary key default extensions.uuid_generate_v4(),
  organization_id uuid references public.organizations(id) on delete cascade,
  code text not null check (code ~ '^[a-z0-9][a-z0-9_-]{1,63}$'),
  name text not null check (char_length(btrim(name)) between 2 and 100),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index device_types_system_code_unique
  on public.device_types (code)
  where organization_id is null;

create unique index device_types_organization_code_unique
  on public.device_types (organization_id, code)
  where organization_id is not null;

create table public.devices (
  id uuid primary key default extensions.uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete restrict,
  client_id uuid not null references public.clients(id) on delete restrict,
  device_type_id uuid not null references public.device_types(id) on delete restrict,
  public_code text not null,
  manufacturer text,
  model text,
  serial_number text,
  service_tag text,
  patrimony text,
  hostname text,
  operating_system text,
  system_version text,
  architecture text,
  processor text,
  memory_ram text,
  storage text,
  gpu text,
  motherboard text,
  mac_address text,
  ip_address inet,
  notes text,
  acquisition_date date,
  manufacturer_warranty_until date,
  status text not null default 'with_client' check (status in ('with_client', 'in_repair', 'in_stock', 'retired', 'lost')),
  current_location text,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id) on delete set null,
  constraint devices_public_code_format check (public_code ~ '^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{4}$')
);

create unique index devices_public_code_unique
  on public.devices (public_code);

create unique index devices_organization_serial_unique
  on public.devices (organization_id, serial_number)
  where serial_number is not null and deleted_at is null;

create table public.device_timeline_events (
  id uuid primary key default extensions.uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  device_id uuid not null references public.devices(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  event_type text not null check (event_type ~ '^[a-z][a-z0-9_.-]{2,100}$'),
  title text not null check (char_length(btrim(title)) between 2 and 200),
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default extensions.uuid_generate_v4(),
  organization_id uuid references public.organizations(id) on delete set null,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null check (action ~ '^[a-z][a-z0-9_.-]{2,100}$'),
  entity_type text not null check (entity_type ~ '^[a-z][a-z0-9_.-]{1,100}$'),
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create index branches_organization_id_idx on public.branches (organization_id);
create index organization_members_user_id_idx on public.organization_members (user_id);
create index user_branch_access_branch_id_idx on public.user_branch_access (branch_id);
create index clients_organization_id_idx on public.clients (organization_id);
create index clients_branch_id_idx on public.clients (branch_id);
create index clients_display_name_idx on public.clients using gin (to_tsvector('simple', display_name));
create index client_contacts_client_id_idx on public.client_contacts (client_id);
create index addresses_client_id_idx on public.addresses (client_id);
create index devices_organization_id_idx on public.devices (organization_id);
create index devices_client_id_idx on public.devices (client_id);
create index devices_branch_id_idx on public.devices (branch_id);
create index devices_model_idx on public.devices using gin (to_tsvector('simple', coalesce(manufacturer, '') || ' ' || coalesce(model, '')));
create index device_timeline_events_device_created_idx on public.device_timeline_events (device_id, created_at desc);
create index audit_logs_organization_created_idx on public.audit_logs (organization_id, created_at desc);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger organizations_set_updated_at
before update on public.organizations
for each row execute function private.set_updated_at();

create trigger branches_set_updated_at
before update on public.branches
for each row execute function private.set_updated_at();

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

create trigger organization_members_set_updated_at
before update on public.organization_members
for each row execute function private.set_updated_at();

create trigger clients_set_updated_at
before update on public.clients
for each row execute function private.set_updated_at();

create trigger client_contacts_set_updated_at
before update on public.client_contacts
for each row execute function private.set_updated_at();

create trigger addresses_set_updated_at
before update on public.addresses
for each row execute function private.set_updated_at();

create trigger devices_set_updated_at
before update on public.devices
for each row execute function private.set_updated_at();

create or replace function private.assign_device_public_code()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, extensions
as $$
declare
  alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  candidate text;
  position integer;
begin
  if tg_op = 'INSERT' then
    if auth.uid() is null and session_user not in ('postgres', 'service_role') then
      raise exception 'authenticated context required to create a device';
    end if;

    loop
      candidate := '';
      for position in 1..4 loop
        candidate := candidate || substr(
          alphabet,
          (get_byte(extensions.gen_random_bytes(1), 0) % char_length(alphabet)) + 1,
          1
        );
      end loop;

      perform pg_advisory_xact_lock(hashtextextended(candidate, 0));

      exit when not exists (
        select 1
        from public.devices
        where public_code = candidate
      );
    end loop;

    new.public_code := candidate;
  elsif tg_op = 'UPDATE' and new.public_code is distinct from old.public_code then
    raise exception 'device public_code is immutable';
  end if;

  return new;
end;
$$;

create trigger devices_assign_public_code
before insert or update of public_code on public.devices
for each row execute function private.assign_device_public_code();

create or replace function private.is_active_org_member(p_organization_id uuid)
returns boolean
language sql
stable
security invoker
set search_path = pg_catalog, public
as $$
  select exists (
    select 1
    from public.organization_members member
    where member.organization_id = p_organization_id
      and member.user_id = (select auth.uid())
      and member.status = 'active'
  );
$$;

create or replace function private.has_branch_access(
  p_organization_id uuid,
  p_branch_id uuid
)
returns boolean
language sql
stable
security invoker
set search_path = pg_catalog, public
as $$
  select exists (
    select 1
    from public.organization_members member
    where member.organization_id = p_organization_id
      and member.user_id = (select auth.uid())
      and member.status = 'active'
      and (
        member.all_branches
        or exists (
          select 1
          from public.user_branch_access branch_access
          where branch_access.organization_member_id = member.id
            and branch_access.branch_id = p_branch_id
        )
      )
  );
$$;

create or replace function private.has_record_access(
  p_organization_id uuid,
  p_branch_id uuid
)
returns boolean
language sql
stable
security invoker
set search_path = pg_catalog, public
as $$
  select private.is_active_org_member(p_organization_id)
    and (p_branch_id is null or private.has_branch_access(p_organization_id, p_branch_id));
$$;

revoke all on all functions in schema private from public;
grant usage on schema private to authenticated;
grant execute on function private.is_active_org_member(uuid) to authenticated;
grant execute on function private.has_branch_access(uuid, uuid) to authenticated;
grant execute on function private.has_record_access(uuid, uuid) to authenticated;

alter table public.organizations enable row level security;
alter table public.branches enable row level security;
alter table public.profiles enable row level security;
alter table public.permissions enable row level security;
alter table public.roles enable row level security;
alter table public.role_permissions enable row level security;
alter table public.organization_members enable row level security;
alter table public.user_branch_access enable row level security;
alter table public.clients enable row level security;
alter table public.client_contacts enable row level security;
alter table public.addresses enable row level security;
alter table public.device_types enable row level security;
alter table public.devices enable row level security;
alter table public.device_timeline_events enable row level security;
alter table public.audit_logs enable row level security;

create policy organizations_select_member
on public.organizations
for select
to authenticated
using (private.is_active_org_member(id));

create policy branches_select_member
on public.branches
for select
to authenticated
using (private.has_branch_access(organization_id, id));

create policy profiles_select_self
on public.profiles
for select
to authenticated
using (id = (select auth.uid()));

create policy profiles_update_self
on public.profiles
for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy permissions_select_authenticated
on public.permissions
for select
to authenticated
using (true);

create policy roles_select_member
on public.roles
for select
to authenticated
using (organization_id is null or private.is_active_org_member(organization_id));

create policy role_permissions_select_member
on public.role_permissions
for select
to authenticated
using (
  exists (
    select 1
    from public.roles role
    where role.id = role_id
      and (role.organization_id is null or private.is_active_org_member(role.organization_id))
  )
);

create policy organization_members_select_self
on public.organization_members
for select
to authenticated
using (user_id = (select auth.uid()));

create policy user_branch_access_select_self
on public.user_branch_access
for select
to authenticated
using (
  exists (
    select 1
    from public.organization_members member
    where member.id = organization_member_id
      and member.user_id = (select auth.uid())
  )
);

create policy clients_select_member
on public.clients
for select
to authenticated
using (private.has_record_access(organization_id, branch_id));

create policy clients_insert_member
on public.clients
for insert
to authenticated
with check (private.has_record_access(organization_id, branch_id));

create policy clients_update_member
on public.clients
for update
to authenticated
using (private.has_record_access(organization_id, branch_id))
with check (private.has_record_access(organization_id, branch_id));

create policy client_contacts_select_member
on public.client_contacts
for select
to authenticated
using (private.has_record_access(organization_id, null));

create policy client_contacts_insert_member
on public.client_contacts
for insert
to authenticated
with check (private.has_record_access(organization_id, null));

create policy client_contacts_update_member
on public.client_contacts
for update
to authenticated
using (private.has_record_access(organization_id, null))
with check (private.has_record_access(organization_id, null));

create policy addresses_select_member
on public.addresses
for select
to authenticated
using (private.has_record_access(organization_id, null));

create policy addresses_insert_member
on public.addresses
for insert
to authenticated
with check (private.has_record_access(organization_id, null));

create policy addresses_update_member
on public.addresses
for update
to authenticated
using (private.has_record_access(organization_id, null))
with check (private.has_record_access(organization_id, null));

create policy device_types_select_member
on public.device_types
for select
to authenticated
using (organization_id is null or private.is_active_org_member(organization_id));

create policy devices_select_member
on public.devices
for select
to authenticated
using (private.has_record_access(organization_id, branch_id));

create policy devices_insert_member
on public.devices
for insert
to authenticated
with check (private.has_record_access(organization_id, branch_id));

create policy devices_update_member
on public.devices
for update
to authenticated
using (private.has_record_access(organization_id, branch_id))
with check (private.has_record_access(organization_id, branch_id));

create policy device_timeline_events_select_member
on public.device_timeline_events
for select
to authenticated
using (private.is_active_org_member(organization_id));

create policy device_timeline_events_insert_member
on public.device_timeline_events
for insert
to authenticated
with check (
  private.is_active_org_member(organization_id)
  and actor_user_id = (select auth.uid())
);

revoke all on all tables in schema public from anon, authenticated;
grant usage on schema public to authenticated;

grant select on
  public.organizations,
  public.branches,
  public.profiles,
  public.permissions,
  public.roles,
  public.role_permissions,
  public.organization_members,
  public.user_branch_access,
  public.clients,
  public.client_contacts,
  public.addresses,
  public.device_types,
  public.devices,
  public.device_timeline_events
to authenticated;

grant update on public.profiles, public.clients, public.client_contacts, public.addresses, public.devices to authenticated;
grant insert on public.clients, public.client_contacts, public.addresses, public.devices, public.device_timeline_events to authenticated;

comment on column public.clients.document_ciphertext is
  'Encrypted application-level value. Never store CPF/CNPJ plaintext in this column.';

comment on column public.devices.public_code is
  'Permanent human-readable identifier. It is not an authentication or authorization token.';

comment on table public.audit_logs is
  'Append-only audit trail. Writes are restricted to trusted server-side processes.';

commit;
