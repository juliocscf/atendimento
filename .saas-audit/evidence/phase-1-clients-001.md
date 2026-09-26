# Evidence: phase-1-clients-001

- Cycle: audit-20260926-114137-87ca41f9
- Timestamp: 2026-09-26T14:45:00Z
- Scope: clients foundation slice
- Source: local repository checks and MCP `supabase-atendimento`

## Discovery

- Existing schema includes `clients`, `branches`, `organization_members`, `devices` and `audit_logs`.
- All public tables inspected remotely have RLS enabled.
- Client API derives `organization_id` from the authenticated membership, rejects an ambiguous multi-membership context, and validates `branch_id` within that organization.
- CPF/CNPJ fields are intentionally excluded from the application payload until the encryption service exists.

## Executed evidence

- `npm run lint`: PASSED.
- `npm run typecheck`: PASSED.
- `npm run build`: PASSED.
- `npm run security:smoke`: PASSED; public routes returned 200, protected routes redirected 307, unauthenticated client API returned 401.
- Remote transactional test: `clients.insert` and `devices.insert` audit events were created; sensitive snapshot keys were all false; transaction rolled back.
- Post-rollback read: zero synthetic organizations, clients and devices persisted.
- Final rerun after context hardening: lint, typecheck, build and smoke test PASSED.

## Findings

- `auth_leaked_password_protection` remains OPEN and requires Supabase Auth Dashboard configuration.
- `authenticated_security_definer_function_executable` is an intentional, documented onboarding exception.

## State

Confidence: TESTED for the listed evidence only. The module remains EM_ANDAMENTO because authenticated E2E, branch-denial behavior with multiple memberships and complete CRUD coverage are pending.
