import { AppTheme } from "../types";

/**
 * SKILL: APEX-THEME-SENTINEL (v1.0)
 * Especialista em Governança de Design e Coerência Visual.
 * 
 * PROPÓSITO:
 * Garantir que 100% dos elementos visuais respeitem o ThemeEngine, eliminando hardcoding
 * e mantendo o contraste semântico (Axioma da Visibilidade Absoluta).
 * 
 * PADRÕES RECONHECIDOS:
 * 1. Deriva de Hardcoding: Substituição de 'text-white' por 'text-[var(--text-on-primary)]'.
 * 2. Semântica de Alerta: Uso de '--status-error' em vez de 'text-red-500' para manter harmonia.
 * 3. Inteligência de Prioridade: Cores de agenda (High/Medium/Low) agora escalam com o brilho do tema.
 */
export const ThemeSentinel = {
  /**
   * Resolve a cor de contraste ideal para textos sobre o fundo do tema.
   */
  getTextContrast: (theme: AppTheme) => {
    return 'var(--text-primary)';
  },

  /**
   * Mapeia cores de status que precisam de destaque mas devem "casar" com a paleta do tema.
   */
  getStatusColor: (type: 'error' | 'success' | 'warning' | 'info') => {
    return `var(--status-${type})`;
  },

  /**
   * Garante que elementos de prioridade (Agenda/Alertas) mantenham legibilidade.
   */
  getPriorityStyles: (priority: 'HIGH' | 'MEDIUM' | 'LOW', isHackerMode: boolean) => {
    if (isHackerMode) return 'text-[var(--primary)] border-[var(--primary)]';
    
    const colors = {
      HIGH: 'var(--status-error)',
      MEDIUM: 'var(--status-info)',
      LOW: 'var(--status-success)'
    };
    return colors[priority];
  }
};
