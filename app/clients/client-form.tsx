"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { clientCreateSchema } from "@/lib/validation/client";

type BranchOption = { id: string; name: string; code: string };

export function ClientForm({ branches }: { branches: BranchOption[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

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
    const response = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    if (!response.ok) {
      setPending(false);
      setError("Não foi possível cadastrar o cliente.");
      return;
    }

    form.reset();
    setPending(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="clientType">Tipo</label>
          <select id="clientType" name="clientType" defaultValue="individual" required>
            <option value="individual">Pessoa física</option>
            <option value="business">Pessoa jurídica</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="branchId">Unidade</label>
          <select id="branchId" name="branchId" defaultValue={branches[0]?.id ?? ""} required>
            <option value="" disabled>Selecione uma unidade</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>{branch.name} ({branch.code})</option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="displayName">Nome de exibição</label>
        <input id="displayName" name="displayName" autoComplete="organization" required />
      </div>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="legalName">Razão social (opcional)</label>
          <input id="legalName" name="legalName" />
        </div>
        <div className="field">
          <label htmlFor="tradeName">Nome fantasia (opcional)</label>
          <input id="tradeName" name="tradeName" />
        </div>
      </div>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="email">E-mail (opcional)</label>
          <input id="email" name="email" type="email" autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="phone">Telefone (opcional)</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="whatsapp">WhatsApp (opcional)</label>
        <input id="whatsapp" name="whatsapp" type="tel" />
      </div>
      <div className="field">
        <label htmlFor="notes">Observações</label>
        <textarea id="notes" name="notes" maxLength={4000} rows={4} />
      </div>
      <p className="form-note">CPF/CNPJ não é coletado nesta etapa: o armazenamento seguro cifrado será habilitado em módulo próprio.</p>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <div className="actions">
        <button className="button" type="submit" disabled={pending || branches.length === 0}>
          {pending ? "Salvando…" : "Cadastrar cliente"}
        </button>
      </div>
    </form>
  );
}
