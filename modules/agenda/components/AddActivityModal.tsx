
import React, { useState, useMemo } from "react";
import { X, Check, Bell, Sparkles, ChevronLeft, ChevronRight, Search, PawPrint, Cat, AlertCircle } from "lucide-react";
import { PredefinedActivity, ActivityPriority, AgendaActivity } from "../types";
import { ActivityIcon } from "./ActivityIcon";

interface AddActivityModalProps {
  date: string;
  onClose: () => void;
  onAdd: (activity: { 
    name: string; 
    time: string; 
    icon: string; 
    isCustom: boolean; 
    alertEnabled: boolean; 
    priority: ActivityPriority;
    alertOffsetMinutes?: number;
  }) => void;
  onUpdate?: (activity: AgendaActivity) => void;
  initialData?: AgendaActivity;
}

const PREDEFINED: PredefinedActivity[] = [
  { name: "Acordar", icon: "☀️", defaultTime: "07:00" },
  { name: "Café da Manhã", icon: "🥛", defaultTime: "07:30" },
  { name: "Entrada da Escola", icon: "🎒", defaultTime: "08:00" },
  { name: "Saída da Escola", icon: "🏫", defaultTime: "12:00" },
  { name: "Almoçar", icon: "🍝", defaultTime: "12:30" },
  { name: "Jogar", icon: "🎮", defaultTime: "14:00" },
  { name: "Assistir Desenho", icon: "📺", defaultTime: "16:00" },
  { name: "Jantar", icon: "🍕", defaultTime: "19:00" },
  { name: "Dormir", icon: "🌙", defaultTime: "21:00" },
];

const EMOJI_CATEGORIES = [
  { label: "Rotina", emojis: ["⏰", "☀️", "🌙", "🚿", "🪥", "👗", "🛌", "🧴"] },
  { label: "Comida", emojis: ["🍎", "🥛", "🍞", "🥣", "🥪", "🍝", "🍕", "🍦", "🍭", "🍉"] },
  { label: "Diversão", emojis: ["🎮", "🧸", "🎨", "⚽", "🚲", "🧩", "💃", "🎢", "🎸", "🎈"] },
  { label: "Estudo", emojis: ["📚", "✏️", "🎒", "🏫", "🧠", "🧪", "📐", "🎹"] },
  { label: "Mágico", emojis: ["✨", "🌈", "🦄", "🐱", "🐶", "🧚", "🪄", "🌟", "🍀", "💖"] }
];

export const AddActivityModal: React.FC<AddActivityModalProps> = ({ date, onClose, onAdd, onUpdate, initialData }) => {
  const [step, setStep] = useState<'TYPE' | 'DETAILS' | 'ICON'>(initialData ? 'DETAILS' : 'TYPE');
  const [selectedPredefined, setSelectedPredefined] = useState<PredefinedActivity | null>(
    initialData && !initialData.isCustom ? PREDEFINED.find(p => p.name === initialData.name) || null : null
  );
  
  const [name, setName] = useState(initialData?.name || "");
  const [time, setTime] = useState(initialData?.time || "");
  const [icon, setIcon] = useState(initialData?.icon || "✨");
  const [priority, setPriority] = useState<ActivityPriority>(initialData?.priority || "MEDIUM");
  const [alertEnabled, setAlertEnabled] = useState(initialData?.alertEnabled || false);
  const [alertOffset, setAlertOffset] = useState(initialData?.alertOffsetMinutes || 15);

  const isEditMode = !!initialData;

  const handleSelectPredefined = (p: PredefinedActivity) => {
    setSelectedPredefined(p);
    setName(p.name);
    setTime(p.defaultTime);
    setIcon(p.icon);
    setStep('DETAILS');
  };

  const handleCustomStart = () => {
    setSelectedPredefined(null);
    setName("");
    setTime("");
    setIcon("✨");
    setStep('DETAILS');
  };

  const handleFinalSave = () => {
    if (!name || !time || !icon) return;

    if (isEditMode && onUpdate && initialData) {
      onUpdate({
        ...initialData,
        name,
        time,
        icon,
        alertEnabled,
        priority,
        alertOffsetMinutes: alertEnabled ? alertOffset : undefined
      });
    } else {
      onAdd({
        name,
        time,
        icon,
        isCustom: !selectedPredefined,
        alertEnabled,
        priority,
        alertOffsetMinutes: alertEnabled ? alertOffset : undefined
      });
    }
    onClose();
  };

  const getPriorityStyle = (p: ActivityPriority) => {
    const isActive = priority === p;
    switch(p) {
      case 'HIGH': return isActive ? 'bg-red-500 text-white shadow-[0_5px_15px_-5px_#EF4444] scale-105' : 'text-red-500 bg-red-50 opacity-60 hover:opacity-100';
      case 'MEDIUM': return isActive ? 'bg-[var(--primary)] text-[var(--text-on-primary)] shadow-[0_5px_15px_-5px_var(--primary)] scale-105' : 'text-[var(--primary)] bg-[var(--primary)]/5 opacity-60 hover:opacity-100';
      case 'LOW': return isActive ? 'bg-emerald-500 text-white shadow-[0_5px_15px_-5px_#10B981] scale-105' : 'text-emerald-500 bg-emerald-50 opacity-60 hover:opacity-100';
      default: return '';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/40 animate-fade-in"
      style={{ backdropFilter: 'blur(var(--ui-blur))', WebkitBackdropFilter: 'blur(var(--ui-blur))' }}
    >
      <div className="bg-[var(--surface)] w-full max-w-lg mimi-card p-8 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border-[var(--ui-border-width)] border-[var(--border-color)] text-[var(--text-primary)]"
           style={{ borderRadius: 'var(--ui-radius)' }}>
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            {step !== 'TYPE' && !isEditMode && (
               <button onClick={() => setStep(step === 'ICON' ? 'DETAILS' : 'TYPE')} className="p-2 text-[var(--text-muted)] hover:text-[var(--primary)] transition-all">
                  <ChevronLeft size={24} />
               </button>
            )}
            <h3 className="font-hand text-3xl text-[var(--primary)]">
              {step === 'TYPE' ? 'Nova Atividade' : step === 'ICON' ? 'Escolha o Ícone' : (isEditMode ? 'Editar Atividade' : 'Ajustes Mágicos')}
            </h3>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="p-2 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
            <X size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 pr-2">
          {step === 'TYPE' ? (
            <div className="animate-fade-in space-y-8">
              <section className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-2">Sugestões da Mimi</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PREDEFINED.map(p => (
                    <button 
                      key={p.name}
                      onClick={() => handleSelectPredefined(p)}
                      className="flex flex-col items-center gap-2 p-4 bg-[var(--surface-elevated)] rounded-[var(--ui-radius)] border-[var(--ui-border-width)] border-transparent hover:border-[var(--primary)] transition-all hover:bg-[var(--surface)] hover:shadow-md group"
                    >
                      <div className="text-3xl group-hover:scale-125 transition-transform">{p.icon}</div>
                      <span className="text-[10px] font-bold text-[var(--text-primary)] text-center">{p.name}</span>
                    </button>
                  ))}
                  <button 
                    onClick={handleCustomStart}
                    className="flex flex-col items-center justify-center gap-2 p-4 bg-[var(--surface)] rounded-[var(--ui-radius)] border-[var(--ui-border-width)] border-dashed border-[var(--border-color)] hover:border-[var(--primary)] hover:bg-[var(--bg-app)]/30 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      <Sparkles size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)]">Personalizada</span>
                  </button>
                </div>
              </section>
            </div>
          ) : step === 'ICON' ? (
            <div className="animate-fade-in space-y-8 pb-4">
               {EMOJI_CATEGORIES.map(cat => (
                 <section key={cat.label} className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-2">{cat.label}</h4>
                    <div className="grid grid-cols-5 gap-3">
                       {cat.emojis.map(e => (
                         <button 
                           key={e}
                           onClick={() => {
                             setIcon(e);
                             setStep('DETAILS');
                           }}
                           className={`aspect-square text-3xl flex items-center justify-center rounded-[var(--ui-radius)] border-[var(--ui-border-width)] transition-all hover:scale-110 ${icon === e ? 'border-[var(--primary)] bg-[var(--primary)]/10 shadow-inner' : 'border-transparent bg-[var(--surface-elevated)] hover:bg-[var(--surface)]'}`}
                         >
                           {e}
                         </button>
                       ))}
                    </div>
                 </section>
               ))}
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                   <button 
                     onClick={() => setStep('ICON')}
                     className="p-4 bg-[var(--surface-elevated)] rounded-[var(--ui-radius)] text-4xl border-[var(--ui-border-width)] border-transparent hover:border-[var(--primary)] min-w-[80px] h-20 flex items-center justify-center transition-all hover:scale-105 shadow-sm group"
                   >
                     <span className="group-hover:animate-mimi-float">{icon}</span>
                   </button>
                   <div className="flex-1">
                      <input 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Nome da atividade..."
                        disabled={!!selectedPredefined && !isEditMode}
                        className="w-full bg-transparent p-0 text-xl font-bold text-[var(--text-primary)] outline-none border-b-[var(--ui-border-width)] border-transparent focus:border-[var(--primary)] transition-all"
                      />
                      <p className="text-[10px] text-[var(--text-muted)] uppercase font-black tracking-widest mt-1">
                        {isEditMode ? 'Editando' : 'Sua Atividade'}
                      </p>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-2">Horário</label>
                  <input 
                    type="time"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full p-4 bg-[var(--surface-elevated)] rounded-[var(--ui-radius)] border-[var(--ui-border-width)] border-[var(--border-color)] focus:border-[var(--primary)] outline-none font-bold text-[var(--text-primary)] transition-all shadow-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-2">O quão importante é?</label>
                  <div className="flex bg-[var(--bg-app)]/50 p-1.5 rounded-[var(--ui-radius)] border-[var(--ui-border-width)] border-[var(--border-color)]">
                    {(['LOW', 'MEDIUM', 'HIGH'] as ActivityPriority[]).map(p => (
                      <button 
                        key={p}
                        onClick={() => setPriority(p)}
                        className={`flex-1 py-3 rounded-[var(--ui-radius)] text-[8px] font-black uppercase tracking-tight transition-all flex flex-col items-center gap-1 ${getPriorityStyle(p)}`}
                      >
                        {p === 'LOW' && <><PawPrint size={14} /> Patinha</>}
                        {p === 'MEDIUM' && <><Cat size={14} /> Miado</>}
                        {p === 'HIGH' && <><AlertCircle size={14} /> Alerta</>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-[var(--surface-elevated)] rounded-[var(--ui-radius)] border-[var(--ui-border-width)] border-[var(--border-color)] space-y-6 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-[var(--ui-radius)] transition-colors ${alertEnabled ? 'bg-orange-500 text-white shadow-md' : 'bg-[var(--border-color)] text-[var(--text-muted)]'}`}>
                      <Bell size={18} />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-[var(--text-primary)]">Lembrar Alice?</h5>
                      <p className="text-[10px] text-[var(--text-muted)] font-medium">Aviso mágico antes da hora</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setAlertEnabled(!alertEnabled)}
                    className={`w-12 h-7 rounded-full relative transition-colors ${alertEnabled ? 'bg-orange-500 shadow-inner' : 'bg-[var(--border-color)]'}`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${alertEnabled ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

                {alertEnabled && (
                  <div className="flex items-center justify-between gap-4 animate-fade-in pt-2">
                    <span className="text-xs font-medium text-[var(--text-muted)] shrink-0">Quanto tempo antes?</span>
                    <div className="flex bg-[var(--surface)] rounded-[var(--ui-radius)] border-[var(--ui-border-width)] border-[var(--border-color)] p-1 shadow-sm">
                      {[5, 15, 30].map(m => (
                        <button 
                          key={m}
                          onClick={() => setAlertOffset(m)}
                          className={`px-4 py-1.5 rounded-[var(--ui-radius)] text-[10px] font-black transition-all ${alertOffset === m ? 'bg-orange-500 text-white shadow-sm' : 'text-[var(--text-muted)] opacity-50'}`}
                        >
                          {m}m
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-4 pt-4 pb-2">
                 <button 
                   onClick={() => isEditMode ? onClose() : setStep('TYPE')}
                   className="flex-1 py-5 border-[var(--ui-border-width)] border-[var(--border-color)] text-[var(--text-muted)] rounded-[var(--ui-radius)] font-black text-xs uppercase tracking-widest hover:bg-[var(--surface-elevated)] transition-all active:scale-95"
                 >
                   {isEditMode ? 'Cancelar' : 'Voltar'}
                 </button>
                 <button 
                   onClick={handleFinalSave}
                   disabled={!name || !time || !icon}
                   className="flex-[2] btn-dynamic py-5 shadow-2xl disabled:opacity-50"
                 >
                   <Check size={18} /> {isEditMode ? 'Salvar Alterações' : 'Tudo Pronto! ✨'}
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
