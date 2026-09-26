import Link from "next/link";

export default function HomePage() {
  return (
    <main className="shell">
      <section className="container card hero">
        <p className="eyebrow">Atendimento seguro</p>
        <h1>Organize o atendimento com controle e rastreabilidade.</h1>
        <p className="muted">
          A base do sistema está preparada para autenticação, isolamento por organização
          e evolução incremental com controles de segurança desde o primeiro módulo.
        </p>
        <div className="actions">
          <Link className="button" href="/login">Entrar</Link>
        </div>
      </section>
    </main>
  );
}
