# Atendimento

Base inicial da plataforma de atendimento, construída para evoluir por módulos com isolamento por organização, RLS no Supabase e auditoria.

## Execução local

1. Copie `.env.example` para `.env.local`.
2. Preencha somente `NEXT_PUBLIC_SUPABASE_URL` e a chave pública/publishable do projeto `syknlbsdwkbwgfvjjebv`.
3. Instale as dependências com `npm install`.
4. Execute `npm run dev`.

Não use `service_role`, chaves secretas ou tokens administrativos em `.env.local`, no navegador ou no repositório.

## Controles aplicados nesta base

- Sessões Supabase em cookies via `@supabase/ssr`.
- Renovação de sessão no `proxy.ts`.
- Verificação server-side com `auth.getClaims()` antes de renderizar o dashboard.
- Mensagens de login genéricas para reduzir enumeração de contas.
- Logout somente por POST com verificação de origem quando disponível.
- Cabeçalhos básicos de proteção no Next.js.
- Nenhum seed, usuário, organização ou dado mockado.
- Onboarding disponível atrás de RPC transacional; a validação E2E autenticada ainda é necessária antes de liberar o fluxo para usuários reais.
- Clientes Supabase tipados pelo schema remoto em `lib/supabase/database.types.ts`.

Antes de habilitar qualquer módulo de negócio, execute `npm run lint`, `npm run typecheck`, `npm run build` e os checks de segurança definidos em `docs/security/`.

Com o servidor local em execução, rode `npm run security:smoke` para validar as fronteiras públicas e protegidas sem criar dados.
