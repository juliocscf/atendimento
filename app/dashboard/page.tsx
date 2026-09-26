import { redirect } from "next/navigation";
import Link from "next/link";

import { requireAuthenticatedUser } from "@/lib/auth/require-authenticated-user";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { supabase, claims } = await requireAuthenticatedUser();
  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .limit(1)
    .maybeSingle();

  if (!membership) {
    redirect("/onboarding");
  }

  const { data: organization } = await supabase
    .from("organizations")
    .select("name, slug")
    .eq("id", membership.organization_id)
    .maybeSingle();
  const { data: branch } = await supabase
    .from("branches")
    .select("name, code")
    .eq("organization_id", membership.organization_id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!organization || !branch) {
    redirect("/login");
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
            <p className="muted">{organization.name} · {branch.name} ({branch.code})</p>
          </div>
          <form action="/auth/signout" method="post">
            <button className="button secondary" type="submit">Sair</button>
          </form>
        </header>
        <section className="dashboard-grid" aria-label="Resumo do sistema">
          <article className="card stat">
            <span className="muted">Organização ativa</span>
            <strong>{organization.slug}</strong>
            <p className="muted">Contexto carregado com isolamento por membership e RLS.</p>
          </article>
          <article className="card stat">
            <span className="muted">Dispositivos</span>
            <strong>Próximo módulo</strong>
            <p className="muted">Nenhum dado de demonstração é criado automaticamente.</p>
          </article>
        </section>
        <div className="actions">
          <Link className="button" href="/clients">Gerenciar clientes</Link>
        </div>
      </div>
    </main>
  );
}
