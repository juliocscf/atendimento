import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { ClientForm } from "@/app/clients/client-form";
import { requireAuthenticatedUser } from "@/lib/auth/require-authenticated-user";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;
const MAX_PAGE = 10_000;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type SearchParams = Record<string, string | string[] | undefined>;
type ClientFilters = {
  q: string;
  clientType: "" | "individual" | "business";
  branchId: string;
  status: "" | "active" | "archived";
  page: number;
};

function singleValue(value: string | string[] | undefined): string | null {
  return typeof value === "string" ? value : null;
}

function parseFilters(params: SearchParams): ClientFilters | null {
  const rawQuery = singleValue(params.q);
  const rawType = singleValue(params.clientType);
  const rawBranch = singleValue(params.branchId);
  const rawStatus = singleValue(params.status);
  const rawPage = singleValue(params.page) ?? "1";

  if (rawQuery === null && params.q !== undefined) return null;
  if (rawType === null && params.clientType !== undefined) return null;
  if (rawBranch === null && params.branchId !== undefined) return null;
  if (rawStatus === null && params.status !== undefined) return null;
  if (!/^\d{1,5}$/.test(rawPage)) return null;

  const page = Number(rawPage);
  if (!Number.isSafeInteger(page) || page < 1 || page > MAX_PAGE) return null;

  const clientType = rawType ?? "";
  const status = rawStatus ?? "";
  const branchId = rawBranch ?? "";
  if (clientType !== "" && clientType !== "individual" && clientType !== "business") return null;
  if (status !== "" && status !== "active" && status !== "archived") return null;
  if (branchId !== "" && !UUID_PATTERN.test(branchId)) return null;

  // ILIKE treats %, _ and backslash as pattern syntax. Removing them keeps
  // user input literal and prevents broad wildcard searches.
  const q = (rawQuery ?? "").trim().replace(/[\\%_*]/g, "").slice(0, 100);
  return { q, clientType, branchId, status, page };
}

function clientsHref(page: number, filters: ClientFilters): string {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.clientType) params.set("clientType", filters.clientType);
  if (filters.branchId) params.set("branchId", filters.branchId);
  if (filters.status) params.set("status", filters.status);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/clients?${query}` : "/clients";
}

export default async function ClientsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const filters = parseFilters(params);
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

  const branchesResult = await supabase
    .from("branches")
    .select("id,name,code")
    .eq("organization_id", membership.organization_id)
    .eq("status", "active")
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  const branches = branchesResult.data ?? [];
  const selectedBranchIsVisible = !filters?.branchId || branches.some((branch) => branch.id === filters.branchId);
  const shouldQueryClients = filters !== null && selectedBranchIsVisible && !branchesResult.error;
  let clientsResult = null;

  if (shouldQueryClients && filters) {
    let clientsQuery = supabase
      .from("clients")
      .select("id,display_name,client_type,branch_id,status,created_at")
      .eq("organization_id", membership.organization_id)
      .is("deleted_at", null);

    if (filters.q) clientsQuery = clientsQuery.ilike("display_name", `%${filters.q}%`);
    if (filters.clientType) clientsQuery = clientsQuery.eq("client_type", filters.clientType);
    if (filters.branchId) clientsQuery = clientsQuery.eq("branch_id", filters.branchId);
    if (filters.status) clientsQuery = clientsQuery.eq("status", filters.status);

    const offset = (filters.page - 1) * PAGE_SIZE;
    clientsResult = await clientsQuery
      .order("created_at", { ascending: false })
      .order("id", { ascending: true })
      .range(offset, offset + PAGE_SIZE);
  }

  const rows = clientsResult?.data ?? [];
  const clients = rows.slice(0, PAGE_SIZE);
  const hasNextPage = rows.length > PAGE_SIZE;

  const branchNames = new Map(branches.map((branch) => [branch.id, `${branch.name} (${branch.code})`]));

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
          <ClientForm branches={branches} />
        </section>

        <section className="card section-card" aria-labelledby="client-list-title">
          <h2 id="client-list-title">Clientes cadastrados</h2>
          <form action="/clients" method="get" className="form-grid" aria-label="Filtros de clientes">
            <div className="field">
              <label htmlFor="client-search">Buscar por nome</label>
              <input id="client-search" name="q" type="search" maxLength={100} defaultValue={filters?.q ?? ""} />
            </div>
            <div className="field">
              <label htmlFor="client-type">Tipo</label>
              <select id="client-type" name="clientType" defaultValue={filters?.clientType ?? ""}>
                <option value="">Todos</option>
                <option value="individual">Pessoa física</option>
                <option value="business">Pessoa jurídica</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="client-branch">Unidade</label>
              <select id="client-branch" name="branchId" defaultValue={filters?.branchId ?? ""}>
                <option value="">Todas</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>{branch.name} ({branch.code})</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="client-status">Status</label>
              <select id="client-status" name="status" defaultValue={filters?.status ?? ""}>
                <option value="">Todos</option>
                <option value="active">Ativo</option>
                <option value="archived">Arquivado</option>
              </select>
            </div>
            <div className="actions">
              <button className="button" type="submit">Filtrar</button>
              <Link className="button secondary" href="/clients">Limpar</Link>
            </div>
          </form>

          {!filters ? (
            <p className="form-error" role="alert">Filtros inválidos. Remova os parâmetros da busca e tente novamente.</p>
          ) : branchesResult.error ? (
            <p className="form-error" role="alert">Não foi possível validar as unidades disponíveis. Atualize a página para tentar novamente.</p>
          ) : !selectedBranchIsVisible ? (
            <p className="muted">Nenhum cliente encontrado com os filtros informados.</p>
          ) : clientsResult?.error ? (
            <p className="form-error" role="alert">Não foi possível carregar os clientes. Atualize a página para tentar novamente.</p>
          ) : clients.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Nome</th><th>Tipo</th><th>Unidade</th><th>Status</th><th>Ações</th></tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id}>
                      <td>{client.display_name}</td>
                      <td>{client.client_type === "business" ? "Pessoa jurídica" : "Pessoa física"}</td>
                      <td>{client.branch_id ? branchNames.get(client.branch_id) ?? "Unidade não disponível" : "Organização"}</td>
                      <td>{client.status}</td>
                      <td>
                        <div className="table-actions">
                          <Link className="button secondary" href={`/clients/${encodeURIComponent(client.id)}`}>Ver</Link>
                          <Link className="button secondary" href={`/clients/${encodeURIComponent(client.id)}/edit`}>Editar</Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <nav className="pagination" aria-label="Paginação de clientes">
                {filters.page > 1 ? (
                  <Link className="button secondary" href={clientsHref(filters.page - 1, filters)}>Anterior</Link>
                ) : <span />}
                <span className="muted">Página {filters.page}</span>
                {hasNextPage && filters.page < MAX_PAGE ? (
                  <Link className="button secondary" href={clientsHref(filters.page + 1, filters)}>Próxima</Link>
                ) : <span />}
              </nav>
            </div>
          ) : (
            <>
              <p className="muted">{filters.q || filters.clientType || filters.branchId || filters.status
                ? "Nenhum cliente encontrado com os filtros informados."
                : "Nenhum cliente cadastrado nesta organização."}</p>
              {filters.page > 1 ? (
                <nav className="pagination" aria-label="Paginação de clientes">
                  <Link className="button secondary" href={clientsHref(filters.page - 1, filters)}>Anterior</Link>
                  <span className="muted">Página {filters.page}</span>
                  <span />
                </nav>
              ) : null}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
