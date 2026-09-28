begin;

-- Keep the atomic onboarding implementation outside the exposed Data API schema.
-- The function still runs with elevated privileges because onboarding must create
-- the first organization, membership and audit event before RLS membership exists.
create or replace function private.create_initial_workspace(
  p_organization_name text,
  p_slug text,
  p_branch_name text,
  p_branch_code text,
  p_full_name text,
  p_phone text default null
)
returns table (
  organization_id uuid,
  branch_id uuid,
  profile_id uuid,
  member_id uuid
)
language plpgsql
security definer
set search_path = pg_catalog, public, extensions
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_organization_name text := btrim(p_organization_name);
  v_slug text := lower(btrim(p_slug));
  v_branch_name text := btrim(p_branch_name);
  v_branch_code text := upper(btrim(p_branch_code));
  v_full_name text := btrim(p_full_name);
  v_phone text := nullif(btrim(coalesce(p_phone, '')), '');
  v_owner_role_id uuid;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'authenticated_context_required';
  end if;

  if char_length(v_organization_name) not between 2 and 160 then
    raise exception using errcode = '22023', message = 'invalid_organization_name';
  end if;

  if v_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' or char_length(v_slug) > 120 then
    raise exception using errcode = '22023', message = 'invalid_slug';
  end if;

  if char_length(v_branch_name) not between 2 and 160 then
    raise exception using errcode = '22023', message = 'invalid_branch_name';
  end if;

  if v_branch_code !~ '^[A-Z0-9_-]{2,32}$' then
    raise exception using errcode = '22023', message = 'invalid_branch_code';
  end if;

  if char_length(v_full_name) not between 2 and 160 then
    raise exception using errcode = '22023', message = 'invalid_full_name';
  end if;

  if v_phone is not null and char_length(v_phone) > 40 then
    raise exception using errcode = '22023', message = 'invalid_phone';
  end if;

  perform pg_advisory_xact_lock(hashtextextended('onboarding:' || v_user_id::text, 0));

  if exists (
    select 1
    from public.organization_members member
    where member.user_id = v_user_id
  ) then
    raise exception using errcode = '23505', message = 'already_onboarded';
  end if;

  insert into public.organizations (name, slug, created_by)
  values (v_organization_name, v_slug, v_user_id)
  returning id into organization_id;

  insert into public.branches (organization_id, name, code, created_by)
  values (organization_id, v_branch_name, v_branch_code, v_user_id)
  returning id into branch_id;

  insert into public.profiles (id, full_name, phone, status)
  values (v_user_id, v_full_name, v_phone, 'active')
  returning id into profile_id;

  insert into public.roles (organization_id, key, name, description, is_system)
  values (
    organization_id,
    'owner',
    'Administrador da organização',
    'Papel inicial criado durante o onboarding.',
    false
  )
  returning id into v_owner_role_id;

  insert into public.organization_members (
    organization_id,
    user_id,
    role_id,
    status,
    all_branches
  )
  values (organization_id, v_user_id, v_owner_role_id, 'active', true)
  returning id into member_id;

  insert into public.audit_logs (
    organization_id,
    actor_user_id,
    action,
    entity_type,
    entity_id,
    after_data
  )
  values (
    organization_id,
    v_user_id,
    'organization.created',
    'organization',
    organization_id,
    jsonb_build_object(
      'branch_id', branch_id,
      'member_id', member_id,
      'source', 'initial_onboarding'
    )
  );

  return next;
exception
  when unique_violation then
    raise exception using errcode = '23505', message = 'workspace_conflict';
end;
$$;

revoke all on function private.create_initial_workspace(text, text, text, text, text, text)
from public, anon, authenticated;
grant usage on schema private to authenticated;
grant execute on function private.create_initial_workspace(text, text, text, text, text, text)
to authenticated;

-- Preserve the existing RPC contract while keeping the exposed function invoker.
drop function if exists public.create_initial_workspace(text, text, text, text, text, text);

create function public.create_initial_workspace(
  p_organization_name text,
  p_slug text,
  p_branch_name text,
  p_branch_code text,
  p_full_name text,
  p_phone text default null
)
returns table (
  organization_id uuid,
  branch_id uuid,
  profile_id uuid,
  member_id uuid
)
language sql
security invoker
set search_path = pg_catalog, public
as $$
  select *
  from private.create_initial_workspace(
    p_organization_name,
    p_slug,
    p_branch_name,
    p_branch_code,
    p_full_name,
    p_phone
  );
$$;

revoke all on function public.create_initial_workspace(text, text, text, text, text, text)
from public, anon, authenticated;
grant execute on function public.create_initial_workspace(text, text, text, text, text, text)
to authenticated;

comment on function private.create_initial_workspace(text, text, text, text, text, text) is
  'Internal atomic onboarding implementation. Authenticated users reach it only through the public invoker wrapper.';

comment on function public.create_initial_workspace(text, text, text, text, text, text) is
  'Authenticated invoker wrapper for the internal atomic onboarding implementation.';

commit;
