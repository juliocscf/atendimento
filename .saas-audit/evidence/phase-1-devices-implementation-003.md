# Evidence: phase-1 devices API and UI guardrails

- Cycle: `audit-20260926-114137-87ca41f9`
- Evidence ID: `EV-20260928-DEVICES-IMPLEMENTATION-003`
- Scope: first protected device inventory workflow

## Implemented

- Added `/api/devices` GET/POST with authenticated membership checks, origin/media/size guards and explicit organization binding.
- Added strict Zod payload validation; `public_code` is never accepted from the client and remains a database locator only.
- Added server-side relationship validation for active branch, client and device type before insert; database constraints remain authoritative.
- Added `/devices` protected server-rendered inventory page and create form.
- Dashboard now shows visible device totals and links to device management.
- Seeded an idempotent global catalog with `Computador`, `Notebook` and `Impressora` so the protected create flow has approved type options.

## Validation

- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run build` passed and includes `/api/devices` and `/devices`.

## Remaining scope

Manual authenticated E2E is still required for device create/list and negative payload/branch cases. Device edit/detail and timeline mutation endpoints are intentionally not exposed yet.
