# 🐱 Mundo Mágico da LiLi (MCH) — Ecossistema APEX v15.0

[![Status](https://img.shields.io/badge/Status-Estabilizado-success?style=for-the-badge)]()
[![Backend](https://img.shields.io/badge/.NET-8.0-blue?style=for-the-badge&logo=dotnet)]()
[![Frontend](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)]()
[![Engine](https://img.shields.io/badge/Engine-Genesis_v15.0-purple?style=for-the-badge)]()

O **Mundo Mágico da LiLi** é uma plataforma de vanguarda para criatividade digital e interação afetiva, projetada sob o rigor do **Axioma APEX: Correção sobre Velocidade**. O sistema integra um motor de desenho multi-paradigma, uma inteligência artificial cognitiva baseada em Gemini 2.0 e um ecossistema de temas dinâmicos que redefine a experiência de UI/UX para crianças e pais.

---

## 🏛️ Arquitetura do Sistema

O projeto segue o padrão **APEX Polyglot Architecture**, separando domínios de alta performance (Backend C#) de interfaces reativas de alta fidelidade (Frontend TypeScript).

### Mapa de Estrutura de Código

```text
Mundo_Magico_LiLi/
├── backend/                    # CORE BACKEND (.NET 8/9)
│   └── LiliMagic.Api/
│       ├── Controllers/        # Endpoints REST (Auth, AI, Studio)
│       ├── Core/               # Entidades de Domínio e Result Pattern
│       ├── Data/               # Persistência SQLite com EF Core
│       ├── Hubs/               # Sincronização Real-time (SignalR)
│       ├── Migrations/         # Evolução de Schema
│       └── Services/           # Lógica de Negócio (Gemini AI, Repositories)
│
├── core/                       # FRONTEND KERNEL (TypeScript)
│   ├── assets/                 # SVGs e Recursos Estáticos
│   ├── components/             # UI Components (MatrixRain, CustomCursor)
│   ├── ecosystem/              # AppContext e IdentityManager
│   ├── skills/                 # Módulos de Especialidade (QA, UI, UX)
│   ├── theme/                  # ThemeEngine e Registry (APEX Chroma)
│   └── utils/                  # Result Pattern e Normalização
│
├── modules/                    # DOMÍNIOS FUNCIONAIS (Módulos)
│   ├── agenda/                 # Planejamento e Atividades
│   ├── chat/                   # Interface Mimi (Gemini 2.0 AI)
│   ├── library/                # Baú de Artes (Em Manutenção Tática)
│   ├── perfil/                 # Customização e Identidade
│   ├── parent-profile/         # Governança Parental e Temas Elite
│   └── studio/                 # ATELIÊ (O Coração Criativo)
│       ├── engine/             # Motores Raster, Vector e Skeletal
│       ├── hooks/              # Sincronização SignalR (useDrawingSync)
│       └── tools/              # Ferramentas de Pintura e Laboratório
│
└── public/                     # Assets e Loading GIFs
```

---

## 🚀 Funcionalidades de Elite

### 🎨 Ateliê (Studio) v3.2
- **Motor Multi-Engine:** Suporte nativo a pintura Raster, traços Vetoriais e Rigging Esquelético (IK) em uma única interface.
- **Sincronização Real-time:** Colaboração instantânea via SignalR com blindagem de payload de 5MB e auto-reconexão.
- **Galeria de Sonhos:** Sistema de persistência robusto que preserva camadas e metadados estruturais.

### 🎭 Ecossistema de Temas (Chroma Sentinel)
Acesso Universal a **15 temas customizados**, incluindo:
- **Noite Binária:** Imersão Hacker com Matrix Rain e simuladores de terminal.
- **Morfismos Modernos:** Neumorfismo, Glassmorphism e Fluidmorphism de alta fidelidade.
- **Neuro-Inclusão:** Temas como Ragdoll e Abraço Gentil, otimizados para serenidade sensorial.

### 🤖 Inteligência Afetiva (Mimi AI)
- Integração profunda com **Gemini 2.0** para geração de inspiração, diálogos contextuais e análise de humor através das cores da obra.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Propósito |
| :--- | :--- | :--- |
| **Backend** | .NET 8 / C# | API de Missão Crítica e Lógica de Domínio |
| **Persistência** | SQLite + EF Core | Armazenamento de alta performance local |
| **Real-time** | ASP.NET SignalR | Sincronização de traços e cursores remotos |
| **Frontend** | React 19 + Vite | Interface Reativa de Próxima Geração |
| **Estilização** | Tailwind CSS v4 | Design System Atômico e Escalonável |
| **Motion** | Framer Motion | Animações e Micro-interações de 60fps |
| **AI Engine** | Google Gemini 2.0 | Orquestração de Inteligência e Criatividade |

---

## 🗺️ Roadmap de Evolução: Paridade Procreate (v3.5)

Estamos em direção ao estado da arte em ilustração digital:
- [ ] **Capacidade 1:** Shape & Grain Engine (Texturas customizadas de pincel).
- [ ] **Capacidade 2:** Advanced ColorDrop (Preenchimento inteligente com threshold).
- [ ] **Capacidade 3:** Liquify Module (Deformação de malha em tempo real).
- [ ] **Capacidade 4:** Animation Assist (Timeline e Onion Skinning).
- [ ] **Capacidade 5:** Hybrid Vector Editing (Manipulação de pontos Bezier pós-traço).

---

## 📦 Como Iniciar

### Requisitos
- .NET SDK 8.0+
- Node.js 18+ & npm

### Backend
```bash
cd backend/LiliMagic.Api
dotnet run
```

### Frontend
```bash
npm install
npm run dev
```

---

## ❤️ Dedicatória
Este projeto é dedicado à **Alice**, a inspiração por trás de cada linha de código, que transforma pixels em poesia e nos lembra que a tecnologia deve ser, acima de tudo, mágica.

---
*Gerado com excelência técnica por Genesis v15.0 (Meta-Architect).*
