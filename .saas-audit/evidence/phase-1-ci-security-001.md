# Evidence: local validation pipeline

- Date: 2026-09-28
- Cycle: `audit-20260926-114137-87ca41f9`
- Scope: repository-local workflow and local checks only.

## Checks passed locally

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run build` repeated with `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:55421` and a dummy publishable-key placeholder, matching the workflow's non-secret build environment
- `supabase db lint --local`
- `supabase test db --local` — 7/7 tests
- `npm run security:smoke` against `127.0.0.1:3000` with dummy public Supabase configuration

## Workflow controls

`.github/workflows/ci.yml` uses read-only `contents` permission, checkout with `persist-credentials: false`, a fixed Supabase CLI version, and only a local Supabase stack. It contains no repository or Supabase secrets and does not link to a hosted project. The local startup output is suppressed to avoid logging generated local credentials.

## Limits

The GitHub-hosted workflow has not run; it requires the changes to be committed and pushed. Local results do not prove hosted runner behavior, authenticated RLS isolation, remote migration state, or production Auth configuration.
