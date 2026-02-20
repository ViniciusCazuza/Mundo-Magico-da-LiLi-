import { useState, useCallback } from 'react';
import { ThemeRegistry } from './ThemeRegistry';
import { AppTheme } from '../types';
import { THEMES, STORAGE_KEYS } from '../config';
import { IdentityManager } from '../ecosystem/IdentityManager';

import { mimiEvents, MIMI_EVENT_TYPES } from '../events';

/**
 * Hook de Consumo do ThemeRegistry (APEX v2.1)
 * Provê estado reativo e métodos de troca de tema com persistência por perfil.
 */
export const useTheme = () => {
  const profile = IdentityManager.getActiveProfile();
  const profileId = profile?.id || 'default';
  const themeStorageKey = `${STORAGE_KEYS.THEME}_${profileId}`;

  // Inicializa com o tema do perfil ou o primeiro tema disponível
  const [currentTheme, setCurrentTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem(themeStorageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const id = typeof parsed === 'string' ? parsed : parsed.id;
        const resolved = ThemeRegistry.resolveTheme(id);
        return resolved.success ? resolved.data : ThemeRegistry.getAvailableThemes()[0];
      } catch (e) {
        return ThemeRegistry.getAvailableThemes()[0];
      }
    }
    return ThemeRegistry.getAvailableThemes()[0];
  });

  const changeTheme = useCallback((themeId: string) => {
    const result = ThemeRegistry.resolveTheme(themeId);
    
    if (result.success) {
      const newTheme = result.data;
      setCurrentTheme(newTheme);
      
      // Persistência Isolada por Perfil
      localStorage.setItem(themeStorageKey, JSON.stringify(newTheme));
      
      // SincronizaÃ§Ã£o Global
      mimiEvents.dispatch(MIMI_EVENT_TYPES.THEME_CHANGED, newTheme);
      
      // AplicaÃ§Ã£o Imediata
      ThemeRegistry.applyTokens(newTheme);

      return { success: true, theme: newTheme };
    }
    
    return { success: false, error: 'Tema nÃ£o encontrado.' };
  }, [themeStorageKey]);

  return {
    theme: currentTheme,
    themeId: currentTheme.id,
    changeTheme,
    availableThemes: ThemeRegistry.getAvailableThemes()
  };
};
