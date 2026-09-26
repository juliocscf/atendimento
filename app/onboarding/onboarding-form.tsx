"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { onboardingSchema } from "@/lib/validation/onboarding";

export function OnboardingForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const parsed = onboardingSchema.safeParse({
      organizationName: formData.get("organizationName"),
      slug: formData.get("slug"),
      branchName: formData.get("branchName"),
      branchCode: formData.get("branchCode"),
      fullName: formData.get("fullName"),
      phone: formData.get("phone") || undefined,
    });

    if (!parsed.success) {
      setError("Revise os campos: nomes devem ter pelo menos 2 caracteres e o slug/código devem estar no formato informado.");
      return;
    }

    setPending(true);
    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    if (!response.ok) {
      setPending(false);
      const result = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(result?.error === "workspace_conflict"
        ? "Este usuário já possui uma organização ou o identificador escolhido já está em uso."
        : "Não foi possível concluir o onboarding.");
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="fullName">Seu nome completo</label>
        <input id="fullName" name="fullName" autoComplete="name" required />
      </div>
      <div className="field">
        <label htmlFor="organizationName">Nome da organização</label>
        <input id="organizationName" name="organizationName" required />
      </div>
      <div className="field">
        <label htmlFor="slug">Identificador da organização</label>
        <input id="slug" name="slug" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" autoCapitalize="none" required />
      </div>
      <div className="field">
        <label htmlFor="branchName">Nome da primeira unidade</label>
        <input id="branchName" name="branchName" required />
      </div>
      <div className="field">
        <label htmlFor="branchCode">Código da unidade</label>
        <input id="branchCode" name="branchCode" pattern="[A-Z0-9_-]{2,32}" maxLength={32} required />
      </div>
      <div className="field">
        <label htmlFor="phone">Telefone (opcional)</label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={40} />
      </div>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <div className="actions">
        <button className="button" type="submit" disabled={pending}>
          {pending ? "Configurando…" : "Criar espaço"}
        </button>
      </div>
    </form>
  );
}
