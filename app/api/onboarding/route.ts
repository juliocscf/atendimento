import { NextResponse } from "next/server";

import { onboardingSchema } from "@/lib/validation/onboarding";
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
  if (contentLength > 16_384) {
    return json({ error: "payload_too_large" }, 413);
  }

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json({ error: "unsupported_media_type" }, 415);
  }

  const supabase = await createClient();
  const { data: claims, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claims?.claims) {
    return json({ error: "unauthorized" }, 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const parsed = onboardingSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: "invalid_input" }, 400);
  }

  const { error } = await supabase.rpc("create_initial_workspace", {
    p_organization_name: parsed.data.organizationName,
    p_slug: parsed.data.slug,
    p_branch_name: parsed.data.branchName,
    p_branch_code: parsed.data.branchCode,
    p_full_name: parsed.data.fullName,
    p_phone: parsed.data.phone || undefined,
  });

  if (error) {
    if (error.code === "23505") {
      return json({ error: "workspace_conflict" }, 409);
    }

    if (error.code === "22023") {
      return json({ error: "invalid_input" }, 400);
    }

    return json({ error: "onboarding_failed" }, 500);
  }

  return json({ ok: true }, 201);
}
