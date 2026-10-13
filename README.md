# LeadPulse — Plataforma Inteligente de Prospecção de Leads com Google Maps + Gemini

Plataforma profissional de inteligência comercial, prospecção e vendas para desenvolvedores web e agências que oferecem criação e modernização de websites para empresas locais.

---

## 1. Visão Geral e Objetivo

O **LeadPulse** transforma pesquisas locais no Google Maps em um processo comercial estruturado e previsível. A plataforma combina:
1. **Google Maps Platform — Places API (New)**: Pesquisa oficial geográfica por cidade, estado e segmento.
2. **Conformidade Estrita com Termos de Serviço**: Zero scraping, sem retenção em lote de dados do Places; fluxo de enriquecimento independente verificado pelo usuário.
3. **Auditoria Técnica de Websites com SSRF-Guard**: Diagnóstico de falhas reais (falta de HTTPS, ausência de viewport mobile, carregamento lento, falta de botão WhatsApp).
4. **Google Gemini Flash AI (@google/genai)**: Assistente comercial no servidor para criação de mensagens para WhatsApp/E-mail, quebra de objeções e propostas comerciais completas.
5. **CRM Comercial & Funil de Vendas**: Quadro Kanban nas 11 etapas do processo de vendas, tarefas de follow-up, gestão de faturamento contratado vs. recebido.
6. **Dashboard Executivo de Alta Conversão**: Identidade visual inspirada em painéis comerciais modernos (vermelho-alaranjado `#E84A2E`, números de 34–48px, gráficos suaves com Recharts).

---

## 2. Paleta de Cores e Identidade Visual

- **Vermelho-alaranjado principal:** `#E84A2E`
- **Laranja de destaque:** `#FF7043`
- **Fundo principal:** `#F4F5F7`
- **Superfícies dos cartões:** `#FFFFFF`
- **Texto principal:** `#191919`
- **Texto secundário:** `#747780`
- **Bordas suaves:** `#E6E7EB`
- **Resultados positivos / Sucesso:** `#169B62`
- **Atenção:** `#E6A23C`
- **Erros / Perdas:** `#D94841`

---

## 3. Arquitetura e Tecnologias

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript (strict mode), Tailwind CSS.
- **Animações e Gráficos:** Framer Motion (respeito a `prefers-reduced-motion`), Recharts, Lucide React.
- **Banco de Dados & Persistência:** Prisma ORM com SQLite para desenvolvimento local imediato zero-configuração; migrações prontas para PostgreSQL e Supabase com Row Level Security (RLS).
- **Inteligência Artificial:** SDK oficial `@google/genai` utilizando o modelo `gemini-3.8-flash` (configurável via `GEMINI_MODEL`).
- **Segurança:** Proteção estrita contra SSRF com validação de IP e resolução DNS para auditoria de websites; validação de entradas; rate limiting e isolamento de chaves secretas no servidor.

---

## 4. Guia Rápido de Instalação e Execução

### Pré-requisitos
- Node.js 18+ (recomendado Node.js 20+)
- npm 9+

### Passos

1. **Clonar e instalar dependências:**
   ```bash
   cd d:/procurador
   npm install
   ```

2. **Configurar variáveis de ambiente:**
   Copie o arquivo de exemplo:
   ```bash
   cp .env.example .env
   ```

3. **Inicializar o banco de dados e dados demonstrativos:**
   ```bash
   npx prisma db push
   node prisma/seed.js
   ```

4. **Executar em modo desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse no navegador: `http://localhost:3000`

---

## 5. Configuração das APIs Externas

### Google Maps Platform
1. Crie ou selecione um projeto no [Google Cloud Console](https://console.cloud.google.com/).
2. Ative as APIs:
   - **Places API (New)**
   - **Maps JavaScript API**
3. Crie duas chaves de API:
   - **Chave de Servidor (`GOOGLE_MAPS_PLACES_SERVER_KEY`)**: Restrita à **Places API (New)** e ao endereço IP do servidor de produção.
   - **Chave de Navegador (`NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY`)**: Restrita à **Maps JavaScript API** e aos domínios HTTP referrers do seu frontend.
4. O identificador de uso e rastreamento oficial configurado no cliente é `gmp_git_agentskills_v1`.

### Google Gemini AI
1. Obtenha uma chave no [Google AI Studio](https://aistudio.google.com/).
2. Defina no arquivo `.env`:
   ```env
   GEMINI_API_KEY=sua_chave_aqui
   GEMINI_MODEL=gemini-3.8-flash
   ```
3. O sistema utiliza o SDK oficial `@google/genai` com isolamento completo no backend.

---

## 6. Rotas da Plataforma

- `/dashboard`: Visão geral com 6 cartões métricos dinâmicos, 4 gráficos Recharts e histórico de atividades.
- `/leads/buscar`: Pesquisa geográfica oficial no Google Maps (Places API New) com visualização em mapa e lista.
- `/leads`: CRM de prospects com busca textual, filtros combinados e exportação CSV de dados independentes.
- `/leads/[id]`: Ficha completa do prospect, tarefas, histórico de atividades, notas e atalho para o assistente IA.
- `/pipeline`: Quadro Kanban interativo com as 11 etapas do processo comercial.
- `/vendas`: Registro de contratos, faturamento contratado vs. realizado, controle de pagamentos e ticket médio.
- `/auditorias`: Inspeção técnica de websites em servidores externos com verificação de SSL, mobile e SSRF-Guard.
- `/ia`: Assistente comercial Gemini — gerador de mensagens para WhatsApp/E-mail, análise de oportunidades, quebra de objeções e propostas em Markdown.
- `/tarefas`: Follow-ups diários, lembretes e agendamentos.
- `/relatorios`: Análise aprofundada de conversão por nicho e faturamento auditável.
- `/configuracoes`: Teste em tempo real de conexão com as APIs e monitor de cotas.
- `/login` e `/cadastro`: Fluxo de autenticação e proteção de rotas.
- `/termos` e `/privacidade`: Políticas de conformidade, divulgação dos provedores e termos LGPD.

---

## 7. Testes Automatizados

Para executar os testes de conformidade, pontuação e segurança SSRF:
```bash
npm test
```
Resultados cobertos:
- Verificação de mitigação contra SSRF (bloqueio de `127.0.0.1`, `169.254.169.254`, redes RFC 1918).
- Cálculo transparente de pontuação de oportunidade de leads.
- Conformidade com as políticas do Google Maps Platform (rastreamento `gmp_git_agentskills_v1`, rotulagem de websites).
