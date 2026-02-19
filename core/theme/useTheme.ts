import { useState, useCallback } from 'react';
import { ThemeRegistry } from './ThemeRegistry';
import { AppTheme } from '../types';
import { THEMES, STORAGE_KEYS } from '../config';
import { IdentityManager } from '../ecosystem/IdentityManager';

/**
 * Hook de Consumo do ThemeRegistry (APEX v2.0)
 * Provê estado reativo e métodos de troca de tema com validação de domínio.
 */
export const useTheme = () => {
  const profile = IdentityManager.getActiveProfile();
  const role = profile?.role || 'child';

  // Inicializa com o tema atual do DOM ou o primeiro tema disponível
  const [currentTheme, setCurrentTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const resolved = ThemeRegistry.resolveTheme(parsed.id, role);
        return resolved.success ? resolved.data : ThemeRegistry.getAvailableThemes(role)[0];
      } catch (e) {
        return ThemeRegistry.getAvailableThemes(role)[0];
      }
    }
    return ThemeRegistry.getAvailableThemes(role)[0];
  });

  const changeTheme = useCallback((themeId: string) => {
    const result = ThemeRegistry.resolveTheme(themeId, role);
    
    if (result.success) {
      setCurrentTheme(result.data);
      // O App.tsx cuidará da aplicação dos tokens via useEffect, 
      // mas podemos aplicar aqui também para feedback imediato se necessário.
      return { success: true, theme: result.data };
    }
    
    return { success: false, error: result.error };
  }, [role]);

  return {
    theme: currentTheme,
    themeId: currentTheme.id,
    changeTheme,
    availableThemes: ThemeRegistry.getAvailableThemes(role)
  };
};
