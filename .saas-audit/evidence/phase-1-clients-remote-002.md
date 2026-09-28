# Evidence: remote Supabase clients and RLS verification

- Cycle: `audit-20260926-114137-87ca41f9`
- Evidence ID: `EV-20260928-REMOTE-CLIENTS-002`
- Timestamp: `2026-09-28T17:00:00Z`
- Scope: phase-1-clients remote schema, migration state and tenant access controls
- Source: dedicated MCP `supabase-atendimento`

## Executed checks

- Inspected the hosted `public` schema with verbose table metadata; all inspected public tables have RLS enabled.
- Confirmed hosted migrations through `audit_clients_devices_0001`:
  `foundation_0001`, `foundation_0002_security_indexes`, `onboarding_0001`,
  `onboarding_0002_acl_hardening`, and `audit_clients_devices_0001`.
- Inspected the policies for `clients`, `client_contacts`, `addresses`, `branches`,
  memberships, devices, timeline events and audit logs.
- Inspected the access helpers `private.is_active_org_member`,
  `private.has_branch_access` and `private.has_record_access`; they are invoker
  functions and use the authenticated user from `auth.uid()`.
- In a transaction-scoped authenticated-role simulation using the existing
  authorized account, the user's active organization/unit access evaluated true,
  a random tenant evaluated false, and visible client rows were zero. The
  transaction was rolled back and no data was created.

## Findings

- `auth_leaked_password_protection` remains open and requires Auth configuration.
- `public.create_initial_workspace` remains an intentionally exposed onboarding
  `SECURITY DEFINER` function and is reported by the security advisor; this is
  not treated as resolved by the read-only verification.
- Performance advisors report unused indexes because the hosted dataset is still
  effectively empty; no index was removed during this checkpoint.

## Limits

- The check is not a browser/API E2E test and does not prove a real client create,
  list or update flow.
- Cross-branch denial with multiple authorized memberships remains untested because
  the runtime manifest authorizes no additional identity and no synthetic tenant
  data was created.

## State

Confidence: `TESTED` for remote schema, migration and helper-policy evidence only.
The module remains `BLOQUEADO` pending authenticated E2E and the leaked-password
protection gate.
