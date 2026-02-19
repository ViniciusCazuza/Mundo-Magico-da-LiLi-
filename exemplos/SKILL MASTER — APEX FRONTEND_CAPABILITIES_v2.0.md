# APEX FRONTEND CAPABILITIES v2.0 — GLOBAL SKILLSET

Este documento codifica as 10 capacidades de frontend desenvolvidas no projeto "Mundo Mágico da LiLi". Estas skills representam padrões arquiteturais e componentes de UX avançados que devem ser reutilizados globalmente.

---

## §1 — CORE ARCHITECTURE

### Skill 1: ThemeEngine (Isolamento de Domínio)
**Conceito:** Sistema de theming que valida permissões de usuário (Role-Based Access Control) antes de carregar ativos.
**Aplicação:** Use para isolar temas "Pro/Admin" de temas "Infantil/Padrão".
**Padrão:** Result Pattern para carregamento seguro.
**Axioma:** Estados ilegais irrepresentáveis (usuário sem permissão não vê o tema).

### Skill 2: useTheme (Contexto Reativo)
**Conceito:** Hook de consumo do ThemeEngine que expõe o estado atual e métodos de troca de tema.
**Aplicação:** Abstração de acesso ao estado global de aparência.
**Padrão:** Composition API / Hook Pattern.

---

## §2 — CREATIVE CODING & PARTICLES

### Skill 3: MatrixRain (Canvas Otimizado)
**Conceito:** Efeito de chuva digital usando Canvas 2D puro e `requestAnimationFrame`.
**Aplicação:** Fundos "Hacker Mode" ou ambientes cibernéticos.
**Performance:** Zero overhead de DOM. Renderização em loop otimizado.

### Skill 4: Nebula (Instanciamento de Partículas)
**Conceito:** Sistema de partículas orgânico que reage ao mouse (repulsão/atração).
**Aplicação:** Backgrounds mágicos, espaciais ou oníricos.
**Técnica:** Instanciamento de classes JS para cada partícula, desenhadas em um único Canvas.

### Skill 5: MagicDust (Feedback Efêmero)
**Conceito:** Sistema de partículas "fire-and-forget" que executa uma animação de celebração e se autodestrói.
**Aplicação:** Feedback de sucesso (conclusão de tarefas, gamification).
**Gerenciamento:** Limpeza automática de memória após a execução.

---

## §3 — DESIGN SYSTEM TÁTIL (NEUMORPHISM/GLASSMORPHISM)

### Skill 6: TactileButton (Neumorphism Kids)
**Conceito:** Botões com aparência física ("soft touch") usando sombras duplas complexas.
**Aplicação:** Interfaces infantis, acessibilidade tátil, brinquedos digitais.
**Estilo:** `box-shadow` inset e outset combinados.

### Skill 7: MagicCard (Glassmorphism Layered)
**Conceito:** Painéis translúcidos com `backdrop-filter: blur` e bordas de vidro.
**Aplicação:** Modais, cards de mensagem, elementos flutuantes.
**Variação:** Borda brilhante para mensagens de IA.

---

## §4 — PHYSICS & INTERACTION (ZERO DEPENDENCY)

### Skill 8: usePhysics (Micro-Engine Nativa)
**Conceito:** Hook que implementa física de "Squash and Stretch" usando Web Animations API (WAAPI).
**Aplicação:** Feedback de clique em botões e cards sem bibliotecas externas (como Framer Motion).
**Vantagem:** -40kb no bundle, 60fps garantidos.

### Skill 9: MagicKey (Pointer Events Physics)
**Conceito:** Mecânica de Drag & Drop com física de mola (Spring) implementada nativamente.
**Aplicação:** Telas de login interativas, puzzles, desbloqueio de recursos.
**Lógica:** Cálculo de distância euclidiana para "snap" ou "reject".

---

## §5 — EXPERIÊNCIA INTEGRADA

### Skill 10: LoginScreen (Morfismo Híbrido + IA)
**Conceito:** Tela de login que combina todos os elementos anteriores em uma experiência coesa.
**Integração:** 
- Fundo: Nebula.
- Input: Neumorphism.
- Container: MagicCard.
- Ação: MagicKey.
- Feedback: Avatar de IA reativo (Mimi).
**Resultado:** Uma entrada "mágica" que substitui formulários padrão.

---

*Estas 10 skills formam o "Toolkit de Encantamento APEX". Devem ser aplicadas sempre que o objetivo for criar interfaces de alta fidelidade visual e interatividade, priorizando performance (Axioma 1) e simplicidade (Axioma 3).*
