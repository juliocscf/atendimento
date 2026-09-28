# Evidence: phase-1 devices authenticated E2E

- Cycle: `audit-20260926-114137-87ca41f9`
- Evidence ID: `EV-20260928-DEVICES-E2E-005`
- Scope: authenticated device create and list
- User evidence: manual browser screenshot showing the protected `/devices` page, the selected MATRIZ unit/client, and the created `SQ3U` row.

## Remote confirmation

- Device `SQ3U` exists in the authorized organization and MATRIZ branch.
- It references the expected client and global `computer` device type.
- Status is `with_client`.
- An authenticated `devices.insert` audit event exists for the same entity and actor.
- The audit snapshot excludes the entered model and other device inventory fields according to the redaction trigger.

## Result

Authenticated create/list passed. The remaining negative check is rejection of an unknown JSON payload field; no edit/detail/timeline mutation flow is exposed yet.
