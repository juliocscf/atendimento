import { LoginForm } from "@/app/login/login-form";

export default function LoginPage() {
  return (
    <main className="auth-wrap">
      <section className="card auth-card" aria-labelledby="login-title">
        <p className="eyebrow">Área restrita</p>
        <h1 id="login-title">Entrar</h1>
        <p className="muted">Use as credenciais fornecidas pelo administrador da sua organização.</p>
        <LoginForm />
      </section>
    </main>
  );
}
