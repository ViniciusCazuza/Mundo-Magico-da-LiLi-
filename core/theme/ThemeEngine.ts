
import { IdentityManager } from "../ecosystem/IdentityManager";
import { THEMES } from "../config";
import { AppTheme } from "../types";

export type ThemeResult<T> = 
  | { success: true; data: T } 
  | { success: false; error: string; code: "UNAUTHORIZED" | "NOT_FOUND" | "LOAD_ERROR" };

/**
 * Axioma 2: Estados ilegais irrepresentáveis.
 * Acesso Universal: Todos os temas estão liberados para todos os perfis.
 */
export const PARENT_ONLY_THEMES: string[] = [];

export class ThemeEngine {
  
  /**
   * Tenta carregar um tema pelo ID.
   */
  static loadTheme(themeId: string): ThemeResult<AppTheme> {
    const targetTheme = THEMES.find(t => t.id === themeId);
    
    if (!targetTheme) {
      return { success: false, error: "Tema não encontrado.", code: "NOT_FOUND" };
    }

    // Sucesso universal
    return { success: true, data: targetTheme };
  }

  /**
   * Retorna a lista total de temas (Acesso Universal).
   */
  static getAvailableThemes(): AppTheme[] {
    return THEMES;
  }
}
