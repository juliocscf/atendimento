import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { DeviceForm } from "@/app/devices/device-form";
import { requireAuthenticatedUser } from "@/lib/auth/require-authenticated-user";

export const dynamic = "force-dynamic";

export default async function DevicesPage() {
  const { supabase, claims } = await requireAuthenticatedUser();
  const userId = typeof claims.sub === "string" ? claims.sub : null;
  if (!userId) redirect("/login");

  const { data: memberships, error: membershipError } = await supabase
    .from("organization_members")
    .select("organization_id,status")
    .eq("user_id", userId)
    .limit(2);

  if (membershipError) notFound();
  if (!memberships?.length) redirect("/onboarding");
  if (memberships.length !== 1 || memberships[0].status !== "active") notFound();

  const organizationId = memberships[0].organization_id;
  const [branchesResult, clientsResult, typesResult, devicesResult] = await Promise.all([
    supabase.from("branches").select("id,name,code").eq("organization_id", organizationId).eq("status", "active").is("deleted_at", null).order("created_at"),
    supabase.from("clients").select("id,display_name,branch_id").eq("organization_id", organizationId).eq("status", "active").is("deleted_at", null).order("display_name"),
    supabase.from("device_types").select("id,name,code").eq("is_active", true).order("name"),
    supabase.from("devices").select("id,public_code,branch_id,client_id,device_type_id,status,manufacturer,model,created_at").eq("organization_id", organizationId).is("deleted_at", null).order("created_at", { ascending: false }),
  ]);

  const branches = branchesResult.data ?? [];
  const clients = (clientsResult.data ?? []).map((client) => ({
    id: client.id,
    name: client.display_name,
    branchId: client.branch_id ?? "",
  }));
  const deviceTypes = typesResult.data ?? [];
  const branchNames = new Map(branches.map((branch) => [branch.id, `${branch.name} (${branch.code})`]));
  const clientNames = new Map(clients.map((client) => [client.id, client.name]));
  const typeNames = new Map(deviceTypes.map((type) => [type.id, type.name]));
  const queryError = branchesResult.error || clientsResult.error || typesResult.error || devicesResult.error;

  return (
    <main className="shell">
      <div className="container">
        <div className="page-toolbar">
          <div>
            <p className="eyebrow">Fundação · dispositivos</p>
            <h1>Dispositivos</h1>
            <p className="muted">Inventário protegido por organização, unidade e cliente.</p>
          </div>
          <Link className="button secondary" href="/dashboard">Voltar ao painel</Link>
        </div>

        <section className="card section-card" aria-labelledby="new-device-title">
          <h2 id="new-device-title">Novo dispositivo</h2>
          {queryError ? <p className="form-error" role="alert">Não foi possível carregar os dados autorizados.</p> : null}
          <DeviceForm branches={branches} clients={clients} deviceTypes={deviceTypes} />
        </section>

        <section className="card section-card" aria-labelledby="device-list-title">
          <h2 id="device-list-title">Dispositivos cadastrados</h2>
          {devicesResult.error ? (
            <p className="form-error" role="alert">Não foi possível carregar os dispositivos.</p>
          ) : devicesResult.data?.length ? (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Código</th><th>Cliente</th><th>Unidade</th><th>Tipo</th><th>Status</th></tr></thead>
                <tbody>{devicesResult.data.map((device) => (
                  <tr key={device.id}>
                    <td>{device.public_code}</td>
                    <td>{clientNames.get(device.client_id) ?? "Cliente não disponível"}</td>
                    <td>{device.branch_id ? branchNames.get(device.branch_id) ?? "Unidade não disponível" : "Organização"}</td>
                    <td>{typeNames.get(device.device_type_id) ?? "Tipo não disponível"}</td>
                    <td>{device.status}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          ) : <p className="muted">Nenhum dispositivo cadastrado nesta organização.</p>}
        </section>
      </div>
    </main>
  );
}
