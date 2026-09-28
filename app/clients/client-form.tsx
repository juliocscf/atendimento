"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { clientCreateSchema } from "@/lib/validation/client";

type BranchOption = { id: string; name: string; code: string };
type ClientInitialValues = {
  id: string;
  clientType: "individual" | "business";
  displayName: string;
  legalName: string | null;
  tradeName: string | null;
  branchId: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  notes: string | null;
};

export function ClientForm({
  branches,
  initialClient,
}: {
  branches: BranchOption[];
  initialClient?: ClientInitialValues;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const isEditing = Boolean(initialClient);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const parsed = clientCreateSchema.safeParse({
      clientType: formData.get("clientType"),
      displayName: formData.get("displayName"),
      legalName: formData.get("legalName") || undefined,
      tradeName: formData.get("tradeName") || undefined,
      branchId: formData.get("branchId"),
      email: formData.get("email") || undefined,
      phone: formData.get("phone") || undefined,
      whatsapp: formData.get("whatsapp") || undefined,
      notes: formData.get("notes") || undefined,
    });

    if (!parsed.success) {
      setError("Revise os campos obrigatórios e os formatos informados.");
      return;
    }

    setPending(true);
    try {
      const response = await fetch(
        initialClient ? `/api/clients/${encodeURIComponent(initialClient.id)}` : "/api/clients",
        {
          method: initialClient ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        },
      );

      if (!response.ok) {
        setError(isEditing ? "Não foi possível atualizar o cliente." : "Não foi possível cadastrar o cliente.");
        return;
      }

      if (isEditing) {
        router.push("/clients");
      } else {
        form.reset();
        router.refresh();
      }
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
          <label htmlFor="clientType">Tipo</label>
          <select id="clientType" name="clientType" defaultValue={initialClient?.clientType ?? "individual"} required>
            <option value="individual">Pessoa física</option>
            <option value="business">Pessoa jurídica</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="branchId">Unidade</label>
          <select
            id="branchId"
            name="branchId"
            defaultValue={initialClient ? initialClient.branchId ?? "" : branches[0]?.id ?? ""}
            required
          >
            <option value="" disabled>Selecione uma unidade</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>{branch.name} ({branch.code})</option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="displayName">Nome de exibição</label>
        <input id="displayName" name="displayName" autoComplete="organization" defaultValue={initialClient?.displayName ?? ""} required />
      </div>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="legalName">Razão social (opcional)</label>
          <input id="legalName" name="legalName" defaultValue={initialClient?.legalName ?? ""} />
        </div>
        <div className="field">
          <label htmlFor="tradeName">Nome fantasia (opcional)</label>
          <input id="tradeName" name="tradeName" defaultValue={initialClient?.tradeName ?? ""} />
        </div>
      </div>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="email">E-mail (opcional)</label>
          <input id="email" name="email" type="email" autoComplete="email" defaultValue={initialClient?.email ?? ""} />
        </div>
        <div className="field">
          <label htmlFor="phone">Telefone (opcional)</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" defaultValue={initialClient?.phone ?? ""} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="whatsapp">WhatsApp (opcional)</label>
        <input id="whatsapp" name="whatsapp" type="tel" defaultValue={initialClient?.whatsapp ?? ""} />
      </div>
      <div className="field">
        <label htmlFor="notes">Observações</label>
        <textarea id="notes" name="notes" maxLength={4000} rows={4} defaultValue={initialClient?.notes ?? ""} />
      </div>
      <p className="form-note">CPF/CNPJ não é coletado nesta etapa: o armazenamento seguro cifrado será habilitado em módulo próprio.</p>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <div className="actions">
        <button className="button" type="submit" disabled={pending || branches.length === 0}>
          {pending ? "Salvando…" : isEditing ? "Salvar alterações" : "Cadastrar cliente"}
        </button>
      </div>
    </form>
  );
}
