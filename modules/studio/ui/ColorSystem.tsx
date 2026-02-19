import React, { useState, useEffect, useMemo } from 'react';
import { Palette, Sparkles, Hash, SlidersHorizontal } from 'lucide-react';

interface MagicColorSystemProps {
  color: string;
  onChange: (color: string) => void;
  opacity: number;
  onOpacityChange: (opacity: number) => void;
}

// Auxiliares de conversão
const hexToHsl = (hex: string) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const hslToHex = (h: number, s: number, l: number) => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export const MagicColorSystem: React.FC<MagicColorSystemProps> = ({ color, onChange, opacity, onOpacityChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const hsl = useMemo(() => hexToHsl(color), [color]);

  const harmonies = useMemo(() => {
    const { h, s, l } = hsl;
    return {
      complementary: hslToHex((h + 180) % 360, s, l),
      analogous: [hslToHex((h + 30) % 360, s, l), hslToHex((h + 330) % 360, s, l)],
      triadic: [hslToHex((h + 120) % 360, s, l), hslToHex((h + 240) % 360, s, l)],
    };
  }, [hsl]);

  const quickColors = ['#FFFFFF', '#000000', '#F87171', '#FB923C', '#FACC15', '#4ADE80', '#2DD4BF', '#60A5FA', '#818CF8', '#A78BFA', '#F472B6', '#94A3B8'];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-2">
        {quickColors.map(c => (
          <button
            key={c}
            onClick={() => onChange(c)}
            className={`w-full aspect-square border-2 transition-all hover:scale-110 active:scale-95 ${color.toUpperCase() === c.toUpperCase() ? 'border-[var(--primary)] ring-2 ring-[var(--primary)] shadow-lg' : 'border-[var(--border-color)]'}`}
            style={{ backgroundColor: c, borderRadius: 'var(--ui-component-radius)' }}
          />
        ))}
      </div>

      <button 
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full py-2 px-3 btn-dynamic text-black flex items-center justify-between text-[9px] font-black uppercase tracking-widest shadow-sm"
        style={{ borderRadius: 'var(--ui-component-radius)' }}
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={12} />
          {showAdvanced ? 'Recolher Ateliê' : 'Expandir Ateliê'}
        </div>
        <Sparkles size={12} className={showAdvanced ? 'animate-pulse' : ''} />
      </button>

      {showAdvanced && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 overflow-hidden shadow-inner border border-[var(--border-color)] shrink-0"
                 style={{ borderRadius: 'var(--ui-radius)' }}>
              <input 
                type="color" 
                value={color} 
                onChange={(e) => onChange(e.target.value)}
                className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
              />
            </div>
            <div className="flex-1 space-y-2">
               <div className="flex items-center gap-2 bg-[var(--surface-elevated)] p-2 border border-[var(--border-color)]"
                    style={{ borderRadius: 'var(--ui-component-radius)' }}>
                 <Hash size={12} className="text-[var(--text-muted)]" />
                 <input 
                   type="text" 
                   value={color.toUpperCase()} 
                   onChange={(e) => onChange(e.target.value)}
                   className="bg-transparent border-none outline-none font-mono text-[10px] w-full text-[var(--text-primary)]"
                 />
               </div>
               <div className="space-y-1">
                  <div className="flex justify-between text-[8px] font-black uppercase text-[var(--text-muted)]">
                    <span>Opacidade</span>
                    <span className="text-[var(--primary)]">{Math.round(opacity * 100)}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.01" 
                    value={opacity} onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
                    className="w-full h-1 bg-black/10 rounded-full appearance-none accent-[var(--primary)]"
                  />
               </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-color)]">
            <h5 className="text-[8px] font-black uppercase text-[var(--text-muted)] tracking-[0.2em] mb-4 flex items-center gap-2">
              <Sparkles size={10} className="text-[var(--primary)]" /> Magic Harmony
            </h5>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex flex-col items-center gap-1.5">
                <button onClick={() => onChange(harmonies.complementary)} className="w-8 h-8 shadow-sm border border-[var(--border-color)] hover:scale-110 transition-all" style={{ backgroundColor: harmonies.complementary, borderRadius: 'var(--ui-component-radius)' }} />
                <span className="text-[7px] font-bold text-[var(--text-muted)] uppercase">Comp.</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex gap-1">
                  {harmonies.analogous.map(c => (
                    <button key={c} onClick={() => onChange(c)} className="w-8 h-8 shadow-sm border border-[var(--border-color)] hover:scale-110 transition-all" style={{ backgroundColor: c, borderRadius: 'var(--ui-component-radius)' }} />
                  ))}
                </div>
                <span className="text-[7px] font-bold text-[var(--text-muted)] uppercase">Análogas</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex gap-1">
                  {harmonies.triadic.map(c => (
                    <button key={c} onClick={() => onChange(c)} className="w-8 h-8 shadow-sm border border-[var(--border-color)] hover:scale-110 transition-all" style={{ backgroundColor: c, borderRadius: 'var(--ui-component-radius)' }} />
                  ))}
                </div>
                <span className="text-[7px] font-bold text-[var(--text-muted)] uppercase">Triádicas</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
