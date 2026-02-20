
import React from 'react';
import { useSquashStretch } from './usePhysics';
import { LucideIcon } from 'lucide-react';

interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  icon?: LucideIcon;
  label?: string;
  isThinking?: boolean;
}

export const TactileButton: React.FC<TactileButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  size = 'md',
  icon: Icon,
  label,
  isThinking,
  ...props 
}) => {
  const { ref, isPressed, playPress, playRelease } = useSquashStretch(0.92);

  const baseStyles = "relative inline-flex items-center justify-center font-bold tracking-wide transition-all outline-none select-none btn-dynamic";
  
  const variants = {
    primary: "bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-[var(--text-on-primary)] hover:brightness-110",
    secondary: "bg-[var(--surface-elevated)] text-[var(--text-primary)] border-[var(--border-color)]/20",
    danger: "bg-red-500 text-white shadow-lg",
    ghost: "bg-transparent shadow-none hover:bg-black/5"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-xl",
    icon: "p-3 w-12 h-12"
  };

  return (
    <button
      // @ts-ignore
      ref={ref}
      onMouseDown={playPress}
      onMouseUp={playRelease}
      onMouseLeave={playRelease}
      onTouchStart={playPress}
      onTouchEnd={playRelease}
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${isThinking ? 'ai-thinking cursor-wait' : ''}
        ${className}
      `}
      aria-label={label || (typeof children === 'string' ? children : 'Button')}
      {...props}
    >
      {Icon && <Icon className={`${children ? 'mr-2' : ''} ${size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}`} />}
      {children}
      <div className={`absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300 ${isPressed ? 'opacity-20 bg-black' : 'opacity-0'}`} />
    </button>
  );
};
