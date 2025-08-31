⚠️ Escopo é lei: Só altere o que foi solicitado.

Não refatore, mover, excluir ou “melhorar” partes fora do escopo sem aprovação.

Mantenha mudanças pequenas, atômicas e rastreáveis.

0) Stack oficial

Front-end: Vite + React + TypeScript, Tailwind CSS, shadcn/ui.

Gerenciador/Runtime: Bun (preferencial).

Back-end (quando presente): Hono (ou Fastify), TypeScript, Drizzle ORM, PostgreSQL (prod), SQLite opcional (dev).

Validação: Zod (schemas compartilháveis).

Auth: JWT (jose), hash argon2.

Logs: pino. Segurança: helmet, CORS, rate limit.

1) Escopo & Convenções de PR

Cada PR deve resolver 1 objetivo claro.

Proibido mudanças “drive-by” (ex.: renomear arquivos, trocar ESLint/Prettier, mexer em layout global) sem ticket.

Se algo precisar de refactor fora do escopo, crie ticket separado e proponha plano.

Checklist do PR:

 Limite de arquivos modificados condizente com o escopo.

 Testes (quando aplicável) passando.

 Sem console.log leftover (exceto logs controlados).

 Sem segredos no commit.

 Documentação atualizada (README, .env.example, comentários).

Commits: Conventional Commits
feat:, fix:, docs:, refactor:, chore:, test:, perf:.
Evite “WIP” e mensagens genéricas.

2) Padrões de Código (TypeScript/React)

TypeScript estrito: sem any implícito; use tipos e utilitários (ReturnType, Pick, Omit etc.).

Componentes:

Funções puras, sem side effects no render.

Extrair hooks para lógica (ex.: useThing()), componentes para UI.

Props tipadas; evite React.FC.

Acessibilidade: use rótulos, aria-*, foco visível; shadcn/ui já ajuda, mas valide.

Estado: prefira local; use context/zustand apenas quando necessário.

Estilo: Tailwind utilitário + cn() para classes condicionais. Evite CSS global.

Imports: absolutos se configurado, ordenados, sem ciclos.

Nomes: descritivos; arquivos kebab-case.tsx, componentes PascalCase.

3) UI/UX & shadcn/ui

Consistência: use tokens/utilitários já existentes (cores, espaços, radius).

Componentes shadcn: não bifurcar sem motivo; se precisar, crie wrapper local.

Responsivo: verifique breakpoints padrão do Tailwind.

Não altere global styles, fontes ou tailwind.config.ts sem aprovação.

4) Acesso a Dados & API (quando houver backend)

Camadas:

Roteador (Hono/Fastify) fino → Service (regras) → Repository/DB (Drizzle).

Validação: sempre com Zod no boundary (entrada/saída).

Erros: padronize { success: false, error: { code, message } }; nada de stack vazar.

Auth:

Hash: argon2;

JWT: jose, curto para access, opcional refresh;

Rotas sensíveis protegidas por middleware.

CORS: restrito a origens confiáveis no .env.

Logs: pino (info/error); sem prints soltos.

Migrations: Drizzle (não executar manualmente SQL sem revisão).

NUNCA commitar dados reais ou segredos.

5) Segurança

.env: use .env.example como referência. Segredos só em .env.

Headers: helmet.

Rate limit em rotas de auth e público.

Uploads: validar tipo/tamanho; preferir armazenamento externo.

Dependências: não adicionar libs sem justificativa; evitar libs não mantidas.

6) Performance

Front:

Split por rota, lazy para componentes pesados.

Memorizar (useMemo, useCallback) quando houver ganho real.

Evitar re-render em listas (keys estáveis, item components).

Back:

Índices adequados; N+1? resolva no SQL/joins.

Endpoints idempotentes quando fizer sentido.

Padrões HTTP corretos (cache headers, status codes).

7) Testes & Qualidade

Testes de smoke para rotas críticas.

Unitários para services/puras; e2e quando possível.

Lint: siga eslint.config.js. Format: Prettier.

CI (quando houver): rodar lint + testes. PR sem verde não mergeia.

8) Estrutura sugerida (resumo)
/src (front)
/server (back)
  /src
    /config/env.ts
    /db/{drizzle.ts,schema.ts}
    /modules/{auth,user,health}/...
    app.ts, routes.ts, index.ts
/drizzle
.env.example

9) Fluxo de Dev (Bun)
bun install

# dev
bun run dev:web         # Vite
bun run dev:api         # Hono/Fastify

# build
bun run build           # web + api (conforme scripts)

10) Diretrizes para colaboração de IA (Cascade/Windsurf)

Obedeça o escopo do ticket.

Sempre listar: 1) arquivos que pretende criar/alterar; 2) diffs planejados; 3) riscos.

Produza plano passo a passo e aguarde confirmação antes de modificar.

Não renomear/mover pastas, trocar lint/config, ou mexer em design system sem instrução explícita.

Para back-end: respeitar stack definida (Hono/Fastify + Drizzle + Zod + jose + argon2).

Para front-end: usar shadcn/ui e Tailwind, sem alterar tema global.

Ao finalizar, resumir mudanças e anexar checklist do PR (seção 1).

11) O que NÃO pode sem aprovação

Alterar tailwind.config.ts, eslint.config.js, tsconfig*, vite.config.ts.

Trocar bibliotecas centrais (roteador, ORM, UI).

Refatorar arquitetura, mover diretórios, renomear componentes globais.

Mudar design tokens, tipografia, cores, espaçamentos globais.

Adicionar novas dependências “por conveniência”.

12) Comunicação

Dúvida → ticket/comentário. Explique motivação, impacto e risco.

Antes de “melhorias gerais”, pergunte. Qualquer mudança fora do pedido será revertida.

Resumo: Faça o mínimo necessário com excelência, validado por testes e documentação, sem expandir escopo. Segurança, consistência e rastreabilidade acima de “atalhos”.