# Evidence: phase-1-devices-discovery-001

- Cycle: audit-20260926-114137-87ca41f9
- Timestamp: 2026-09-26T15:20:00-03:00
- Stage: DISCOVERY / read-only
- Source: local repository and exclusive Supabase MCP `supabase-atendimento`
- Scope: `device_types`, `devices`, `device_timeline_events`, existing RLS, constraints and migration history

## Authorization and safety

- Database operations were read-only `list_tables`, `execute_sql` SELECTs, `get_advisors` and `list_migrations`.
- No schema, Auth setting, user, or database row was modified.
- No customer PII was selected or used.

## Discovery

- `public.device_types`, `public.devices` and `public.device_timeline_events` exist remotely; RLS is enabled on each.
- All three tables have broad `SELECT` grants for `authenticated`; device and timeline tables also grant `INSERT` to `authenticated`.
- `devices_insert_member` checks `private.has_record_access(organization_id, branch_id)`, but its foreign keys independently validate `client_id`, `branch_id` and `device_type_id`. The policy and FKs do not prove those related rows share the device's `organization_id`.
- `device_timeline_events_insert_member` checks an active membership for the event's `organization_id` and that `actor_user_id = auth.uid()`, but does not prove that `device_id` belongs to that organization.
- `devices.branch_id` is nullable. `private.has_record_access(org, null)` falls back to active organization membership, so a null branch bypasses branch-specific authorization for direct authenticated inserts and reads.
- `device_types` permits global rows (`organization_id IS NULL`) and organization-specific rows; the current grants allow reading but not creating or editing them through the authenticated Data API.
- `public_code` has a database generator, format constraint, global unique index, and update immutability trigger. It must remain a locator only and must not authorize access.
- The audit trigger removes hostname, IP, MAC and notes from device snapshots. Serial number, service tag, asset number and hardware details remain in snapshots and need explicit data classification before device records are used.

## Threat model and abuse cases

| Asset / boundary | Abuse case | Existing control | Gap / required control |
|---|---|---|---|
| Tenant device inventory | Authenticated member submits own `organization_id` with a `client_id` from another tenant | RLS membership and independent FK | Database-level composite relationship enforcement plus negative tenant test |
| Unit-scoped inventory | Member with limited branch access inserts or reads a row with `branch_id = NULL` | `has_record_access` checks non-null branch access | Make branch mandatory for devices and ensure policies fail closed on null |
| Equipment timeline | Member inserts an event under own organization pointing to another tenant's device | Authenticated role, active membership, actor UID, FK to device id | Database-level `(organization_id, device_id)` relationship enforcement and negative test |
| Device type catalog | Member chooses a type owned by another organization | Select policy on device_types | Enforce global-or-same-tenant type at database boundary |
| Public four-character code | Attacker guesses or enumerates a code to access a device | Unique non-authentication comment | Every lookup must require authenticated membership and tenant/unit RLS; never expose a public lookup endpoint |
| Device audit | Hardware identifiers are copied into before/after JSON | Sensitive contact fields are excluded | Classify serial/service tag/patrimony/hardware attributes and redact or minimize audit snapshots |

## Gate assessment

- GATE-01 discovery for the device data model: PASSED.
- GATE-02 logic reconstruction: PENDING; authorized device-type maintenance, client lifecycle, branch access and timeline mutation behavior are not implemented.
- GATE-03/04/05/06 for the device module: PENDING; there is no device UI/API and no authenticated cross-tenant test identity in the current authorization manifest.
- The high-severity relational authorization gaps block exposing device CRUD until enforced at the database layer and verified.
- Separate existing client slice blockers remain: leaked-password protection and authenticated E2E/isolation evidence.

## Resume

Return to the clients checkpoint. After its blockers are resolved, design database-level composite tenant/unit relationships for devices and timeline, specify the device-type permission model and audit-field minimization, then implement and test before enabling device UI/API.
