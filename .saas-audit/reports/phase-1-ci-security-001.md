# Local CI pipeline report

## Outcome

Added a GitHub Actions workflow for pull requests, pushes to `main`, and manual runs. It installs locked npm dependencies, runs application lint/typecheck/build, starts an isolated local Supabase stack, executes local database lint and pgTAP tests, then runs the anonymous security smoke test against a local production server.

All equivalent application and database checks passed locally, including a second build using the exact dummy localhost configuration from the workflow. The workflow uses read-only repository permissions, does not persist the checkout token, uses fixed action/tool versions, and contains no Supabase credentials or remote link.

## Remaining uncertainty and gates

The hosted workflow has not yet run. Authentication-dependent client tests, negative RLS isolation, remote migration verification using only `supabase-atendimento`, and a safe answer for the Free-plan leaked-password control remain outstanding. This checkpoint does not close the clients phase or authorize deployment.
