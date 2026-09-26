begin;

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
    v_old := v_old - 'notes' - 'ip_address' - 'mac_address' - 'hostname';
    v_new := v_new - 'notes' - 'ip_address' - 'mac_address' - 'hostname';
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

create trigger clients_audit_change
after insert or update or delete on public.clients
for each row execute function private.audit_client_device_change();

create trigger devices_audit_change
after insert or update or delete on public.devices
for each row execute function private.audit_client_device_change();

comment on function private.audit_client_device_change() is
  'Append-only audit for client and device changes. Sensitive contact and credential-like fields are excluded from snapshots.';

commit;
