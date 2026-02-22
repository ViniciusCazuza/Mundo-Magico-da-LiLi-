import React from 'react';
import { useTheme } from '../../../core/theme/useTheme';
import { ThemeRegistry } from '../../../core/theme/ThemeRegistry';
import { ThemeCard } from '../../../core/components/ui/ThemeCard';
import { DecryptText } from '../../../core/components/effects/DecryptText';

/**
 * EliteThemeSelector (APEX v3.1)
 * Interface de personalização unificada para a conta dos Pais.
 * Exibe todos os temas disponíveis no ecossistema utilizando o componente modular ThemeCard.
 */
export const EliteThemeSelector: React.FC = () => {
  const { themeId, changeTheme } = useTheme();
  const availableThemes = ThemeRegistry.getAvailableThemes();
  const isHackerMode = themeId === 'binary-night';

  return (
    <div className="space-y-12 animate-fade-in">
      <header>
        <h2 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">
          {isHackerMode ? <DecryptText text="GALERIA_DE_TEMAS" /> : "Galeria de Temas"}
        </h2>
        <p className="text-[var(--text-muted)] font-medium text-lg">
          {isHackerMode ? <DecryptText text="PERSONALIZACAO_TOTAL_DO_ECOSSISTEMA" /> : "Personalização total do ecossistema para todos os perfis."}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {availableThemes.map(theme => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            isActive={themeId === theme.id}
            onSelect={(t) => changeTheme(t.id)}
          />
        ))}
      </div>
    </div>
  );
};
