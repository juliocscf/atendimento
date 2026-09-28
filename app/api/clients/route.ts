import { NextResponse } from "next/server";

import { clientCreateSchema } from "@/lib/validation/client";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get("origin");

  if (origin && origin !== requestUrl.origin) {
    return json({ error: "forbidden" }, 403);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 32_768) {
    return json({ error: "payload_too_large" }, 413);
  }

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json({ error: "unsupported_media_type" }, 415);
  }

  const supabase = await createClient();
  const { data: claims, error: claimsError } = await supabase.auth.getClaims();
  const userId = typeof claims?.claims?.sub === "string" ? claims.claims.sub : null;

  if (claimsError || !userId) {
    return json({ error: "unauthorized" }, 401);
  }

  const { data: memberships, error: membershipError } = await supabase
    .from("organization_members")
    .select("organization_id,status")
    .eq("user_id", userId)
    .limit(2);

  if (membershipError || memberships?.length !== 1 || memberships[0].status !== "active") {
    return json({ error: "organization_required" }, 403);
  }

  const membership = memberships[0];

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const parsed = clientCreateSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: "invalid_input" }, 400);
  }

  const { data: branch } = await supabase
    .from("branches")
    .select("id")
    .eq("id", parsed.data.branchId)
    .eq("organization_id", membership.organization_id)
    .eq("status", "active")
    .is("deleted_at", null)
    .maybeSingle();

  if (!branch) {
    return json({ error: "forbidden" }, 403);
  }

  const { data: client, error } = await supabase
    .from("clients")
    .insert({
      organization_id: membership.organization_id,
      branch_id: branch.id,
      client_type: parsed.data.clientType,
      display_name: parsed.data.displayName,
      legal_name: parsed.data.legalName || null,
      trade_name: parsed.data.tradeName || null,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      whatsapp: parsed.data.whatsapp || null,
      notes: parsed.data.notes || null,
      created_by: userId,
      updated_by: userId,
    })
    .select("id,display_name,client_type,branch_id,status,created_at")
    .single();

  if (error || !client) {
    return json({ error: "client_creation_failed" }, 500);
  }

  return json({ client }, 201);
}
