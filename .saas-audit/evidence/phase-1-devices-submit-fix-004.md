# Evidence: phase-1 devices false submission failure fix

- Cycle: `audit-20260926-114137-87ca41f9`
- Evidence ID: `EV-20260928-DEVICES-SUBMIT-FIX-004`
- Scope: authenticated device create form

## Finding

The database confirmed that the device POST was committed and audited, while the browser displayed a connection error. The form accessed `event.currentTarget` after an asynchronous `fetch`; React no longer guarantees that event property after the await. The resulting client exception was caught as a network failure, leaving the form populated and encouraging duplicate submissions.

## Fix

- Capture the form element before the asynchronous request.
- Keep network failure handling limited to the fetch operation.
- Reset the form only after a successful HTTP response.
- Apply the same lifecycle hardening to the client form.

## Validation

- Remote audit confirmed the previously submitted devices were committed with redacted audit snapshots.
- `npm run lint`, `npm run typecheck` and `npm run build` passed after the fix.
- No database migration was needed for this frontend-only correction.
