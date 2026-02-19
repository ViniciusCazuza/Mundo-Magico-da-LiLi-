
import React from "react";
import { Plus, Clock, Sparkles, Heart } from "lucide-react";
import { AgendaActivity, AgendaModuleProps } from "../types";
import { ActivityCard } from "./ActivityCard";
import { ActivityIcon } from "./ActivityIcon";

interface DailyAgendaViewProps {
  date: string;
  activities: AgendaActivity[];
  events: AgendaModuleProps['events'];
  onAddClick: () => void;
  onToggleAlert: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (activity: AgendaActivity) => void;
}

export const DailyAgendaView: React.FC<DailyAgendaViewProps> = ({ 
  date, 
  activities, 
  events, 
  onAddClick, 
  onToggleAlert, 
  onDelete,
  onEdit
}) => {
  const [year, month, day] = date.split('-');
  const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  const dayName = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });

  const dayEvents = events.filter(e => e.date === date);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-transparent overflow-hidden">
      <header className="p-6 md:p-8 shrink-0 flex justify-between items-center bg-[var(--surface)]/50 backdrop-blur-sm border-b border-[var(--border-color)]">
        <div>
          <h3 className="font-hand text-4xl text-[var(--text-primary)] capitalize">{dayName}, {day}</h3>
          <p className="text-[var(--text-muted)] text-sm font-medium">Sua jornada de hoje Alice!</p>
        </div>
        <button 
          onClick={onAddClick}
          className="btn-dynamic p-4 text-white shadow-lg"
          style={{ borderRadius: 'var(--ui-radius)' }}
          aria-label="Adicionar Nova Atividade"
        >
          <Plus size={24} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 no-scrollbar">
        {/* Momentos Emocionais */}
        {dayEvents.length > 0 && (
          <section className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] flex items-center gap-2">
              <Heart size={14} className="fill-[var(--primary)]" /> Emoções do Dia
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {dayEvents.map(e => (
                <div key={e.id} className="p-4 bg-[var(--surface-elevated)] border border-[var(--border-color)] flex items-center gap-3"
                     style={{ borderRadius: 'var(--ui-radius)' }}>
                  <ActivityIcon name={e.type} size={18} className="text-[var(--primary)]" />
                  <span className="font-bold text-[var(--text-primary)] text-sm">{e.title}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Atividades Timeline */}
        <section className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-2">
            <Clock size={14} /> Minha Agenda
          </h4>
          
          <div className="space-y-3 relative">
            {activities.length > 0 ? (
              activities.map(activity => (
                <ActivityCard 
                  key={activity.id} 
                  activity={activity} 
                  onToggleAlert={onToggleAlert}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center opacity-30 space-y-4">
                <div className="w-16 h-16 bg-[var(--surface-elevated)] rounded-full flex items-center justify-center text-[var(--primary)]">
                  <Sparkles size={32} />
                </div>
                <p className="text-sm font-medium text-[var(--text-muted)]">O que vamos fazer hoje?</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
