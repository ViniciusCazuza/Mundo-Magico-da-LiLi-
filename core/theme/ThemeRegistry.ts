import { THEMES } from "../config";
import { AppTheme } from "../types";
import { UserRole } from "../ecosystem/types";
import { Result } from "../utils/result";

/**
 * Registry de Temas APEX v2.0
 * Centraliza a inteligência de design e isolamento de domínio.
 */
export class ThemeRegistry {
  
  /**
   * Obtém a lista de temas disponível para o usuário.
   * Retorna todos os temas do ecossistema (Acesso Universal APEX v3.2).
   */
  static getAvailableThemes(_role: UserRole = 'child'): AppTheme[] {
    return THEMES;
  }

  /**
   * Resolve o tema atual garantindo fallback seguro (Padrão de Ouro).
   */
  static resolveTheme(themeId: string): Result<AppTheme> {
    const theme = THEMES.find(t => t.id === themeId);

    if (theme) {
      return Result.ok(theme);
    }

    // Fallback silencioso mas reportado
    console.warn(`[ThemeRegistry] Tema '${themeId}' não encontrado. Retornando padrão.`);
    return Result.ok(THEMES[0]);
  }

  /**
   * Calcula o filtro de drop-shadow ideal para criar o EFEITO NEON.
   * A batinha (núcleo) é branca, e a aura é a cor do tema.
   */
  static getCursorFilter(theme: AppTheme): string {
    const tokens = theme.tokens;
    const glowColor = tokens.colors.primary;

    if (theme.id === 'neumorphic-tactile') {
      return `drop-shadow(0 0 12px rgba(163, 177, 198, 0.8)) drop-shadow(0 0 4px rgba(0, 0, 0, 0.1))`;
    }

    // Camadas de Neon saturadas (Visibilidade Absoluta v2.4)
    return `
      drop-shadow(0 0 4px #FFFFFF) 
      drop-shadow(0 0 12px ${glowColor}) 
      drop-shadow(0 0 25px ${tokens.colors.accent || glowColor}) 
      drop-shadow(0 0 45px ${glowColor})
    `.replace(/\s+/g, ' ').trim();
  }

  /**
   * Calcula a cor base do cursor para o tema.
   * Axioma: O núcleo do neon é sempre branco (#FFFFFF).
   */
  static getCursorColor(theme: AppTheme): string {
    return '#FFFFFF'; 
  }

  /**
   * Injeta os Design Tokens estruturais no :root do DOM.
   */
  static applyTokens(theme: AppTheme) {
    const root = document.documentElement;
    const tokens = theme.tokens;

    if (!tokens) return; // Fail safe

        // --- Cores ---
        root.style.setProperty('--primary', tokens.colors?.primary || '#FFB7C5');
        root.style.setProperty('--secondary', tokens.colors?.secondary || '#98FB98');
        root.style.setProperty('--accent', tokens.colors?.accent || '#FF69B4');
        root.style.setProperty('--bg-app', tokens.colors?.background || '#FFFFFF');
        root.style.setProperty('--surface', tokens.colors?.surface || '#F9F9F9');
        root.style.setProperty('--surface-elevated', tokens.colors?.surfaceElevated || '#F9F9F9');
        root.style.setProperty('--text-primary', tokens.colors?.text || '#333333');
        root.style.setProperty('--text-secondary', tokens.colors?.textSecondary || '#666666');
        root.style.setProperty('--text-muted', tokens.colors?.textMuted || '#999999');
        root.style.setProperty('--border-color', tokens.colors?.border || 'rgba(0,0,0,0.1)');
        root.style.setProperty('--text-on-primary', tokens.colors?.textOnPrimary || '#FFFFFF');
        root.style.setProperty('--text-on-accent', tokens.colors?.textOnAccent || '#FFFFFF');
    
    // --- Status & Semântica (APEX v2.3 - Contraste Inteligente) ---
    const getContrastColor = (hexColor: string) => {
      if (!hexColor || hexColor.startsWith('linear')) return '#FFFFFF';
      const hex = hexColor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      return (yiq >= 128) ? '#000000' : '#FFFFFF';
    };

    const primaryColor = tokens.colors?.primary || '#FFB7C5';
    const accentColor = tokens.colors?.accent || '#FF69B4';

    root.style.setProperty('--text-on-primary', getContrastColor(primaryColor));
    root.style.setProperty('--text-on-accent', getContrastColor(accentColor));

    // Determina se o tema é escuro baseando-se na cor de texto primária
    const isDarkTheme = tokens.colors?.text?.toLowerCase().includes('#f') || 
                        tokens.colors?.text?.toLowerCase().includes('#e') || 
                        tokens.colors?.text?.toLowerCase().includes('255'); 

    root.style.setProperty('--status-error', isDarkTheme ? '#FF6B6B' : '#DC2626');   // Vermelho claro no escuro, escuro no claro
    root.style.setProperty('--status-success', isDarkTheme ? '#4ADE80' : '#16A34A'); // Verde claro no escuro, escuro no claro
    root.style.setProperty('--status-warning', isDarkTheme ? '#FBBF24' : '#D97706'); // Âmbar
    root.style.setProperty('--status-info', isDarkTheme ? '#60A5FA' : '#2563EB');    // Azul
    
        // Contraste calculado para superfícies
        root.style.setProperty('--text-on-surface', tokens.colors?.text || '#333333');
        root.style.setProperty('--text-on-surface-elevated', tokens.colors?.text || '#333333');
    
        // --- Cursor FX (APEX v2.2) ---
        root.style.setProperty('--ui-cursor-filter', this.getCursorFilter(theme));
        root.style.setProperty('--ui-cursor-color', this.getCursorColor(theme));
    
        // --- Estrutura Dinâmica (Anatomia de Componentes) ---
    root.style.setProperty('--ui-radius', tokens.layout?.borderRadius || '24px');
    root.style.setProperty('--ui-border-width', tokens.layout?.borderWidth || '0px');
    root.style.setProperty('--ui-shadow', tokens.colors?.shadow || 'none');
    root.style.setProperty('--ui-shadow-elevated', tokens.colors?.shadowElevated || 'none');
    root.style.setProperty('--ui-blur', tokens.layout?.blurIntensity || '0px');
    
    // Tokens de Forma (Anatomia APEX)
    const shapeRadius = tokens.layout?.componentShape === 'square' ? '0px' : 
                        tokens.layout?.componentShape === 'pill' ? '9999px' : 
                        (tokens.layout?.borderRadius || '24px');
    
    root.style.setProperty('--ui-component-radius', shapeRadius);
    root.style.setProperty('--ui-edge-style', tokens.layout?.edgeStyle || 'smooth');
    
    // --- Tipografia ---
    root.style.setProperty('--font-main', tokens.typography?.fontFamily || 'sans-serif');
    
    // --- Motion & FX ---
    root.style.setProperty('--ui-transition', tokens.motion?.transitionSpeed || '0.3s');
    root.style.setProperty('--ui-ease', tokens.motion?.ease || 'ease-in-out');
    root.setAttribute('data-glitch', tokens.motion?.glitchEnabled ? 'true' : 'false');

    // Atributo de data para seletores CSS complexos
    root.setAttribute('data-theme-style', tokens.layout?.cardStyle || 'glass');
    root.setAttribute('data-theme-id', theme.id);
  }
}
