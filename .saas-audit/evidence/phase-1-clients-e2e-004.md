# Evidence: authenticated clients E2E

- Cycle: `audit-20260926-114137-87ca41f9`
- Evidence ID: `EV-20260928-CLIENTS-E2E-004`
- Timestamp: `2026-09-28T17:44:29Z`
- Scope: authenticated clients create, list, details and update flow
- Sources: user-provided screenshots from the hosted app and read-only MCP `supabase-atendimento`

## Executed flow

- Authenticated dashboard session opened `/clients`.
- Created synthetic client `E2E Cliente QA 20260928` in `MATRIZ`.
- Opened the client details page successfully.
- Edited the display name to `E2E Cliente QA 20260928 EDITADO`.
- Confirmed the edited row in the clients list with status `active` and the expected branch.
- Confirmed the UI does not collect CPF/CNPJ in this slice.

## Remote confirmation

- Hosted row exists with the expected synthetic display name, `individual` type,
  `MATRIZ` branch and `.invalid` test email.
- Audit trail contains both `clients.insert` and `clients.update` events for the
  same synthetic row.
- Sensitive audit snapshot keys `document_ciphertext` and `document_hash` are
  absent from both events.

## Limits

- The authorized membership has `all_branches = true`; therefore this session
  cannot prove denial for a real branch outside a restricted user's assignment.
- No additional identity or persistent second test tenant was created.

## State

Confidence: `TESTED` for authenticated create/list/details/update. Branch-denial
testing with a restricted membership remains pending under the runtime authorization
manifest.
