# Segurança — Fase 1: Fundação

## Escopo

Esta etapa cobre a fundação de dados da Fase 1:

- organizações e unidades;
- perfis, papéis e permissões;
- membros e acesso por unidade;
- clientes, contatos e endereços;
- tipos e equipamentos;
- timeline inicial;
- auditoria;
- isolamento por organização e unidade.

Não foram criados dados de demonstração.

## Classificação dos dados

- Dados pessoais: clientes, contatos, endereços, telefones e e-mails.
- Dados potencialmente sensíveis: CPF/CNPJ e observações.
- Dados operacionais: equipamentos, patrimônio, serial, hostname, IP e histórico.
- Dados de segurança: perfis, memberships, papéis, permissões e auditoria.

CPF/CNPJ não deve ser armazenado em texto puro. A coluna clients.document_ciphertext é reservada para valor cifrado no backend; clients.document_hash deve ser usado para buscas exatas.

## Controles implementados

- UUID como identificador interno.
- Código público do equipamento com quatro caracteres e alfabeto sem O, 0, I, 1 e L.
- Código público gerado no banco, único, imutável e sem função de autenticação.
- RLS habilitado em todas as 15 tabelas públicas.
- Nenhum grant para anon.
- Acesso de dados condicionado à associação ativa com a organização e, quando aplicável, à unidade.
- Políticas com USING e WITH CHECK nas operações de atualização.
- Auditoria sem acesso direto por usuários autenticados.
- Soft delete nas entidades de negócio relevantes.
- Funções auxiliares em schema privado.
- Função SECURITY DEFINER restrita ao trigger de geração de código, com search_path fixo e validação de contexto.
- Índices para chaves estrangeiras e consultas principais.
- Valores de autorização não dependem de user_metadata.

## Migrations aplicadas

- foundation_0001
- foundation_0002_security_indexes

## Evidências da validação

Data: 26/09/2026

- 15 tabelas públicas detectadas.
- 15 de 15 tabelas com RLS.
- 25 políticas RLS.
- 0 grants de tabela para anon.
- 0 grants para authenticated em audit_logs.
- Advisor de segurança da fundação: sem findings; após o onboarding, permanece somente o warning intencional da RPC `SECURITY DEFINER` autenticada.
- Advisor de performance: somente avisos informativos de índices ainda não utilizados em banco vazio.
- Geração de tipos TypeScript: concluída sem erro.
- Teste transacional do código público: MYSN gerado, formato válido e valor informado pelo chamador ignorado.
- Verificação pós-rollback: 0 organizações, clientes e equipamentos de teste persistidos.

## Checkpoint da aplicação

- Next.js 16.3.6 com App Router e TypeScript 5.9.3 fixados no package.json e lockfile.
- Supabase SSR configurado com cookies em `lib/supabase/client.ts` e `lib/supabase/server.ts`.
- Renovação de sessão centralizada em `proxy.ts` usando `auth.getClaims()`.
- Dashboard com verificação server-side e redirecionamento fail-closed para `/login`.
- Callback PKCE com destino relativo validado contra open redirect.
- Logout somente por POST, com verificação de `Origin` quando presente.
- Entrada de login validada por schema; mensagens de falha não enumeram contas.
- Cabeçalhos básicos: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` e `Permissions-Policy`.
- Varredura local não encontrou valores de credenciais; as ocorrências de `service_role` são somente documentação e a função SQL interna esperada.
- `npm install`: 0 vulnerabilidades reportadas.
- `npm run lint`: passou sem erros ou avisos.
- `npm run typecheck`: passou.
- `npm run build`: passou.

## Onboarding aplicado e verificado

- Endpoint server-side `/api/onboarding` com verificação de claims, limite de payload, Content-Type JSON, verificação de origem e respostas sem detalhes internos.
- Formulário com validação client-side e validação repetida no backend.
- Migrations `onboarding_0001` e `onboarding_0002_acl_hardening` aplicadas no banco.
- A migration cria a RPC transacional `public.create_initial_workspace`.
- A RPC exige usuário autenticado, usa lock transacional por usuário, bloqueia segundo onboarding, cria organização/unidade/perfil/papel/membership e grava evento de auditoria na mesma transação.
- Não são concedidos `INSERT` direto nas tabelas protegidas; apenas `EXECUTE` da função RPC para `authenticated`.
- O MCP `supabase-atendimento` confirmou as quatro migrations no histórico: `foundation_0001`, `foundation_0002_security_indexes`, `onboarding_0001` e `onboarding_0002_acl_hardening`.

## Exceção controlada do advisor

- `public.create_initial_workspace` é `SECURITY DEFINER` por necessidade: precisa criar, em uma única transação, registros em tabelas que não concedem `INSERT` direto a usuários.
- A execução está explicitamente negada a `anon` e concedida somente a `authenticated`.
- A função valida `auth.uid()`, normaliza e valida os parâmetros, usa lock transacional por usuário, bloqueia segundo onboarding e grava auditoria.
- O warning `authenticated_security_definer_function_executable` foi revisado como exceção de arquitetura, não como finding não tratado.
- ACL verificado: `authenticated_execute=true` e `anon_execute=false`.
- Verificação pós-migration: 0 organizações, unidades, perfis, memberships e audit logs; 15 tabelas públicas com RLS e 25 políticas.

## Validação local do fluxo

- `.env.local` configurado somente com a URL do projeto e a chave `sb_publishable_...`; o arquivo está ignorado pelo repositório.
- Smoke test HTTP: `/` e `/login` retornaram 200.
- Smoke test HTTP: `/dashboard` e `/onboarding` redirecionaram para `/login` com 307 sem sessão.
- Smoke test HTTP: `POST /api/onboarding` sem sessão retornou 401.
- Não foi criado usuário de teste nem houve escrita de dados durante a validação local.
- Tipos TypeScript regenerados pelo MCP após as migrations de onboarding e integrados aos clientes browser, server e proxy.
- Lint, typecheck e build passaram após a integração dos tipos gerados.
- Guard server-side centralizado em `requireAuthenticatedUser`; o dashboard exige membership e consulta organização/unidade somente por relações protegidas pela RLS.
- Em caso de ausência de membership, organização ou unidade consistente, o fluxo falha fechado e não renderiza dados operacionais.
- Smoke test automatizado criado em `scripts/security-smoke.mjs` para repetir a validação sem usuário real ou escrita no banco.
- `npm run security:smoke`: passou contra o servidor local.

Estado do onboarding: TESTED estruturalmente; ainda requer teste E2E com usuário autenticado de teste.

Estado deste checkpoint: TESTED. A validação final depende de configurar o ambiente local com a chave publishable, autenticar um usuário de teste e executar os testes E2E de autorização sem dados reais.

## Riscos residuais

- Ainda não existem testes E2E com usuários autenticados reais.
- O fluxo de criação inicial de organização, unidade e membership ainda será implementado no backend.
- O preenchimento de clients.document_ciphertext depende do serviço de criptografia da aplicação.
- A escrita efetiva em audit_logs ainda precisa ser integrada ao backend.
- A auditoria completa stateful do repositório ainda deve ser executada quando o código da aplicação estiver disponível.

## Gate

Estado da fundação de banco: TESTED.

Não marcar como VALIDATED até concluir os testes de autorização, os fluxos de autenticação e a auditoria completa conforme o protocolo de segurança do projeto.md.
