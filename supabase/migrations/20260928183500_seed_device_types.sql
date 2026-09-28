begin;

insert into public.device_types (organization_id, code, name)
values
  (null, 'computer', 'Computador'),
  (null, 'notebook', 'Notebook'),
  (null, 'printer', 'Impressora')
on conflict (code) where organization_id is null do nothing;

commit;
