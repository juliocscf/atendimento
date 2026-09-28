"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { deviceCreateSchema } from "@/lib/validation/device";

type Option = { id: string; name: string; code?: string };
type ClientOption = Option & { branchId: string };

export function DeviceForm({
  branches,
  clients,
  deviceTypes,
}: {
  branches: Option[];
  clients: ClientOption[];
  deviceTypes: Option[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const parsed = deviceCreateSchema.safeParse({
      branchId: formData.get("branchId"),
      clientId: formData.get("clientId"),
      deviceTypeId: formData.get("deviceTypeId"),
      manufacturer: formData.get("manufacturer") || undefined,
      model: formData.get("model") || undefined,
      serialNumber: formData.get("serialNumber") || undefined,
      hostname: formData.get("hostname") || undefined,
      notes: formData.get("notes") || undefined,
    });

    if (!parsed.success) {
      setError("Revise a unidade, o cliente, o tipo e os campos informados.");
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!response.ok) {
        setError(response.status === 400
          ? "A unidade, o cliente e o tipo precisam pertencer ao mesmo contexto autorizado."
          : "Não foi possível cadastrar o dispositivo.");
        return;
      }
      event.currentTarget.reset();
      router.refresh();
    } catch {
      setError("Não foi possível salvar. Verifique sua conexão e tente novamente.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="branchId">Unidade</label>
          <select id="branchId" name="branchId" defaultValue={branches[0]?.id ?? ""} required>
            <option value="" disabled>Selecione uma unidade</option>
            {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name} ({branch.code})</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="clientId">Cliente</label>
          <select id="clientId" name="clientId" defaultValue={clients[0]?.id ?? ""} required>
            <option value="" disabled>Selecione um cliente</option>
            {clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
          </select>
        </div>
      </div>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="deviceTypeId">Tipo de dispositivo</label>
          <select id="deviceTypeId" name="deviceTypeId" defaultValue={deviceTypes[0]?.id ?? ""} required>
            <option value="" disabled>Selecione um tipo</option>
            {deviceTypes.map((type) => <option key={type.id} value={type.id}>{type.name}{type.code ? ` (${type.code})` : ""}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="manufacturer">Fabricante (opcional)</label>
          <input id="manufacturer" name="manufacturer" maxLength={120} />
        </div>
      </div>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="model">Modelo (opcional)</label>
          <input id="model" name="model" maxLength={120} />
        </div>
        <div className="field">
          <label htmlFor="serialNumber">Número de série (opcional)</label>
          <input id="serialNumber" name="serialNumber" maxLength={160} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="hostname">Hostname (opcional)</label>
        <input id="hostname" name="hostname" maxLength={120} />
      </div>
      <div className="field">
        <label htmlFor="notes">Observações</label>
        <textarea id="notes" name="notes" maxLength={4000} rows={4} />
      </div>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <div className="actions">
        <button className="button" type="submit" disabled={pending || !branches.length || !clients.length || !deviceTypes.length}>
          {pending ? "Salvando…" : "Cadastrar dispositivo"}
        </button>
      </div>
    </form>
  );
}
