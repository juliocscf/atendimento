begin;

-- Existing data must already respect the client/device unit relationship.
do $$
begin
  if exists (
    select 1
    from public.devices as device
    join public.clients as client
      on client.id = device.client_id
     and client.organization_id = device.organization_id
    where device.branch_id is distinct from client.branch_id
  ) then
    raise exception 'devices contains client/branch mismatches; reconcile existing records before applying this migration';
  end if;
end;
$$;

-- The trigger closes the NULL-composite-FK escape hatch and requires the
-- device unit to match the client's unit exactly, including NULL semantics.
create or replace function private.enforce_device_client_unit_integrity()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_client_organization_id uuid;
  v_client_branch_id uuid;
begin
  select client.organization_id, client.branch_id
    into v_client_organization_id, v_client_branch_id
  from public.clients as client
  where client.id = new.client_id
  for share;

  if not found then
    raise exception using
      errcode = '23503',
      message = 'device client does not exist';
  end if;

  if v_client_organization_id <> new.organization_id then
    raise exception using
      errcode = '23503',
      message = 'device client belongs to another organization';
  end if;

  if v_client_branch_id is distinct from new.branch_id then
    raise exception using
      errcode = '23514',
      message = 'device branch must match the client branch';
  end if;

  return new;
end;
$$;

revoke all on function private.enforce_device_client_unit_integrity() from public, anon, authenticated;

drop trigger if exists devices_client_unit_integrity on public.devices;
create trigger devices_client_unit_integrity
before insert or update of organization_id, branch_id, client_id on public.devices
for each row execute function private.enforce_device_client_unit_integrity();

-- Timeline visibility and writes inherit both tenant and unit access from the
-- parent device. A member cannot use an event row to bypass device RLS.
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
      and private.has_device_access(parent_device.organization_id, parent_device.branch_id)
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
      and private.has_device_access(parent_device.organization_id, parent_device.branch_id)
  )
);

comment on function private.enforce_device_client_unit_integrity() is
  'Requires every device client and unit to match exactly, including NULL semantics.';

commit;
