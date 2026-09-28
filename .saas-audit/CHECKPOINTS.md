# CHECKPOINTS

## CP-20260926-CLIENTS-001

- Cycle: audit-20260926-114137-87ca41f9
- Module: phase-1-clients
- Status: EM_ANDAMENTO
- Evidence: `.saas-audit/evidence/phase-1-clients-001.md`
- Report: `.saas-audit/reports/phase-1-clients-001.md`
- Result: lint, typecheck, build and smoke test passed after context hardening; rollback audit passed; authenticated E2E and leaked-password protection remain pending.
- Resume: enable Auth leaked-password protection, then test authenticated create/list and branch denial with a dedicated test identity.

Cada checkpoint deve possuir um identificador único. O checkpoint final deve registrar explicitamente `GATE-07`, o resultado e o caminho do relatório final.

## CP-20260928-LOCAL-TENANT-INTEGRITY-001

- Cycle: audit-20260926-114137-87ca41f9
- Module: phase-1-clients; supplemental tenant relationship integrity
- Status: EM_ANDAMENTO
- Evidence: `.saas-audit/evidence/phase-1-tenant-integrity-local-001.md`
- Report: `.saas-audit/reports/phase-1-tenant-integrity-local-001.md`
- Result: local schema lint passed; pgTAP passed 7/7 transaction-scoped checks for same-tenant client contacts, device client/branch/type, timeline ownership, and device-type reassignment. Local config no longer references a nonexistent seed file.
- Gate status: relational integrity checks passed locally; client E2E, authenticated RLS/isolation, remote migration state, and leaked-password protection remain pending.
- Scope: no remote Supabase operation and no real/customer data; all test fixtures were rolled back.
- Resume: restore this project's MCP tools in a fresh project session, then continue the authorized client workflow; do not mark the phase complete or expose password enrollment until the remaining production gates have an approved solution.

## CP-20260928-CI-SECURITY-001

- Cycle: audit-20260926-114137-87ca41f9
- Module: phase-1-clients; local validation automation
- Status: EM_ANDAMENTO
- Evidence: `.saas-audit/evidence/phase-1-ci-security-001.md`
- Report: `.saas-audit/reports/phase-1-ci-security-001.md`
- Result: local lint, typecheck, production build, database lint, 7 pgTAP tenant-integrity tests, and anonymous security smoke all passed. Added a GitHub Actions workflow with read-only permissions, token persistence disabled, fixed tool versions, local Supabase only, and dummy public config for smoke checks.
- Gate status: local validation is reproducible; GitHub workflow has not run because the changes have not been pushed. Authenticated RLS/E2E, remote database verification, and leaked-password protection remain pending.
- Resume: run the workflow after the user-authorized Git commit/push; restore `supabase-atendimento` in a fresh project session before any remote inspection.

## CP-20260926-SECURITY-READ-002

- Cycle: audit-20260926-114137-87ca41f9
- Module: phase-1-clients; read-only discovery for devices
- Status: BLOQUEADO
- Evidence: `.saas-audit/evidence/phase-1-devices-discovery-001.md`
- Report: `.saas-audit/reports/phase-1-readiness-002.md`
- Result: Supabase integrity and migration history were inspected through MCP `supabase-atendimento`; `devices` RLS checks organization and branch membership but does not enforce that client, branch and device type belong to the same tenant; timeline event policy does not bind its device to the event organization. `branch_id` is nullable and the shared RLS helper treats null branch as organization-level access. No writes or test data were created.
- Gate status: GATE-01 discovery for devices PASSED; GATE-02 logic and GATE-03/04/05/06 for clients/devices remain PENDING. The clients slice remains incomplete.
- Blockers: leaked-password protection is disabled; authenticated E2E/isolation testing needs a dedicated test identity, which the current manifest does not authorize; database authorization needs relational tenant constraints before devices are exposed.
- Resume: close the clients checkpoint only after the required Auth setting and authorized dedicated test identity are available. Then implement database-level relationship constraints and authorization tests before device UI/API.

## CP-20260928-REMOTE-CLIENTS-002

- Cycle: audit-20260926-114137-87ca41f9
- Module: phase-1-clients; remote schema and RLS verification
- Status: BLOQUEADO
- Evidence: `.saas-audit/evidence/phase-1-clients-remote-002.md`
- Report: `.saas-audit/reports/phase-1-clients-remote-002.md`
- Result: dedicated MCP restored; hosted public tables, migration history, RLS policies and tenant helper functions inspected. Authenticated-role transaction simulation confirmed own-tenant/unit access and random-tenant denial with rollback and no created data.
- Gate status: remote verification passed for its scope; GATE-03/GATE-04/GATE-05/GATE-06 remain pending because authenticated application E2E and leaked-password protection are unresolved.
- Findings: leaked-password protection remains disabled; the intentional onboarding `SECURITY DEFINER` advisor finding remains open; unused-index performance notices were observed and not changed.
- Resume: execute the authorized user's real authenticated client create/list/update flow when browser automation is available; keep password enrollment gated until leaked-password protection has an approved solution.

## CP-20260928-SECURITY-HARDENING-003

- Cycle: audit-20260926-114137-87ca41f9
- Module: phase-1-clients; onboarding exposure and password-control applicability
- Status: EM_ANDAMENTO
- Evidence: `.saas-audit/evidence/phase-1-clients-scope-003.md`
- Result: applied `onboarding_security_hardening`; the exposed RPC is now an authenticated invoker wrapper and the privileged implementation is in the non-exposed `private` schema. The security advisor no longer reports the onboarding `SECURITY DEFINER` finding. The leaked-password control is formally `NAO_APLICAVEL` to this module because no password enrollment/reset/change exists.
- Gate status: the password-control blocker is resolved for this module with a documented production restriction; GATE-03/GATE-04/GATE-06 remain pending only for real authenticated application E2E and branch-isolation evidence.
- Resume: run the authorized user's authenticated client create/list/update flow and the negative branch/unit checks when browser automation is available.

## CP-20260928-CLIENTS-E2E-004

- Cycle: audit-20260926-114137-87ca41f9
- Module: phase-1-clients; authenticated application E2E
- Status: BLOQUEADO
- Evidence: `.saas-audit/evidence/phase-1-clients-e2e-004.md`
- Result: manual authenticated flow passed for create, list, details and update; remote row and audit events were confirmed through `supabase-atendimento`, with sensitive document keys absent.
- Gate status: GATE-03 progressed for the tested client flows; GATE-04 remains pending for negative branch isolation with a restricted membership, and payload-allowlist negative coverage remains pending.
- Limitation: the authorized user has `all_branches=true`; no extra identity or persistent second tenant was created.
- Resume: obtain an authorized restricted membership/context and execute the negative branch and payload rejection checks.

## CP-20260928-CLIENTS-GATES-005

- Cycle: audit-20260926-114137-87ca41f9
- Module: phase-1-clients
- Status: CONCLUIDO
- Evidence: `.saas-audit/evidence/phase-1-clients-gates-005.md`
- Result: transaction-scoped remote test with a restricted membership passed; the assigned branch was allowed and the unassigned branch was denied, with rollback and no persistent authorization change. Client create/update schemas now reject unknown payload fields through Zod `.strict()`.
- Gate status: GATE-01, GATE-02, GATE-03, GATE-04, GATE-05 and GATE-06 PASSED for the clients module. `phase-1-clients` is complete; the overall audit remains in progress for devices.
- Resume: begin phase-1-devices discovery and resolve the previously recorded tenant/branch relationship findings before exposing device workflows.

## CP-20260928-DEVICES-HARDENING-006

- Cycle: audit-20260926-114137-87ca41f9
- Module: phase-1-devices
- Status: EM_ANDAMENTO
- Evidence: `.saas-audit/evidence/phase-1-devices-hardening-002.md`
- Result: applied database-level tenant and unit hardening for devices, device types and timeline events. Restricted-membership remote transaction passed with rollback; local pgTAP passed 9/9 and local schema lint passed.
- Gate status: discovery and data authorization guardrails passed for this scope. Device API/UI, request allowlist, authenticated E2E and final audit-snapshot verification remain pending.
- Resume: implement device API/UI only after adding the remaining request and audit tests; do not expose public-code lookup without authenticated tenant/unit access.

## CP-20260928-DEVICES-IMPLEMENTATION-007

- Cycle: audit-20260926-114137-87ca41f9
- Module: phase-1-devices
- Status: EM_ANDAMENTO
- Evidence: `.saas-audit/evidence/phase-1-devices-implementation-003.md`
- Result: protected `/api/devices` GET/POST, strict request validation, relationship prechecks, `/devices` inventory/create UI and dashboard navigation were implemented. Lint, typecheck and production build passed.
- Gate status: implementation guardrails passed; authenticated E2E, negative API payload/branch tests and device audit snapshot verification remain pending. Edit/detail/timeline mutation are intentionally not exposed.
- Resume: run the manual authenticated device create/list flow with an assigned unit, then verify rejection for an unknown payload field and an unauthorized unit.

## CP-20260928-DEVICES-SUBMIT-FIX-008

- Cycle: audit-20260926-114137-87ca41f9
- Module: phase-1-devices
- Status: EM_ANDAMENTO
- Evidence: `.saas-audit/evidence/phase-1-devices-submit-fix-004.md`
- Result: corrected the false connection error caused by reading `event.currentTarget` after an asynchronous request. The database had already committed the device; the browser-side exception was incorrectly classified as a failed save and enabled duplicate submissions.
- Gate status: submit lifecycle fix passed lint, typecheck and build. Authenticated E2E still needs one clean manual run after deployment.
- Resume: deploy this corrective commit and repeat one device registration, then verify the success state and negative payload/unit cases.

## CP-20260928-DEVICES-E2E-009

- Cycle: audit-20260926-114137-87ca41f9
- Module: phase-1-devices
- Status: EM_ANDAMENTO
- Evidence: `.saas-audit/evidence/phase-1-devices-e2e-005.md`
- Result: manual authenticated create/list passed for device `SQ3U` in MATRIZ; remote MCP confirmed the row and its audit event. Sensitive device attributes were absent from the audit snapshot.
- Gate status: authenticated device create/list and audit redaction passed. Unknown-payload rejection remains pending; edit/detail/timeline mutation remain outside the exposed scope.
- Resume: execute one negative POST containing an unknown JSON field and confirm HTTP 400 with no additional device row.

## CP-20260928-DEVICES-PAYLOAD-010

- Cycle: audit-20260926-114137-87ca41f9
- Module: phase-1-devices
- Status: EM_ANDAMENTO
- Evidence: `.saas-audit/evidence/phase-1-devices-payload-010.md`
- Result: production Zod schema smoke test passed; valid payload was accepted and the same payload with `unknownField` was rejected before database insertion.
- Gate status: device create/list, tenant/unit isolation, audit redaction and payload allowlist are validated for the exposed slice. Edit, detail and timeline mutation remain future scope.
- Resume: define and implement the next device slice (detail/edit/timeline) only after its own authorization and payload gates are specified.
