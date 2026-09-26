import Link from "next/link";
import { redirect } from "next/navigation";

import { ClientForm } from "@/app/clients/client-form";
import { requireAuthenticatedUser } from "@/lib/auth/require-authenticated-user";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const { supabase } = await requireAuthenticatedUser();
  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .limit(1)
    .maybeSingle();

  if (!membership) {
    redirect("/onboarding");
  }

  const [{ data: branches }, { data: clients }] = await Promise.all([
    supabase
      .from("branches")
      .select("id,name,code")
      .eq("organization_id", membership.organization_id)
      .order("created_at", { ascending: true }),
    supabase
      .from("clients")
      .select("id,display_name,client_type,branch_id,status,created_at")
      .eq("organization_id", membership.organization_id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
  ]);

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
          <ClientForm branches={branches ?? []} />
        </section>

        <section className="card section-card" aria-labelledby="client-list-title">
          <h2 id="client-list-title">Clientes cadastrados</h2>
          {clients?.length ? (
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
