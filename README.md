# FinanceAI

Aplicativo de controle financeiro pessoal com análise inteligente via **Gemini 3 Flash**.

## Stack

- **Next.js 15** (App Router + Turbopack)
- **TypeScript**
- **Tailwind CSS v4**
- **Prisma** + PostgreSQL
- **NextAuth.js v5** (credentials + Google OAuth)
- **Gemini 3 Flash** (`gemini-3-flash-preview`)
- **Recharts** (gráficos interativos)
- **xlsx** (importação de Excel)

## Funcionalidades

- Autenticação (e-mail/senha + Google OAuth)
- Dashboard com métricas mensais e gráfico de categorias
- CRUD de transações com paginação e filtros
- Importação de transações via JSON, Excel, PDF ou formulário
- Relatórios interativos com 5 tipos de gráfico (barras, linhas, pizza, área, dispersão)
- Análise financeira com Gemini 3 Flash por período personalizado
- Chat de dúvidas com o Gemini após a análise

## Setup

### 1. Instalar dependências

```bash
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
GOOGLE_CLIENT_ID="seu-client-id"        # opcional
GOOGLE_CLIENT_SECRET="seu-client-secret" # opcional
GEMINI_API_KEY="sua-chave-gemini"
```

### 3. Configurar banco de dados

```bash
# Criar as tabelas
npm run db:push

# Ou usar migrations (recomendado para produção)
npm run db:migrate
```

### 4. Rodar o projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

## Obter a chave Gemini

1. Acesse [Google AI Studio](https://aistudio.google.com)
2. Crie uma API Key
3. Coloque em `GEMINI_API_KEY` no `.env`

> O modelo `gemini-3-flash-preview` requer conta com acesso à preview. Se necessário, use `gemini-2.5-flash` como fallback.

## Estrutura do projeto

```
src/
├── app/
│   ├── (auth)/           # Login e registro
│   ├── (dashboard)/      # Área autenticada
│   │   ├── dashboard/    # Visão geral
│   │   ├── transactions/ # CRUD de transações
│   │   ├── reports/      # Relatórios interativos
│   │   └── ai/           # Análise Gemini + chat
│   └── api/              # API Routes
│       ├── auth/         # NextAuth + registro
│       ├── transactions/ # CRUD API
│       └── ai/           # Gemini API
├── lib/
│   ├── prisma.ts         # Cliente Prisma (singleton)
│   ├── auth.ts           # Configuração NextAuth
│   └── gemini.ts         # Cliente Gemini 3 Flash
└── types/
    └── index.ts          # Tipos TypeScript
```

## Importação de transações

### Formato JSON esperado

```json
[
  {
    "title": "Supermercado",
    "amount": 230.50,
    "type": "EXPENSE",
    "category": "Alimentação",
    "date": "2026-04-01"
  }
]
```

### Formato Excel esperado

| titulo | valor | tipo | categoria | data |
|--------|-------|------|-----------|------|
| Salário | 4200 | INCOME | Salário | 2026-04-01 |

## Nota sobre o Gemini 3 Flash

O Gemini 3 introduz **thought signatures** para conversas multi-turno. O chat da página `/ai` já implementa o envio do histórico corretamente. Para chamadas com function calling, retorne as thought signatures recebidas na resposta anterior.

O parâmetro `thinking_level` pode ser configurado em `src/lib/gemini.ts`:
- `"minimal"` — mais rápido, menor custo
- `"low"` — para chat
- `"medium"` — para análises financeiras (recomendado)
- `"high"` — para análises complexas
