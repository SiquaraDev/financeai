# FinanceAI — Arquitetura

## Visão geral

O projeto segue uma arquitetura em camadas com separação clara de responsabilidades. O Next.js App Router atua como cola entre o frontend React e as API Routes que expõem dados do PostgreSQL via Prisma.

```
Browser → React (Client Components)
            └── Hooks (estado + side effects)
                  └── Services (HTTP + lógica de negócio)
                        └── /api/* (Next.js Route Handlers)
                              └── Prisma → PostgreSQL
                                  Gemini API (IA)
```

---

## Estrutura de diretórios

```
src/
├── app/
│   ├── (auth)/                     # Rotas públicas — sem layout de dashboard
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx              # Fundo com orbs animados
│   ├── (dashboard)/                # Rotas protegidas — requer sessão JWT
│   │   ├── layout.tsx              # Valida sessão, renderiza Sidebar + TopBar
│   │   ├── dashboard/
│   │   │   ├── page.tsx            # Server Component — busca sessão
│   │   │   └── DashboardClient.tsx # Client Component — gerencia estado
│   │   ├── transactions/page.tsx
│   │   ├── reports/page.tsx
│   │   └── ai/page.tsx
│   ├── api/
│   │   ├── ai/route.ts             # POST — analyze | chat (Gemini)
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts
│   │   │   └── register/route.ts
│   │   └── transactions/
│   │       ├── route.ts            # GET (lista paginada) | POST (criar)
│   │       └── [id]/route.ts       # PUT (atualizar) | DELETE (excluir)
│   ├── layout.tsx                  # Root layout — fontes, providers
│   └── page.tsx                    # Redireciona para /dashboard
│
├── components/
│   ├── ui/                         # Design system — átomos reutilizáveis
│   │   ├── index.ts                # Barrel export único
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── FilterBar.tsx
│   │   ├── TypeToggle.tsx
│   │   ├── TransactionIcon.tsx
│   │   └── ...
│   ├── ai/                         # Chat e análise com Gemini
│   ├── auth/                       # Login, registro, OAuth
│   ├── dashboard/                  # Stats, gráfico de categorias, recentes
│   ├── icons/index.tsx             # Todos os SVGs inline centralizados
│   ├── layout/                     # Sidebar, TopBar, NavLinks
│   ├── providers/                  # SessionProvider, UserProvider
│   ├── reports/                    # Gráficos e cards de relatórios
│   └── transactions/               # Tabela, cards mobile, modais
│
├── context/
│   └── UserContext.ts              # Contexto de sessão do usuário (nome, iniciais)
│
├── hooks/                          # Lógica de estado — nunca acessa API diretamente
│   ├── index.ts
│   ├── useApi.ts                   # Hook genérico para operações assíncronas
│   ├── useSort.ts                  # Ordenação de tabelas
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   ├── useDropdown.ts
│   ├── useDateRange.ts             # Estado do filtro de período
│   ├── useDashboardStats.ts
│   ├── useTransactions.ts          # Estado completo da página de transações
│   ├── useAiPage.ts                # Estado da página de IA
│   ├── useReportsData.ts
│   └── useFormatCurrency.ts
│
├── services/                       # Acesso a dados — única camada que faz fetch
│   ├── ApiService.ts               # Classe base abstrata com GET/POST/PUT/DELETE
│   ├── TransactionService.ts
│   ├── DashboardService.ts
│   └── AnalysisService.ts
│
├── styles/
│   └── design-tokens.ts            # Tokens tipados para uso em componentes TS
│
├── types/
│   ├── index.ts                    # Re-exporta tudo
│   ├── base.ts                     # Tipos de domínio (Transaction, DashboardStats…)
│   ├── categories.ts               # Constantes de categorias
│   ├── hooks.ts                    # Tipos de retorno dos hooks
│   └── services.ts                 # Interfaces ISP dos serviços
│
├── utils/
│   ├── index.ts
│   ├── formatters.ts               # Moeda, strings, arrays — funções puras
│   └── dateRange.ts                # Cálculo e formatação de intervalos de data
│
└── lib/                            # Integrações de infraestrutura
    ├── auth.ts                     # NextAuth config (JWT + callbacks)
    ├── prisma.ts                   # Singleton do PrismaClient
    ├── gemini.ts                   # analyzeFinances() + chatWithGemini()
    └── formatters.ts               # Shim de retrocompatibilidade
```

---

## Camadas e responsabilidades

### Pages (`app/`)

Podem ser Server ou Client Components. Server Components fazem autenticação e passam dados serializáveis para Client Components. Nunca contêm lógica de estado.

### Hooks (`hooks/`)

Toda lógica de estado e side effects fica aqui. Hooks consomem Services e expõem estado + handlers para as páginas. Nunca fazem `fetch` diretamente — isso é responsabilidade dos Services.

### Services (`services/`)

Única camada que realiza chamadas HTTP. Herdam de `ApiService` (classe base abstrata) que centraliza `buildUrl`, tratamento de erros e os métodos `get`, `post`, `put`, `delete`. Retornam `MutationResult<T>` para operações de escrita, garantindo que erros nunca "explodam" nos hooks.

### API Routes (`app/api/`)

Route Handlers do Next.js. Validam entrada com Zod, verificam sessão via `auth()`, e acessam o banco via Prisma. São o único ponto que conhece o Prisma e o Gemini.

### Design System (`components/ui/`)

Componentes atômicos sem lógica de negócio. Estilizados com CSS custom properties do tema. Exportados via barrel (`index.ts`) para imports limpos.

---

## Autenticação

O middleware (`src/middleware.ts`) protege todas as rotas do dashboard verificando o JWT do NextAuth. A estratégia é `jwt` — sem sessões em banco. O token carrega `id`, `email` e `name` do usuário.

```
Requisição → middleware.ts
               ├── Token válido + rota pública → redireciona /dashboard
               ├── Token inválido + rota privada → redireciona /login
               └── Caso normal → NextResponse.next()
```

---

## Modelo de dados (Prisma)

```
User
 ├── accounts[]       (OAuth providers)
 ├── sessions[]
 ├── transactions[]
 └── aiAnalyses[]

Transaction
 ├── userId
 ├── title, amount, type (INCOME | EXPENSE)
 ├── category, date, description
 └── source (MANUAL | JSON | PDF | EXCEL)

AiAnalysis
 ├── userId
 ├── startDate, endDate
 ├── summary (Text)
 └── tips (Json)
```

Índices: `(userId, date)` e `(userId, type)` em Transaction para as queries de dashboard e relatórios.

---

## Integração com Gemini

Dois pontos de contato em `src/lib/gemini.ts`:

- **`analyzeFinances(transactions, startDate, endDate)`** — gera resumo e dicas em JSON estruturado. O resultado é salvo em `AiAnalysis`.
- **`chatWithGemini(message, analysisContext, history)`** — conversa multi-turno com contexto da análise injetado via `systemInstruction`.

A API Route `POST /api/ai` despacha para um desses dois com base no campo `action` (`"analyze"` | `"chat"`).

---

## Decisões de design

| Decisão                                         | Justificativa                                                                                 |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------- |
| CSS custom properties no lugar de Tailwind puro | Permite tema escuro consistente sem purge e facilita animações com variáveis                  |
| `ApiService` como classe base                   | Centraliza `buildUrl`, headers e tratamento de erro HTTP sem duplicação                       |
| `MutationResult<T>` em vez de throw             | Hooks não precisam de try/catch; o componente recebe `{ success, data, error }`               |
| Server Component no topo do dashboard           | `auth()` só roda server-side; o Client Component filho recebe a sessão como prop serializável |
| `parseSafeDate` em todas as datas de transação  | Evita bug de fuso horário ao fixar o horário em 12:00 ao fazer parse de strings `YYYY-MM-DD`  |

---

## Como adicionar features

### Novo tipo de gráfico

1. Adicionar variante em `components/reports/ChartRenderer.tsx` → objeto `VARIANTS`
2. Adicionar botão em `components/reports/ChartControls.tsx` → array `CHART_TYPES`

### Nova categoria de transação

1. Editar `src/types/categories.ts` → `TRANSACTION_CATEGORIES`

### Nova chamada de API

1. Criar método em `src/services/<Serviço>.ts`
2. O hook correspondente consome o método — zero mudança nos componentes

### Novo componente UI

1. Criar em `src/components/ui/<Nome>.tsx`
2. Exportar em `src/components/ui/index.ts`

### Nova rota protegida

1. Criar página em `src/app/(dashboard)/<rota>/page.tsx`
2. Adicionar entrada em `src/components/layout/NavLinks.tsx` → array `NAV_ITEMS`
