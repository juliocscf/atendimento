begin;

-- Fail closed if existing records cannot satisfy the new tenant/unit invariants.
do $$
begin
  if exists (
    select 1
    from public.devices as device
    left join public.clients as client on client.id = device.client_id
    left join public.branches as branch on branch.id = device.branch_id
    left join public.device_types as device_type on device_type.id = device.device_type_id
    where client.id is null
       or (device.branch_id is not null and branch.id is null)
       or device_type.id is null
       or client.organization_id <> device.organization_id
       or (device.branch_id is not null and branch.organization_id <> device.organization_id)
       or (device_type.organization_id is not null and device_type.organization_id <> device.organization_id)
  ) then
    raise exception 'devices contains tenant, branch, client or device-type mismatches; reconcile existing records before applying this migration';
  end if;

  if exists (
    select 1
    from public.device_timeline_events as event
    join public.devices as device on device.id = event.device_id
    where event.organization_id <> device.organization_id
  ) then
    raise exception 'device timeline contains organization/device mismatches; reconcile existing records before applying this migration';
  end if;
end;
$$;

-- Composite unique targets support database-enforced tenant/unit relationships.
create unique index if not exists branches_organization_id_id_key
  on public.branches (organization_id, id);

create unique index if not exists clients_organization_id_id_key
  on public.clients (organization_id, id);

create unique index if not exists devices_organization_id_id_key
  on public.devices (organization_id, id);

create index if not exists devices_organization_client_branch_idx
  on public.devices (organization_id, client_id, branch_id);

create index if not exists devices_organization_branch_idx
  on public.devices (organization_id, branch_id);

create index if not exists device_timeline_events_organization_device_idx
  on public.device_timeline_events (organization_id, device_id);

-- Client and optional unit must independently belong to the device organization.
alter table public.devices
  drop constraint if exists devices_client_id_fkey,
  drop constraint if exists devices_branch_id_fkey;

alter table public.devices
  add constraint devices_organization_client_fkey
  foreign key (organization_id, client_id)
  references public.clients (organization_id, id)
  on delete restrict
  not valid,
  add constraint devices_organization_branch_fkey
  foreign key (organization_id, branch_id)
  references public.branches (organization_id, id)
  on delete restrict
  not valid;

alter table public.devices
  validate constraint devices_organization_client_fkey;
alter table public.devices
  validate constraint devices_organization_branch_fkey;

-- A timeline event cannot reference a device from another organization.
alter table public.device_timeline_events
  drop constraint if exists device_timeline_events_device_id_fkey;

alter table public.device_timeline_events
  add constraint device_timeline_events_organization_device_fkey
  foreign key (organization_id, device_id)
  references public.devices (organization_id, id)
  on delete cascade
  not valid;

alter table public.device_timeline_events
  validate constraint device_timeline_events_organization_device_fkey;

-- SECURITY INVOKER: authenticated users can only see global or same-tenant types
-- through the existing device_types SELECT policy; lock the row to serialize
-- device creation with any administrative tenant reassignment.
create or replace function private.enforce_device_type_tenant_integrity()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
declare
  v_type_organization_id uuid;
begin
  if tg_table_name = 'devices' then
    select device_type.organization_id
      into v_type_organization_id
    from public.device_types as device_type
    where device_type.id = new.device_type_id
    for share;

    if not found or (
      v_type_organization_id is not null
      and v_type_organization_id <> new.organization_id
    ) then
      raise exception using
        errcode = '23514',
        message = 'device type is not available for this organization';
    end if;

    return new;
  end if;

  if tg_table_name = 'device_types' then
    if new.organization_id is not null and exists (
      select 1
      from public.devices as existing_device
      where existing_device.device_type_id = old.id
        and existing_device.organization_id <> new.organization_id
    ) then
      raise exception using
        errcode = '23514',
        message = 'device type cannot be reassigned while used by another organization';
    end if;

    return new;
  end if;

  raise exception using
    errcode = '0A000',
    message = 'unsupported table for device type integrity trigger';
end;
$$;

revoke all on function private.enforce_device_type_tenant_integrity() from public, anon, authenticated;

drop trigger if exists devices_device_type_tenant_insert on public.devices;
create trigger devices_device_type_tenant_insert
before insert on public.devices
for each row execute function private.enforce_device_type_tenant_integrity();

drop trigger if exists devices_device_type_tenant_update on public.devices;
create trigger devices_device_type_tenant_update
before update of organization_id, device_type_id on public.devices
for each row execute function private.enforce_device_type_tenant_integrity();

drop trigger if exists device_types_tenant_reassignment_guard on public.device_types;
create trigger device_types_tenant_reassignment_guard
before update of organization_id on public.device_types
for each row execute function private.enforce_device_type_tenant_integrity();

-- A NULL device unit is organization-wide only for memberships explicitly
-- granted all-branch access; limited members must have a concrete authorized unit.
create or replace function private.has_device_access(
  p_organization_id uuid,
  p_branch_id uuid
)
returns boolean
language sql
stable
security invoker
set search_path = pg_catalog, public
as $$
  select case
    when p_branch_id is not null then private.has_branch_access(p_organization_id, p_branch_id)
    else exists (
      select 1
      from public.organization_members as member
      where member.organization_id = p_organization_id
        and member.user_id = (select auth.uid())
        and member.status = 'active'
        and member.all_branches
    )
  end;
$$;

revoke all on function private.has_device_access(uuid, uuid) from public, anon, authenticated;
grant execute on function private.has_device_access(uuid, uuid) to authenticated;

drop policy if exists devices_select_member on public.devices;
create policy devices_select_member
on public.devices
for select
to authenticated
using (private.has_device_access(organization_id, branch_id));

drop policy if exists devices_insert_member on public.devices;
create policy devices_insert_member
on public.devices
for insert
to authenticated
with check (private.has_device_access(organization_id, branch_id));

drop policy if exists devices_update_member on public.devices;
create policy devices_update_member
on public.devices
for update
to authenticated
using (private.has_device_access(organization_id, branch_id))
with check (private.has_device_access(organization_id, branch_id));

-- Inherit unit-scoped device RLS for timeline reads and writes.
drop policy if exists device_timeline_events_select_member on public.device_timeline_events;
create policy device_timeline_events_select_member
on public.device_timeline_events
for select
to authenticated
using (
  exists (
    select 1
    from public.devices as parent_device
    where parent_device.id = device_timeline_events.device_id
      and parent_device.organization_id = device_timeline_events.organization_id
  )
);

drop policy if exists device_timeline_events_insert_member on public.device_timeline_events;
create policy device_timeline_events_insert_member
on public.device_timeline_events
for insert
to authenticated
with check (
  actor_user_id = (select auth.uid())
  and exists (
    select 1
    from public.devices as parent_device
    where parent_device.id = device_timeline_events.device_id
      and parent_device.organization_id = device_timeline_events.organization_id
  )
);

-- Minimize audit snapshots: retain relationship/status context, not inventory
-- identifiers, network details, free-form notes, or hardware configuration.
create or replace function private.audit_client_device_change()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, extensions
as $$
declare
  v_old jsonb;
  v_new jsonb;
  v_organization_id uuid;
  v_entity_id uuid;
begin
  if tg_op <> 'INSERT' then
    v_old := to_jsonb(old);
    v_organization_id := nullif(v_old ->> 'organization_id', '')::uuid;
    v_entity_id := nullif(v_old ->> 'id', '')::uuid;
  end if;

  if tg_op <> 'DELETE' then
    v_new := to_jsonb(new);
    v_organization_id := nullif(v_new ->> 'organization_id', '')::uuid;
    v_entity_id := nullif(v_new ->> 'id', '')::uuid;
  end if;

  if tg_table_name = 'clients' then
    v_old := v_old - 'document_ciphertext' - 'document_hash' - 'notes' - 'email' - 'phone' - 'whatsapp';
    v_new := v_new - 'document_ciphertext' - 'document_hash' - 'notes' - 'email' - 'phone' - 'whatsapp';
  elsif tg_table_name = 'devices' then
    v_old := v_old - 'public_code' - 'manufacturer' - 'model' - 'serial_number' - 'service_tag'
      - 'patrimony' - 'hostname' - 'operating_system' - 'system_version' - 'architecture'
      - 'processor' - 'memory_ram' - 'storage' - 'gpu' - 'motherboard' - 'mac_address'
      - 'ip_address' - 'notes' - 'acquisition_date' - 'manufacturer_warranty_until' - 'current_location';
    v_new := v_new - 'public_code' - 'manufacturer' - 'model' - 'serial_number' - 'service_tag'
      - 'patrimony' - 'hostname' - 'operating_system' - 'system_version' - 'architecture'
      - 'processor' - 'memory_ram' - 'storage' - 'gpu' - 'motherboard' - 'mac_address'
      - 'ip_address' - 'notes' - 'acquisition_date' - 'manufacturer_warranty_until' - 'current_location';
  elsif tg_table_name = 'client_contacts' then
    v_old := v_old - 'name' - 'department' - 'role_title' - 'email' - 'phone' - 'whatsapp';
    v_new := v_new - 'name' - 'department' - 'role_title' - 'email' - 'phone' - 'whatsapp';
  end if;

  insert into public.audit_logs (
    organization_id,
    actor_user_id,
    action,
    entity_type,
    entity_id,
    before_data,
    after_data
  )
  values (
    v_organization_id,
    (select auth.uid()),
    lower(tg_table_name) || '.' || lower(tg_op),
    lower(tg_table_name),
    v_entity_id,
    case when tg_op = 'INSERT' then null else v_old end,
    case when tg_op = 'DELETE' then null else v_new end
  );

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

revoke all on function private.audit_client_device_change() from public, anon, authenticated;

comment on constraint devices_organization_client_fkey on public.devices is
  'Binds every device to a client in the same organization.';
comment on constraint device_timeline_events_organization_device_fkey on public.device_timeline_events is
  'Binds every timeline event to a device in the same organization.';
comment on function private.enforce_device_type_tenant_integrity() is
  'Allows only global or same-organization device types and prevents unsafe tenant reassignment.';
comment on function private.audit_client_device_change() is
  'Append-only audit for client and device changes; contact, credential-like, network and hardware identifier fields are excluded.';

commit;
