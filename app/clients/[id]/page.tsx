import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { requireAuthenticatedUser } from "@/lib/auth/require-authenticated-user";

export const dynamic = "force-dynamic";

export default async function ClientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { supabase, claims } = await requireAuthenticatedUser();
  const userId = typeof claims.sub === "string" ? claims.sub : null;
  if (!userId) redirect("/login");

  const { id } = await params;
  const parsedId = z.string().uuid().safeParse(id);
  if (!parsedId.success) notFound();

  const { data: memberships, error: membershipError } = await supabase
    .from("organization_members")
    .select("organization_id,status")
    .eq("user_id", userId)
    .limit(2);

  if (membershipError) notFound();
  if (!memberships?.length) redirect("/onboarding");
  if (memberships.length !== 1 || memberships[0].status !== "active") notFound();

  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("id,display_name,client_type,legal_name,trade_name,branch_id,status,email,phone,whatsapp,created_at")
    .eq("id", parsedId.data)
    .eq("organization_id", memberships[0].organization_id)
    .is("deleted_at", null)
    .maybeSingle();

  if (clientError || !client) notFound();
  if (client.client_type !== "individual" && client.client_type !== "business") notFound();

  let branchLabel = "Organização";
  if (client.branch_id) {
    const { data: branch } = await supabase
      .from("branches")
      .select("name,code")
      .eq("id", client.branch_id)
      .eq("organization_id", memberships[0].organization_id)
      .maybeSingle();
    branchLabel = branch ? `${branch.name} (${branch.code})` : "Unidade não disponível";
  }

  return (
    <main className="shell">
      <div className="container">
        <div className="page-toolbar">
          <div>
            <p className="eyebrow">Fundação · clientes</p>
            <h1>{client.display_name}</h1>
            <p className="muted">Detalhes visíveis conforme sua membership e as políticas de acesso.</p>
          </div>
          <div className="actions">
            <Link className="button secondary" href="/clients">Voltar aos clientes</Link>
            <Link className="button" href={`/clients/${encodeURIComponent(client.id)}/edit`}>Editar</Link>
          </div>
        </div>

        <section className="card section-card" aria-labelledby="client-details-title">
          <h2 id="client-details-title">Dados do cliente</h2>
          <dl className="details-grid">
            <div><dt>Tipo</dt><dd>{client.client_type === "business" ? "Pessoa jurídica" : "Pessoa física"}</dd></div>
            <div><dt>Unidade</dt><dd>{branchLabel}</dd></div>
            <div><dt>Status</dt><dd>{client.status === "active" ? "Ativo" : "Arquivado"}</dd></div>
            {client.legal_name ? <div><dt>Razão social</dt><dd>{client.legal_name}</dd></div> : null}
            {client.trade_name ? <div><dt>Nome fantasia</dt><dd>{client.trade_name}</dd></div> : null}
            {client.email ? <div><dt>E-mail</dt><dd><a href={`mailto:${client.email}`}>{client.email}</a></dd></div> : null}
            {client.phone ? <div><dt>Telefone</dt><dd><a href={`tel:${client.phone}`}>{client.phone}</a></dd></div> : null}
            {client.whatsapp ? <div><dt>WhatsApp</dt><dd>{client.whatsapp}</dd></div> : null}
            <div><dt>Cadastrado em</dt><dd>{new Date(client.created_at).toLocaleDateString("pt-BR")}</dd></div>
          </dl>
        </section>
      </div>
    </main>
  );
}
