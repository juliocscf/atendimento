import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { ClientForm } from "@/app/clients/client-form";
import { requireAuthenticatedUser } from "@/lib/auth/require-authenticated-user";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
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

  const [branchesResult, clientsResult] = await Promise.all([
    supabase
      .from("branches")
      .select("id,name,code")
      .eq("organization_id", membership.organization_id)
      .eq("status", "active")
      .is("deleted_at", null)
      .order("created_at", { ascending: true }),
    supabase
      .from("clients")
      .select("id,display_name,client_type,branch_id,status,created_at")
      .eq("organization_id", membership.organization_id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
  ]);

  const branches = branchesResult.data;
  const clients = clientsResult.data;

  const branchNames = new Map((branches ?? []).map((branch) => [branch.id, `${branch.name} (${branch.code})`]));

  return (
    <main className="shell">
      <div className="container">
        <div className="page-toolbar">
          <div>
            <p className="eyebrow">Fundação · clientes</p>
            <h1>Clientes</h1>
            <p className="muted">Cadastre clientes vinculados a uma unidade da organização ativa.</p>
          </div>
          <Link className="button secondary" href="/dashboard">Voltar ao painel</Link>
        </div>

        <section className="card section-card" aria-labelledby="new-client-title">
          <h2 id="new-client-title">Novo cliente</h2>
          {branchesResult.error ? (
            <p className="form-error" role="alert">Não foi possível carregar as unidades. Tente novamente mais tarde.</p>
          ) : null}
          <ClientForm branches={branches ?? []} />
        </section>

        <section className="card section-card" aria-labelledby="client-list-title">
          <h2 id="client-list-title">Clientes cadastrados</h2>
          {clientsResult.error ? (
            <p className="form-error" role="alert">Não foi possível carregar os clientes. Atualize a página para tentar novamente.</p>
          ) : clients?.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Nome</th><th>Tipo</th><th>Unidade</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id}>
                      <td>{client.display_name}</td>
                      <td>{client.client_type === "business" ? "Pessoa jurídica" : "Pessoa física"}</td>
                      <td>{client.branch_id ? branchNames.get(client.branch_id) ?? "Unidade não disponível" : "Organização"}</td>
                      <td>{client.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="muted">Nenhum cliente cadastrado nesta organização.</p>
          )}
        </section>
      </div>
    </main>
  );
}
