
import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { AgendaActivity, AgendaModuleProps } from "../types";

interface MonthlyViewProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  events: AgendaModuleProps['events'];
  reports: AgendaModuleProps['reports'];
  activities: AgendaActivity[];
}

export const MonthlyView: React.FC<MonthlyViewProps> = ({ 
  currentDate, 
  onPrevMonth, 
  onNextMonth, 
  selectedDate, 
  onSelectDate,
  events,
  reports,
  activities
}) => {
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long' });
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    const days = [];

    for (let i = 0; i < startDay; i++) days.push(null);

    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dateStr);
      const dayActivities = activities.filter(a => a.date === dateStr);
      const dayReport = reports.find(r => r.date === new Date(year, month, i).toLocaleDateString('pt-BR'));
      
      // Dominância de Prioridade: HIGH > MEDIUM > LOW
      let dominantPriority: 'HIGH' | 'MEDIUM' | 'LOW' | null = null;
      if (dayActivities.some(a => a.priority === 'HIGH')) dominantPriority = 'HIGH';
      else if (dayActivities.some(a => a.priority === 'MEDIUM')) dominantPriority = 'MEDIUM';
      else if (dayActivities.some(a => a.priority === 'LOW')) dominantPriority = 'LOW';

      days.push({
        day: i,
        dateStr,
        hasEvents: dayEvents.length > 0,
        hasActivities: dayActivities.length > 0,
        hasReport: !!dayReport,
        priority: dominantPriority
      });
    }
    return days;
  }, [year, month, events, reports, activities]);

  return (
    <div className="w-full max-w-lg mimi-card overflow-hidden flex flex-col h-full animate-fade-in border-[var(--border-color)]">
      <header className="p-8 flex items-center justify-between bg-[var(--surface-elevated)]">
        <div>
          <h2 className="font-hand text-4xl text-[var(--primary)] capitalize">{monthName}</h2>
          <p className="text-[var(--text-muted)] text-sm font-medium uppercase tracking-widest">{year}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onPrevMonth} className="p-3 bg-[var(--surface)] hover:bg-[var(--surface-elevated)] rounded-2xl transition-all text-[var(--primary)] shadow-sm border border-[var(--border-color)]"><ChevronLeft size={24}/></button>
          <button onClick={onNextMonth} className="p-3 bg-[var(--surface)] hover:bg-[var(--surface-elevated)] rounded-2xl transition-all text-[var(--primary)] shadow-sm border border-[var(--border-color)]"><ChevronRight size={24}/></button>
        </div>
      </header>

      <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
        <div className="grid grid-cols-7 mb-4 text-center">
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
            <div key={d} className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, idx) => (
            <div key={idx} className="aspect-square relative">
              {day ? (
                <button 
                  onClick={() => onSelectDate(day.dateStr)}
                  className={`w-full h-full rounded-[var(--radius-base)] border-2 transition-all flex flex-col items-center justify-center gap-1 group relative overflow-hidden
                    ${selectedDate === day.dateStr ? 'border-[var(--primary)] bg-[var(--primary)]/10 shadow-inner' : 'border-transparent bg-[var(--surface-elevated)] hover:bg-[var(--surface)] hover:border-[var(--primary)]'}
                    ${day.priority === 'HIGH' ? 'border-red-500/30' : ''}
                  `}
                >
                  <span className={`text-base font-black ${selectedDate === day.dateStr ? 'text-[var(--primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--primary)]'}`}>
                    {day.day}
                  </span>
                  
                  <div className="flex gap-0.5">
                    {day.hasActivities && (
                      <div className={`w-1.5 h-1.5 rounded-full transition-all 
                        ${day.priority === 'HIGH' ? 'bg-red-500 animate-pulse' : 
                          day.priority === 'MEDIUM' ? 'bg-[var(--primary)]' : 'bg-emerald-500'}
                      `} />
                    )}
                    {day.hasEvents && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>}
                  </div>

                  {day.hasReport && (
                    <div className="absolute top-1.5 right-1.5 text-orange-400 animate-pulse">
                      <AlertTriangle size={10} />
                    </div>
                  )}
                  
                  {day.priority === 'HIGH' && (
                    <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />
                  )}
                </button>
              ) : <div className="w-full h-full" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
