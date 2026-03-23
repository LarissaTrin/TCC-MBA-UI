# Kanban Project Manager — Front-end 

Interface web do sistema de gerenciamento de projetos no estilo Kanban. Desenvolvida em Next.js 15 + React 19 + TypeScript.

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 15 (App Router) |
| UI | React 19 + MUI v7 |
| Linguagem | TypeScript |
| Autenticação | NextAuth.js v5 |
| Validação | Zod |
| Drag & Drop | dnd-kit |
| HTTP | apiClient (fetch com Bearer token automático) |
| Testes unitários/BDD | Jest + jest-cucumber + React Testing Library |
| Testes E2E | Playwright |

---

## Pré-requisitos

- Node.js 18+
- Back-end rodando em `http://localhost:8000` (para testes E2E)

---

## Como Rodar

```bash
# Instalar dependências (primeira vez)
npm install

# Modo desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

---

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do front-end:

```env
NEXTAUTH_SECRET=sua_chave_secreta
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Testes

### Jest — Unitários e BDD

Roda **95 testes** sem precisar do back-end (usa Mock Service Worker para simular a API).

```bash
# Rodar todos os testes uma vez
npm test

# Modo watch (re-executa ao salvar arquivos)
npm run test:watch

# Relatório de cobertura de código
npm run test:coverage
```

**O que é testado:**

| Pasta | Conteúdo |
|-------|----------|
| `test/common/utils/` | `cardMapper`, `pickColor`, `timelineUtils` |
| `test/common/schemas/` | Schemas Zod: auth, card, boardFilter |
| `test/features/` | BDD Gherkin: login, registro, filtros, CRUD cards |
| `test/components/` | `Button`, `DroppableContainer`, `useBoardFilters`, `CardTasksSection` |

### Playwright — E2E Visual

Testes de ponta a ponta que abrem o browser real. Grava vídeo de cada execução.

```bash
# Rodar testes E2E (browser visível)
npm run test:e2e

# Interface visual de debug
npm run test:e2e:ui
```

**Pré-requisito:** back-end e front-end devem estar rodando.

**Configurar credenciais de teste:**

```env
TEST_EMAIL=seu@email.com
TEST_PASSWORD=suasenha
TEST_PROJECT_ID=1
```

**Instalar browsers (primeira vez):**

```bash
npx playwright install chromium
```

---

## Arquitetura

```
App Router (src/app/)
    └── Páginas
            └── components/modules/   (funcionalidades por domínio)
                    └── components/widgets/  (componentes reutilizáveis)
                            └── common/      (services, models, schemas, utils, hooks)
```

---

## Estrutura de Arquivos

```
front_end/
├── src/
│   ├── app/                    # Páginas (App Router)
│   │   ├── (auth)/             # Login, registro, recuperação de senha
│   │   └── project/[id]/       # Board, timeline, configurações do projeto
│   ├── components/
│   │   ├── modules/            # Componentes por domínio (board, card, sidebar…)
│   │   └── widgets/            # Componentes genéricos (Button, Modal, Input…)
│   └── common/
│       ├── services/           # apiClient + serviços por domínio
│       ├── models/             # Tipos/interfaces de domínio
│       ├── schemas/            # Schemas Zod (validação de forms)
│       ├── utils/              # Funções utilitárias
│       └── hooks/              # React hooks customizados
├── test/
│   ├── features/               # BDD: .feature + .steps.tsx
│   ├── components/             # React Testing Library
│   ├── common/                 # Testes unitários (utils, schemas)
│   ├── mocks/                  # MSW handlers + factories de dados
│   │   ├── msw/                # handlers.ts, server.ts, setupMswForTest.ts
│   │   └── factories/          # buildCard, buildUser, buildSection…
│   └── e2e/                    # Playwright specs
│       ├── auth/               # login.spec.ts, register.spec.ts
│       ├── board/              # board.spec.ts
│       └── card/               # card.spec.ts
├── jest.config.ts
├── jest.setup.ts
├── jest.environment.ts         # Ambiente customizado jsdom + MSW v2
└── playwright.config.ts
```

---

## Rotas Principais

| Rota | Descrição |
|------|-----------|
| `/login` | Autenticação |
| `/register` | Cadastro |
| `/forgot-password` | Recuperação de senha |
| `/dashboard` | Lista de projetos do usuário |
| `/project/[id]?tab=board` | Board Kanban do projeto |
| `/project/[id]?tab=timeline` | Timeline do projeto |
| `/project/[id]?tab=settings` | Configurações do projeto |
