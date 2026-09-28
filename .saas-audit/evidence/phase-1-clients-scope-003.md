# Evidence: password-control scope decision and onboarding hardening

- Cycle: `audit-20260926-114137-87ca41f9`
- Evidence ID: `EV-20260928-CLIENTS-SCOPE-003`
- Timestamp: `2026-09-28T17:30:00Z`
- Scope: phase-1-clients security applicability and onboarding RPC hardening
- Sources: local repository, dedicated MCP `supabase-atendimento`, Supabase Auth documentation

## Password-control decision

The current application exposes login only. Repository inspection found no signup,
password reset, password update or password enrollment route; the login form only
submits credentials to `signInWithPassword`.

The hosted Supabase advisor still reports native leaked-password protection disabled,
and the current plan does not provide that Auth feature. Because phase-1-clients
does not create or change passwords, the control is marked `NAO_APLICAVEL` for this
module with an explicit production condition: password enrollment/reset/change must
remain unavailable until native protection is enabled or a separately approved,
validated control is implemented.

## Onboarding hardening

Migration `20260928171806_onboarding_security_hardening` was applied through the
dedicated MCP. The privileged implementation now lives in the non-exposed `private`
schema. The public RPC is an authenticated `SECURITY INVOKER` wrapper. The remote
security advisor no longer reports `authenticated_security_definer_function_executable`.

The remote migration list includes `onboarding_security_hardening`, and the local
database lint plus the 7 transaction-scoped pgTAP integrity tests passed after the
migration was added.

## Limits

This decision closes only the password-control applicability question for the
clients module. It does not authorize adding password-management features or claim
that the hosted Auth setting is enabled.

## State

Confidence: `VALIDATED` for the scope decision and onboarding hardening. The module
still requires real authenticated application E2E before completion.
