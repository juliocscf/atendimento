# RESUME_FROM

- Cycle: `audit-20260926-114137-87ca41f9`
- Module: `phase-1-clients`
- Stage: `CHECKPOINT`
- Resource: `clients`
- Test: `EV-CLIENTS-001`
- Status: `BLOQUEADO`
- Evidence already completed: local schema lint; 7 transaction-scoped tenant-integrity pgTAP checks; remote schema/migration/RLS inspection and an authenticated-role transaction simulation through MCP `supabase-atendimento`.
- Pending: negative branch/organization isolation with a membership restricted to a unit; payload-allowlist negative test remains pending.
- Next action: run the negative branch test with an authorized restricted membership or an explicitly approved equivalent test context. Password enrollment/reset/change remains outside this module and must not be added until an approved protection exists. Do not use the generic Supabase connector, do not create another identity, and do not write to the remote database outside an explicitly authorized migration or test operation.
