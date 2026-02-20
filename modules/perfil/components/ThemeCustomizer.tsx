import React, { useState } from "react";
import { Check, Sparkles, Terminal, Layers, Box, Droplets, Zap, Fingerprint, Heart, Shield, Sun, Cat } from "lucide-react";
import { AppTheme } from "../../../core/types";
import { THEMES } from "../../../core/config";
import { NeurodiversitySymbol } from "../../../core/components/NeurodiversitySymbol";
import { ThemeRegistry } from "../../../core/theme/ThemeRegistry";
import { AmbientThemeEffect } from "../../../core/components/effects/AmbientThemeEffect";
import { HackerSimulator } from "../../../core/components/HackerSimulator";

interface ThemeCustomizerProps {
  currentTheme: AppTheme;
  onUpdateTheme: (theme: AppTheme) => void;
}

const getThemeIcon = (id: string) => {
  switch(id) {
    case 'binary-night': return <Terminal className="text-[var(--primary)]" />;
    case 'glass-elite': return <Layers className="text-[var(--primary)]" />;
    case 'neubrutalist-raw': return <Box className="text-[var(--text-primary)]" />;
    case 'fluid-vision': return <Droplets className="text-[var(--primary)]" />;
    case 'luminous-interface': return <Zap className="text-[var(--accent)]" />;
    case 'skeuomorph-command': return <Fingerprint className="text-[var(--text-muted)]" />;
    case 'neumorphic-tactile': return <Box className="text-[var(--primary)]" />;
    case 'maternal-sweetness': return <Heart className="text-[var(--primary)]" />;
    case 'maternal-strength': return <Shield className="text-[var(--primary)]" />;
    case 'neuro-gentle-embrace': return <Sun className="text-[var(--primary)]" />;
    case 'siamese': return <Cat className="text-[var(--primary)]" />;
    case 'persian': return <Cat className="text-[var(--primary)]" />;
    case 'bengal': return <Cat className="text-[var(--primary)]" />;
    case 'british': return <Cat className="text-[var(--primary)]" />;
    case 'ragdoll': return <Cat className="text-[var(--primary)]" />;
    default: return <Sparkles className="text-[var(--primary)]" />;
  }
};

const ThemeCard = ({ 
  theme, 
  isActive, 
  onSelect 
}: { 
  theme: AppTheme, 
  isActive: boolean, 
  onSelect: (t: AppTheme) => void 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // OMNI-SKILL: Mapeamento Total de Tokens (100% Imersão no Hover)
  const themeStyles = isHovered ? {
    '--primary': theme.tokens.colors.primary,
    '--secondary': theme.tokens.colors.secondary,
    '--accent': theme.tokens.colors.accent,
    '--bg-app': theme.tokens.colors.background,
    '--surface': theme.tokens.colors.surface,
    '--surface-elevated': theme.tokens.colors.surfaceElevated,
    '--text-primary': theme.tokens.colors.text,
    '--text-secondary': theme.tokens.colors.textSecondary,
    '--text-muted': theme.tokens.colors.textMuted,
    '--border-color': theme.tokens.colors.border,
    '--text-on-primary': theme.tokens.colors.textOnPrimary,
    '--text-on-accent': theme.tokens.colors.textOnAccent,
    '--ui-radius': theme.tokens.layout.borderRadius,
    '--ui-border-width': theme.tokens.layout.borderWidth,
    '--ui-shadow': theme.tokens.colors.shadow,
    '--ui-shadow-elevated': theme.tokens.colors.shadowElevated,
    '--ui-blur': theme.tokens.layout.blurIntensity,
    '--ui-component-radius': theme.tokens.layout.componentShape === 'pill' ? '9999px' : 
                             theme.tokens.layout.componentShape === 'square' ? '0px' : theme.tokens.layout.borderRadius,
    '--ui-edge-style': theme.tokens.layout.edgeStyle,
    '--font-main': theme.tokens.typography.fontFamily,
    '--ui-transition': theme.tokens.motion.transitionSpeed,
    '--ui-ease': theme.tokens.motion.ease,
  } as React.CSSProperties : {} ;

  return (
    <div 
      className="h-full transition-all duration-500"
      data-theme-style={isHovered ? theme.tokens.layout.cardStyle : undefined}
      data-theme-id={isHovered ? theme.id : undefined}
      data-glitch={isHovered && theme.tokens.motion.glitchEnabled ? "true" : "false"}
      style={themeStyles}
    >
      <button
        onClick={() => onSelect(theme)}
        onMouseEnter={() => {
          setIsHovered(true);
          document.dispatchEvent(new CustomEvent('theme-preview', { detail: { themeId: theme.id } }));
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          document.dispatchEvent(new CustomEvent('theme-preview', { detail: { themeId: null } }));
        }}
        className={`
          relative group flex flex-col items-start p-10 text-left transition-all duration-500 h-full w-full overflow-hidden
          mimi-card
          ${isActive ? 'ring-4 ring-emerald-500 ring-offset-4 ring-offset-[var(--bg-app)]' : ''}
          ${isHovered ? 'scale-105 z-10 shadow-2xl' : 'hover:scale-[1.02]'}
        `}
      >
        {/* OMNI-SKILL: 100% Immersive Full Card Ambient on Hover */}
        {isHovered && (
          <div className="absolute inset-0 z-0">
             <AmbientThemeEffect themeId={theme.id} container />
             {theme.id === 'binary-night' && <HackerSimulator />}
          </div>
        )}

        <div className={`
          relative z-10 mb-8 p-6 rounded-[var(--ui-component-radius)] transition-all duration-500 group-hover:scale-110
          bg-[var(--surface-elevated)] border-[var(--ui-border-width)] border-[var(--border-color)] shadow-[var(--ui-shadow)]
          glitch-icon cursor-pointer
        `}>
          {getThemeIcon(theme.id)}
        </div>

        <div className="relative z-10 flex items-center gap-3 mb-3">
          <h3 className={`text-2xl font-black tracking-tight transition-colors duration-300 text-[var(--text-primary)]`} style={{ fontFamily: 'var(--font-main)' }}>
            {theme.name}
          </h3>
          {theme.id === 'neuro-gentle-embrace' && <NeurodiversitySymbol size={24} />}
        </div>

        <p className={`relative z-10 text-base font-medium leading-relaxed transition-colors duration-300 text-[var(--text-muted)]`} style={{ fontFamily: 'var(--font-main)' }}>
          {theme.description}
        </p>

        {/* Status Indicator */}
        {isActive && (
          <div className="absolute top-6 right-6 bg-emerald-500 text-white p-2 rounded-full shadow-lg border-4 border-[var(--surface)] animate-bounce-soft z-20">
            <Check size={18} strokeWidth={4} />
          </div>
        )}

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-10 transition-opacity blur-3xl rounded-[inherit]"
             style={{ backgroundColor: 'var(--primary)' }} />
      </button>
    </div>
  );
};

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ currentTheme, onUpdateTheme }) => {
  const availableThemes = ThemeRegistry.getAvailableThemes();

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
           <Cat size={180} />
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
