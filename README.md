# 🏀 Basketball API

API REST completa para gerenciamento de dados de basquete, integrada com a [AllSports Basketball API](https://allsportsapi.com). Desenvolvida com NestJS, PostgreSQL e Prisma ORM.

## 📋 Índice

- [Características](#-características)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração da API Externa](#-configuração-da-api-externa)
- [Rodando o Projeto](#-rodando-o-projeto)
- [Documentação da API](#-documentação-da-api)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Funcionalidades](#-funcionalidades)

---

## Características

- ✅ **Autenticação JWT** com refresh tokens
- ✅ **Controle de Acesso** baseado em roles (USER/ADMIN)
- ✅ **Cache em Memória** para otimização de performance
- ✅ **Paginação** em todos os endpoints de listagem
- ✅ **Cron Jobs** para sincronização automática de dados
- ✅ **Documentação OpenAPI/Swagger** interativa
- ✅ **Validação** de dados com class-validator
- ✅ **TypeScript** com tipagem forte
- ✅ **Docker** para PostgreSQL

---

## 🛠 Tecnologias

- **Node.js** v20+
- **NestJS** v11
- **PostgreSQL** 15
- **Prisma ORM** v6
- **Docker** & Docker Compose
- **JWT** para autenticação
- **Swagger** para documentação
- **Cache Manager** para cache
- **Schedule** para cron jobs

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (v20 ou superior)
- [pnpm](https://pnpm.io/) (gerenciador de pacotes)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (para o banco de dados)
- [Git](https://git-scm.com/)

---

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/ChangCarlos/backend-bbl-lnb.git
cd backend-bbl-lnb
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/basketball_db?schema=public"

# JWT
JWT_SECRET="sua-chave-secreta-super-segura-aqui"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="sua-chave-refresh-super-segura-aqui"
JWT_REFRESH_EXPIRES_IN="7d"

# AllSports Basketball API
BASKETBALL_API_KEY="sua-api-key-aqui"
BASKETBALL_API_URL="https://apiv2.allsportsapi.com/basketball/"

# App
NODE_ENV="development"
PORT=3000
```

---

## Configuração da API Externa

A aplicação utiliza a **AllSports Basketball API** para obter dados de jogos, times, ligas, etc.

### Passo a Passo para Obter a API Key:

1. **Acesse o site**: [https://allsportsapi.com](https://allsportsapi.com)

2. **Crie uma conta gratuita**:
   - Clique em "Sign Up" ou "Register"
   - Preencha seus dados (email, nome, senha)
   - Confirme seu email

3. **Obtenha sua API Key**:
   - Faça login no dashboard
   - Vá em "My Account" → "API Key"
   - Copie sua chave API (formato: `abc123def456...`)

4. **Cole no arquivo `.env`**:
   ```env
   BASKETBALL_API_KEY="abc123def456..."
   ```

### Planos Disponíveis:

- **Free Tier**: 260 requisições/hora (ideal para desenvolvimento)
- **Basic**: 2.000 requisições/hora
- **Pro**: 10.000+ requisições/hora

> 💡 **Dica**: O plano gratuito é suficiente para desenvolvimento e testes iniciais.

---

## Rodando o Projeto

### 1. Inicie o banco de dados (Docker)

```bash
docker compose up -d
```

Isso iniciará um container PostgreSQL na porta `5432`.

### 2. Execute as migrações do Prisma

```bash
pnpm prisma migrate dev
```

Isso criará todas as tabelas no banco de dados.

### 3. (Opcional) Visualize o banco com Prisma Studio

```bash
pnpm prisma studio
```

Abre uma interface visual em `http://localhost:5555`.

### 4. Inicie a aplicação

```bash
# Modo desenvolvimento (com hot-reload)
pnpm dev

# Ou modo produção
pnpm build
pnpm start:prod
```

A API estará rodando em: **http://localhost:3000**

---

## 📚 Documentação da API

A documentação interativa Swagger está disponível em:

```
http://localhost:3000/api/docs
```

### Endpoints Principais:

#### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Renovar token

#### Countries (Países)
- `GET /api/countries` - Listar países (com paginação)
- `GET /api/countries/:key` - Buscar país por key
- `POST /api/countries/sync` - Sincronizar países ADMIN

#### Leagues (Ligas)
- `GET /api/leagues` - Listar ligas (com paginação)
- `GET /api/leagues/:key` - Buscar liga por key
- `POST /api/leagues/sync` - Sincronizar ligas ADMIN

#### Teams (Times)
- `GET /api/teams` - Listar times (com paginação)
- `GET /api/teams/:key` - Buscar time por key
- `POST /api/teams/sync/:leagueKey` - Sincronizar times ADMIN

#### Fixtures (Jogos)
- `GET /api/fixtures` - Listar fixtures (filtros + paginação)
- `GET /api/fixtures/:key` - Detalhes de um jogo
- `POST /api/fixtures/sync` - Sincronizar fixtures ADMIN

#### Standings (Classificação)
- `GET /api/standings/league/:key` - Tabela de classificação
- `POST /api/standings/sync/:leagueId` - Sincronizar standings ADMIN

#### H2H (Head to Head)
- `GET /api/h2h/:team1Id/:team2Id` - Confrontos diretos

> Endpoints marcados com **ADMIN** requerem autenticação com role de administrador.

---

## Estrutura do Projeto

```
backend-bbl-lnb/
├── prisma/
│   ├── models/              # Modelos Prisma modulares
│   │   ├── users.prisma
│   │   ├── countries.prisma
│   │   ├── leagues.prisma
│   │   └── ...
│   └── schema.prisma        # Schema principal
├── src/
│   ├── common/              # Recursos compartilhados
│   │   ├── decorators/      # @Public, @Roles, etc.
│   │   ├── guards/          # JWT, Roles guards
│   │   ├── enums/           # UserRole enum
│   │   └── dto/             # DTOs comuns (Pagination)
│   ├── config/              # Configurações
│   │   ├── jwt.config.ts
│   │   ├── basketball-api.config.ts
│   │   └── cache.config.ts
│   ├── modules/
│   │   ├── auth/            # Autenticação
│   │   ├── users/           # Gerenciamento de usuários
│   │   ├── basketball/      # Módulo principal
│   │   │   ├── controllers/ # Controllers REST
│   │   │   ├── services/    # Lógica de negócio
│   │   │   ├── dto/         # Data Transfer Objects
│   │   │   └── interfaces/  # Interfaces TypeScript
│   │   └── prisma/          # Prisma Service
│   ├── app.module.ts        # Módulo raiz
│   └── main.ts              # Bootstrap da aplicação
├── .env                     # Variáveis de ambiente
├── docker-compose.yml       # PostgreSQL container
├── package.json
└── README.md
```

---

## Funcionalidades

### 1. Sistema de Autenticação

```bash
# Registrar usuário normal
POST /api/auth/register
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}

# Registrar administrador
POST /api/auth/register
{
  "name": "Admin",
  "email": "admin@email.com",
  "password": "admin123",
  "role": "ADMIN"
}

# Login
POST /api/auth/login
{
  "email": "admin@email.com",
  "password": "admin123"
}
```

### 2. Sincronização de Dados (Ordem Correta)

Para popular o banco de dados pela primeira vez, execute **nesta ordem**:

```bash
# 1. Sincronizar países
POST /api/countries/sync
Headers: { Authorization: "Bearer <token_admin>" }

# 2. Sincronizar ligas (exemplo: EUA para NBA)
POST /api/leagues/sync?countryId=5
Headers: { Authorization: "Bearer <token_admin>" }

# 3. Sincronizar times da NBA
POST /api/teams/sync/766
Headers: { Authorization: "Bearer <token_admin>" }

# 4. Sincronizar fixtures
POST /api/fixtures/sync
Headers: { Authorization: "Bearer <token_admin>" }
Body: {
  "leagueId": "766",
  "from": "2024-11-01",
  "to": "2024-11-30"
}

# 5. Sincronizar standings
POST /api/standings/sync/766
Headers: { Authorization: "Bearer <token_admin>" }
```

### 3. Cron Jobs Automáticos

Os cron jobs rodam automaticamente:

- **Fixtures**: A cada 1 hora (sincroniza fixtures de todas as ligas cadastradas - período: 2 dias atrás até 7 dias à frente)
- **Standings**: Diariamente à meia-noite (sincroniza tabelas de classificação de todas as ligas cadastradas)

Os cron jobs buscam dinamicamente todas as ligas no banco de dados e sincronizam cada uma individualmente.

Para visualizar os logs:

```bash
pnpm dev
# Procure por logs: [BasketballCronService] ...
```

### 4. Cache

O cache é aplicado automaticamente:

- **Countries/Leagues**: 24 horas
- **Teams**: 12 horas
- **Fixtures**: 5 minutos
- **Standings**: 30 minutos

### 5. Paginação

Todos os endpoints de listagem suportam paginação:

```bash
GET /api/fixtures?page=1&limit=20
GET /api/teams?page=2&limit=50
```

Resposta:

```json
{
  "data": [...],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

---

## Testes

```bash
# Testes unitários
pnpm test

# Testes e2e
pnpm test:e2e

# Cobertura
pnpm test:cov
```

---

## Docker

### Comandos úteis:

```bash
# Iniciar PostgreSQL
docker compose up -d

# Parar PostgreSQL
docker compose down

# Ver logs
docker compose logs -f

# Resetar banco (CUIDADO!)
docker compose down -v
```

---

## Scripts Disponíveis

```bash
pnpm dev           # Modo desenvolvimento
pnpm build         # Build para produção
pnpm start:prod    # Rodar em produção
pnpm format        # Formatar código (Prettier)
pnpm lint          # Lint com ESLint
pnpm prisma:studio # Abrir Prisma Studio
```

---

## Troubleshooting

### Erro: "Port 5432 already in use"

PostgreSQL já está rodando localmente. Pare o serviço ou mude a porta no `docker-compose.yml`.

### Erro: "Invalid API Key"

Verifique se a `BASKETBALL_API_KEY` no `.env` está correta.

### Erro: Migrações falhando

```bash
# Resetar banco (apaga tudo!)
pnpm prisma migrate reset

# Ou aplicar novamente
pnpm prisma migrate dev
```

### Cache não está funcionando

Reinicie a aplicação para limpar o cache em memória.

---

## Licença

Este projeto está sob a licença MIT.

---

## Autor

**Carlos Chang**
- GitHub: [@ChangCarlos](https://github.com/ChangCarlos)

---

## Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

## Suporte

Se encontrar algum problema:

1. Verifique a documentação Swagger: `http://localhost:3000/api/docs`
2. Consulte os logs da aplicação
3. Abra uma issue no GitHub

---

**Feito com ❤️ e ☕**
