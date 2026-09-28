# Evidence: phase-1 devices tenant and unit hardening

- Cycle: `audit-20260926-114137-87ca41f9`
- Evidence ID: `EV-20260928-DEVICES-HARDENING-002`
- Timestamp: `2026-09-28`
- Scope: database tenant/unit integrity, device RLS and timeline RLS
- Sources: local Supabase database, remote MCP `supabase-atendimento`, migration history and pgTAP

## Database controls

- `devices` now binds `organization_id + client_id` and `organization_id + branch_id` with composite foreign keys.
- A device must match the client's organization and unit exactly, including NULL semantics.
- Global device types or types owned by the same organization are allowed; cross-tenant type use and unsafe reassignment are rejected.
- Timeline events now bind to the parent device's organization and inherit the parent device's unit authorization.
- A NULL device unit is visible only to memberships explicitly granted `all_branches=true`.

## Validation

- Remote migrations `device_tenant_integrity`, `devices_unit_hardening` and `devices_trigger_security_hardening` are applied.
- Remote transaction test with a restricted membership passed: assigned unit device insert/read allowed, unassigned unit insert/read denied; timeline follows the same boundary. All fixtures and authorization changes were rolled back.
- Local `supabase db lint --local` passed.
- Local pgTAP passed `9/9`, including cross-organization client/branch/type, client-unit mismatch and timeline relationship checks.
- Application `lint`, `typecheck` and `build` passed.

## Remaining scope

No device API or UI exists yet. The device workflow remains blocked from exposure until its request allowlist, authenticated E2E and audit snapshot redaction are implemented and tested.
