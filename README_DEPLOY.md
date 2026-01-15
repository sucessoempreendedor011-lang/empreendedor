# iPhone Store - Guia de Deploy

## Opção 1: Deploy na Railway (Recomendado)

### Pré-requisitos
- Conta no [Railway.app](https://railway.app)
- Repositório GitHub com este código

### Passos

1. **Conecte seu repositório GitHub no Railway**
   - Acesse railway.app
   - Clique em "New Project"
   - Selecione "Deploy from GitHub"
   - Autorize e selecione este repositório

2. **Configure as variáveis de ambiente**
   - No painel do Railway, vá para "Variables"
   - Adicione as seguintes variáveis:

```
DATABASE_URL=mysql://user:password@host:3306/database
JWT_SECRET=sua_chave_secreta_aqui
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
```

3. **Deploy automático**
   - Railway fará deploy automático quando você fazer push para a branch principal

---

## Opção 2: Deploy na Turbocloud (cPanel)

### Pré-requisitos
- Acesso SSH ou cPanel na Turbocloud
- Node.js 18+ instalado no servidor
- Banco de dados MySQL disponível

### Passos

1. **Clone o repositório**
```bash
cd /home/seu_usuario/public_html
git clone https://github.com/seu_usuario/iphone_store.git
cd iphone_store
```

2. **Instale as dependências**
```bash
pnpm install
# ou
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais
nano .env
```

Adicione:
```
DATABASE_URL=mysql://user:password@localhost:3306/iphone_store
JWT_SECRET=sua_chave_secreta_aqui
NODE_ENV=production
PORT=3000
```

4. **Build do projeto**
```bash
pnpm build
```

5. **Inicie o servidor**
```bash
pnpm start
```

6. **Configure PM2 para manter o servidor rodando**
```bash
npm install -g pm2
pm2 start dist/index.js --name "iphone_store"
pm2 startup
pm2 save
```

7. **Configure Nginx/Apache como proxy reverso**

Para Nginx:
```nginx
server {
    listen 80;
    server_name seu_dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Opção 3: Deploy na Hostinger

### Pré-requisitos
- Acesso SSH na Hostinger
- Node.js 18+ disponível

### Passos

Siga os mesmos passos da Turbocloud (Opção 2), mas:

1. Acesse via SSH: `ssh usuario@seu_dominio.com`
2. Navegue até o diretório de hospedagem
3. Clone e configure conforme descrito acima

---

## Variáveis de Ambiente Necessárias

```
# Banco de dados
DATABASE_URL=mysql://user:password@host:3306/database

# JWT
JWT_SECRET=sua_chave_secreta_muito_segura

# OAuth (se usar autenticação)
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# Duttyfy (para pagamentos PIX)
DUTTYFY_API_KEY=sua_chave_duttyfy
DUTTYFY_API_URL=https://api.duttyfy.com

# Ambiente
NODE_ENV=production
PORT=3000
```

---

## Troubleshooting

### Erro: "Cannot find module"
```bash
pnpm install
pnpm build
```

### Erro: "Database connection failed"
- Verifique a `DATABASE_URL`
- Certifique-se de que o banco de dados está acessível
- Teste a conexão: `mysql -u user -p -h host`

### Erro: "Port already in use"
```bash
# Mude a porta no .env
PORT=3001
```

---

## Estrutura do Projeto

```
iphone_store/
├── client/              # Frontend React
│   ├── public/          # Arquivos estáticos (incluindo pagamento.html)
│   └── src/             # Código React
├── server/              # Backend Node.js/Express
│   ├── payment.ts       # Integração Duttyfy
│   └── routers.ts       # Rotas tRPC
├── drizzle/             # Schema do banco de dados
└── package.json         # Dependências
```

---

## Suporte

Para dúvidas ou problemas, entre em contato com o suporte da sua hospedagem.
