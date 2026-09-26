begin;

create policy audit_logs_deny_direct_access
on public.audit_logs
for all
to authenticated
using (false)
with check (false);

create index organizations_created_by_idx on public.organizations (created_by);
create index organizations_deleted_by_idx on public.organizations (deleted_by);
create index branches_created_by_idx on public.branches (created_by);
create index branches_deleted_by_idx on public.branches (deleted_by);
create index role_permissions_permission_id_idx on public.role_permissions (permission_id);
create index organization_members_role_id_idx on public.organization_members (role_id);
create index clients_created_by_idx on public.clients (created_by);
create index clients_updated_by_idx on public.clients (updated_by);
create index clients_deleted_by_idx on public.clients (deleted_by);
create index client_contacts_organization_id_idx on public.client_contacts (organization_id);
create index client_contacts_deleted_by_idx on public.client_contacts (deleted_by);
create index addresses_organization_id_idx on public.addresses (organization_id);
create index addresses_deleted_by_idx on public.addresses (deleted_by);
create index devices_device_type_id_idx on public.devices (device_type_id);
create index devices_created_by_idx on public.devices (created_by);
create index devices_updated_by_idx on public.devices (updated_by);
create index devices_deleted_by_idx on public.devices (deleted_by);
create index device_timeline_events_organization_id_idx on public.device_timeline_events (organization_id);
create index device_timeline_events_actor_user_id_idx on public.device_timeline_events (actor_user_id);
create index audit_logs_actor_user_id_idx on public.audit_logs (actor_user_id);

commit;
