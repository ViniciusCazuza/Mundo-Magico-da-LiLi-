import React from "react";
import { LucideIcon } from "lucide-react";
import { MagicIcon } from "../../../core/components/ui/MagicIcon";
import { useTheme } from "../../../core/theme/useTheme";

interface QuotaCardProps {
  name: string;
  icon: LucideIcon;
  used: number;
  limit: number;
  cost: number;
  status: string;
}

export const QuotaCard = React.memo(({ name, icon: Icon, used, limit, cost, status }: QuotaCardProps) => {
  const { themeId } = useTheme();
  const isHackerMode = themeId === "binary-night";
  const isNeubrutalist = themeId === "neubrutalist-raw";

  const percent = Math.max(0, Math.min(100, (used / (limit || 1)) * 100));
  
  // Cores dinâmicas baseadas no status e tema
  const getProgressColor = () => {
    if (isHackerMode) return 'bg-green-500 shadow-[0_0_10px_#00FF41]';
    if (percent > 90) return 'bg-red-500';
    if (percent > 70) return 'bg-orange-500';
    return 'bg-[var(--primary)]';
  };

  const getIconContainerClass = () => {
    if (isHackerMode) return 'bg-green-500/10 text-green-500 border border-green-500/30';
    if (percent > 90) return 'bg-red-50 text-red-500';
    return 'bg-[var(--surface-elevated)] text-[var(--primary)]';
  };

  return (
    <div 
      className={`
        p-8 flex flex-col gap-5 w-full transition-all duration-300 relative overflow-hidden
        ${isHackerMode ? 'bg-black/80 border border-green-500/50 shadow-[0_0_15px_rgba(0,255,65,0.1)]' : 'mimi-card bg-[var(--surface)]'}
      `}
      style={{
        borderRadius: isHackerMode ? '0px' : 'var(--ui-radius)',
        borderWidth: isHackerMode ? '1px' : 'var(--ui-border-width)'
      }}
    >
      {/* Glitch Overlay for Hacker Mode */}
      {isHackerMode && <div className="absolute top-0 right-0 w-1 h-full bg-green-500/10 animate-pulse"></div>}

      <div className="flex justify-between items-start relative z-10">
        <div className={`p-4 rounded-[var(--ui-component-radius)] shadow-sm ${getIconContainerClass()}`}>
          <MagicIcon icon={Icon} size={28} color="currentColor" variant="duotone" />
        </div>
        <div className="text-right">
          <span className={`
            text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full
            ${isHackerMode 
              ? 'bg-green-500/20 text-green-400 border border-green-500/40' 
              : (percent > 90 ? 'bg-red-100 text-red-600' : 'bg-[var(--primary)]/10 text-[var(--primary)]')
            }
          `}>
            {status}
          </span>
          <div className={`text-2xl font-black mt-2 ${isHackerMode ? 'text-green-500 font-mono' : 'text-[var(--text-primary)]'}`}>
            {isHackerMode ? `COST: $${(cost || 0).toFixed(6)}` : `$${(cost || 0).toFixed(4)}`}
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-60 ${isHackerMode ? 'text-green-500' : 'text-[var(--text-muted)]'}`}>
          {name}
        </h4>
        <div className={`h-3 rounded-full overflow-hidden ${isHackerMode ? 'bg-green-950 border border-green-900' : 'bg-[var(--surface-elevated)]'}`}>
          <div 
            className={`h-full transition-all duration-1000 ease-out ${getProgressColor()}`} 
            style={{ width: `${percent}%` }} 
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className={`text-[9px] font-bold ${isHackerMode ? 'text-green-700' : 'text-[var(--text-muted)]'}`}>
            {used.toLocaleString()} {isHackerMode ? 'UNITS' : 'usados'}
          </span>
          <span className={`text-[9px] font-bold ${isHackerMode ? 'text-green-700' : 'text-[var(--text-muted)]'}`}>
            LIMIT: {limit.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
});
