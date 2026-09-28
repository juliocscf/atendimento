begin;

-- The trigger must inspect the catalog even when the mutating request runs as
-- authenticated. It is not an API function: execution remains revoked for
-- public roles and is reachable only through the table trigger.
create or replace function private.enforce_device_type_tenant_integrity()
returns trigger
language plpgsql
security definer
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

commit;
