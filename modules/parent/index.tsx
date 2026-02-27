import React, { useState, useMemo, useEffect } from "react";
import { 
  ShieldAlert, Search, Calendar, Download, AlertTriangle, Users, MapPin, 
  Activity, ChevronRight, Eye, Terminal, Clock, MessageSquare, Palette, 
  BookOpen, BrainCircuit, Info
} from "lucide-react";
import { ParentReport } from "../../core/types";
import { mimiEvents, MIMI_EVENT_TYPES, ObservabilityEvent } from "../../core/events";

interface ParentZoneViewProps {
  reports: ParentReport[];
  children?: React.ReactNode;
}

// Sub-components moved to top to fix type inference issues
const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
    <Icon size={14} /> {label}
  </button>
);

// Fix: Explicitly define as React.FC to allow reserved props like 'key' and resolve TS error at usage site
const ActivityRow: React.FC<{ event: ObservabilityEvent }> = ({ event }) => {
  const getModuleIcon = () => {
    switch(event.module) {
      case 'chat': return <MessageSquare size={16} className="text-indigo-500" />;
      case 'studio': return <Palette size={16} className="text-amber-500" />;
      case 'library': return <BookOpen size={16} className="text-emerald-500" />;
      default: return <Activity size={16} className="text-slate-500" />;
    }
  };

  const getActionLabel = () => {
    if (event.module === 'chat' && event.action === 'user_message') return "Alice enviou uma mensagem";
    if (event.module === 'chat' && event.action === 'mimi_reply') return "Mimi respondeu";
    return event.action;
  };

  return (
    <div className="group flex items-center gap-6 p-6 bg-white border border-slate-200 rounded-[2rem] hover:shadow-md transition-all animate-fade-in border-l-4 border-l-slate-900">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
        {getModuleIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {new Date(event.timestamp).toLocaleTimeString()} • {event.module}
          </span>
        </div>
        <h4 className="font-bold text-slate-800 text-sm truncate">{getActionLabel()}</h4>
        {event.payload?.text && (
          <p className="text-xs text-slate-500 italic mt-1 line-clamp-1">"{event.payload.text}"</p>
        )}
      </div>
      <div className="text-[8px] font-black text-slate-300 uppercase bg-slate-50 px-3 py-1.5 rounded-full">
        Monitorado
      </div>
    </div>
  );
};

const StatusCard = ({ label, value, color, icon: Icon }: any) => {
  const colors: any = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100'
  };
  return (
    <div className={`p-6 rounded-3xl border ${colors[color]} flex flex-col gap-2`}>
      <div className="flex items-center gap-3">
        <Icon size={16} />
        <span className="text-[9px] font-black uppercase tracking-widest opacity-60">{label}</span>
      </div>
      <p className="text-lg font-black">{value}</p>
    </div>
  );
};

export const ParentZoneView = ({ reports, children }: ParentZoneViewProps) => {
  const [activeTab, setActiveTab] = useState<'observability' | 'reports' | 'operational'>('observability');
  const [filter, setFilter] = useState("");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  
  // Memória Volátil de Observabilidade (POL Stream)
  const [activityStream, setActivityStream] = useState<ObservabilityEvent[]>([]);

  useEffect(() => {
    // Subscreve ao fluxo de observabilidade transversal
    const unsub = mimiEvents.on(MIMI_EVENT_TYPES.OBSERVABILITY_ACTIVITY, (event: ObservabilityEvent) => {
      setActivityStream(prev => [event, ...prev].slice(0, 100)); // Mantém as últimas 100 atividades em memória
    });
    return unsub;
  }, []);

  const filteredReports = useMemo(() => {
    return (reports || []).filter(r => 
      r.mimiAnalysis?.toLowerCase().includes(filter.toLowerCase()) ||
      r.involvedParties?.some(p => p.toLowerCase().includes(filter.toLowerCase())) ||
      r.locations?.some(l => l.toLowerCase().includes(filter.toLowerCase())) ||
      r.keywords?.some(k => k.toLowerCase().includes(filter.toLowerCase()))
    );
  }, [reports, filter]);

  const downloadReport = (report: ParentReport) => {
    const content = `RELATÓRIO DE MONITORAMENTO - MIMI\nData: ${report.date}\nGravidade: ${report.riskLevel.toUpperCase()}\nAnálise: ${report.mimiAnalysis}\nRecomendação: ${report.suggestedParentAction}`.trim();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-mimi-${report.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const selectedReport = reports.find(r => r.id === selectedReportId);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-0 overflow-hidden text-slate-900">
      <header className="px-10 py-6 bg-white border-b border-slate-200 flex justify-between items-center shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
            <ShieldAlert size={24}/>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Governança Parental</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monitoramento de Observabilidade Integral</p>
          </div>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
           <TabButton active={activeTab === 'observability'} onClick={() => setActiveTab('observability')} icon={Eye} label="Monitor Vivo" />
           <TabButton active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} icon={Terminal} label="Alertas" />
           <TabButton active={activeTab === 'operational'} onClick={() => setActiveTab('operational')} icon={Activity} label="Cota & Uso" />
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        {activeTab === 'observability' && (
          <div className="flex-1 flex min-h-0 animate-fade-in">
            {/* Timeline de Atividades */}
            <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-3xl font-hand text-slate-800">Atividade em Tempo Real</h2>
                <div className="flex items-center gap-2 text-[9px] font-black text-emerald-600 uppercase bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Stream Conectado
                </div>
              </div>

              <div className="space-y-4">
                {activityStream.map((event, i) => (
                  <ActivityRow key={`${event.timestamp}-${i}`} event={event} />
                ))}
                {activityStream.length === 0 && (
                  <div className="h-64 flex flex-col items-center justify-center text-center opacity-20 border-2 border-dashed border-slate-200 rounded-[3rem]">
                    <Clock size={48} className="mb-2" />
                    <p className="text-sm font-black uppercase tracking-widest">Aguardando sinais da Alice...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Resumo de Saúde do Ecossistema */}
            <aside className="w-96 border-l border-slate-200 bg-white p-10 hidden xl:block">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Estado do Ecossistema</h3>
              <div className="space-y-6">
                <StatusCard label="Nível de Risco Geral" value="Saudável" color="emerald" icon={ShieldAlert} />
                <StatusCard label="Módulos Ativos" value="Chat, Ateliê" color="indigo" icon={Activity} />
                <StatusCard label="Protocolos de Alerta" value="Ativos" color="amber" icon={AlertTriangle} />
                <div className="pt-8 border-t border-slate-100">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                     <div className="flex items-center gap-3 mb-3">
                        <Info size={16} className="text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Dica Parental</span>
                     </div>
                     <p className="text-xs text-slate-500 leading-relaxed italic">
                        "O fluxo de observabilidade é volátil e não persiste no disco para proteger a privacidade da criança, exceto em casos de alerta crítico."
                     </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="flex-1 flex min-h-0 animate-fade-in">
             <aside className="w-80 border-r border-slate-200 bg-white flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      value={filter}
                      onChange={e => setFilter(e.target.value)}
                      placeholder="Filtrar alertas..." 
                      className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-slate-900"
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-2">
                  {filteredReports.map(r => (
                    <button 
                      key={r.id}
                      onClick={() => setSelectedReportId(r.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${selectedReportId === r.id ? 'border-slate-900 bg-slate-900 text-white shadow-lg' : 'border-transparent hover:bg-slate-50'}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[8px] font-black uppercase tracking-widest ${selectedReportId === r.id ? 'text-slate-400' : 'text-slate-400'}`}>{r.date}</span>
                      </div>
                      <p className="text-sm font-bold truncate">{r.mimiAnalysis}</p>
                    </button>
                  ))}
                </div>
             </aside>

             <main className="flex-1 overflow-y-auto p-10 no-scrollbar">
                {selectedReport ? (
                   <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-3xl font-hand text-slate-800">Relatório Consolidado</h2>
                          <p className="text-slate-400 text-xs mt-1 uppercase font-black tracking-widest">Gravidade: {selectedReport.riskLevel}</p>
                        </div>
                        <button onClick={() => downloadReport(selectedReport)} className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
                           <Download size={20} />
                        </button>
                      </div>
                      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200">
                        <p className="text-slate-700 leading-relaxed italic">"{selectedReport.mimiAnalysis}"</p>
                      </div>
                      <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl">
                         <h4 className="flex items-center gap-3 font-bold mb-4"><AlertTriangle className="text-amber-400" /> Recomendação Parental</h4>
                         <p className="text-slate-400 text-sm leading-relaxed">{selectedReport.suggestedParentAction}</p>
                      </div>
                   </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                     <Terminal size={64} className="mb-4" />
                     <h3 className="text-xl font-bold">Selecione um alerta para auditar</h3>
                  </div>
                )}
             </main>
          </div>
        )}

        {activeTab === 'operational' && (
          <div className="flex-1 p-10 overflow-y-auto no-scrollbar animate-fade-in">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
