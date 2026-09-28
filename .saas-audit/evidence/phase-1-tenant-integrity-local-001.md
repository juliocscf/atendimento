# Evidence: local tenant relationship integrity

- Date: 2026-09-28
- Cycle: `audit-20260926-114137-87ca41f9`
- Environment: isolated local Supabase database (`--local`)
- Data: synthetic fixture rows only; the pgTAP file ends with `ROLLBACK`.

## Executed checks

1. `supabase db lint --local` — passed; no schema errors.
2. `supabase test db --local` — passed; 1 file, 7 tests.

The pgTAP suite verifies one valid fixture setup and rejects cross-organization client-contact, device-client, device-branch, device-type and timeline-device relationships, plus reassignment of an in-use device type across organizations.

## Limits

This proves local database constraint behavior only. It does not prove RLS behavior as an authenticated tenant user, application E2E behavior, or the state of the hosted Supabase project. No remote project was queried or modified; no customer records or additional Auth identities were used.
