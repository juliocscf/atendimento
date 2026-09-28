import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { deviceCreateSchema } from "@/lib/validation/device";

export const dynamic = "force-dynamic";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

async function getActiveMembership() {
  const supabase = await createClient();
  const { data: claims, error: claimsError } = await supabase.auth.getClaims();
  const userId = typeof claims?.claims?.sub === "string" ? claims.claims.sub : null;

  if (claimsError || !userId) return { supabase, userId: null, organizationId: null };

  const { data: memberships, error } = await supabase
    .from("organization_members")
    .select("organization_id,status")
    .eq("user_id", userId)
    .limit(2);

  if (error || memberships?.length !== 1 || memberships[0].status !== "active") {
    return { supabase, userId, organizationId: null };
  }

  return { supabase, userId, organizationId: memberships[0].organization_id };
}

function payloadForInsert(input: ReturnType<typeof deviceCreateSchema.parse>, organizationId: string, userId: string) {
  return {
    organization_id: organizationId,
    branch_id: input.branchId,
    client_id: input.clientId,
    device_type_id: input.deviceTypeId,
    manufacturer: input.manufacturer || null,
    model: input.model || null,
    serial_number: input.serialNumber || null,
    service_tag: input.serviceTag || null,
    patrimony: input.patrimony || null,
    hostname: input.hostname || null,
    operating_system: input.operatingSystem || null,
    system_version: input.systemVersion || null,
    architecture: input.architecture || null,
    processor: input.processor || null,
    memory_ram: input.memoryRam || null,
    storage: input.storage || null,
    gpu: input.gpu || null,
    motherboard: input.motherboard || null,
    mac_address: input.macAddress || null,
    ip_address: input.ipAddress || null,
    notes: input.notes || null,
    acquisition_date: input.acquisitionDate || null,
    manufacturer_warranty_until: input.manufacturerWarrantyUntil || null,
    status: input.status ?? "with_client",
    current_location: input.currentLocation || null,
    created_by: userId,
    updated_by: userId,
  };
}

export async function GET(request: Request) {
  const { supabase, userId, organizationId } = await getActiveMembership();
  if (!userId) return json({ error: "unauthorized" }, 401);
  if (!organizationId) return json({ error: "organization_required" }, 403);

  const url = new URL(request.url);
  const branchId = url.searchParams.get("branchId");
  if (branchId && !UUID_PATTERN.test(branchId)) return json({ error: "invalid_input" }, 400);

  let query = supabase
    .from("devices")
    .select("id,public_code,branch_id,client_id,device_type_id,status,manufacturer,model,hostname,created_at,updated_at")
    .eq("organization_id", organizationId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (branchId) query = query.eq("branch_id", branchId);

  const { data, error } = await query;
  if (error) return json({ error: "device_query_failed" }, 500);
  return json({ devices: data ?? [] });
}

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get("origin");
  if (origin && origin !== requestUrl.origin) return json({ error: "forbidden" }, 403);
  if (Number(request.headers.get("content-length") ?? 0) > 65_536) return json({ error: "payload_too_large" }, 413);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json({ error: "unsupported_media_type" }, 415);
  }

  const { supabase, userId, organizationId } = await getActiveMembership();
  if (!userId) return json({ error: "unauthorized" }, 401);
  if (!organizationId) return json({ error: "organization_required" }, 403);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const parsed = deviceCreateSchema.safeParse(body);
  if (!parsed.success) return json({ error: "invalid_input" }, 400);

  const [{ data: branch }, { data: client }, { data: deviceType }] = await Promise.all([
    supabase
      .from("branches")
      .select("id")
      .eq("id", parsed.data.branchId)
      .eq("organization_id", organizationId)
      .eq("status", "active")
      .is("deleted_at", null)
      .maybeSingle(),
    supabase
      .from("clients")
      .select("id,branch_id")
      .eq("id", parsed.data.clientId)
      .eq("organization_id", organizationId)
      .eq("status", "active")
      .is("deleted_at", null)
      .maybeSingle(),
    supabase
      .from("device_types")
      .select("id")
      .eq("id", parsed.data.deviceTypeId)
      .eq("is_active", true)
      .maybeSingle(),
  ]);

  if (!branch || !client || client.branch_id !== branch.id || !deviceType) {
    return json({ error: "invalid_relationship" }, 400);
  }

  const { data: device, error } = await supabase
    .from("devices")
    .insert(payloadForInsert(parsed.data, organizationId, userId))
    .select("id,public_code,branch_id,client_id,device_type_id,status,created_at")
    .single();

  if (error || !device) return json({ error: "device_creation_failed" }, 500);
  return json({ device }, 201);
}
