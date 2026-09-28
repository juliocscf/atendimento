# Evidence: phase-1 devices negative payload gate

- Cycle: `audit-20260926-114137-87ca41f9`
- Evidence ID: `EV-20260928-DEVICES-PAYLOAD-010`
- Scope: device create payload allowlist

## Automated result

The smoke test imports the production schema from `lib/validation/device.ts` and runs through the same Zod contract used by `/api/devices`:

- valid payload: accepted;
- identical payload plus `unknownField`: rejected;
- route validation occurs before the database insert.

Command: `npm run security:device-payload`

Result: `device payload smoke passed: valid payload accepted, unknown field rejected`.

## Gate

The device payload allowlist gate is `VALIDATED`. The module remains in progress for future edit/detail/timeline scopes.
