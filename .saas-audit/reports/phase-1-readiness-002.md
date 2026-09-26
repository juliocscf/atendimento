# Phase 1 readiness — read-only security discovery

Date: 2026-09-26 15:20 America/Sao_Paulo  
Cycle: `audit-20260926-114137-87ca41f9`

## Result

The clients slice remains in progress. The project is not ready to advance into device CRUD or Phase 2. Read-only discovery found tenant and branch relationship gaps in the existing device schema and policies. The detailed evidence and abuse matrix are in `.saas-audit/evidence/phase-1-devices-discovery-001.md`.

## Evidence reviewed

- Skill integrity: PASSED.
- Runtime authorization, status, validation state, coverage and regression ledger: reviewed.
- Supabase MCP: public schema, RLS policies, FK/check constraints, migration history, security and performance advisors.
- Local source: foundation migration, client endpoint and clients page.
- No data or configuration was changed during discovery.

## Open findings and gates

1. HIGH — `devices` insert policy plus independent foreign keys do not bind client, branch and device type to the same organization. Authenticated users have direct table insert grants, so API checks alone would not contain this.
2. HIGH — nullable `devices.branch_id` combines with `has_record_access(org, NULL)` to permit organization-level access without branch authorization.
3. HIGH — timeline event RLS verifies the event tenant membership and actor, but not that the referenced device belongs to that tenant.
4. MEDIUM — device audit snapshots retain hardware identifiers and details; classification and minimization remain to be decided.
5. OPEN — Supabase leaked-password protection is disabled.
6. OPEN — authenticated E2E and branch/tenant negative tests need a dedicated test identity not authorized by the current runtime manifest.
7. WARN — Supabase reports one intentional authenticated SECURITY DEFINER onboarding RPC; its authorization rationale remains documented.

- GATE-01 for read-only device discovery: PASSED.
- GATE-02 logic: PENDING.
- GATE-03 through GATE-06: PENDING for the clients slice and the device module.
- GATE-07: NOT REACHED.

## Required continuation

The requester must enable leaked-password protection in the Supabase Auth settings and authorize a dedicated, non-production test identity for authenticated authorization tests. Then complete the clients checkpoint. Device implementation must begin with database-level tenant/unit relationship enforcement and explicit tests for cross-tenant client, branch, device-type and timeline references.
