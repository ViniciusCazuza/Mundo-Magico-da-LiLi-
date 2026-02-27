# SKILL: APEX STABILITY & SYNTAX PROTOCOL — QA GOVERNANCE v1.0

## §1 — Contexto da Evolução
Este protocolo foi forjado após falhas críticas de sintaxe e lógica de escopo que resultaram em instabilidade do sistema (Crash da Agenda e Invisibilidade de Assets).

## §2 — Regras de Ouro de Implementação

### 1. Governança de Escopo (Anti-Crash)
Antes de usar qualquer variável condicional de tema ou estado:
*   Verifique se ela está definida no componente atual.
*   Se for um subcomponente, use o Hook `useTheme()` localmente em vez de depender de props em cascata profunda.

### 2. Validação Sintática Rigorosa
Cada bloco de código React (JSX/TSX) deve passar por verificação de:
*   Fechamento de parênteses e chaves em Arrow Functions.
*   Importação correta de componentes globais (ex: `DecryptText`).
*   Tipagem estrita para evitar `undefined` em tempo de execução.

### 3. Integridade de CSS e SVG
*   **Proibição:** Uso de `:not()` com seletores de descendência.
*   **Mandato:** Ativos de marca (Logos) devem possuir classes de proteção que anulem `fill: none` ou `opacity` de temas globais.
*   **Prioridade:** Use classes específicas (`.mimi-logo`, `.mimi-custom-cursor`) para exceções, nunca regras genéricas que afetem todos os SVGs.

## §3 — Checkpoint Pré-Entrega (O Crivo do Arquiteto)
1. [ ] O código compila sem erros de referência?
2. [ ] Todas as variáveis usadas estão definidas no escopo local?
3. [ ] O CSS adicionado é válido e testado para especificidade?
4. [ ] Ativos críticos (Logo/Cursor) permanecem visíveis em todos os estados?

---
*Assinado: Genesis — Meta-Arquiteto v15.0*
