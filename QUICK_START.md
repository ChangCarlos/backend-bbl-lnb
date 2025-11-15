# 🚀 Guia de Início Rápido

## Instalação em 5 Minutos

### Pré-requisitos
- Node.js 20+
- Docker Desktop
- pnpm (`npm install -g pnpm`)

### Clone e Instale
```bash
git clone https://github.com/ChangCarlos/backend-bbl-lnb.git
cd backend-bbl-lnb
pnpm install
```

### Configure o .env
```bash
cp .env.example .env
```

**Obtenha sua API Key:**
1. Acesse: https://allsportsapi.com
2. Cadastre-se gratuitamente
3. Copie sua API Key do dashboard
4. Cole no `.env`:
```env
BASKETBALL_API_KEY="sua-key-aqui"
```

### Inicie o Banco
```bash
docker compose up -d
pnpm prisma migrate dev
```

### Rode a API
```bash
pnpm dev
```

**Pronto!** 

- API: http://localhost:3000
- Docs: http://localhost:3000/api/docs

---

## Checklist de Primeiro Uso

### 1. Crie um usuário ADMIN
```bash
POST http://localhost:3000/api/auth/register
Body:
{
  "name": "Admin",
  "email": "admin@email.com",
  "password": "admin123",
  "role": "ADMIN"
}
```

### 2. Faça login e copie o token
```bash
POST http://localhost:3000/api/auth/login
Body:
{
  "email": "admin@email.com",
  "password": "admin123"
}

# Copie o "accessToken" da resposta
```

### 3. Sincronize os dados (NESTA ORDEM!)

#### 3.1 Países
```bash
POST http://localhost:3000/api/countries/sync
Headers: { Authorization: "Bearer SEU_TOKEN_AQUI" }
```

#### 3.2 Ligas (exemplo: EUA para NBA)
```bash
POST http://localhost:3000/api/leagues/sync?countryId=5
Headers: { Authorization: "Bearer SEU_TOKEN_AQUI" }
```

#### 3.3 Times da NBA
```bash
POST http://localhost:3000/api/teams/sync/766
Headers: { Authorization: "Bearer SEU_TOKEN_AQUI" }
```

#### 3.4 Fixtures (jogos)
```bash
POST http://localhost:3000/api/fixtures/sync
Headers: { Authorization: "Bearer SEU_TOKEN_AQUI" }
Body:
{
  "leagueId": "766",
  "from": "2024-11-01",
  "to": "2024-11-30"
}
```

#### 3.5 Standings (classificação)
```bash
POST http://localhost:3000/api/standings/sync/766
Headers: { Authorization: "Bearer SEU_TOKEN_AQUI" }
```

---

## Testar a API

### Ver todos os jogos
```bash
GET http://localhost:3000/api/fixtures
```

### Ver classificação da NBA
```bash
GET http://localhost:3000/api/standings/league/766
```

### Ver times
```bash
GET http://localhost:3000/api/teams?page=1&limit=10
```

---

## Documentação Completa

Acesse o Swagger para explorar todos os endpoints:
```
http://localhost:3000/api/docs
```

---

## Problemas Comuns

### "Port 5432 already in use"
Você já tem PostgreSQL rodando. Pare-o ou mude a porta no `docker-compose.yml`.

### "Invalid API Key"
Verifique se colocou a key correta no `.env` e reiniciou a aplicação.

### Banco de dados vazio após sync
Verifique os logs do terminal. Se houver erros de API, sua key pode estar inválida ou você atingiu o limite de requisições.

---

## Cron Jobs Automáticos

Após a sincronização inicial, o sistema mantém os dados atualizados automaticamente:

- **Fixtures**: Atualiza a cada 1 hora
- **Standings**: Atualiza diariamente à meia-noite

Você pode ver os logs no terminal:
```
[BasketballCronService] Iniciando sync automático de fixtures...
[BasketballCronService] Liga NBA (766): 45 fixtures sincronizadas
```

---

**Pronto para começar!** 
