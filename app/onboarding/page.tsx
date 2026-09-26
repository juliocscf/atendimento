import { redirect } from "next/navigation";

import { OnboardingForm } from "@/app/onboarding/onboarding-form";
import { requireAuthenticatedUser } from "@/lib/auth/require-authenticated-user";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const { supabase } = await requireAuthenticatedUser();

  const { data: membership } = await supabase
    .from("organization_members")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (membership) {
    redirect("/dashboard");
  }

  return (
    <main className="auth-wrap">
      <section className="card auth-card" aria-labelledby="onboarding-title">
        <p className="eyebrow">Primeiro acesso</p>
        <h1 id="onboarding-title">Configure seu espaço</h1>
        <p className="muted">Crie a organização e a primeira unidade. Esta operação só pode ser concluída uma vez por usuário.</p>
        <OnboardingForm />
      </section>
    </main>
  );
}
