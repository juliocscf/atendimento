import { NextResponse } from "next/server";
import { z } from "zod";

import { clientUpdateSchema } from "@/lib/validation/client";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const { id } = await params;
  const parsedId = z.string().uuid().safeParse(id);
  if (!parsedId.success) {
    return json({ error: "client_not_found" }, 404);
  }

  const { data: memberships, error: membershipError } = await supabase
    .from("organization_members")
    .select("organization_id,status")
    .eq("user_id", userId)
    .limit(2);

  if (membershipError || memberships?.length !== 1 || memberships[0].status !== "active") {
    return json({ error: "organization_required" }, 403);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const parsed = clientUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: "invalid_input" }, 400);
  }

  const organizationId = memberships[0].organization_id;
  const { data: branch } = await supabase
    .from("branches")
    .select("id")
    .eq("id", parsed.data.branchId)
    .eq("organization_id", organizationId)
    .eq("status", "active")
    .is("deleted_at", null)
    .maybeSingle();

  if (!branch) {
    return json({ error: "client_not_found" }, 404);
  }

  const { data: client, error } = await supabase
    .from("clients")
    .update({
      branch_id: branch.id,
      client_type: parsed.data.clientType,
      display_name: parsed.data.displayName,
      legal_name: parsed.data.legalName || null,
      trade_name: parsed.data.tradeName || null,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      whatsapp: parsed.data.whatsapp || null,
      notes: parsed.data.notes || null,
      updated_by: userId,
    })
    .eq("id", parsedId.data)
    .eq("organization_id", organizationId)
    .is("deleted_at", null)
    .select("id,display_name,client_type,branch_id,status,created_at")
    .maybeSingle();

  if (error) {
    return json({ error: "client_update_failed" }, 500);
  }
  if (!client) {
    return json({ error: "client_not_found" }, 404);
  }

  return json({ client });
}
