import React, { useState } from 'react';
import { useTheme } from '../../../core/theme/useTheme';
import { ThemeRegistry } from '../../../core/theme/ThemeRegistry';
import { Check, Sparkles, Terminal, Layers, Box, Fingerprint, Droplets, Zap, Heart, Shield, Sun, Cat } from 'lucide-react';
import { IdentityManager } from '../../../core/ecosystem/IdentityManager';
import { AppTheme } from '../../../core/types';
import { AmbientThemeEffect } from '../../../core/components/effects/AmbientThemeEffect';
import { HackerSimulator } from '../../../core/components/HackerSimulator';

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
    default: return <Sparkles className="text-[var(--primary)]" />;
  }
};

const EliteThemeCard = ({ 
  theme, 
  isActive, 
  onSelect 
}: { 
  theme: AppTheme, 
  isActive: boolean, 
  onSelect: (id: string) => void 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Adaptação Visual JIT Total (100% Theme Assumption on Hover)
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
  } as React.CSSProperties : {};

  return (
    <div 
      className="h-full transition-transform duration-500"
      data-theme-style={isHovered ? theme.tokens.layout.cardStyle : undefined}
      data-theme-id={isHovered ? theme.id : undefined}
      data-glitch={isHovered && theme.tokens.motion.glitchEnabled ? "true" : "false"}
      style={themeStyles}
    >
      <button
        onClick={() => onSelect(theme.id)}
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
          relative z-10 mb-6 p-5 rounded-[var(--ui-component-radius)] transition-all duration-500 group-hover:scale-110
          bg-[var(--surface-elevated)] border-[var(--ui-border-width)] border-[var(--border-color)] shadow-[var(--ui-shadow)]
          glitch-icon cursor-pointer
        `}>
          {getThemeIcon(theme.id)}
        </div>

        <h3 className={`relative z-10 text-xl font-black tracking-tight transition-colors duration-300 text-[var(--text-primary)]`} style={{ fontFamily: 'var(--font-main)' }}>
          {theme.name}
        </h3>
        <p className={`relative z-10 text-sm font-medium leading-relaxed transition-colors duration-300 text-[var(--text-muted)]`} style={{ fontFamily: 'var(--font-main)' }}>
          {theme.description}
        </p>

        {isActive && (
          <div className="absolute top-6 right-6 bg-emerald-500 text-white p-2 rounded-full shadow-lg z-20 border-4 border-[var(--surface)]">
            <Check size={18} strokeWidth={4} />
          </div>
        )}
      </button>
    </div>
  );
};

export const EliteThemeSelector: React.FC = () => {
  const { themeId, changeTheme } = useTheme();
  
  const childThemeIds = ['siamese', 'persian', 'bengal', 'british', 'ragdoll'];
  const eliteThemes = ThemeRegistry.getAvailableThemes()
    .filter(t => !childThemeIds.includes(t.id));

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Temas de Elite</h2>
        <p className="text-slate-500 font-medium">Interfaces avançadas para controle total do ecossistema.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eliteThemes.map(theme => (
          <EliteThemeCard 
            key={theme.id}
            theme={theme}
            isActive={themeId === theme.id}
            onSelect={changeTheme}
          />
        ))}
      </div>
    </div>
  );
};
