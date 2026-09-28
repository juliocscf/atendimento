import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { ClientForm } from "@/app/clients/client-form";
import { requireAuthenticatedUser } from "@/lib/auth/require-authenticated-user";

export const dynamic = "force-dynamic";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { supabase, claims } = await requireAuthenticatedUser();
  const userId = typeof claims.sub === "string" ? claims.sub : null;
  if (!userId) {
    redirect("/login");
  }

  const { id } = await params;
  const parsedId = z.string().uuid().safeParse(id);
  if (!parsedId.success) {
    notFound();
  }

  const { data: memberships, error: membershipError } = await supabase
    .from("organization_members")
    .select("organization_id,status")
    .eq("user_id", userId)
    .limit(2);

  if (membershipError) {
    notFound();
  }
  if (!memberships?.length) {
    redirect("/onboarding");
  }
  if (memberships.length !== 1 || memberships[0].status !== "active") {
    notFound();
  }

  const organizationId = memberships[0].organization_id;
  const [branchesResult, clientResult] = await Promise.all([
    supabase
      .from("branches")
      .select("id,name,code")
      .eq("organization_id", organizationId)
      .eq("status", "active")
      .is("deleted_at", null)
      .order("created_at", { ascending: true }),
    supabase
      .from("clients")
      .select("id,client_type,display_name,legal_name,trade_name,branch_id,email,phone,whatsapp,notes")
      .eq("id", parsedId.data)
      .eq("organization_id", organizationId)
      .is("deleted_at", null)
      .maybeSingle(),
  ]);

  const client = clientResult.data;
  if (
    branchesResult.error ||
    clientResult.error ||
    !client ||
    (client.client_type !== "individual" && client.client_type !== "business") ||
    (client.branch_id !== null && !branchesResult.data?.some((branch) => branch.id === client.branch_id))
  ) {
    notFound();
  }

  return (
    <main className="shell">
      <div className="container">
        <div className="page-toolbar">
          <div>
            <p className="eyebrow">Fundação · clientes</p>
            <h1>Editar cliente</h1>
            <p className="muted">Atualize os dados básicos do cliente. Alterações ficam registradas na auditoria.</p>
          </div>
          <Link className="button secondary" href="/clients">Voltar aos clientes</Link>
        </div>

        <section className="card section-card" aria-labelledby="edit-client-title">
          <h2 id="edit-client-title">{client.display_name}</h2>
          <ClientForm
            branches={branchesResult.data ?? []}
            initialClient={{
              id: client.id,
              clientType: client.client_type,
              displayName: client.display_name,
              legalName: client.legal_name,
              tradeName: client.trade_name,
              branchId: client.branch_id,
              email: client.email,
              phone: client.phone,
              whatsapp: client.whatsapp,
              notes: client.notes,
            }}
          />
        </section>
      </div>
    </main>
  );
}
