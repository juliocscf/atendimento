begin;

select plan(9);

select lives_ok(
  $$
    insert into public.organizations (id, name, slug) values
      ('10000000-0000-4000-8000-000000000001', 'Tenant Alpha', 'tenant-alpha-test'),
      ('20000000-0000-4000-8000-000000000002', 'Tenant Beta', 'tenant-beta-test');

    insert into public.branches (id, organization_id, name, code) values
      ('10000000-0000-4000-8000-000000000011', '10000000-0000-4000-8000-000000000001', 'Alpha Branch', 'ALPHA'),
      ('10000000-0000-4000-8000-000000000013', '10000000-0000-4000-8000-000000000001', 'Alpha Secondary Branch', 'ALPHA2'),
      ('20000000-0000-4000-8000-000000000022', '20000000-0000-4000-8000-000000000002', 'Beta Branch', 'BETA');

    insert into public.clients (id, organization_id, branch_id, client_type, display_name) values
      ('10000000-0000-4000-8000-000000000111', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000011', 'individual', 'Alpha Client'),
      ('20000000-0000-4000-8000-000000000222', '20000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000022', 'business', 'Beta Client');

    insert into public.device_types (id, organization_id, code, name) values
      ('10000000-0000-4000-8000-000000001111', '10000000-0000-4000-8000-000000000001', 'alpha-notebook', 'Alpha Notebook'),
      ('20000000-0000-4000-8000-000000002222', '20000000-0000-4000-8000-000000000002', 'beta-notebook', 'Beta Notebook');

    insert into public.devices (id, organization_id, branch_id, client_id, device_type_id, public_code)
    values (
      '10000000-0000-4000-8000-000000011111',
      '10000000-0000-4000-8000-000000000001',
      '10000000-0000-4000-8000-000000000011',
      '10000000-0000-4000-8000-000000000111',
      '10000000-0000-4000-8000-000000001111',
      'AAAA'
    );
  $$,
  'Creates isolated synthetic tenants and a valid device fixture'
);

select throws_ok(
  $$insert into public.client_contacts (organization_id, client_id, name)
    values ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000111', 'Cross Tenant Contact')$$,
  '23503', null, 'A contact cannot reference a client in another organization'
);

select throws_ok(
  $$insert into public.devices (organization_id, branch_id, client_id, device_type_id, public_code)
    values ('10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000011', '20000000-0000-4000-8000-000000000222', '10000000-0000-4000-8000-000000001111', 'BBBB')$$,
  '23503', null, 'A device cannot reference a client in another organization'
);

select throws_ok(
  $$insert into public.devices (organization_id, branch_id, client_id, device_type_id, public_code)
    values ('10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000022', '10000000-0000-4000-8000-000000000111', '10000000-0000-4000-8000-000000001111', 'CCCC')$$,
  '23514', null, 'A device branch must match the client branch'
);

select throws_ok(
  $$insert into public.devices (organization_id, branch_id, client_id, device_type_id, public_code)
    values ('10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000022', '20000000-0000-4000-8000-000000000222', '10000000-0000-4000-8000-000000001111', 'EEEE')$$,
  '23503', null, 'A device cannot reference a client from another organization even with a foreign branch'
);

select throws_ok(
  $$insert into public.devices (organization_id, branch_id, client_id, device_type_id, public_code)
    values ('10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000013', '10000000-0000-4000-8000-000000000111', '10000000-0000-4000-8000-000000001111', 'FFFF')$$,
  '23514', null, 'A device branch must match the client branch'
);

select throws_ok(
  $$insert into public.devices (organization_id, branch_id, client_id, device_type_id, public_code)
    values ('10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000011', '10000000-0000-4000-8000-000000000111', '20000000-0000-4000-8000-000000002222', 'DDDD')$$,
  '23514', null, 'A device cannot use a type owned by another organization'
);

select throws_ok(
  $$insert into public.device_timeline_events (organization_id, device_id, event_type, title)
    values ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000011111', 'device.test', 'Cross Tenant Event')$$,
  '23503', null, 'A timeline event cannot reference a device in another organization'
);

select throws_ok(
  $$update public.device_types
    set organization_id = '20000000-0000-4000-8000-000000000002'
    where id = '10000000-0000-4000-8000-000000001111'$$,
  '23514', null, 'A device type in use cannot be reassigned across organizations'
);

select * from finish();
rollback;
