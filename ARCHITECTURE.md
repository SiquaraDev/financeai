# FinanceAI — Arquitetura de Software

## Estrutura de diretórios

```
src/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Grupo de rotas públicas
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/            # Grupo de rotas protegidas
│   │   ├── dashboard/
│   │   │   ├── page.tsx        # Server Component — busca sessão
│   │   │   └── DashboardClient.tsx  # Client Component — estado
│   │   ├── transactions/page.tsx
│   │   ├── reports/page.tsx
│   │   └── ai/page.tsx
│   └── api/                    # Route Handlers
│       ├── ai/route.ts
│       ├── auth/
│       └── transactions/
│
├── components/
│   ├── ui/                     # Design system — componentes base
│   │   ├── index.ts            # Barrel export único
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── FilterBar.tsx
│   │   ├── TypeToggle.tsx      # Toggle INCOME/EXPENSE
│   │   └── ...
│   ├── ai/                     # Componentes de IA
│   ├── auth/                   # Componentes de autenticação
│   ├── dashboard/              # Componentes do dashboard
│   ├── layout/                 # Sidebar, TopBar, NavLinks
│   ├── reports/                # Gráficos e cards de relatórios
│   └── transactions/           # Tabela, cards, modais
│
├── hooks/                      # React hooks (estado + efeitos)
│   ├── index.ts
│   ├── useApi.ts               # Hook genérico para async ops
│   ├── useSort.ts              # Hook genérico para ordenação
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   ├── useDateRange.ts         # Estado do filtro de período
│   ├── useDashboardStats.ts    # Estado do dashboard
│   ├── useTransactions.ts      # Estado da página de transações
│   ├── useAiPage.ts            # Estado da página de IA
│   └── useReportsData.ts
│
├── services/                   # Camada de acesso a dados
│   ├── ApiService.ts           # Base HTTP client (abstract)
│   ├── TransactionService.ts   # CRUD de transações
│   ├── DashboardService.ts     # Métricas do dashboard
│   └── AnalysisService.ts      # Chamadas de IA
│
├── styles/
│   └── design-tokens.ts        # Tokens de cor, espaço, sombra
│
├── types/
│   ├── base.ts                 # Tipos de domínio
│   ├── categories.ts           # Categorias de transação
│   ├── hooks.ts                # Tipos de retorno dos hooks
│   └── services.ts             # Interfaces dos serviços (ISP)
│
├── utils/                      # Funções puras utilitárias
│   ├── formatters.ts           # Moeda, string, array, validação
│   └── dateRange.ts            # Cálculo e formatação de datas
│
└── lib/                        # Integrações externas
    ├── auth.ts                 # NextAuth config
    ├── prisma.ts               # Prisma client singleton
    ├── gemini.ts               # Google Generative AI
    └── formatters.ts           # Shim de retrocompatibilidade
```

---

## Fluxo de dados

```
Page (Server Component)
  └── Page Client (Client Component)
        └── Hook (estado + efeitos)
              └── Service (HTTP + lógica de negócio)
                    └── ApiService (fetch + error handling)
                          └── /api/route.ts (Next.js handler)
                                └── Prisma / Gemini
```

---

## Como adicionar uma nova feature

### Novo tipo de relatório

1. Adicionar variante em `components/reports/ChartRenderer.tsx` → `VARIANTS`
2. Adicionar botão em `components/reports/ChartControls.tsx` → `CHART_TYPES`

### Nova categoria de transação

1. Editar `src/types/categories.ts` → `TRANSACTION_CATEGORIES`

### Nova chamada de API

1. Criar método em `src/services/TransactionService.ts` (ou serviço relevante)
2. O hook correspondente consome o método — zero mudança em componentes

### Novo componente UI

1. Criar em `src/components/ui/NomeComponente.tsx`
2. Exportar em `src/components/ui/index.ts`
