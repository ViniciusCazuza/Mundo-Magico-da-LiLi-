
import { IdentityManager } from "../ecosystem/IdentityManager";
import { THEMES } from "../config";
import { AppTheme } from "../types";

export type ThemeResult<T> = 
  | { success: true; data: T } 
  | { success: false; error: string; code: "UNAUTHORIZED" | "NOT_FOUND" | "LOAD_ERROR" };

/**
 * Axioma 2: Estados ilegais irrepresentáveis.
 * Lista de IDs de temas que são estritamente proibidos para crianças.
 */
export const PARENT_ONLY_THEMES = [
  "binary-night",
  "neumorphic-tactile",
  "glass-elite",
  "neubrutalist-raw",
  "skeuomorph-command",
  "luminous-interface"
];

export class ThemeEngine {
  
  /**
   * Tenta carregar um tema pelo ID, validando as permissões do usuário atual.
   */
  static loadTheme(themeId: string): ThemeResult<AppTheme> {
    const session = IdentityManager.getSession();
    const profile = IdentityManager.getActiveProfile();
    const role = profile?.role || 'child';

    // 1. Busca o tema na configuração global
    const targetTheme = THEMES.find(t => t.id === themeId);
    
    if (!targetTheme) {
      return { success: false, error: "Tema não encontrado.", code: "NOT_FOUND" };
    }

    // 2. Validação de Isolamento de Domínio (Axioma 2)
    if (PARENT_ONLY_THEMES.includes(themeId) && role !== "parent_admin") {
      console.warn(`[ThemeEngine] Acesso negado: O perfil '${profile?.nickname}' (role: ${role}) tentou acessar o tema restrito '${themeId}'.`);
      return { 
        success: false, 
        error: "Este tema é exclusivo para os Guardiões (Pais).",
        code: "UNAUTHORIZED"
      };
    }

    // 3. Sucesso
    return { success: true, data: targetTheme };
  }

  /**
   * Retorna a lista de temas permitidos para o usuário atual.
   */
  static getAvailableThemes(): AppTheme[] {
    const profile = IdentityManager.getActiveProfile();
    const role = profile?.role || 'child';

    if (role === "parent_admin") {
      return THEMES; // Pais veem tudo
    }

    // Crianças veem apenas temas não restritos
    return THEMES.filter(t => !PARENT_ONLY_THEMES.includes(t.id));
  }
}
