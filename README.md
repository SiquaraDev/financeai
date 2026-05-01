# FinanceAI

Aplicativo de controle financeiro pessoal com análise inteligente via **Gemini Flash**.

## Stack

| Camada         | Tecnologia                                     |
| -------------- | ---------------------------------------------- |
| Framework      | Next.js 15 (App Router + Turbopack)            |
| Linguagem      | TypeScript (strict mode)                       |
| Estilização    | Tailwind CSS v4 + CSS custom properties        |
| Banco de dados | PostgreSQL + Prisma ORM                        |
| Autenticação   | NextAuth.js v5 (credentials + Google OAuth)    |
| IA             | Google Gemini Flash (`gemini-3-flash-preview`) |
| Gráficos       | Recharts                                       |
| Importação     | xlsx (Excel), JSON nativo                      |

## Funcionalidades

- Autenticação via e-mail/senha e Google OAuth
- Dashboard com métricas do período e gráfico de gastos por categoria
- CRUD completo de transações com paginação, filtros e ordenação
- Importação em lote via JSON, Excel (.xlsx) e PDF
- Relatórios interativos com 5 tipos de gráfico (barras, linhas, área, pizza, dispersão)
- Filtros de período flexíveis (mês atual, mês anterior, 3/6 meses, ano, personalizado)
- Análise financeira com Gemini por período personalizado
- Chat de dúvidas financeiras com o Gemini após análise

## Pré-requisitos

- Node.js >= 18.18
- PostgreSQL >= 14
- Conta no [Google AI Studio](https://aistudio.google.com) para a chave Gemini

## Setup

### 1. Clonar e instalar dependências

```bash
git clone <repo-url>
cd financeai
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Preencha o `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/financeai"
NEXTAUTH_SECRET="gere com: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""        # opcional — OAuth Google
GOOGLE_CLIENT_SECRET=""    # opcional — OAuth Google
GEMINI_API_KEY=""          # obrigatório — Google AI Studio
```

### 3. Banco de dados

```bash
# Desenvolvimento (sem histórico de migrations)
npm run db:push

# Produção (recomendado — mantém histórico)
npm run db:migrate
```

### 4. Iniciar o servidor

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## Scripts disponíveis

| Script                | Descrição                                 |
| --------------------- | ----------------------------------------- |
| `npm run dev`         | Servidor de desenvolvimento com Turbopack |
| `npm run build`       | Build de produção                         |
| `npm run start`       | Servidor de produção                      |
| `npm run lint`        | Lint com ESLint                           |
| `npm run db:push`     | Sincroniza schema sem migrations          |
| `npm run db:migrate`  | Cria e aplica migration                   |
| `npm run db:studio`   | Abre Prisma Studio                        |
| `npm run db:generate` | Gera Prisma Client                        |

## Formatos de importação

### JSON

```json
[
    {
        "title": "Supermercado",
        "amount": 230.5,
        "type": "EXPENSE",
        "category": "Alimentação",
        "date": "2026-04-01"
    }
]
```

### Excel (.xlsx)

| titulo       | valor | tipo    | categoria   | data       |
| ------------ | ----- | ------- | ----------- | ---------- |
| Salário      | 4200  | INCOME  | Salário     | 2026-04-01 |
| Supermercado | 350   | EXPENSE | Alimentação | 2026-04-03 |

Colunas aceitas: `titulo`/`title`, `valor`/`amount`, `tipo`/`type`, `categoria`/`category`, `data`/`date`.

## Categorias disponíveis

**Gastos:** Alimentação, Transporte, Moradia, Saúde, Lazer, Educação, Vestuário, Tecnologia, Viagens, Outros

**Receitas:** Salário, Freelance, Investimentos, Aluguel, Presente, Outros

## Variáveis CSS

O tema é controlado por custom properties definidas em `src/app/globals.css`. As principais:

```css
--bg-base, --bg-surface, --bg-card        /* Backgrounds */
--accent-brand, --accent-teal             /* Cores de destaque */
--color-success, --color-danger           /* Semânticas */
--text-primary, --text-secondary          /* Tipografia */
--radius-*, --space-*, --shadow-*         /* Utilitários */
```

Tokens com nomes são exportados em `src/styles/design-tokens.ts` para uso em componentes TypeScript.
