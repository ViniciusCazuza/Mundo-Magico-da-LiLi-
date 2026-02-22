import React, { useState } from "react";
import { Check, Sparkles, Terminal, Layers, Box, Droplets, Zap, Fingerprint, Heart, Shield, Sun, Cat } from "lucide-react";
import { MagicIcon } from "./MagicIcon";
import { AppTheme } from "../../types";
import { NeurodiversitySymbol } from "../NeurodiversitySymbol";
import { AmbientThemeEffect } from "../effects/AmbientThemeEffect";
import { HackerSimulator } from "../HackerSimulator";

const getThemeIcon = (id: string, isHovered: boolean) => {
  const props = { size: 32, variant: 'gradient' as const, glow: true };
  switch(id) {
    case 'binary-night': return <MagicIcon icon={Terminal} {...props} color="#00FF41" />;
    case 'glass-elite': return <MagicIcon icon={Layers} {...props} color="#C084FC" />;
    case 'neubrutalist-raw': return <MagicIcon icon={Box} {...props} color={isHovered ? "#000000" : "#FFEA00"} variant="default" strokeWidth={3} />;
    case 'fluid-vision': return <MagicIcon icon={Droplets} {...props} color="#FF9EB5" />;
    case 'luminous-interface': return <MagicIcon icon={Zap} {...props} color="#39FF14" />;
    case 'skeuomorph-command': return <MagicIcon icon={Fingerprint} {...props} color="#475569" variant="duotone" />;
    case 'neumorphic-tactile': return <MagicIcon icon={Box} {...props} color="#A3B1C6" variant="duotone" />;
    case 'maternal-sweetness': return <MagicIcon icon={Heart} {...props} color="#FFB6C1" />;
    case 'maternal-strength': return <MagicIcon icon={Shield} {...props} color="#98FB98" />;
    case 'neuro-gentle-embrace': return <MagicIcon icon={Sun} {...props} color="#ADD8E6" />;
    case 'siamese': return <MagicIcon icon={Cat} {...props} color="#818CF8" />;
    case 'persian': return <MagicIcon icon={Cat} {...props} color="#F472B6" />;
    case 'bengal': return <MagicIcon icon={Cat} {...props} color="#F59E0B" />;
    case 'british': return <MagicIcon icon={Cat} {...props} color="#475569" />;
    case 'ragdoll': return <MagicIcon icon={Cat} {...props} color="#64748B" />;
    default: return <MagicIcon icon={Sparkles} {...props} />;
  }
};

interface ThemeCardProps {
  theme: AppTheme;
  isActive: boolean;
  onSelect: (t: AppTheme) => void;
}

/**
 * ThemeCard Modularizado (APEX v3.0)
 * Atua como um "Isolamento de Domínio Visual". 
 * Ao sofrer hover, o card torna-se uma cápsula pura do seu próprio tema.
 */
export const ThemeCard: React.FC<ThemeCardProps> = ({ 
  theme, 
  isActive, 
  onSelect 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // OMNI-SKILL: Mapeamento Total de Tokens (100% Imersão no Hover)
  // Garantimos que TODAS as variáveis sejam sobrescritas localmente
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
          relative group flex flex-col items-center p-8 text-center transition-all duration-500 h-full w-full overflow-hidden
          mimi-card theme-card min-h-[320px]
          ${isActive ? 'ring-4 ring-emerald-500 ring-offset-4 ring-offset-[var(--bg-app)]' : ''}
          ${isHovered ? 'scale-105 z-10 shadow-2xl' : 'hover:scale-[1.02]'}
        `}
        style={isHovered ? { background: 'var(--bg-app)', border: 'var(--ui-border-width) solid var(--border-color)', borderRadius: 'var(--ui-radius)' } : {}}
      >
        {/* OMNI-SKILL: 100% Immersive Full Card Ambient on Hover */}
        {isHovered && (
          <div className="absolute inset-0 z-0 pointer-events-none">
             <AmbientThemeEffect themeId={theme.id} container />
             {theme.id === 'binary-night' && <HackerSimulator />}
          </div>
        )}

        <div className={`
          relative z-10 mb-6 p-5 rounded-[var(--ui-component-radius)] transition-all duration-500 group-hover:scale-110
          bg-[var(--surface-elevated)] border-[var(--ui-border-width)] border-[var(--border-color)] shadow-[var(--ui-shadow)]
          glitch-icon cursor-pointer
        `}>
          {getThemeIcon(theme.id, isHovered)}
        </div>

        <div className="relative z-10 flex items-center gap-3 mb-2">
          <h3 className={`text-xl font-black tracking-tight transition-colors duration-300 text-[var(--text-primary)]`} style={{ fontFamily: 'var(--font-main)' }}>
            {theme.name}
          </h3>
          {theme.id === 'neuro-gentle-embrace' && <NeurodiversitySymbol size={20} />}
        </div>

        <p className={`relative z-10 text-sm font-medium leading-relaxed transition-colors duration-300 text-[var(--text-muted)] opacity-80`} style={{ fontFamily: 'var(--font-main)' }}>
          {theme.description}
        </p>

        {/* Status Indicator */}
        {isActive && (
          <div className="absolute top-6 right-6 bg-emerald-500 text-white p-2 rounded-full shadow-lg border-4 border-[var(--surface)] animate-bounce-soft z-20 flex items-center justify-center">
            <MagicIcon icon={Check} size={18} strokeWidth={4} color="white" />
          </div>
        )}

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-10 transition-opacity blur-3xl rounded-[inherit]"
             style={{ backgroundColor: 'var(--primary)' }} />
      </button>
    </div>
  );
};
