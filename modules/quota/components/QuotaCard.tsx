import React from "react";
import { LucideIcon } from "lucide-react";

interface QuotaCardProps {
  name: string;
  icon: LucideIcon;
  used: number;
  limit: number;
  cost: number;
  status: string;
}

export const QuotaCard = React.memo(({ name, icon: Icon, used, limit, cost, status }: QuotaCardProps) => {
  const percent = Math.max(0, Math.min(100, (used / (limit || 1)) * 100));
  const colorClass = percent > 90 ? 'bg-red-500' : percent > 70 ? 'bg-orange-500' : 'bg-indigo-500';
  
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-4 w-full">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl ${percent > 90 ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-500'}`}>
          <Icon size={24} />
        </div>
        <div className="text-right">
          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${percent > 90 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
            {status}
          </span>
          <div className="text-lg font-black text-slate-800 mt-1">${(cost || 0).toFixed(4)}</div>
        </div>
      </div>
      <div>
        <h4 className="text-sm font-black text-slate-700 truncate">{name}</h4>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
          <div className={`h-full transition-all duration-700 ${colorClass}`} style={{ width: `${percent}%` }} />
        </div>
      </div>
    </div>
  );
});
