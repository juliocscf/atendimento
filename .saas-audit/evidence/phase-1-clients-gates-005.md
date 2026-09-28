# Evidence: phase-1 clients gate closure

- Cycle: `audit-20260926-114137-87ca41f9`
- Evidence ID: `EV-20260928-CLIENTS-GATES-005`
- Timestamp: `2026-09-28T18:00:00Z`
- Scope: negative branch isolation and payload allowlist
- Sources: dedicated MCP `supabase-atendimento`, repository validation schema and prior authenticated E2E evidence

## Restricted membership isolation

A transaction-scoped remote test temporarily changed the existing authorized
membership to `all_branches = false` and assigned only the existing `MATRIZ` branch.
The transaction then executed under the `authenticated` role with the authorized
user's JWT claims.

Results:

- restricted membership: `true`
- assigned branch allowed: `true`
- unassigned branch denied: `true`
- visible client rows in the assigned branch: `1`

The transaction ended with `ROLLBACK`; the membership and branch-access changes did
not persist.

## Payload allowlist

The client create/update schema now uses Zod `.strict()`. A request containing an
unknown field is rejected during schema validation instead of being silently
accepted. The API continues to construct the database insert/update object from the
explicit allowlist, so unknown properties cannot reach `public.clients`.

## State

Confidence: `VALIDATED` for both previously pending gates. No new identity or
persistent test tenant was created.
