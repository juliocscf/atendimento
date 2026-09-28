# PROJECT STATUS
Projeto: Atendimento
Versão: foundation + onboarding + clients slice; devices protected inventory slice
Cycle ID: audit-20260926-114137-87ca41f9
Ambiente: desenvolvimento local + Supabase remoto
Fuso: America/Sao_Paulo
Status geral: EM_ANDAMENTO
Última atualização: 2026-09-28
Último checkpoint: CP-20260928-DEVICES-PAYLOAD-010

## RESUME_FROM
Módulo: phase-1-devices
Etapa: NEXT_SCOPE
Recurso: devices
Teste: EV-20260928-DEVICES-PAYLOAD-010
Motivo: cadastro/listagem autenticados e allowlist negativa passaram; o próximo trabalho é um escopo separado de edição, detalhes e timeline
Próxima ação: especificar e implementar a próxima fatia de dispositivos somente com seus próprios gates de autorização, payload e auditoria

## Encerramento
Gate final:
Relatório final:
Checkpoint final:
Fechado em:

## Progresso por módulo
phase-1-clients: CONCLUÍDO — todos os gates aplicáveis passaram.
phase-1-devices: EM ANDAMENTO — integridade, RLS, primeira API/UI, E2E e allowlist validados; edição, detalhes e timeline são o próximo escopo.

## Pendências atuais

- `auth_leaked_password_protection`: controle nativo permanece desabilitado e indisponível no plano Free; foi classificado como `NAO_APLICAVEL` para `phase-1-clients` porque não há cadastro, reset ou alteração de senha. Essas capacidades continuam proibidas até existir proteção aprovada.
- Os vínculos de banco de dispositivos, cliente, unidade e tipo agora são validados no banco; membros restritos não conseguem inserir ou ler dispositivos de unidade não atribuída.
- A timeline agora vincula o dispositivo ao mesmo tenant e herda a autorização de unidade; `branch_id` nulo só é visível para membership com `all_branches=true`.
- A primeira API/UI de dispositivos e a allowlist estrita já existem; falta executar E2E autenticado e confirmar redaction de auditoria. Edição, detalhes e mutações de timeline ainda não foram expostos.
- `auth_leaked_password_protection` continua desabilitado no plano Free, mas está documentado como `NAO_APLICAVEL` a este ciclo: não há cadastro, reset ou alteração de senha. Essas capacidades continuam proibidas até existir proteção aprovada.
