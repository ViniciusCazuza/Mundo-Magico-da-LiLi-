import React from "react";
import { Cat } from "lucide-react";
import { MagicIcon } from "../../../core/components/ui/MagicIcon";
import { AppTheme } from "../../../core/types";
import { THEMES } from "../../../core/config";
import { ThemeRegistry } from "../../../core/theme/ThemeRegistry";
import { ThemeCard } from "../../../core/components/ui/ThemeCard";
import { IdentityManager } from "../../../core/ecosystem/IdentityManager";

interface ThemeCustomizerProps {
  currentTheme: AppTheme;
  onUpdateTheme: (theme: AppTheme) => void;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ currentTheme, onUpdateTheme }) => {
  const profile = IdentityManager.getActiveProfile();
  const availableThemes = ThemeRegistry.getAvailableThemes(profile?.role);

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {availableThemes.map(theme => (
          <ThemeCard 
            key={theme.id}
            theme={theme}
            isActive={currentTheme.id === theme.id}
            onSelect={onUpdateTheme}
          />
        ))}
      </div>

      {/* Aesthetic Footer Hook */}
      <div className="p-12 mimi-card border-dashed border-2 border-slate-200 flex flex-col md:flex-row items-center gap-8 justify-between group overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
           <MagicIcon icon={Cat} size={180} color="var(--primary)" />
        </div>
        <div className="text-center md:text-left z-10">
          <h4 className="text-4xl font-black text-slate-800 mb-3 tracking-tight">O Reino da LiLi é Seu</h4>
          <p className="text-slate-500 font-medium max-w-lg text-lg">
            Sua conta, seu estilo. No Mundo Mágico da LiLi, cada perfil pode brilhar de um jeito diferente! ✨
          </p>
        </div>
        <div className="z-10">
           <div className="flex -space-x-4">
              {THEMES.slice(0, 5).map((t, i) => (
                <div 
                  key={t.id} 
                  className="w-16 h-16 rounded-full border-4 border-white shadow-lg transition-transform hover:translate-y-[-10px] cursor-pointer"
                  style={{ background: t.tokens.colors.primary, zIndex: 5 - i }}
                />
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
