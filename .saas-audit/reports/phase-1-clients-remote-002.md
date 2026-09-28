# Report: remote Supabase clients and RLS verification

The dedicated `supabase-atendimento` MCP was restored and used for a read-only
verification of the hosted project. The public schema, migration history, RLS
policies and tenant access helpers are consistent with the current clients slice.

The authenticated-role transaction simulation confirmed access for the authorized
user's own organization/unit and denial for a random tenant. It created no rows and
was rolled back.

This checkpoint does not close the module: real authenticated browser/API E2E,
multi-branch isolation with an authorized test context, and leaked-password
protection remain pending. The existing security-advisor findings remain documented.
