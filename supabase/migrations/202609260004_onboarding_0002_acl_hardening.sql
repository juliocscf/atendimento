begin;

revoke execute on function public.create_initial_workspace(text, text, text, text, text, text) from anon;
revoke execute on function public.create_initial_workspace(text, text, text, text, text, text) from public;
grant execute on function public.create_initial_workspace(text, text, text, text, text, text) to authenticated;

commit;
