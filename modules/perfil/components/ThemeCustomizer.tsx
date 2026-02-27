
import React from "react";
import { Check, Sparkles } from "lucide-react";
import { AppTheme } from "../../../core/types";
import { THEMES } from "../../../core/config";

interface ThemeCustomizerProps {
  currentTheme: AppTheme;
  onUpdateTheme: (theme: AppTheme) => void;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ currentTheme, onUpdateTheme }) => {
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {THEMES.map(t => (
          <button 
            key={t.id}
            onClick={() => onUpdateTheme(t)}
            style={{ 
              borderRadius: t.tokens.layout.borderRadius,
              backgroundColor: t.tokens.colors.surface,
              boxShadow: currentTheme.id === t.id ? `0 10px 30px -5px ${t.tokens.colors.primary}` : 'none',
              border: `2px solid ${currentTheme.id === t.id ? t.tokens.colors.primary : 'transparent'}`,
              fontFamily: t.tokens.typography.fontFamily,
              color: t.tokens.colors.text
            }}
            className={`flex flex-col items-center p-6 transition-all relative group h-full justify-center
              ${currentTheme.id === t.id ? 'scale-105 z-10' : 'opacity-80 hover:opacity-100 hover:scale-[1.05] hover:z-20'}
              ${t.tokens.motion.animationLevel === 'none' ? '' : 'active:scale-95'}`}
          >
            {/* Dynamic Preview Layer */}
            <div 
              className="w-full h-16 rounded-xl mb-4 transition-all duration-500 shadow-inner overflow-hidden relative"
              style={{ 
                background: t.tokens.colors.background, 
                backgroundImage: t.tokens.decorative.backgroundPattern
              }}
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              {currentTheme.id === t.id && (
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                   <Sparkles className="animate-spin-slow" />
                </div>
              )}
            </div>

            {/* Label with dynamic contrast */}
            <div className="text-center">
              <span className="text-xs font-black uppercase tracking-[0.2em] block transition-colors group-hover:text-[var(--primary)]" 
                    style={{ color: currentTheme.id === t.id ? t.tokens.colors.primary : t.tokens.colors.text }}>
                {t.name}
              </span>
            </div>

            {/* Selection indicator with glow */}
            {currentTheme.id === t.id && (
              <div className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center shadow-lg animate-fade-in border-4 border-[var(--surface)]"
                   style={{ 
                     backgroundColor: t.tokens.colors.primary, 
                     color: t.tokens.colors.textOnPrimary, 
                     borderRadius: '50%',
                     boxShadow: `0 0 15px ${t.tokens.colors.primary}`
                   }}>
                <Check size={14} />
              </div>
            )}

            {/* Extra hover effect: ambient glow border */}
            <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-20 transition-opacity blur-xl rounded-[inherit]"
                 style={{ backgroundColor: t.tokens.colors.primary }} />
          </button>
        ))}
      </div>

      <div className="p-10 mimi-card flex flex-col md:flex-row items-center gap-10 justify-center border-dashed border-[var(--border-color)] group">
        <div className="text-center md:text-left flex-1">
          <h4 className="font-hand text-4xl text-[var(--primary)] mb-2 group-hover:scale-105 transition-transform origin-left">Seu Mundo, Suas Cores</h4>
          <p className="text-xs text-[var(--text-muted)] max-w-sm">Mudar o tema altera as formas e o brilho do seu reino encantado. Escolha o que mais te faz feliz hoje!</p>
        </div>
        
        <div className="flex gap-8 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
           <div className="flex flex-col items-center gap-2 group-hover:translate-y-[-5px] transition-transform">
              <div className="w-12 h-12 mimi-card flex items-center justify-center text-[var(--primary)] text-sm font-black border-[var(--border-color)]">Aa</div>
           </div>
           <div className="flex flex-col items-center gap-2 group-hover:translate-y-[-5px] transition-transform delay-75">
              <div className="w-12 h-12 mimi-card border-4 border-[var(--primary)] bg-transparent"></div>
           </div>
           <div className="flex flex-col items-center gap-2 group-hover:translate-y-[-5px] transition-transform delay-150">
              <div className="w-12 h-12 mimi-card bg-[var(--primary)]"></div>
           </div>
        </div>
      </div>
    </div>
  );
};
