# SKILL: EVENT TARGETING & INTERACTION PROTOCOL — UI PRECISION MODULE v1.0

## §1 — Contexto do Aprendizado (O "Bug do Cursor Viciado")
Foi identificado um padrão crítico de falha onde a detecção de interatividade via `e.target.closest('[data-attr]')` resultou em falsos positivos globais. O motivo: o atributo alvo existia na tag raiz `<html>` ou `<body>`.

## §2 — Axioma da Contaminação da Raiz
**"Atributos globais de estado (Theme, Lang, Mode) são proibidos como gatilhos de interação local."**
Se um atributo define o contexto da aplicação, ele não pode definir o estado de um botão.

## §3 — Diretrizes de Implementação Invioláveis

### 1. Detecção Cirúrgica
Ao verificar se um elemento é interativo, o código deve explicitamente rejeitar a raiz do documento.
*   ❌ **Errado:** `!!target.closest('[data-theme-id]')` (Pega o `<html>` e trava o estado).
*   ✅ **Correto:** `!!target.closest('.theme-card')` (Usa uma classe semântica local).

### 2. Princípio da Intenção Explícita
Elementos interativos não-nativos (divs, spans) devem possuir marcadores de intenção claros:
*   Classes: `.interactive`, `.clickable`, `.btn-custom`.
*   Roles: `role="button"`.
*   CSS: `cursor: pointer`.

### 3. Hierarquia de Eventos (Composed Path)
Em interações complexas (Shadow DOM ou Portals), prefira `e.composedPath()` para validar a cadeia de eventos, mas sempre aplique o **Filtro de Exclusão de Raiz**.

## §4 — Checklist de Validação de Cursor
Antes de aprovar qualquer lógica de cursor customizado:
1.  [ ] O estado inicial (boot) é neutro/inativo?
2.  [ ] A detecção ignora `html` e `body`?
3.  [ ] O feedback visual (ex: garras) tem um gatilho de saída (`mouseleave` ou perda de target) robusto?
4.  [ ] A escala visual (feedback tátil) não interfere na precisão funcional (ex: ferramentas de desenho)?

---
*Este protocolo foi forjado na correção do CustomCursor v2.0.*
