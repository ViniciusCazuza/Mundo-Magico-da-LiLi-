
import React from "react";
import { Bell, BellOff, Trash2, Pencil, AlertCircle, Cat, PawPrint } from "lucide-react";
import { AgendaActivity } from "../types";
import { ActivityIcon } from "./ActivityIcon";

interface ActivityCardProps {
  activity: AgendaActivity;
  onToggleAlert: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (activity: AgendaActivity) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onToggleAlert, onDelete, onEdit }) => {
  const getPriorityData = () => {
    switch(activity.priority) {
      case 'HIGH': 
        return { 
          color: '#EF4444', 
          label: 'Alerta Bigodinho!', 
          icon: AlertCircle, 
          className: 'animate-mimi-pulse-red border-red-500 bg-red-50/10' 
        };
      case 'MEDIUM': 
        return { 
          color: 'var(--primary)', 
          label: 'Miado Importante', 
          icon: Cat, 
          className: 'border-[var(--primary)] bg-[var(--primary)]/5' 
        };
      case 'LOW': 
        return { 
          color: '#10B981', 
          label: 'Patinha Tranquila', 
          icon: PawPrint, 
          className: 'border-emerald-400 bg-emerald-50/10' 
        };
      default: 
        return { 
          color: 'var(--border-color)', 
          label: 'Rotina', 
          icon: Cat, 
          className: 'border-[var(--border-color)]' 
        };
    }
  };

  const priorityData = getPriorityData();

  return (
    <div 
      className={`flex items-center gap-4 bg-[var(--surface)] p-5 border-2 shadow-sm group hover:shadow-md transition-all animate-fade-in ${priorityData.className}`}
      style={{ borderLeftWidth: '8px', borderLeftColor: priorityData.color, borderRadius: 'var(--ui-radius)' }}
    >
      <div className="w-14 font-black text-[var(--text-primary)] text-sm opacity-80">
        {activity.time}
      </div>
      
      <div className="w-12 h-12 flex items-center justify-center shadow-inner shrink-0"
           style={{ borderRadius: 'var(--ui-component-radius)', backgroundColor: 'var(--surface-elevated)' }}>
        <ActivityIcon name={activity.icon || activity.name} size={24} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-[var(--text-primary)] text-base truncate">{activity.name}</h4>
          </div>
          
          {/* Badge de Prioridade Temática */}
          <div 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full w-fit"
            style={{ backgroundColor: `${priorityData.color}20` }}
          >
            <priorityData.icon size={10} style={{ color: priorityData.color }} />
            <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: priorityData.color }}>
              {priorityData.label}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2 shrink-0">
        <button 
          onClick={() => onToggleAlert(activity.id)}
          aria-label="Alternar alerta"
          className={`p-3 transition-all ${activity.alertEnabled ? 'bg-[var(--primary)] text-white shadow-lg' : 'bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:bg-black/5'}`}
          style={{ borderRadius: 'var(--ui-component-radius)' }}
        >
          {activity.alertEnabled ? <Bell size={18} /> : <BellOff size={18} />}
        </button>
        <button 
          onClick={() => onEdit(activity)}
          aria-label="Editar atividade"
          className="p-3 text-[var(--text-muted)] hover:text-[var(--primary)] transition-all opacity-0 group-hover:opacity-100"
          style={{ borderRadius: 'var(--ui-component-radius)' }}
        >
          <Pencil size={18} />
        </button>
        <button 
          onClick={() => onDelete(activity.id)}
          aria-label="Excluir atividade"
          className="p-3 text-[var(--text-muted)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
          style={{ borderRadius: 'var(--ui-component-radius)' }}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};
