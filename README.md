# Mundo Mágico LiLi

Aplicativo interativo infantil com IA, construído com React (frontend) e .NET (backend seguro).

## Arquitetura de Segurança

Este projeto implementa uma arquitetura segura onde:
- **A chave da API do Gemini NUNCA é exposta no cliente**
- O backend .NET atua como gateway seguro entre o frontend e a API do Google Gemini
- Todas as chamadas de IA passam pelo backend

## Pré-requisitos

- **Node.js** (v18+)
- **.NET 8 SDK**

## Executando o Projeto

### 1. Configurar o Backend (.NET)

```bash
# Navegar para a pasta do backend
cd backend/LiliMagic.Api

# Configurar a chave da API
# Copie o arquivo de exemplo e adicione sua chave
cp appsettings.Development.json.example appsettings.Development.json

# Edite appsettings.Development.json e substitua YOUR_GEMINI_API_KEY_HERE pela sua chave
# NUNCA commite este arquivo com a chave real!

# Executar o backend
dotnet run
```

O backend estará disponível em `http://localhost:5000` (porta pode variar, verifique o output).

### 2. Configurar o Frontend (React)

```bash
# Na raiz do projeto
npm install

# Criar arquivo .env.local com a URL do backend
echo "VITE_API_BASE_URL=http://localhost:5000" > .env.local

# Executar o frontend
npm run dev
```

O frontend estará disponível em `http://localhost:3000`.

## Estrutura do Projeto

```
Mundo_Magico_LiLi/
├── backend/
│   └── LiliMagic.Api/          # Backend .NET seguro
│       ├── Controllers/        # Endpoints da API
│       ├── DTOs/               # Objetos de transferência de dados
│       └── Services/           # Serviços (Gemini, etc.)
├── modules/                    # Módulos do frontend React
│   ├── chat/                   # Módulo de chat com a Mimi
│   └── studio/                 # Studio de arte mágica
├── core/                       # Núcleo compartilhado
└── ...config files
```

## Segurança

- A chave `GEMINI_API_KEY` é armazenada apenas no servidor backend
- O arquivo `appsettings.Development.json` está no `.gitignore`
- Use o Secret Manager do .NET para produção: `dotnet user-secrets set "GEMINI_API_KEY" "sua-chave"`

## Endpoints da API

- `POST /api/ai/chat` - Chat com a Mimi
- `POST /api/ai/tts` - Text-to-Speech
- `POST /api/studio/inspiration` - Gerar inspiração criativa
- `POST /api/studio/generate-image` - Gerar imagem mágica

## Desenvolvimento

Para contribuir com o projeto:

1. Nunca exponha chaves de API no código do frontend
2. Sempre passe chamadas de IA pelo backend
3. Mantenha o `.gitignore` atualizado para proteger arquivos sensíveis
