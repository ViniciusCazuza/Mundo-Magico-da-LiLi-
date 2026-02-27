
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
          colorVar: 'var(--color-danger)', 
          label: 'Alerta Bigodinho!', 
          icon: AlertCircle, 
          className: 'animate-mimi-pulse-red border-[var(--color-danger)] bg-[color:var(--color-danger)/0.1]' 
        };
      case 'MEDIUM': 
        return { 
          colorVar: 'var(--primary)', 
          label: 'Miado Importante', 
          icon: Cat, 
          className: 'border-[var(--primary)] bg-[var(--primary)]/5' 
        };
      case 'LOW': 
        return { 
          colorVar: 'var(--color-success)', 
          label: 'Patinha Tranquila', 
          icon: PawPrint, 
          className: 'border-[var(--color-success)] bg-[color:var(--color-success)/0.1]' 
        };
      default: 
        return { 
          colorVar: 'var(--border-color)', 
          label: 'Rotina', 
          icon: Cat, 
          className: 'border-[var(--border-color)]' 
        };
    }
  };

  const priorityData = getPriorityData();

  return (
    <div 
      className={`flex items-center gap-4 bg-[var(--surface)] p-5 rounded-[2rem] border-2 shadow-sm group hover:shadow-md transition-all animate-fade-in ${priorityData.className}`}
      style={{ borderLeftWidth: '8px', borderLeftColor: priorityData.colorVar }}
    >
      <div className="w-14 font-black text-[var(--text-primary)] text-sm opacity-80">
        {activity.time}
      </div>
      
      <div className="w-12 h-12 rounded-2xl bg-[var(--surface-elevated)] flex items-center justify-center shadow-inner shrink-0">
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
            style={{ backgroundColor: `${priorityData.colorVar}20` }}
          >
            <priorityData.icon size={10} style={{ color: priorityData.colorVar }} />
            <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: priorityData.colorVar }}>
              {priorityData.label}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2 shrink-0">
        <button 
          onClick={() => onToggleAlert(activity.id)}
          aria-label="Alternar alerta"
          className={`p-3 rounded-2xl transition-all ${activity.alertEnabled ? 'bg-[var(--primary)] text-[var(--text-on-primary)] shadow-lg' : 'bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:bg-black/5'}`}
        >
          {activity.alertEnabled ? <Bell size={18} /> : <BellOff size={18} />}
        </button>
        <button 
          onClick={() => onEdit(activity)}
          aria-label="Editar atividade"
          className="p-3 rounded-2xl text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--surface-elevated)] transition-all opacity-0 group-hover:opacity-100"
        >
          <Pencil size={18} />
        </button>
        <button 
          onClick={() => onDelete(activity.id)}
          aria-label="Excluir atividade"
          className="p-3 rounded-2xl text-[var(--text-muted)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};
