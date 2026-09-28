begin;

-- Stop without changing schema if legacy rows cross the organization boundary.
do $$
begin
  if exists (
    select 1
    from public.client_contacts as contact
    join public.clients as client on client.id = contact.client_id
    where contact.organization_id <> client.organization_id
  ) then
    raise exception 'client_contacts contains organization/client mismatches; reconcile rows before applying this migration';
  end if;
end;
$$;

-- A composite unique target lets the database enforce tenant/client consistency.
create unique index if not exists clients_organization_id_id_key
  on public.clients (organization_id, id);

alter table public.client_contacts
  drop constraint if exists client_contacts_client_id_fkey;

alter table public.client_contacts
  add constraint client_contacts_organization_client_fkey
  foreign key (organization_id, client_id)
  references public.clients (organization_id, id)
  on delete cascade
  not valid;

alter table public.client_contacts
  validate constraint client_contacts_organization_client_fkey;

-- Contact access inherits the parent client's branch-level RLS decision.
drop policy if exists client_contacts_select_member on public.client_contacts;
create policy client_contacts_select_member
on public.client_contacts
for select
to authenticated
using (
  exists (
    select 1
    from public.clients as parent_client
    where parent_client.id = client_contacts.client_id
      and parent_client.organization_id = client_contacts.organization_id
  )
);

drop policy if exists client_contacts_insert_member on public.client_contacts;
create policy client_contacts_insert_member
on public.client_contacts
for insert
to authenticated
with check (
  exists (
    select 1
    from public.clients as parent_client
    where parent_client.id = client_contacts.client_id
      and parent_client.organization_id = client_contacts.organization_id
  )
);

drop policy if exists client_contacts_update_member on public.client_contacts;
create policy client_contacts_update_member
on public.client_contacts
for update
to authenticated
using (
  exists (
    select 1
    from public.clients as parent_client
    where parent_client.id = client_contacts.client_id
      and parent_client.organization_id = client_contacts.organization_id
  )
)
with check (
  exists (
    select 1
    from public.clients as parent_client
    where parent_client.id = client_contacts.client_id
      and parent_client.organization_id = client_contacts.organization_id
  )
);

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

drop trigger if exists client_contacts_audit_change on public.client_contacts;
create trigger client_contacts_audit_change
after insert or update or delete on public.client_contacts
for each row execute function private.audit_client_device_change();

comment on constraint client_contacts_organization_client_fkey on public.client_contacts is
  'Ensures each contact belongs to a client in the same organization.';

commit;
