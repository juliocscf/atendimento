import { notFound, redirect } from "next/navigation";
import Link from "next/link";

import { requireAuthenticatedUser } from "@/lib/auth/require-authenticated-user";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { supabase, claims } = await requireAuthenticatedUser();
  const userId = typeof claims.sub === "string" ? claims.sub : null;
  if (!userId) {
    redirect("/login");
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

  const membership = memberships[0];

  const [{ data: organization, error: organizationError }, branchesResult, clientsResult] = await Promise.all([
    supabase
      .from("organizations")
      .select("name")
      .eq("id", membership.organization_id)
      .maybeSingle(),
    supabase
      .from("branches")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", membership.organization_id)
      .eq("status", "active")
      .is("deleted_at", null),
    supabase
      .from("clients")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", membership.organization_id)
      .is("deleted_at", null),
  ]);

  if (organizationError || !organization) {
    notFound();
  }

  const emailClaim = claims.email;
  const email = typeof emailClaim === "string" ? emailClaim : "usuário autenticado";

  return (
    <main className="dashboard shell">
      <div className="container">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Painel protegido</p>
            <h1>Olá, {email}</h1>
            <p className="muted">{organization.name}</p>
          </div>
          <form action="/auth/signout" method="post">
            <button className="button secondary" type="submit">Sair</button>
          </form>
        </header>
        <section className="dashboard-grid" aria-label="Resumo do sistema">
          <article className="card stat">
            <span className="muted">Unidades ativas</span>
            <strong>{branchesResult.error ? "—" : branchesResult.count ?? 0}</strong>
            <p className="muted">Unidades visíveis para sua membership e as políticas de acesso.</p>
          </article>
          <article className="card stat">
            <span className="muted">Clientes cadastrados</span>
            <strong>{clientsResult.error ? "—" : clientsResult.count ?? 0}</strong>
            <p className="muted">Clientes não excluídos que sua membership pode consultar.</p>
          </article>
          <article className="card stat">
            <span className="muted">Dispositivos</span>
            <strong>Próximo módulo</strong>
            <p className="muted">Cadastro será liberado após a validação do isolamento entre organização, unidade e cliente.</p>
          </article>
        </section>
        <div className="actions">
          <Link className="button" href="/clients">Gerenciar clientes</Link>
        </div>
        {branchesResult.error || clientsResult.error ? (
          <p className="form-note" role="status">Alguns totais não puderam ser carregados. Atualize a página para tentar novamente.</p>
        ) : null}
      </div>
    </main>
  );
}
