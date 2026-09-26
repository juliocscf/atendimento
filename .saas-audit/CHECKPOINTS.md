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
