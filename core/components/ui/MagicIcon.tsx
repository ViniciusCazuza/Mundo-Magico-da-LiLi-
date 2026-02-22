
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useTheme } from '../../theme/useTheme';

interface MagicIconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  color?: string;
  glow?: boolean;
  strokeWidth?: number;
  variant?: 'default' | 'gradient' | 'duotone';
  fillOpacity?: number;
}

export const MagicIcon: React.FC<MagicIconProps> = ({ 
  icon: Icon, 
  size = 24, 
  className = '', 
  color,
  glow = false,
  strokeWidth = 2,
  variant = 'default',
  fillOpacity = 0.1
}) => {
  const { themeId, theme } = useTheme();
  const cardStyle = theme?.tokens.layout.cardStyle;
  const colors = theme?.tokens.colors;

  const gradientId = React.useMemo(() => `magic-grad-${Math.random().toString(36).substr(2, 9)}`, []);

  const getIconStyles = () => {
    let styles: React.CSSProperties = {
      color: variant === 'gradient' ? undefined : (color || 'currentColor'),
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    // 1. Hacker Mode (Binary Night) - Adiciona brilho sem bloquear outros estilos
    if (themeId === 'binary-night') {
      styles.filter = 'drop-shadow(0 0 8px rgba(0, 255, 65, 0.6))';
      if (!color) styles.color = '#00FF41';
    }

    // 2. Glassmorphism
    if (cardStyle === 'glass') {
      const glassShadow = glow ? 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.4))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))';
      styles.filter = styles.filter ? `${styles.filter} ${glassShadow}` : glassShadow;
      styles.opacity = 0.9;
    }

    // 3. Neumorphism
    if (cardStyle === 'neumorphic') {
      const neuShadow = 'drop-shadow(1px 1px 1px rgba(0,0,0,0.05))';
      styles.filter = styles.filter ? `${styles.filter} ${neuShadow}` : neuShadow;
    }

    // 4. Neubrutalism & Outlined - Aplica apenas a sombra bruta, a cor será do stroke
    if (cardStyle === 'neubrutalist' || cardStyle === 'outlined') {
      const bruteShadow = 'drop-shadow(2px 2px 0px rgba(0,0,0,1))';
      styles.filter = styles.filter ? `${styles.filter} ${bruteShadow}` : bruteShadow;
    }

    // 5. Luminous
    if (themeId === 'luminous-interface') {
      const lumShadow = `drop-shadow(0 0 15px ${color || colors?.primary || '#39FF14'})`;
      styles.filter = styles.filter ? `${styles.filter} ${lumShadow}` : lumShadow;
    }

    return styles;
  };

  const getFill = () => {
    if (variant === 'duotone') return color || colors?.primary || 'currentColor';
    // Para gradientes em Lucide, aplicamos no stroke, não no fill (para não virar um blob)
    return 'none';
  };

  return (
    <div className={`magic-icon-container inline-flex items-center justify-center ${className} relative group/icon`}>
      {variant === 'gradient' && (
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color || colors?.primary || '#818CF8'} />
              <stop offset="100%" stopColor={colors?.accent || '#C084FC'} />
            </linearGradient>
          </defs>
        </svg>
      )}
      
      <Icon 
        size={size} 
        strokeWidth={strokeWidth} 
        stroke={variant === 'gradient' ? `url(#${gradientId})` : (color || 'currentColor')}
        fill={getFill()}
        fillOpacity={variant === 'duotone' ? fillOpacity : 0}
        style={getIconStyles()} 
        className="transition-all duration-500 group-hover/icon:scale-110 group-hover/icon:rotate-3"
      />
      
      {/* Subtle Underglow for High-End feel */}
      {glow && (
        <div 
          className="absolute inset-0 blur-xl opacity-20 group-hover/icon:opacity-40 transition-opacity"
          style={{ backgroundColor: color || colors?.primary }}
        />
      )}
    </div>
  );
};


