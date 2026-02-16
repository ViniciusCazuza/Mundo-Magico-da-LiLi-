
import React, { useState, useMemo } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Heart, 
  Frown, 
  School, 
  Users, 
  Star, 
  AlertTriangle, 
  Clock,
  X
} from "lucide-react";
import { CalendarEvent, ParentReport, UserProfile } from "../../core/types";

interface CalendarModuleProps {
  events: CalendarEvent[];
  onUpdateEvents: (events: CalendarEvent[]) => void;
  reports: ParentReport[];
  profile: UserProfile;
}

export const CalendarModule: React.FC<CalendarModuleProps> = ({ events, onUpdateEvents, reports, profile }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [filterType, setFilterType] = useState<string | 'all'>('all');

  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<CalendarEvent['type']>('happy');

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long' });
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1));

  const filteredEvents = useMemo(() => {
    return events.filter(e => filterType === 'all' || e.type === filterType);
  }, [events, filterType]);

  const calendarDays = useMemo(() => {
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    const days = [];

    for (let i = 0; i < startDay; i++) days.push(null);

    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayEvents = filteredEvents.filter(e => e.date === dateStr);
      const dayReport = reports.find(r => r.date === new Date(year, month, i).toLocaleDateString('pt-BR'));
      
      days.push({
        day: i,
        dateStr,
        events: dayEvents,
        hasReport: !!dayReport
      });
    }
    return days;
  }, [year, month, filteredEvents, reports]);

  const addEvent = () => {
    if (!newTitle || !selectedDay) return;
    const newEvent: CalendarEvent = {
      id: `ev_${Date.now()}`,
      date: selectedDay,
      title: newTitle,
      type: newType,
      timestamp: Date.now()
    };
    onUpdateEvents([...events, newEvent]);
    setNewTitle("");
    setIsAddingEvent(false);
  };

  const getIcon = (type: string, size = 16) => {
    switch(type) {
      case 'happy': return <Heart size={size} className="fill-[var(--primary)] text-[var(--primary)]" />;
      case 'sad': return <Frown size={size} className="text-blue-400" />;
      case 'school': return <School size={size} className="text-orange-400" />;
      case 'family': return <Users size={size} className="text-indigo-400" />;
      default: return <Star size={size} className="text-yellow-400" />;
    }
  };

  const selectedDayData = calendarDays.find(d => d && d.dateStr === selectedDay);

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-0 bg-transparent overflow-hidden">
      {/* Sidebar de Linha do Tempo */}
      <aside className="w-full md:w-80 bg-[var(--surface)] border-r border-[var(--border-color)] flex flex-col shrink-0 overflow-hidden">
        <div className="p-6 border-b border-[var(--border-color)]">
          <h2 className="font-hand text-3xl text-[var(--primary)] mb-4">Linha do Tempo</h2>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {['all', 'happy', 'sad', 'school', 'family', 'other'].map(t => (
              <button 
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${filterType === t ? 'bg-[var(--primary)] text-[var(--text-on-primary)] shadow-md' : 'bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:bg-[var(--surface)]'}`}
              >
                {t === 'all' ? 'Tudo' : t}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {events.sort((a,b) => b.timestamp - a.timestamp).map(e => (
            <div key={e.id} className="mimi-card-elevated p-4 flex gap-3 animate-fade-in bg-[var(--surface-elevated)]">
              <div className="mt-1">{getIcon(e.type, 20)}</div>
              <div>
                <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-tighter">{new Date(e.timestamp).toLocaleDateString('pt-BR')}</p>
                <h4 className="font-bold text-[var(--text-primary)] text-sm leading-tight">{e.title}</h4>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 p-8">
              <Clock size={48} className="mb-4 text-[var(--text-muted)]" />
              <p className="text-sm font-medium text-[var(--text-muted)]">Nenhum momento registrado ainda.</p>
            </div>
          )}
        </div>
      </aside>

      {/* Calendário Principal */}
      <section className="flex-1 p-4 md:p-8 overflow-y-auto no-scrollbar flex flex-col items-center bg-[var(--bg-app)]">
        <div className="w-full max-w-4xl mimi-card overflow-hidden flex flex-col border-[var(--border-color)]">
          {/* Header Calendário */}
          <div className="p-8 flex items-center justify-between bg-[var(--surface-elevated)]">
            <div>
              <h2 className="font-hand text-4xl text-[var(--primary)] capitalize">{monthName}</h2>
              <p className="text-[var(--text-muted)] text-sm font-medium uppercase tracking-widest">{year}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={handlePrevMonth} className="p-3 bg-[var(--surface)] hover:bg-[var(--surface-elevated)] rounded-2xl transition-all text-[var(--primary)] shadow-sm border border-[var(--border-color)]"><ChevronLeft size={24}/></button>
              <button onClick={handleNextMonth} className="p-3 bg-[var(--surface)] hover:bg-[var(--surface-elevated)] rounded-2xl transition-all text-[var(--primary)] shadow-sm border border-[var(--border-color)]"><ChevronRight size={24}/></button>
            </div>
          </div>

          {/* Grid de Dias */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-7 mb-4 text-center">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                <div key={d} className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] py-2">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2 md:gap-4">
              {calendarDays.map((day, idx) => (
                <div key={idx} className="aspect-square relative">
                  {day ? (
                    <button 
                      onClick={() => setSelectedDay(day.dateStr)}
                      className={`w-full h-full rounded-[var(--radius-base)] border-2 transition-all flex flex-col items-center justify-center gap-1 group relative overflow-hidden
                        ${selectedDay === day.dateStr ? 'border-[var(--primary)] bg-[var(--primary)]/10 shadow-inner' : 'border-transparent bg-[var(--surface-elevated)] hover:bg-[var(--surface)] hover:border-[var(--primary)] hover:shadow-lg active:scale-95'}
                      `}
                    >
                      <span className={`text-lg font-black ${selectedDay === day.dateStr ? 'text-[var(--primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--primary)]'}`}>
                        {day.day}
                      </span>
                      <div className="flex gap-0.5">
                        {day.events.slice(0, 3).map(e => (
                          <div key={e.id} className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]"></div>
                        ))}
                      </div>
                      {day.hasReport && (
                        <div className="absolute top-2 right-2 text-orange-400 animate-pulse">
                          <AlertTriangle size={12} />
                        </div>
                      )}
                    </button>
                  ) : <div className="w-full h-full" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Painel do Dia Selecionado */}
        {selectedDay && (
          <div className="w-full max-w-4xl mt-8 mimi-card-elevated p-8 animate-fade-in relative bg-[var(--surface)]">
            <button onClick={() => setSelectedDay(null)} className="absolute top-6 right-6 p-2 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"><X size={20}/></button>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h3 className="font-hand text-3xl text-[var(--text-primary)]">Dia {selectedDay.split('-')[2]} de {monthName}</h3>
                <p className="text-[var(--text-muted)] text-sm font-medium">Momentos registrados para este dia mágico</p>
              </div>
              <button 
                onClick={() => setIsAddingEvent(true)}
                className="mimi-button"
              >
                <Plus size={16} /> Novo Momento
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedDayData?.events.map(e => (
                <div key={e.id} className="p-6 bg-[var(--surface-elevated)] rounded-[var(--radius-base)] border border-[var(--border-color)] flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[var(--surface)] rounded-2xl shadow-sm border border-[var(--border-color)]">{getIcon(e.type, 24)}</div>
                    <div>
                      <h4 className="font-bold text-[var(--text-primary)] leading-tight">{e.title}</h4>
                      <p className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest">{e.type}</p>
                    </div>
                  </div>
                </div>
              ))}
              {selectedDayData?.hasReport && (
                <div className="p-6 bg-orange-50/50 rounded-[var(--radius-base)] border border-orange-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-orange-500"><AlertTriangle size={24}/></div>
                    <div>
                      <h4 className="font-bold text-orange-800 leading-tight">Relatório de Alerta</h4>
                      <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Monitoramento Mimi</p>
                    </div>
                  </div>
                </div>
              )}
              {selectedDayData?.events.length === 0 && !selectedDayData?.hasReport && (
                <div className="col-span-full py-12 text-center opacity-20 italic text-[var(--text-muted)]">
                  Tudo tranquilo por aqui...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Adicionar Evento */}
        {isAddingEvent && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-[var(--surface)] w-full max-w-sm rounded-[3rem] p-8 shadow-2xl space-y-6 border border-[var(--border-color)] text-[var(--text-primary)]">
              <div className="text-center">
                <h3 className="font-hand text-3xl text-[var(--primary)]">Novo Momento</h3>
                <p className="text-[var(--text-muted)] text-sm italic">Como foi o dia, {profile.nickname}?</p>
              </div>

              <div className="space-y-4">
                <input 
                  autoFocus
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="O que aconteceu?"
                  className="mimi-input w-full"
                />

                <div className="grid grid-cols-5 gap-2">
                  {(['happy', 'sad', 'school', 'family', 'other'] as CalendarEvent['type'][]).map(t => (
                    <button 
                      key={t}
                      onClick={() => setNewType(t)}
                      className={`p-3 rounded-2xl flex items-center justify-center transition-all ${newType === t ? 'bg-[var(--primary)] text-[var(--text-on-primary)] shadow-lg scale-110' : 'bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:bg-[var(--surface)]'}`}
                    >
                      {getIcon(t, 20)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setIsAddingEvent(false)} className="flex-1 py-4 font-black text-xs uppercase tracking-widest text-[var(--text-muted)] hover:bg-[var(--surface-elevated)] rounded-2xl transition-all">Cancelar</button>
                <button onClick={addEvent} className="mimi-button flex-1 shadow-lg">Salvar</button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
