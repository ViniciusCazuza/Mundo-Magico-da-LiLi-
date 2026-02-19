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
   * Obtém a lista de temas permitida para o papel do usuário.
   * Axioma 2: Estados ilegais irrepresentáveis.
   */
  static getAvailableThemes(role: UserRole): AppTheme[] {
    const parentThemeIds = [
      "binary-night",
      "neumorphic-tactile",
      "glass-elite",
      "neubrutalist-raw",
      "skeuomorph-command",
      "luminous-interface",
      "maternal-sweetness",
      "maternal-strength",
      "neuro-gentle-embrace"
    ];

    if (role === 'parent_admin') {
      return THEMES; // Pais acessam todos os temas (Elite + Kids)
    }
    
    // Crianças acessam apenas os temas infantis (não contidos na lista de elite)
    return THEMES.filter(t => !parentThemeIds.includes(t.id));
  }

  /**
   * Resolve o tema atual garantindo fallback seguro (Padrão de Ouro).
   */
  static resolveTheme(themeId: string, role: UserRole): Result<AppTheme> {
    const available = this.getAvailableThemes(role);
    const theme = available.find(t => t.id === themeId);

    if (theme) {
      return Result.ok(theme);
    }

    // Fallback silencioso mas reportado
    console.warn(`[ThemeRegistry] Tema '${themeId}' não disponível para o papel '${role}'. Retornando padrão.`);
    return Result.ok(available[0] || THEMES[0]);
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
