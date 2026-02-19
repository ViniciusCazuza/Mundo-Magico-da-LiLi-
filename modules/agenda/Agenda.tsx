
import React, { useState } from "react";
import { AgendaModuleProps, AgendaActivity } from "./types";
import { useAgendaState } from "./hooks/useAgendaState";
import { MonthlyView } from "./components/MonthlyView";
import { DailyAgendaView } from "./components/DailyAgendaView";
import { AddActivityModal } from "./components/AddActivityModal";

export const AgendaModule: React.FC<AgendaModuleProps> = (props) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [isAdding, setIsAdding] = useState(false);
  const [editingActivity, setEditingActivity] = useState<AgendaActivity | null>(null);

  const { activities, dailyActivities, addActivity, updateActivity, removeActivity, toggleAlert } = useAgendaState(selectedDate);

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const onAddActivity = (data: any) => {
    addActivity({
      ...data,
      date: selectedDate
    });
  };

  const onUpdateActivity = (updated: AgendaActivity) => {
    updateActivity(updated);
  };

  const handleEdit = (activity: AgendaActivity) => {
    setEditingActivity(activity);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-0 bg-transparent overflow-hidden animate-fade-in">
      {/* Lado Esquerdo: Calendário Mensal */}
      <section className="w-full md:w-[450px] p-4 md:p-8 flex flex-col shrink-0 border-r border-[var(--border-color)] bg-[var(--surface)]">
        <MonthlyView 
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          events={props.events}
          reports={props.reports}
          activities={activities} 
        />
        
        {/* Legenda semântica temática */}
        <div className="mt-8 grid grid-cols-2 gap-y-4 gap-x-2 px-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.4)]" />
            <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest">Patinha</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)] shadow-[0_0_5px_var(--primary)]" />
            <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest">Miado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_5px_var(--accent)]" />
            <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest">Alerta!</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--text-muted)] opacity-40" />
            <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest">Momentos</span>
          </div>
        </div>
      </section>

      {/* Lado Direito: Agenda Diária */}
      <DailyAgendaView 
        date={selectedDate}
        activities={dailyActivities}
        events={props.events}
        onAddClick={() => setIsAdding(true)}
        onToggleAlert={toggleAlert}
        onDelete={removeActivity}
        onEdit={handleEdit}
      />

      {/* Modal de Criação / Edição */}
      {(isAdding || editingActivity) && (
        <AddActivityModal 
          date={selectedDate}
          onClose={() => {
            setIsAdding(false);
            setEditingActivity(null);
          }}
          onAdd={onAddActivity}
          onUpdate={onUpdateActivity}
          initialData={editingActivity || undefined}
        />
      )}
    </div>
  );
};
