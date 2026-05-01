# FinanceAI — Documentação

## Índice

1. [Visão geral](#1-visão-geral)
2. [Autenticação](#2-autenticação)
3. [API Reference](#3-api-reference)
4. [Componentes](#4-componentes)
5. [Hooks](#5-hooks)
6. [Services](#6-services)
7. [Tipos](#7-tipos)
8. [Utilitários](#8-utilitários)
9. [Design System](#9-design-system)
10. [Integração com Gemini](#10-integração-com-gemini)

---

## 1. Visão geral

FinanceAI é um SPA financeiro construído com Next.js 15 (App Router). O usuário se autentica, registra transações de receita e despesa, visualiza relatórios interativos e obtém análises personalizadas via Gemini AI.

### Rotas da aplicação

| Rota            | Acesso      | Descrição                                          |
| --------------- | ----------- | -------------------------------------------------- |
| `/`             | Público     | Redireciona para `/dashboard`                      |
| `/login`        | Público     | Login com e-mail/senha ou Google                   |
| `/register`     | Público     | Criação de conta                                   |
| `/dashboard`    | Autenticado | Visão geral financeira do período                  |
| `/transactions` | Autenticado | Listagem, criação, edição e exclusão de transações |
| `/reports`      | Autenticado | Gráficos de evolução financeira                    |
| `/ai`           | Autenticado | Análise IA e chat com Gemini                       |

---

## 2. Autenticação

### Provedores

- **Credentials** — e-mail e senha com hash bcrypt (rounds: 12)
- **Google OAuth** — requer `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`

### Estratégia de sessão

JWT armazenado em cookie. O token carrega `id`, `email` e `name`. Não há tabela de sessões ativas no banco.

### Proteção de rotas

O arquivo `src/middleware.ts` intercepta todas as requisições (exceto assets estáticos e rotas `/api`). Usuários não autenticados tentando acessar rotas do dashboard são redirecionados para `/login`. Usuários autenticados tentando acessar `/login` ou `/register` são redirecionados para `/dashboard`.

### Registro de conta

`POST /api/auth/register`

```json
{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "minhasenha123"
}
```

Validação: `name` mínimo 2 chars, `email` válido, `password` mínimo 6 chars. Retorna `409` se o e-mail já existir.

---

## 3. API Reference

Todas as rotas autenticadas verificam a sessão via `auth()` do NextAuth e retornam `401` se não houver sessão válida.

---

### `GET /api/transactions`

Lista transações paginadas do usuário autenticado.

**Query params**

| Parâmetro | Tipo                  | Padrão | Descrição                |
| --------- | --------------------- | ------ | ------------------------ |
| `page`    | number                | `1`    | Página atual             |
| `limit`   | number                | `20`   | Itens por página         |
| `type`    | `INCOME` \| `EXPENSE` | —      | Filtro por tipo          |
| `start`   | ISO string            | —      | Data inicial (inclusiva) |
| `end`     | ISO string            | —      | Data final (inclusiva)   |

**Resposta `200`**

```json
{
  "transactions": [...],
  "total": 42,
  "page": 1,
  "limit": 20
}
```

---

### `POST /api/transactions`

Cria uma transação.

**Body**

```json
{
    "title": "Supermercado",
    "amount": 230.5,
    "type": "EXPENSE",
    "category": "Alimentação",
    "date": "2026-04-01",
    "description": "Compra semanal",
    "source": "MANUAL"
}
```

| Campo         | Tipo                                   | Obrigatório | Descrição                 |
| ------------- | -------------------------------------- | ----------- | ------------------------- |
| `title`       | string                                 | Sim         | Descrição da transação    |
| `amount`      | number                                 | Sim         | Valor positivo            |
| `type`        | `INCOME` \| `EXPENSE`                  | Sim         | Tipo                      |
| `category`    | string                                 | Sim         | Categoria                 |
| `date`        | string (YYYY-MM-DD)                    | Sim         | Data da transação         |
| `description` | string                                 | Não         | Observação livre          |
| `source`      | `MANUAL` \| `JSON` \| `PDF` \| `EXCEL` | Não         | Origem (padrão: `MANUAL`) |

**Resposta `201`** — objeto `Transaction` criado.

---

### `PUT /api/transactions/:id`

Atualiza parcialmente uma transação existente. Todos os campos do body são opcionais. Retorna `404` se a transação não pertencer ao usuário autenticado.

---

### `DELETE /api/transactions/:id`

Remove uma transação. Retorna `404` se não pertencer ao usuário autenticado.

**Resposta `200`**

```json
{ "success": true }
```

---

### `POST /api/ai`

Ponto único para interações com o Gemini. O campo `action` determina o comportamento.

#### `action: "analyze"`

Busca as transações do período, envia ao Gemini e salva o resultado em `AiAnalysis`.

**Body**

```json
{
    "action": "analyze",
    "startDate": "2026-04-01",
    "endDate": "2026-04-30"
}
```

**Resposta `200`**

```json
{
    "summary": "Texto do resumo financeiro...",
    "tips": ["Dica 1", "Dica 2", "Dica 3", "Dica 4"]
}
```

#### `action: "chat"`

Envia uma mensagem para o Gemini com contexto da análise e histórico da conversa.

**Body**

```json
{
    "action": "chat",
    "message": "Onde posso economizar mais?",
    "analysisContext": "Resumo da análise anterior...",
    "history": [
        { "role": "user", "parts": "Primeira mensagem" },
        { "role": "model", "parts": "Resposta anterior" }
    ]
}
```

**Resposta `200`**

```json
{ "response": "Texto da resposta do Gemini..." }
```

---

## 4. Componentes

### Design System (`components/ui/`)

#### `Button`

```tsx
<Button
  variant="primary" | "ghost" | "danger" | "teal"
  size="sm" | "md" | "lg"
  loading={boolean}
  icon={ReactNode}
  iconRight={ReactNode}
  fullWidth={boolean}
  disabled={boolean}
  onClick={handler}
>
  Label
</Button>
```

#### `Card`

```tsx
<Card
  variant="glass" | "solid" | "elevated"
  accentBar="brand" | "success" | "teal" | "none"
  padding={string | number}
  style={CSSProperties}
  className={string}
  onClick={handler}
>
  {children}
</Card>
```

#### `Badge`

```tsx
<Badge
  variant="success" | "danger" | "warning" | "brand" | "teal" | "neutral"
  dot={boolean}
>
  Texto
</Badge>
```

#### `Modal`

```tsx
<Modal
  onClose={handler}
  maxWidth={440}
  accentBar="brand" | "success" | "teal" | "none"
  ariaLabel="Descrição acessível"
>
  {children}
</Modal>
```

Fecha automaticamente com `Escape` e clique no backdrop. Bloqueia scroll do `body` enquanto aberto.

#### `FilterBar`

```tsx
<FilterBar
  options={[{ value: "ALL", label: "Todas" }, ...]}
  active="ALL"
  onChange={(value) => setFilter(value)}
/>
```

#### `TypeToggle`

Toggle visual entre `INCOME` e `EXPENSE`.

```tsx
<TypeToggle value={form.type} onChange={(type) => onFormChange({ type })} />
```

#### `TransactionIcon`

Ícone colorido de seta para cima/baixo baseado no tipo.

```tsx
<TransactionIcon type="INCOME" | "EXPENSE" size={36} borderRadius="var(--radius-md)" />
```

#### `PageHeader`

```tsx
<PageHeader
    title={ReactNode}
    subtitle="Texto secundário"
    label="Rótulo pequeno acima"
    actions={
        <>
            <Button>A</Button>
            <Button>B</Button>
        </>
    }
/>
```

#### `EmptyState`

```tsx
<EmptyState
    icon={ReactNode}
    title="Nenhum resultado"
    description="Texto explicativo opcional"
/>
```

#### `LoadingSpinner`

```tsx
<LoadingSpinner size={16} label="Carregando..." centered={true} height={200} />
```

#### `Pagination`

```tsx
<Pagination
    page={1}
    total={42}
    pageSize={15}
    onPageChange={(page) => setPage(page)}
/>
```

Não renderiza nada se `total <= pageSize`.

#### `AlertBanner`

```tsx
<AlertBanner message="Mensagem de erro" variant="danger" | "success" | "warning" />
```

---

### Transactions (`components/transactions/`)

#### `TransactionTable`

Tabela desktop com colunas ordenáveis (título, categoria, data, valor). Recebe `sortColumn`, `sortDirection` e `onSort` para controle externo da ordenação.

#### `TransactionCardList`

Lista mobile de transações. Mesmo contrato de dados que `TransactionTable`.

#### `TransactionModal`

Modal de criação/edição de transação. Contém `TypeToggle`, campos de formulário e validação básica (`title`, `amount`, `category` obrigatórios).

#### `ImportModal`

Modal com opções de importação (JSON, Excel, PDF). Cada opção dispara um `<input type="file">` oculto.

---

### Dashboard (`components/dashboard/`)

#### `StatsGrid`

Renderiza 3 `StatCard` (Receitas, Gastos, Saldo). Em loading, exibe skeletons.

#### `StatCard`

Card individual de métrica com valor, label, ícone e descrição. Cores configuráveis via props.

#### `PeriodFilter`

Barra de filtro de período com `FilterBar` e inputs de data customizada quando `activeFilter === "custom"`.

#### `DashboardBottomGrid`

Grid 2 colunas com `CategoryExpenseList` e `RecentTransactionsList`. Colapsa para 1 coluna abaixo de 780px.

---

### Reports (`components/reports/`)

#### `MainChartCard`

Card principal com controles de tipo de gráfico e período, mais o `ChartRenderer`.

#### `ChartRenderer`

Delega a renderização para um dos 5 sub-componentes baseado em `chartType`: `BarVariant`, `LineVariant`, `AreaVariant`, `PieVariant`, `ScatterVariant`.

#### `BalanceEvolutionCard`

Gráfico de área da evolução do saldo mês a mês.

#### `CategoryBreakdownCard`

Pizza de gastos por categoria com legenda lateral.

---

### AI (`components/ai/`)

#### `NewAnalysisCard`

Formulário de configuração da análise (período, atalhos de data, botão de análise).

#### `AnalysisResultCard`

Exibe `summary` e array de `tips` retornados pelo Gemini.

#### `ChatArea`

Container do chat com scroll automático, estado vazio e indicador de digitação (`TypingDots`).

#### `ChatMessage`

Bolha de mensagem com suporte a Markdown via `react-markdown`. Estilos distintos para `user` e `assistant`.

#### `ChatInputBar`

Textarea com auto-resize, envio por `Enter` (nova linha com `Shift+Enter`) e botão de envio.

---

## 5. Hooks

### `useTransactions()`

Gerencia o estado completo da página de transações: listagem paginada, filtros, modal de criação/edição, modal de importação e operações CRUD.

**Retorna**

```ts
{
  transactions: Transaction[]
  total: number
  page: number
  filter: FilterType
  loading: boolean
  setPage: (p: number) => void
  setFilter: (f: FilterType) => void
  refetch: () => void
  showModal: boolean
  showImport: boolean
  editingId: string | null
  form: TransactionFormData
  saving: boolean
  importError: string
  openCreate: () => void
  openEdit: (t: Transaction) => void
  closeModal: () => void
  openImport: () => void
  closeImport: () => void
  updateForm: (updates: Partial<TransactionFormData>) => void
  handleSave: () => Promise<void>
  handleDelete: (id: string) => Promise<void>
  handleFileImport: (e: ChangeEvent<HTMLInputElement>, type: "json" | "excel" | "pdf") => void
}
```

---

### `useDashboardStats({ activeFilter, customStart, customEnd })`

Busca métricas do dashboard quando os parâmetros de filtro mudam.

**Retorna** `{ stats: DashboardStats | null, loading: boolean, refetch: () => void }`

---

### `useDateRange({ initialFilter? })`

Estado do filtro de período com cálculo automático do intervalo de datas.

**Retorna**

```ts
{
  activeFilter: DateFilterKey
  customStart: string
  customEnd: string
  range: DateRange
  periodLabel: string
  setActiveFilter: (key: DateFilterKey) => void
  setCustomStart: (v: string) => void
  setCustomEnd: (v: string) => void
}
```

---

### `useAiPage()`

Estado completo da página de IA: configuração de período, execução da análise, histórico do chat e envio de mensagens.

---

### `useSort<T>(initialColumn?, initialDirection?)`

Ordenação genérica de tabelas.

```ts
const { sortColumn, sortDirection, handleSort, getSortedItems } =
    useSort<TransactionSortColumn>();
```

`getSortedItems(items, getKey)` retorna uma cópia ordenada do array sem mutar o original.

---

### `useApi<T>(fn, options?)`

Hook genérico para operações assíncronas com estado de loading e erro.

```ts
const { data, loading, error, execute, reset } = useApi(myAsyncFn, {
    onSuccess: (data) => {},
    onError: (error) => {},
});
```

---

### `useDebounce<T>(value, delay?)`

Retorna o valor debounced após `delay` ms (padrão: 300ms).

---

### `useLocalStorage<T>(key, initialValue)`

Persiste estado no `localStorage`. Retorna `[value, setValue, removeValue]`.

---

### `useDropdown()`

Gerencia estado de dropdown com fechamento automático ao clicar fora.

```ts
const { isOpen, toggle, close, ref } = useDropdown();
// ref deve ser atribuído ao container do dropdown
```

---

### `useFormatCurrency()`

Memoiza as funções de formatação de moeda.

```ts
const { format, compact, withSign } = useFormatCurrency();
format(1234.56); // "R$ 1.234,56"
compact(12500); // "R$13k"
withSign(-500); // "-R$ 500,00"
```

---

## 6. Services

Todos herdam de `ApiService` que fornece:

- `get<T>(path, params?)` — GET com query string automática
- `post<T>(path, body)` — POST com JSON
- `put<T>(path, body)` — PUT com JSON
- `delete<T>(path)` — DELETE
- `buildUrl(path, params)` — monta URL com origem dinâmica (funciona em SSR e CSR)

Erros HTTP são convertidos em `ApiError` com `status` e `body`.

### `TransactionService`

| Método                        | Descrição                                         |
| ----------------------------- | ------------------------------------------------- |
| `fetchTransactions(params)`   | Listagem paginada com filtros                     |
| `createTransaction(form)`     | Cria e retorna `MutationResult<Transaction>`      |
| `updateTransaction(id, form)` | Atualiza e retorna `MutationResult<Transaction>`  |
| `deleteTransaction(id)`       | Remove e retorna `MutationResult`                 |
| `bulkCreate(items, source)`   | Cria N transações e retorna `{ created, failed }` |

### `DashboardService`

| Método                                               | Descrição                                                       |
| ---------------------------------------------------- | --------------------------------------------------------------- |
| `fetchStats(activeFilter, customStart?, customEnd?)` | Calcula métricas client-side a partir das transações do período |

### `AnalysisService`

| Método                                     | Descrição                                                         |
| ------------------------------------------ | ----------------------------------------------------------------- |
| `analyze({ startDate, endDate })`          | Dispara análise Gemini e retorna `MutationResult<AnalysisResult>` |
| `chat(message, analysisContext, messages)` | Envia mensagem ao chat Gemini                                     |

---

## 7. Tipos

### `Transaction`

```ts
interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    category: string;
    date: string; // ISO string
    description?: string;
    source?: "MANUAL" | "JSON" | "PDF" | "EXCEL";
}
```

### `TransactionFormData`

```ts
interface TransactionFormData {
    title: string;
    amount: string; // string para controle de input
    type: TransactionType;
    category: string;
    date: string; // YYYY-MM-DD
    description: string;
}
```

### `DashboardStats`

```ts
interface DashboardStats {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    byCategory: Record<string, number>;
    recent: Transaction[];
}
```

### `AnalysisResult`

```ts
interface AnalysisResult {
    summary: string;
    tips: string[];
}
```

### `ChatMessage`

```ts
interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}
```

### `PaginatedResponse<T>`

```ts
interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}
```

### `MutationResult<T>`

```ts
interface MutationResult<T = void> {
    success: boolean;
    data?: T;
    error?: string;
}
```

### `DateFilterKey`

```ts
type DateFilterKey =
    | "all"
    | "this_month"
    | "last_month"
    | "3_months"
    | "6_months"
    | "this_year"
    | "last_year"
    | "custom";
```

### `AiShortcut`

```ts
type AiShortcut =
    | "last_month"
    | "this_month"
    | "3_months"
    | "6_months"
    | "year";
```

---

## 8. Utilitários

### `formatters.ts`

| Função                   | Assinatura                                             | Descrição                                         |
| ------------------------ | ------------------------------------------------------ | ------------------------------------------------- |
| `formatCurrency`         | `(value: number) => string`                            | Formata em BRL — `"R$ 1.234,56"`                  |
| `formatCurrencyCompact`  | `(value: number) => string`                            | Compacto para eixos — `"R$12k"`, `"R$1.5M"`       |
| `formatCurrencyWithSign` | `(value: number) => string`                            | Com sinal explícito — `"+R$ 100,00"`              |
| `capitalize`             | `(str: string) => string`                              | Primeira letra maiúscula                          |
| `getFirstName`           | `(fullName?: string) => string`                        | Extrai primeiro nome, retorna `"você"` se vazio   |
| `getInitials`            | `(name?: string) => string`                            | Até 2 iniciais maiúsculas, retorna `"U"` se vazio |
| `parseSafeDate`          | `(dateStr: string) => Date`                            | Parse sem bug de timezone (fixa horário em 12:00) |
| `groupBy`                | `<T>(items: T[], key: keyof T) => Record<string, T[]>` | Agrupa por chave                                  |
| `sumBy`                  | `<T>(items: T[], key: keyof T) => number`              | Soma campo numérico                               |
| `sortBy`                 | `<T>(items: T[], key: keyof T, direction?) => T[]`     | Ordena sem mutar                                  |
| `isPositiveNumber`       | `(value: string) => boolean`                           | Valida número positivo                            |
| `hasMinLength`           | `(value: string, min: number) => boolean`              | Valida comprimento mínimo                         |
| `truncate`               | `(value: string, maxLength: number) => string`         | Trunca com reticências                            |
| `normalizeSearch`        | `(value: string) => string`                            | Remove acentos, lowercase                         |

---

### `dateRange.ts`

| Função                                           | Descrição                                                                 |
| ------------------------------------------------ | ------------------------------------------------------------------------- |
| `getDateRange(filter, customStart?, customEnd?)` | Calcula `{ start, end }` para cada `DateFilterKey`                        |
| `formatPeriodLabel(filter, range)`               | Texto legível do período — `"abril de 2026"`, `"01/04/2026 – 30/04/2026"` |
| `toLocalISO(date)`                               | Converte `Date` para string ISO local sem shift de UTC                    |
| `dateRangeToParams(range)`                       | Converte `DateRange` para query params `{ start?, end? }`                 |
| `applyAiShortcut(shortcut)`                      | Retorna `{ start, end }` em `YYYY-MM-DD` para atalhos da página de IA     |

---

## 9. Design System

### Tokens de cor (CSS custom properties)

```css
/* Backgrounds */
--bg-base, --bg-surface, --bg-card, --bg-card-hover, --bg-elevated, --bg-overlay

/* Bordas */
--border, --border-subtle, --border-strong, --border-glow

/* Marca */
--accent-brand, --accent-brand-light, --accent-brand-glow
--accent-teal, --accent-teal-light, --accent-teal-glow

/* Semânticas */
--color-success, --color-success-light, --color-success-bg, --color-success-border
--color-danger,  --color-danger-light,  --color-danger-bg,  --color-danger-border
--color-warning, --color-warning-light, --color-warning-bg, --color-warning-border
--color-info,    --color-info-light,    --color-info-bg,    --color-info-border

/* Texto */
--text-primary, --text-secondary, --text-muted, --text-dim, --text-on-brand

/* Gradientes */
--gradient-brand, --gradient-brand-h, --gradient-success, --gradient-danger, --gradient-card

/* Sombras */
--shadow-sm, --shadow-md, --shadow-lg, --shadow-xl, --shadow-brand, --shadow-teal

/* Espaçamento */
--space-1 (0.25rem) a --space-12 (3rem)

/* Bordas arredondadas */
--radius-sm (6px), --radius-md (10px), --radius-lg (14px),
--radius-xl (18px), --radius-2xl (24px), --radius-full (9999px)

/* Tipografia */
--text-xs a --text-4xl
--font-display (Bricolage Grotesque)
--font-body (Inter)
--font-mono (JetBrains Mono)

/* Transições */
--transition-fast (100ms), --transition-base (180ms),
--transition-slow (320ms), --transition-spring (500ms)
```

### Classes utilitárias (`globals.css`)

| Classe                                       | Descrição                           |
| -------------------------------------------- | ----------------------------------- |
| `.card-glass`                                | Card com blur, borda sutil e sombra |
| `.btn-primary`                               | Botão com gradiente brand           |
| `.btn-ghost`                                 | Botão transparente com borda        |
| `.btn-danger`                                | Botão vermelho semântico            |
| `.skeleton`                                  | Animação shimmer para loading       |
| `.animate-fade-in`                           | Fade + slide up (350ms)             |
| `.animate-fade-in-scale`                     | Fade + scale + slide (450ms)        |
| `.animate-pulse-glow`                        | Pulso de brilho brand               |
| `.animate-pulse-teal`                        | Pulso de brilho teal                |
| `.animate-spin`                              | Rotação contínua                    |
| `.delay-75/.delay-150/.delay-225/.delay-300` | Delays de animação em cascade       |
| `.font-mono`                                 | Fonte monospace com tabular-nums    |
| `.font-display`                              | Fonte display (Bricolage Grotesque) |
| `.tx-table-wrapper`                          | Visível em desktop (>640px)         |
| `.tx-cards-wrapper`                          | Visível em mobile (≤640px)          |

### Tokens TypeScript (`design-tokens.ts`)

```ts
import { colors, gradients, shadows, space, radii, text, fonts, transitions } from "@/styles/design-tokens";

// Helper semântico para transações
const { color, bg, border } = transactionColorTokens("INCOME");

// Tokens de ícones pré-configurados
import { iconTokens } from "@/styles/design-tokens";
<SectionHeader {...iconTokens.brand} />
```

### Responsividade

| Breakpoint  | Comportamento                             |
| ----------- | ----------------------------------------- |
| ≥ 1600px    | Sidebar com 260px                         |
| 1025–1599px | Sidebar com 220px                         |
| 769–1024px  | Sidebar colapsada (60px, apenas ícones)   |
| ≤ 768px     | Sidebar oculta, TopBar mobile visível     |
| ≤ 640px     | Tabela substituída por cards de transação |
| ≤ 480px     | Grid de categorias vira coluna única      |

---

## 10. Integração com Gemini

### Modelo

`gemini-3-flash-preview` com `temperature: 0.7` e `maxOutputTokens: 2048`.

### `analyzeFinances(transactions, startDate, endDate)`

Recebe até 50 transações e retorna JSON com `summary` (texto) e `tips` (array de strings). O prompt instrui o modelo a responder **apenas em JSON válido**, sem markdown. Em caso de falha no parse, o texto bruto vai para `summary`.

### `chatWithGemini(message, analysisContext, history)`

Usa `model.startChat()` com:

- **`systemInstruction`** contendo o contexto da análise como consultor financeiro
- **`history`** deduplado e validado (primeiro item deve ser `role: "user"`)

O `AnalysisService.toGeminiHistory()` faz a conversão do formato interno `ChatMessage[]` para o formato Gemini (`{ role: "user" | "model", parts: string }[]`), removendo duplicatas consecutivas do mesmo papel.

### Persistência

Cada análise bem-sucedida é salva em `AiAnalysis` com `userId`, `startDate`, `endDate`, `summary` e `tips`. O histórico de análises não é exposto via UI atualmente, mas os dados ficam disponíveis no banco.
