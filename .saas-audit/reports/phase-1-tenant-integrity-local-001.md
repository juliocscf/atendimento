# Local tenant integrity report

## Result

The project-local schema passed Supabase CLI lint with no schema errors. The pgTAP suite passed all 7 checks using synthetic data in a transaction that is rolled back.

The tests cover valid same-tenant fixture creation and negative cross-tenant relationships for contacts, devices, branches, device types, timeline events, and reassignment of an in-use tenant device type.

## Security state

The result is limited to local database constraints. It does not establish authenticated RLS isolation or client-application behavior. Those checks remain pending, as does the hosted project migration state because the current task session does not expose the dedicated `supabase-atendimento` MCP tools.

The hosted Auth leaked-password control remains unavailable on the Free plan. No upgrade was made and no unverified workaround is treated as equivalent. Keep password enrollment/change and production release gated until an alternative is validated or the risk is explicitly handled under project policy.

## Scope and rollback

Only the local Supabase database was used. pgTAP fixtures were rolled back. No remote database, customer data, additional test user, or other project's MCP configuration was touched.
