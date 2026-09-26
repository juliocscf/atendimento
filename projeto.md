\# PROMPT MESTRE DE DESENVOLVIMENTO



Quero desenvolver uma aplicação web moderna, profissional, rápida, segura e totalmente responsiva para gestão de uma assistência técnica especializada em computadores, notebooks, redes, suporte remoto e suporte técnico presencial.



Não quero apenas um sistema simples de Ordem de Serviço.



O sistema deve ser concebido como uma \*\*plataforma completa de gestão técnica\*\*, cujo elemento central é o histórico permanente dos equipamentos dos clientes.



A aplicação deve ter arquitetura moderna, excelente UX/UI, design system consistente, responsividade completa, segurança, auditoria, permissões, automações e estrutura preparada para crescimento futuro.



\---



\# 1. PRINCÍPIO CENTRAL DO SISTEMA



A arquitetura de negócio deve seguir esta lógica:



Cliente

↓

Equipamento

↓

Histórico permanente

↓

Atendimentos



Um equipamento é uma entidade permanente.



Uma Ordem de Serviço ou atendimento é apenas um evento no histórico daquele equipamento.



O mesmo equipamento pode receber ao longo do tempo:



\- atendimento em laboratório;

\- suporte remoto;

\- atendimento presencial;

\- manutenção preventiva;

\- upgrade;

\- garantia;

\- diagnóstico;

\- instalação;

\- configuração;

\- outros serviços.



Todo esse histórico deve permanecer associado ao equipamento.



\---



\# 2. IDENTIFICAÇÃO PERMANENTE DO EQUIPAMENTO



Ao cadastrar um equipamento pela primeira vez, gerar automaticamente um código público exclusivo de \*\*4 caracteres alfanuméricos\*\*.



Exemplos:



K7M4

9XQP

B28Z

R7NK



Evitar caracteres visualmente ambíguos, principalmente:



\- O

\- 0

\- I

\- 1

\- L



Utilizar um conjunto seguro semelhante a:



ABCDEFGHJKMNPQRSTUVWXYZ23456789



O código deve:



\- ser gerado automaticamente;

\- possuir índice UNIQUE no banco;

\- nunca ser reutilizado;

\- permanecer associado ao equipamento permanentemente;

\- ser facilmente pesquisável;

\- aparecer nas etiquetas;

\- aparecer no histórico;

\- aparecer nas telas de atendimento.



IMPORTANTE:



O código de quatro caracteres NÃO deve ser a chave primária interna do banco.



Utilizar UUID ou ULID como identificador interno.



Exemplo:



ID interno:

01K6RP5VTXGE94Y54M5N7DWR4A



Código público:

K7M4



Se houver colisão durante geração do código público, gerar automaticamente outro.



O código público não deve ser utilizado sozinho como mecanismo de autenticação ou autorização.



\---



\# 3. QR CODE DO EQUIPAMENTO



Cada equipamento deve possuir QR Code próprio.



O QR Code deve permitir que um funcionário autenticado encontre imediatamente a ficha do equipamento.



Exemplo de rota:



/equipamentos/K7M4



A aplicação deve permitir:



\- visualizar etiqueta;

\- imprimir etiqueta;

\- gerar PDF da etiqueta;

\- selecionar tamanho da etiqueta;

\- incluir nome da assistência;

\- código de quatro caracteres;

\- QR Code;

\- opcionalmente telefone ou URL.



Exemplo visual:



ASSISTÊNCIA TÉCNICA



K7M4



\[QR CODE]



\---



\# 4. ENTIDADE CLIENTE



Permitir clientes:



\## Pessoa física



Campos principais:



\- nome;

\- CPF;

\- telefone;

\- WhatsApp;

\- e-mail;

\- endereço;

\- data de nascimento opcional;

\- observações;

\- contatos adicionais.



\## Pessoa jurídica



Campos:



\- razão social;

\- nome fantasia;

\- CNPJ;

\- inscrição estadual;

\- telefone;

\- WhatsApp;

\- e-mail;

\- endereço;

\- responsáveis;

\- departamentos;

\- contatos;

\- observações.



Um cliente pode possuir vários equipamentos.



Uma empresa pode possuir dezenas ou centenas de equipamentos.



\---



\# 5. EQUIPAMENTOS



Tipos iniciais:



\- notebook;

\- desktop;

\- workstation;

\- servidor;

\- monitor;

\- impressora;

\- nobreak;

\- roteador;

\- switch;

\- access point;

\- NAS;

\- periférico;

\- equipamento de rede;

\- outros.



Permitir expansão futura sem alterar código-fonte.



Campos possíveis:



\- código público;

\- cliente;

\- tipo;

\- fabricante;

\- modelo;

\- número de série;

\- service tag;

\- patrimônio;

\- hostname;

\- sistema operacional;

\- versão do sistema;

\- arquitetura;

\- processador;

\- memória RAM;

\- armazenamento;

\- GPU;

\- placa-mãe;

\- MAC Address;

\- endereço IP;

\- observações;

\- data de aquisição;

\- garantia do fabricante;

\- status;

\- localização atual.



\---



\# 6. PASSAPORTE DO EQUIPAMENTO



Criar uma página central chamada "Passaporte do Equipamento".



Ela deve ser uma das páginas mais importantes do sistema.



Exemplo:



Dell Inspiron 3583

K7M4



Cliente:

João da Silva



Primeiro atendimento:

14/05/2024



Último atendimento:

23/09/2026



Quantidade de atendimentos:

5



Valor gasto em manutenção:

R$ 2.840,00



Garantias ativas:

1



Problemas recorrentes:

Sistema de refrigeração



Componentes substituídos:

SSD

Memória

Bateria



Criar abas:



\- Visão Geral;

\- Histórico;

\- Atendimentos;

\- Hardware;

\- Drivers;

\- Arquivos;

\- Fotos;

\- Garantias;

\- Componentes;

\- Financeiro;

\- Auditoria.



\---



\# 7. HISTÓRICO DE HARDWARE



O sistema não deve armazenar apenas a configuração atual.



Deve ser possível manter histórico da evolução do equipamento.



Exemplo:



2024:

RAM: 4 GB

HD: 1 TB



2025:

RAM: 8 GB

HD: 1 TB



2026:

RAM: 8 GB

SSD: 480 GB



Toda alteração relevante deve gerar um evento histórico.



\---



\# 8. CONCEITO DE ATENDIMENTO



Criar uma entidade principal chamada:



ATENDIMENTO



Tipos:



1\. Laboratório / Bancada

2\. Suporte Remoto

3\. Suporte Presencial



Todos utilizam a mesma estrutura central, mas possuem fluxos específicos.



Estrutura:



Cliente

↓

Equipamento

↓

Atendimento

↓

Modalidade



\---



\# 9. ATENDIMENTO DE LABORATÓRIO



Criar fluxo profissional de ordem de serviço.



Estados sugeridos:



\- Recebido;

\- Aguardando diagnóstico;

\- Em diagnóstico;

\- Aguardando orçamento;

\- Aguardando aprovação;

\- Aprovado;

\- Aguardando peça;

\- Em reparo;

\- Em testes;

\- Pronto;

\- Aguardando retirada;

\- Entregue;

\- Sem reparo;

\- Recusado;

\- Cancelado;

\- Garantia.



Os estados devem ser configuráveis futuramente.



\---



\# 10. CHECKLIST DE RECEBIMENTO



Ao receber equipamento permitir checklist específico por categoria.



Notebook, por exemplo:



\- equipamento liga;

\- tela;

\- teclado;

\- touchpad;

\- webcam;

\- áudio;

\- portas USB;

\- HDMI;

\- Wi-Fi;

\- Bluetooth;

\- dobradiças;

\- carcaça;

\- carregador;

\- bateria;

\- parafusos;

\- sinais de queda;

\- sinais de líquido;

\- outros.



Estados:



\- OK;

\- Com avaria;

\- Não testado;

\- Não possui.



Permitir observações.



\---



\# 11. FOTOS DE RECEBIMENTO



Permitir captura diretamente pela câmera do smartphone.



Categorias:



\- frente;

\- traseira;

\- teclado;

\- tela;

\- laterais;

\- número de série;

\- acessórios;

\- avarias;

\- outras.



Guardar:



\- usuário;

\- data/hora;

\- atendimento;

\- equipamento;

\- categoria;

\- arquivo original;

\- miniatura.



Permitir comparação:



ANTES



DEPOIS



\---



\# 12. CREDENCIAIS TEMPORÁRIAS



Alguns equipamentos exigem:



\- senha Windows;

\- PIN;

\- senha BIOS;

\- senha de usuário;

\- outra credencial temporária.



Esses dados são extremamente sensíveis.



Implementar:



\- criptografia forte;

\- acesso somente por usuários autorizados;

\- botão revelar senha;

\- registro de auditoria ao visualizar;

\- possibilidade de exclusão automática;

\- nunca exibir senha em logs;

\- nunca armazenar em texto puro;

\- opção de apagar após conclusão da OS;

\- opção de prazo automático, como 30 dias.



\---



\# 13. DIAGNÓSTICO TÉCNICO



Criar diagnóstico estruturado.



Exemplo:



POST

BIOS

Memória RAM

SSD/HD

SMART

GPU

Temperaturas

Wi-Fi

Bluetooth

USB

Áudio

Webcam

Bateria

Fonte

Carregador

Tela

Teclado



Permitir:



\- resultado;

\- status;

\- observações;

\- arquivos;

\- fotos;

\- evidências;

\- valores técnicos;

\- conclusão.



\---



\# 14. ORÇAMENTO



Permitir criação de orçamento associado ao atendimento.



Itens:



\- peças;

\- serviços;

\- deslocamento;

\- horas técnicas;

\- taxas;

\- descontos.



Mostrar:



Subtotal

Desconto

Total



Estados:



\- rascunho;

\- enviado;

\- visualizado;

\- aprovado;

\- recusado;

\- expirado.



\---



\# 15. APROVAÇÃO DIGITAL DO ORÇAMENTO



Criar link seguro para o cliente visualizar o orçamento.



O cliente deve conseguir:



\- visualizar;

\- aprovar;

\- recusar;

\- escrever observação.



Registrar:



\- data/hora;

\- identificação do orçamento;

\- endereço IP quando juridicamente apropriado;

\- user agent;

\- versão do orçamento aprovada;

\- alterações posteriores.



Não utilizar o código de quatro caracteres do equipamento como token de autorização.



Gerar token seguro específico e expirável.



\---



\# 16. SERVIÇOS



Criar catálogo de serviços.



Exemplos:



\- diagnóstico;

\- formatação;

\- instalação Windows;

\- limpeza interna;

\- troca de pasta térmica;

\- substituição SSD;

\- backup;

\- recuperação de dados;

\- configuração de rede;

\- suporte remoto;

\- visita técnica;

\- instalação de software.



Campos:



\- nome;

\- descrição;

\- preço;

\- custo;

\- duração estimada;

\- categoria;

\- ativo/inativo.



\---



\# 17. PEÇAS E ESTOQUE



Criar módulo de estoque.



Entidades:



\- produtos;

\- categorias;

\- fornecedores;

\- marcas;

\- compras;

\- entradas;

\- saídas;

\- movimentações;

\- reservas;

\- inventário.



Ao incluir peça em orçamento:



reservar peça opcionalmente.



Após uso:



baixar estoque.



Registrar:



\- produto;

\- quantidade;

\- lote;

\- fornecedor;

\- custo;

\- preço vendido;

\- margem;

\- técnico;

\- atendimento.



\---



\# 18. GARANTIAS



Permitir garantia separada para:



\- peça;

\- serviço.



Exemplo:



SSD:

12 meses



Serviço:

90 dias



Calcular automaticamente:



Data inicial

Data final

Dias restantes



Ao abrir novo atendimento para equipamento com garantia ativa, exibir alerta.



Exemplo:



"Este equipamento possui garantia ativa referente à troca do SSD realizada na OS #1847."



\---



\# 19. SUPORTE REMOTO



Criar modalidade específica.



Campos:



\- cliente;

\- equipamento;

\- técnico;

\- problema relatado;

\- prioridade;

\- data/hora;

\- duração;

\- solução;

\- softwares utilizados;

\- observações;

\- anexos.



Permitir cronômetro:



Iniciar atendimento



Pausar



Retomar



Finalizar



Registrar eventos.



Exemplo:



09:42 sessão iniciada

09:47 erro identificado

09:53 configuração corrigida

10:04 teste realizado

10:17 atendimento encerrado



\---



\# 20. SUPORTE PRESENCIAL



Criar modalidade de atendimento externo.



Campos:



\- cliente;

\- local;

\- endereço;

\- contato;

\- técnico;

\- data agendada;

\- problema;

\- equipamentos relacionados;

\- prioridade;

\- SLA;

\- observações.



Workflow:



Agendado

↓

A caminho

↓

Cheguei

↓

Atendimento iniciado

↓

Atendimento concluído



Registrar:



\- horário de deslocamento;

\- chegada;

\- início;

\- pausa;

\- término;

\- duração;

\- quilometragem opcional;

\- despesas;

\- peças utilizadas;

\- fotos;

\- assinatura do cliente.



\---



\# 21. ASSINATURA DO CLIENTE



No smartphone ou tablet permitir assinatura utilizando:



\- dedo;

\- caneta digital;

\- mouse.



Associar assinatura ao atendimento.



Guardar:



\- imagem;

\- data/hora;

\- usuário responsável;

\- atendimento;

\- versão do documento assinado.



\---



\# 22. CONTRATOS DE SUPORTE



Criar estrutura para clientes empresariais.



Tipos:



\- mensalidade;

\- pacote de horas;

\- pacote de visitas;

\- suporte ilimitado;

\- personalizado.



Exemplo:



Contrato:

Suporte Empresarial



Mensalidade:

R$ 1.200



Incluído:

10 horas remotas

4 visitas presenciais



Consumido:

6h25 remotas

3 visitas



Mostrar saldo.



Permitir:



\- franquia;

\- excedente;

\- vencimento;

\- reajuste;

\- SLA;

\- equipamentos incluídos;

\- usuários incluídos.



\---



\# 23. DRIVERS



Criar módulo completo de armazenamento e biblioteca de drivers.



Na ficha do equipamento deve existir uma aba:



Drivers



Permitir upload de:



\- EXE;

\- MSI;

\- ZIP;

\- INF;

\- CAB;

\- outros formatos permitidos.



Informações:



\- fabricante;

\- dispositivo;

\- modelo;

\- versão;

\- sistema operacional;

\- arquitetura;

\- data;

\- origem;

\- URL original;

\- observações;

\- Hardware ID;

\- hash SHA-256;

\- tamanho;

\- usuário responsável pelo upload.



\---



\# 24. BIBLIOTECA DE DRIVERS



Um driver não deve necessariamente ser duplicado para cada equipamento.



Arquitetura:



Driver

↓

Compatibilidade

↓

Modelo / Hardware ID / Equipamento



Permitir relacionar um driver a:



\- fabricante;

\- modelo;

\- Hardware ID;

\- equipamento específico;

\- família de equipamentos.



Exemplo:



Dell Inspiron 3583



Drivers disponíveis:



Chipset

Intel UHD

Realtek Audio

Intel Wi-Fi

Bluetooth

Touchpad

Card Reader



\---



\# 25. BACKUP DE DRIVERS



Preparar arquitetura para futuramente permitir um agente Windows que envie para o sistema os drivers instalados.



Guardar backups por equipamento.



Exemplo:



23/09/2026

Windows 11 Pro

38 drivers



14/05/2025

Windows 10 Pro

34 drivers



Permitir:



\- visualizar;

\- baixar;

\- identificar versões;

\- comparar backups.



\---



\# 26. SEGURANÇA DOS DRIVERS



Como drivers podem possuir executáveis, implementar:



\- armazenamento privado;

\- validação MIME;

\- validação de extensão;

\- tamanho máximo;

\- antivírus/antimalware;

\- hash SHA-256;

\- auditoria;

\- permissão por usuário;

\- URLs temporárias de download;

\- bloqueio de execução no servidor.



Nunca executar arquivos enviados pelo usuário no servidor principal.



\---



\# 27. ARQUIVOS



Criar biblioteca de arquivos relacionados a:



\- cliente;

\- equipamento;

\- atendimento;

\- orçamento;

\- contrato;

\- driver;

\- garantia.



Tipos:



PDF

imagem

documento

planilha

ZIP

logs

outros.



\---



\# 28. LINHA DO TEMPO



Toda ação relevante deve produzir evento.



Exemplo:



09:14 equipamento recebido por Ana

09:18 fotos adicionadas

09:21 OS criada

10:45 Carlos iniciou diagnóstico

11:04 SSD identificado com falha

11:14 orçamento criado

11:15 orçamento enviado

11:43 cliente visualizou

12:07 cliente aprovou

13:22 SSD reservado

13:25 reparo iniciado

15:40 sistema operacional instalado

16:10 testes iniciados

17:02 testes aprovados

17:05 cliente notificado



A timeline deve permitir filtrar eventos.



\---



\# 29. AUDITORIA



Criar sistema robusto de auditoria.



Registrar ações críticas:



\- login;

\- logout;

\- criação;

\- edição;

\- exclusão;

\- alteração de status;

\- visualização de senha;

\- aprovação;

\- alteração financeira;

\- movimentação de estoque;

\- upload;

\- download;

\- alterações de permissões.



Registrar:



\- usuário;

\- data;

\- hora;

\- entidade;

\- ID;

\- ação;

\- valor anterior;

\- novo valor;

\- IP quando necessário;

\- user agent.



Logs de auditoria não devem poder ser alterados por usuários comuns.



\---



\# 30. PESQUISA GLOBAL



Criar busca global extremamente rápida.



Atalho:



Ctrl + K



Pesquisar:



\- cliente;

\- CPF;

\- CNPJ;

\- telefone;

\- WhatsApp;

\- e-mail;

\- código do equipamento;

\- serial;

\- service tag;

\- patrimônio;

\- hostname;

\- modelo;

\- fabricante;

\- OS;

\- atendimento;

\- orçamento;

\- contrato.



Exemplo:



K7M4



deve abrir imediatamente o equipamento.



Permitir filtros avançados futuramente.



\---



\# 31. DASHBOARD



Criar dashboard operacional realmente útil.



Cards:



Equipamentos recebidos hoje

Em diagnóstico

Aguardando aprovação

Aguardando peça

Em reparo

Em testes

Prontos

Aguardando retirada

Atendimentos remotos

Atendimentos presenciais

SLA em risco



Financeiro:



Faturamento

Ticket médio

Margem

Orçamentos pendentes

Contas a receber



Operacional:



Tempo médio de diagnóstico

Tempo médio de reparo

Taxa de aprovação

Retorno em garantia

Quantidade por técnico



\---



\# 32. ALERTAS INTELIGENTES



Exemplos:



"23 equipamentos aguardam diagnóstico há mais de 24 horas."



"R$ 8.420 em orçamentos aguardam aprovação."



"12 equipamentos estão prontos há mais de 7 dias."



"3 chamados estão próximos do SLA."



"Estoque de SSD 480 GB abaixo do mínimo."



"Equipamento retornou 3 vezes pelo mesmo problema."



\---



\# 33. NOTIFICAÇÕES



Criar central de notificações.



Eventos:



\- nova OS;

\- orçamento aprovado;

\- orçamento recusado;

\- mensagem do cliente;

\- SLA próximo;

\- estoque baixo;

\- equipamento pronto;

\- garantia próxima do vencimento;

\- atendimento atribuído.



Permitir notificações:



\- dentro do sistema;

\- e-mail;

\- WhatsApp;

\- push futuramente.



\---



\# 34. WHATSAPP



Preparar integração via API oficial ou provedor compatível.



Criar templates configuráveis.



Exemplos:



Recebemos seu equipamento.



Orçamento disponível.



Orçamento aprovado.



Reparo iniciado.



Equipamento pronto.



Lembrete de retirada.



Atendimento agendado.



Técnico a caminho.



Nunca acoplar a lógica de negócio diretamente a um fornecedor específico de WhatsApp.



Criar camada abstrata de integração.



\---



\# 35. PORTAL DO CLIENTE



Criar portal responsivo.



Cliente pode consultar:



\- equipamentos;

\- atendimentos;

\- andamento;

\- histórico;

\- orçamento;

\- aprovação;

\- arquivos;

\- documentos;

\- garantias;

\- pagamentos;

\- contratos;

\- chamados.



O cliente deve visualizar somente dados pertencentes à sua conta.



\---



\# 36. FINANCEIRO



Preparar estrutura para:



\- contas a receber;

\- pagamentos;

\- formas de pagamento;

\- PIX;

\- dinheiro;

\- cartão;

\- boleto;

\- transferência;

\- parcelamento;

\- descontos;

\- acréscimos;

\- estorno.



Associar financeiro a:



\- atendimento;

\- orçamento;

\- cliente;

\- contrato.



\---



\# 37. USUÁRIOS



Tipos iniciais:



Administrador

Gerente

Atendente

Técnico

Financeiro

Estoque



Não implementar permissões apenas com if role == "admin".



Criar RBAC flexível.



Exemplos de permissões:



clients.view

clients.create

clients.edit



devices.view

devices.create

devices.edit



tickets.view

tickets.create

tickets.assign



financial.view

financial.edit



credentials.view



inventory.manage



users.manage



audit.view



\---



\# 38. MULTIUNIDADE



Preparar banco para múltiplas unidades.



Exemplo:



Matriz

Filial 1

Filial 2



Um equipamento pode estar associado a uma unidade.



Usuários podem possuir acesso a uma ou várias unidades.



\---



\# 39. POSSIBILIDADE FUTURA DE SAAS



Mesmo que inicialmente exista apenas uma empresa usando o sistema, estruturar a aplicação para possível evolução futura para SaaS.



Utilizar conceito de:



organization\_id / tenant\_id



nas entidades relevantes.



Evitar queries sem escopo organizacional.



Implementar isolamento adequado entre organizações.



\---



\# 40. DESIGN SYSTEM



Quero visual moderno inspirado conceitualmente na qualidade de produtos como:



\- Linear;

\- Stripe;

\- Vercel;

\- Notion;

\- GitHub;

\- modernos painéis SaaS.



NÃO copiar identidade visual.



Utilizar apenas princípios:



\- clareza;

\- hierarquia;

\- minimalismo;

\- velocidade;

\- consistência.



Evitar aparência de ERP antigo.



\---



\# 41. INTERFACE



Características:



\- sidebar moderna;

\- header discreto;

\- command palette;

\- pesquisa global;

\- breadcrumbs;

\- tabelas modernas;

\- filtros avançados;

\- tabs;

\- drawers;

\- dialogs;

\- dropdown menus;

\- tooltips;

\- skeleton loading;

\- empty states;

\- toasts;

\- badges;

\- avatars;

\- atalhos de teclado.



\---



\# 42. DESIGN TOKENS



Criar tokens reutilizáveis:



colors

spacing

radius

shadow

typography

breakpoints

z-index

animations



Evitar valores aleatórios espalhados pelo código.



\---



\# 43. CORES DE STATUS



Utilizar cores com moderação.



Exemplos:



Neutro:

cinza



Informação:

azul



Sucesso:

verde



Atenção:

âmbar



Erro:

vermelho



Nunca depender exclusivamente da cor.



Sempre combinar:



cor + ícone + texto.



\---



\# 44. TEMA



Implementar:



Light

Dark

System



Salvar preferência.



\---



\# 45. RESPONSIVIDADE



O sistema deve funcionar perfeitamente em:



\- desktop;

\- notebook;

\- tablet;

\- smartphone.



Não simplesmente reduzir a versão desktop.



Criar UX específica quando necessário.



\---



\# 46. MOBILE-FIRST PARA TÉCNICOS EXTERNOS



No celular priorizar:



\- buscar cliente;

\- buscar equipamento;

\- escanear QR Code;

\- iniciar atendimento;

\- cronômetro;

\- adicionar foto;

\- anexar documento;

\- escrever observação;

\- registrar peça;

\- assinatura;

\- finalizar atendimento.



Evitar tabelas enormes no smartphone.



Converter tabelas para cards quando apropriado.



\---



\# 47. PWA



Implementar Progressive Web App.



Permitir:



\- instalação;

\- ícone;

\- splash;

\- manifest;

\- service worker quando apropriado;

\- notificações futuras;

\- funcionamento parcial em conexão instável.



Planejar offline-first apenas para funcionalidades específicas.



Não tentar transformar toda a aplicação em offline sem necessidade.



\---



\# 48. PERFORMANCE



Objetivos:



\- páginas rápidas;

\- lazy loading;

\- paginação;

\- busca otimizada;

\- índices de banco;

\- evitar N+1 queries;

\- cache quando apropriado;

\- compressão;

\- imagens otimizadas;

\- thumbnails.



Grandes tabelas nunca devem carregar todos os registros de uma vez.



\---



\# 49. ACESSIBILIDADE



Seguir boas práticas WCAG.



Implementar:



\- navegação por teclado;

\- foco visível;

\- labels;

\- aria attributes;

\- contraste adequado;

\- leitores de tela;

\- componentes acessíveis.



\---



\# 50. IDIOMA



Interface inicialmente em:



Português do Brasil.



Preparar arquitetura de internacionalização para futuro.



Formatação:



Data:

DD/MM/YYYY



Hora:

HH:mm



Moeda:

R$ 1.234,56



Timezone configurável.



\---



\# 51. LGPD



Implementar conceitos adequados à LGPD.



Especial atenção a:



\- dados pessoais;

\- credenciais;

\- documentos;

\- auditoria;

\- permissões;

\- retenção;

\- exclusão;

\- consentimento quando aplicável.



Não apagar registros financeiros ou de auditoria de forma inadequada.



Criar política de retenção configurável.



\---



\# 52. SEGURANÇA



Aplicar:



\- autenticação segura;

\- hash forte de senha;

\- MFA opcional;

\- rate limiting;

\- CSRF quando aplicável;

\- XSS protection;

\- SQL injection protection;

\- validação server-side;

\- autorização server-side;

\- cookies seguros;

\- sessão segura;

\- logs;

\- proteção contra brute force;

\- upload seguro;

\- URLs assinadas;

\- secrets via environment variables.



Nunca confiar apenas em validação frontend.



\---



\# 53. SOFT DELETE



Para entidades relevantes usar soft delete.



Campos possíveis:



deleted\_at

deleted\_by



Não remover definitivamente registros importantes sem fluxo administrativo apropriado.



\---



\# 54. BANCO DE DADOS



Utilizar banco relacional, preferencialmente PostgreSQL.



Principais tabelas sugeridas:



organizations

branches

users

roles

permissions

role\_permissions

user\_roles



clients

client\_contacts

addresses



devices

device\_types

device\_hardware

device\_hardware\_history



attendances

attendance\_status\_history

attendance\_events

attendance\_notes



diagnostics

diagnostic\_items



quotes

quote\_items

quote\_approvals



services



products

stock\_movements

suppliers

purchases



parts\_used



warranties



files

photos



drivers

driver\_compatibility

driver\_backups



contracts

contract\_consumption



payments

receivables



notifications



audit\_logs



credentials



signatures



\---



\# 55. EVENTOS



Adotar arquitetura orientada a eventos internamente quando útil.



Exemplos:



attendance.created

attendance.status\_changed

quote.created

quote.sent

quote.approved

quote.rejected

device.created

device.updated

stock.low

warranty.created

payment.received



Esses eventos podem posteriormente alimentar:



\- notificações;

\- WhatsApp;

\- e-mails;

\- auditoria;

\- webhooks;

\- automações.



\---



\# 56. API



Criar arquitetura API-first.



Endpoints consistentes.



Versionamento futuro:



/api/v1/



Implementar autenticação e autorização.



Preparar webhooks.



Exemplo:



POST /webhooks



Eventos selecionáveis.



\---



\# 57. IA



Preparar arquitetura para recursos futuros de inteligência artificial.



Possibilidades:



\- reescrever relato técnico;

\- resumir histórico;

\- sugerir checklist;

\- identificar problemas recorrentes;

\- resumir diagnóstico;

\- gerar texto de orçamento;

\- encontrar atendimentos relacionados;

\- sugerir drivers da biblioteca;

\- alertar sobre garantia;

\- pesquisar base técnica.



IA deve atuar como assistente.



Nunca alterar dados críticos automaticamente sem confirmação humana.



\---



\# 58. BUSCA SEMÂNTICA FUTURA



Planejar possibilidade de busca como:



"notebooks Dell que voltaram com problema de temperatura"



ou:



"equipamentos que trocaram SSD nos últimos 12 meses"



Não precisa necessariamente implementar vetor database na primeira versão.



A arquitetura deve permitir evolução.



\---



\# 59. UX DE CADASTRO



Evitar formulários gigantes.



Utilizar:



\- progressive disclosure;

\- seções;

\- passos;

\- preenchimento opcional;

\- defaults inteligentes.



No cadastro inicial do equipamento pedir somente informações essenciais.



Dados técnicos detalhados podem ser preenchidos depois.



\---



\# 60. AÇÕES RÁPIDAS



Na ficha do cliente:



Nova OS

Novo chamado

Novo equipamento

Novo orçamento



Na ficha do equipamento:



Novo atendimento

Suporte remoto

Visita técnica

Imprimir etiqueta

Adicionar foto

Adicionar driver

Adicionar arquivo



\---



\# 61. COMMAND PALETTE



Atalho:



Ctrl + K



Permitir comandos:



Novo atendimento

Novo cliente

Novo equipamento

Buscar OS

Buscar equipamento

Abrir estoque

Abrir agenda



\---



\# 62. ATALHOS



Exemplos:



N + O

Nova OS



N + C

Novo cliente



N + E

Novo equipamento



/



Pesquisar



Não ativar atalhos quando usuário estiver digitando em campos.



\---



\# 63. EMPTY STATES



Nunca mostrar telas vazias sem orientação.



Exemplo:



"Nenhum equipamento cadastrado para este cliente."



Botão:



\+ Cadastrar primeiro equipamento



\---



\# 64. ERROS



Mensagens compreensíveis.



Evitar:



Error 500



Preferir:



"Não foi possível salvar o atendimento. Tente novamente."



Registrar detalhes técnicos somente nos logs.



\---



\# 65. AUTOSAVE



Campos longos como:



\- diagnóstico;

\- observação técnica;

\- relatório;

\- descrição;



podem possuir salvamento automático.



Mostrar:



Salvando...



Salvo às 14:32



Evitar perda de trabalho.



\---



\# 66. CONCORRÊNCIA



Prevenir sobrescrita silenciosa quando dois usuários editam o mesmo atendimento.



Considerar:



updated\_at

version

optimistic locking



\---



\# 67. IMPORTAÇÃO



Preparar futuro módulo para importação:



CSV

Excel



Clientes

Equipamentos

Produtos

Estoque



Criar validação e preview antes da importação.



\---



\# 68. EXPORTAÇÃO



Permitir exportar informações autorizadas para:



CSV

Excel

PDF



Respeitando permissões.



\---



\# 69. RELATÓRIOS



Relatórios futuros:



Faturamento

Margem

Atendimentos

Serviços mais realizados

Peças mais utilizadas

Clientes

Garantias

Técnicos

SLA

Contratos

Estoque

Equipamentos recorrentes



\---



\# 70. TECNOLOGIA SUGERIDA



Utilizar tecnologias modernas, estáveis e amplamente mantidas.



Sugestão inicial:



Frontend:

Next.js

React

TypeScript



UI:

Tailwind CSS

shadcn/ui ou componentes próprios baseados em Radix



Ícones:

Lucide



Banco:

PostgreSQL



ORM:

Prisma ou Drizzle



Validação:

Zod



Forms:

React Hook Form



State/Data Fetching:

TanStack Query quando apropriado



Storage:

S3-compatible object storage



Autenticação:

solução madura com RBAC



Fila:

Redis + worker, quando necessário



E-mail:

provider desacoplado



Deploy:

Docker



IMPORTANTE:



Não escolher bibliotecas abandonadas apenas por conveniência.



Antes de implementar, confirmar compatibilidade das versões utilizadas.



\---



\# 71. ESTRUTURA DE CÓDIGO



Adotar arquitetura modular por domínio.



Exemplo:



modules/

&#x20; clients/

&#x20; devices/

&#x20; attendances/

&#x20; inventory/

&#x20; financial/

&#x20; drivers/

&#x20; contracts/

&#x20; users/

&#x20; notifications/



Evitar arquivo gigante.



Evitar componentes de milhares de linhas.



Separar:



UI

domínio

repositório

serviço

validação

autorização



\---



\# 72. REGRAS DE IMPLEMENTAÇÃO



Não gerar apenas protótipos visuais.



Cada funcionalidade implementada deve possuir:



\- schema;

\- migration;

\- backend;

\- validação;

\- autorização;

\- frontend;

\- tratamento de erros;

\- loading state;

\- empty state;

\- testes relevantes.



Não usar dados mockados permanentemente.



Mocks podem existir apenas durante desenvolvimento.



\---



\# 73. QUALIDADE DO CÓDIGO



Obrigatório:



TypeScript strict



Lint



Formatter



Testes



Nomes claros



Funções pequenas



Componentes reutilizáveis



Sem duplicação desnecessária



Sem secrets hardcoded



Sem any desnecessário



Sem console.log em produção



\---



\# 74. TESTES



Criar:



testes unitários



testes de integração



testes de API



testes de autorização



E2E para fluxos críticos



Fluxos críticos:



login;

criação de cliente;

criação de equipamento;

geração de código;

abertura de OS;

criação de orçamento;

aprovação;

mudança de status;

movimentação de estoque;

finalização;

garantia.



\---



\# 75. SEED



Criar seed de desenvolvimento com:



empresa exemplo;

usuários;

clientes;

equipamentos;

atendimentos;

produtos;

drivers;

orçamentos.



Nunca executar seed de demonstração automaticamente em produção.



\---



\# 76. MIGRATIONS



Toda mudança estrutural no banco deve utilizar migrations versionadas.



Nunca alterar banco de produção manualmente como solução permanente.



\---



\# 77. OBSERVABILIDADE



Preparar:



logs estruturados;

monitoramento de erro;

métricas;

health check;

status de workers;

status de integrações.



\---



\# 78. BACKUP



Documentar estratégia para:



backup PostgreSQL;

backup de arquivos;

retenção;

restore;

teste de restauração.



\---



\# 79. MVP



Não implementar tudo simultaneamente.



Dividir desenvolvimento.



\## FASE 1 — FUNDAÇÃO



Implementar:



autenticação;

organização;

unidades;

usuários;

permissões;

design system;

layout;

clientes;

equipamentos;

código de quatro caracteres;

QR Code;

busca global básica.



\## FASE 2 — LABORATÓRIO



Implementar:



atendimentos;

OS;

timeline;

checklist;

fotos;

diagnóstico;

status;

orçamento;

aprovação.



\## FASE 3 — OPERAÇÃO



Implementar:



serviços;

produtos;

estoque;

peças;

garantia;

financeiro básico.



\## FASE 4 — SUPORTE



Implementar:



suporte remoto;

suporte presencial;

cronômetro;

agenda;

assinaturas;

contratos.



\## FASE 5 — DRIVERS



Implementar:



upload;

biblioteca;

compatibilidade;

Hardware IDs;

backup;

segurança.



\## FASE 6 — COMUNICAÇÃO



Implementar:



portal cliente;

WhatsApp;

e-mail;

notificações.



\## FASE 7 — INTELIGÊNCIA



Implementar:



dashboards;

relatórios;

automações;

IA;

alertas;

análises.



\---



\# 80. PRIMEIRA TELA



Criar dashboard limpo.



Sidebar:



Dashboard

Atendimentos

Clientes

Equipamentos

Agenda

Estoque

Drivers

Contratos

Financeiro

Relatórios



Administração:



Usuários

Unidades

Integrações

Configurações



\---



\# 81. PÁGINA DE EQUIPAMENTO



Exemplo:



← Equipamentos



Dell Inspiron 3583                         K7M4



Notebook • João da Silva



\[ + Novo atendimento ]

\[ Imprimir etiqueta ]

\[ ••• ]



Tabs:



Visão Geral

Histórico

Atendimentos

Hardware

Drivers

Arquivos

Garantias



Resumo:



STATUS

Com cliente



HARDWARE



CPU

Intel Core i5-8265U



RAM

8 GB DDR4



SSD

Kingston A400 480 GB



Serial

ABC123



Sistema

Windows 11 Pro



Histórico:



23/09/2026

SSD substituído

OS #1847



17/02/2026

Limpeza interna

OS #1298



08/04/2025

Upgrade de memória

OS #841



\---



\# 82. PRINCÍPIO DE UX



O usuário deve conseguir executar as ações mais comuns com poucos cliques.



Perguntar a cada decisão:



"Isto está facilitando ou complicando o trabalho diário do atendente e do técnico?"



O sistema deve parecer rápido mesmo quando estiver executando operações demoradas.



Utilizar feedback visual imediato.



\---



\# 83. NÃO FAZER



Não criar:



\- sistema visualmente semelhante a ERP dos anos 2000;

\- formulários gigantes;

\- dezenas de modais desnecessários;

\- cores excessivas;

\- navegação confusa;

\- IDs sequenciais como único identificador externo;

\- senha armazenada em texto puro;

\- upload público irrestrito;

\- regras de autorização somente no frontend;

\- deletes físicos indiscriminados;

\- componentes monolíticos;

\- lógica financeira espalhada pelo frontend;

\- dependência rígida de um único provedor externo.



\---



\# 84. CRITÉRIOS DE ACEITE DA FUNDAÇÃO



A primeira fase somente estará completa quando for possível:



1\. autenticar usuário;

2\. respeitar permissões;

3\. criar cliente;

4\. editar cliente;

5\. cadastrar equipamento;

6\. gerar automaticamente código alfanumérico de quatro caracteres;

7\. impedir códigos duplicados;

8\. gerar QR Code;

9\. imprimir etiqueta;

10\. listar equipamentos;

11\. localizar equipamento pelo código;

12\. localizar equipamento por cliente;

13\. abrir Passaporte do Equipamento;

14\. visualizar timeline inicial;

15\. funcionar corretamente em desktop;

16\. funcionar corretamente em tablet;

17\. funcionar corretamente em smartphone;

18\. funcionar em tema claro;

19\. funcionar em tema escuro;

20\. registrar auditoria das operações importantes.



\---



\# 85. PROCEDIMENTO DE DESENVOLVIMENTO



Antes de escrever código:



1\. analisar estes requisitos;

2\. identificar domínios;

3\. desenhar arquitetura;

4\. desenhar schema inicial do banco;

5\. definir relações;

6\. definir estratégia de autenticação;

7\. definir autorização;

8\. definir design system;

9\. definir estrutura de pastas;

10\. apresentar plano de implementação.



Depois iniciar pela FASE 1.



Não tentar gerar toda a aplicação em uma única resposta ou alteração.



Implementar por módulos completos e utilizáveis.



Para cada módulo:



Planejar

↓

Implementar banco

↓

Implementar backend

↓

Implementar autorização

↓

Implementar UI

↓

Testar

↓

Revisar

↓

Documentar



\---



\# 86. REGRA PRINCIPAL



Este projeto não é apenas um sistema de Ordem de Serviço.



Ele deve ser desenvolvido como uma plataforma moderna de gestão técnica baseada em:



CLIENTE

\+

EQUIPAMENTO

\+

HISTÓRICO PERMANENTE

\+

ATENDIMENTOS

\+

CONHECIMENTO TÉCNICO



O equipamento deve possuir uma identidade permanente no sistema.



O código como K7M4 representa essa identidade de forma simples para humanos.



A Ordem de Serviço representa apenas um episódio da vida técnica daquele equipamento.



Essa distinção deve orientar toda a arquitetura do produto.



\# 87. PROTOCOLO OBRIGATÓRIO DE SEGURANÇA



Este projeto deve seguir segurança desde o design em todas as fases, módulos, migrations, APIs, telas, integrações e operações.



As regras desta seção são obrigatórias e prevalecem sobre atalhos de implementação, protótipos ou decisões de conveniência.



Devem ser utilizadas, de forma complementar, as seguintes skills:



\- \`saas-security-architect-pro\`: arquitetura segura, modelagem de ameaças, AppSec, banco de dados, DevOps, revisão de código, correções e preparação para produção;

\- \`saas-intelligence-auditor\`: auditoria funcional e de segurança reproduzível, stateful, baseada em evidências, com checkpoints, coverage gates e validação mecânica.



Princípios obrigatórios:



\- fail-closed: ausência de evidência não pode ser tratada como segurança comprovada;

\- menor privilégio;

\- defesa em profundidade;

\- autorização sempre no servidor;

\- isolamento por organização e unidade;

\- segurança e privacidade proporcionais à sensibilidade do dado;

\- rastreabilidade das decisões, alterações, acessos e exceções;

\- nenhuma funcionalidade crítica pode depender apenas do frontend;

\- nenhuma fase pode ser considerada concluída sem os gates definidos neste documento.



\# 88. CICLO DE SEGURANÇA DE CADA MÓDULO



Todo módulo deve passar obrigatoriamente pelo ciclo abaixo:



1. Definir escopo, atores, ativos, dados pessoais, dados sensíveis e fronteiras de confiança.

2. Identificar ameaças, abusos, impactos e requisitos de retenção da LGPD.

3. Produzir modelagem de ameaças e matriz de permissões antes da implementação.

4. Definir arquitetura, schema, migrations, contratos de API, validações, auditoria e estratégia de recuperação.

5. Implementar autenticação, autorização server-side, isolamento organizacional e validação de entrada.

6. Implementar backend, frontend, tratamento de erros, loading state, empty state e feedback seguro.

7. Criar testes unitários, integração, API, autorização, abuso e E2E dos fluxos críticos.

8. Executar revisão com \`saas-security-architect-pro\`.

9. Executar auditoria com \`saas-intelligence-auditor\`, registrando evidências e coverage.

10. Corrigir achados, repetir os testes afetados e registrar o resultado em checkpoint.

11. Documentar controles, riscos residuais, procedimentos operacionais e plano de rollback.



Não avançar para o próximo passo quando houver falha crítica, autorização não comprovada, isolamento de tenant não comprovado, segredo exposto, teste obrigatório ausente ou evidência incompleta.



\# 89. ENTREGÁVEIS OBRIGATÓRIOS DE SEGURANÇA



Cada módulo ou alteração relevante deve possuir, no mínimo:



\- classificação dos dados tratados;

\- modelo de ameaças e casos de abuso;

\- matriz de papéis, permissões, organização e unidade;

\- inventário de endpoints, eventos, integrações e superfícies de ataque;

\- schema e migration versionada;

\- validação server-side e política de erros;

\- testes positivos e negativos de autorização;

\- política de sessão, tokens, expiração, rate limiting e revogação;

\- política de arquivos, MIME, extensão, tamanho, armazenamento privado e download;

\- eventos de auditoria e campos que não podem ser registrados;

\- estratégia de criptografia, secrets e rotação;

\- evidências dos testes executados;

\- achados, severidade, correção, reteste e risco residual;

\- documentação de operação, monitoramento, backup e restauração quando aplicável.



O estado runtime da auditoria deve ficar no projeto auditado em \`.saas-audit/\`. Nunca gravar estado, evidências ou alterações dentro da pasta imutável da skill.



\# 90. GATES DE SEGURANÇA POR FASE



Cada fase do MVP deve ser aprovada em dois níveis: revisão arquitetural com \`saas-security-architect-pro\` e auditoria verificável com \`saas-intelligence-auditor\`.



\## FASE 1 — FUNDAÇÃO



Bloqueios mínimos:



\- autenticação segura, sessão protegida, recuperação de conta e proteção contra brute force;

\- RBAC validado no servidor com testes de acesso permitido e negado;

\- isolamento por \`organization_id\` e \`branch_id\` em queries, mutations, cache e arquivos;

\- ausência de enumeração indevida de clientes, equipamentos, UUIDs e códigos públicos;

\- código público de equipamento sem função de autenticação ou autorização;

\- validação de CPF, CNPJ, contatos e dados de equipamento;

\- proteção contra IDOR, SQL injection, XSS, CSRF quando aplicável e mass assignment;

\- auditoria de operações administrativas e alterações relevantes;

\- secrets fora do código, cookies seguros, headers de proteção e rate limiting;

\- QR Code e etiqueta sem exposição de dados além do mínimo necessário.



\## FASE 2 — LABORATÓRIO



Bloqueios mínimos:



\- autorização por cliente, equipamento, atendimento e unidade;

\- transições de status validadas no servidor e registradas na timeline;

\- fotos e arquivos privados, com validação, quotas, antivírus quando disponível e URLs temporárias;

\- credenciais temporárias criptografadas, acesso privilegiado auditado e nunca exibidas em logs;

\- tokens de aprovação aleatórios, específicos, expiráveis, revogáveis e não reutilizados;

\- aprovação vinculada à versão exata do orçamento;

\- proteção contra replay, alteração de preço após aprovação e acesso não autorizado;

\- testes de concorrência e prevenção de sobrescrita silenciosa.



\## FASE 3 — OPERAÇÃO



Bloqueios mínimos:



\- invariantes transacionais de estoque, reservas, baixas, devoluções e inventário;

\- proteção contra estoque negativo e dupla baixa;

\- segregação de funções para preços, descontos, pagamentos e ajustes;

\- trilha de auditoria financeira imutável para usuários comuns;

\- autorização por produto, fornecedor, compra, movimentação e atendimento;

\- cálculo financeiro realizado no backend, com valores monetários seguros;

\- garantia vinculada à peça ou serviço correto, sem possibilidade de extensão indevida.



\## FASE 4 — SUPORTE



Bloqueios mínimos:



\- autorização para iniciar, pausar, retomar e finalizar atendimentos;

\- integridade do cronômetro e dos eventos de presença;

\- proteção de localização, endereço, assinatura e dados do cliente;

\- assinatura vinculada ao documento, atendimento, versão e data/hora;

\- controle de acesso a credenciais e anexos de suporte remoto;

\- validação de quilometragem, despesas, peças e equipamentos relacionados.



\## FASE 5 — DRIVERS



Bloqueios mínimos:



\- armazenamento privado e download por URL assinada e temporária;

\- validação independente de MIME, extensão, tamanho e conteúdo;

\- hash SHA-256, quarentena e análise antimalware quando disponível;

\- arquivos enviados nunca executados no servidor principal;

\- autorização por organização, compatibilidade, equipamento e usuário;

\- auditoria de upload, download, associação, substituição e exclusão;

\- proteção contra path traversal, arquivos poliglotas, ZIP bombs e nomes maliciosos.



\## FASE 6 — COMUNICAÇÃO



Bloqueios mínimos:



\- secrets de provedores armazenados somente em cofre ou variáveis protegidas;

\- validação de assinatura de webhooks, idempotência e proteção contra replay;

\- rate limiting, filas, retry com backoff e dead-letter para integrações;

\- consentimento, opt-out, templates aprovados e minimização de dados;

\- nenhum token, senha ou dado sensível em URLs, mensagens ou logs;

\- auditoria de envio, entrega, falha e reprocessamento.



\## FASE 7 — INTELIGÊNCIA



Bloqueios mínimos:



\- dashboards e relatórios respeitando organização, unidade e permissões;

\- exportações com minimização de dados, autorização, rastreabilidade e expiração quando aplicável;

\- IA sem autorização para alterar dados críticos automaticamente;

\- revisão humana antes de aplicar recomendações de IA;

\- proteção contra prompt injection, vazamento de dados e exposição de informações entre tenants;

\- logs de prompts, respostas e decisões sem armazenar segredos desnecessários;

\- alertas com controle de acesso e prevenção de vazamento em notificações.



\# 91. PROTOCOLO FORMAL DE AUDITORIA



Antes de uma auditoria, executar o fluxo da \`saas-intelligence-auditor\` na ordem definida pela skill:



1. Verificar a integridade da skill.

2. Ler a autorização runtime.

3. Ler \`PROJECT_STATUS\`, \`VALIDATION_STATE\`, \`COVERAGE\` e \`REGRESSION_LEDGER\`.

4. Localizar \`RESUME_FROM\`.

5. Executar discovery e mapeamento de módulos.

6. Reconstruir a lógica de negócio.

7. Definir testes funcionais e de segurança.

8. Executar os testes e validar evidências.

9. Avaliar stage gates, invariantes e validação mecânica.

10. Criar checkpoint e registrar o próximo \`RESUME_FROM\`.



Estados de confiança obrigatórios:



\`DISCOVERED\` → \`VERIFIED\` → \`TESTED\` → \`VALIDATED\`



Nunca promover um requisito diretamente de \`DISCOVERED\` para \`VALIDATED\`.



Um módulo somente pode ser marcado como concluído quando recursos, fluxos críticos, regras de negócio e controles de segurança estiverem testados, com evidências completas, gates aprovados e validador mecânico sem violações.



Auditoria e correção são atividades separadas. A auditoria não deve modificar código, banco ou dados destrutivamente sem autorização explícita para correção. Após qualquer correção, executar reteste e registrar nova evidência.



\# 92. CLASSIFICAÇÃO E TRATAMENTO DE ACHADOS



\- Crítico: bloqueia imediatamente a fase, release e produção. Corrigir e retestar.

\- Alto: bloqueia a fase e a produção. Corrigir antes de avançar.

\- Médio: exige correção planejada, teste de mitigação e aceite formal do risco antes de avançar.

\- Baixo: registrar no backlog de segurança, atribuir responsável e prazo.



Nenhum achado pode ser encerrado apenas com justificativa textual. O encerramento exige correção, mitigação comprovada ou aceite formal de risco com responsável, prazo e impacto documentados.



\# 93. CONTROLES CONTÍNUOS



Em toda alteração do projeto, verificar:



\- dependências novas, versões, licença e vulnerabilidades conhecidas;

\- exposição de secrets, tokens, chaves ou dados pessoais;

\- mudanças em permissões, escopo de tenant e filtros de consulta;

\- validação server-side e proteção contra entradas maliciosas;

\- logs sem senhas, tokens, credenciais ou dados excessivos;

\- migrations reversíveis ou com plano de recuperação;

\- testes de autorização e regressão dos fluxos críticos;

\- backup, restore e observabilidade afetados pela mudança;

\- documentação atualizada e evidência anexada ao checkpoint.



Não fazer deploy com testes de segurança obrigatórios falhando, findings Críticos ou Altos abertos, evidências ausentes, isolamento de tenant não comprovado ou secrets expostos.



\# 94. CRITÉRIOS DE PRONTO SEGURO



Uma fase ou módulo só estará pronto quando:



1. O escopo e os dados estiverem classificados.

2. A modelagem de ameaças e a matriz de permissões estiverem revisadas.

3. O backend aplicar autenticação e autorização server-side.

4. Os testes positivos, negativos, de abuso e de regressão estiverem executados.

5. As operações críticas gerarem auditoria adequada.

6. Os arquivos, secrets, sessões, tokens e integrações estiverem protegidos.

7. O isolamento por organização e unidade estiver comprovado.

8. Os achados tiverem tratamento conforme a severidade.

9. A revisão do \`saas-security-architect-pro\` estiver registrada.

10. A auditoria do \`saas-intelligence-auditor\` estiver validada.

11. O checkpoint, as evidências, o risco residual e o plano de rollback estiverem documentados.



A palavra \`CONCLUIDO\` somente pode ser usada para um ciclo de auditoria após relatório final, checkpoint final e metadados de fechamento validados. Homologação e deploy exigem autorização própria e não podem ser inferidos automaticamente a partir da auditoria.



\# 95. RESPOSTA A INCIDENTES



Preparar procedimento para:



\- detectar e classificar incidentes;

\- preservar evidências sem sobrescrevê-las;

\- revogar sessões, tokens, URLs e credenciais comprometidas;

\- conter o impacto por organização, unidade ou integração;

\- avaliar dados pessoais afetados e obrigações da LGPD;

\- corrigir a causa raiz e executar retestes;

\- documentar linha do tempo, decisões, impacto e ações preventivas;

\- realizar post-mortem sem alterar ou apagar a trilha de auditoria.



\# 96. REGRA FINAL DE SEGURANÇA



Nenhuma funcionalidade deve ser considerada pronta apenas porque funciona no cenário feliz.



Para cada recurso, provar também:



\- quem pode acessar;

\- quem não pode acessar;

\- quais dados podem ser vistos;

\- quais dados devem ser ocultados;

\- como entradas maliciosas são rejeitadas;

\- como ações são auditadas;

\- como falhas são contidas;

\- como o sistema é recuperado;

\- como a correção será validada novamente.



Segurança não é uma etapa final deste projeto. É um critério obrigatório de passagem em todas as etapas.
