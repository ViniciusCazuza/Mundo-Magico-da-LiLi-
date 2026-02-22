
import React, { useState, useEffect } from "react";
import { Plus, Trash2, BrainCircuit, Sparkles, CheckCircle2, Clock } from "lucide-react";
import { MagicIcon } from "../../../core/components/ui/MagicIcon";
import { MimiCustomTrainingEntry } from "../types";

interface KnowledgeTrainerProps {
  knowledge: MimiCustomTrainingEntry[];
  onChange: (knowledge: MimiCustomTrainingEntry[]) => void;
  isParentView?: boolean;
}

export const KnowledgeTrainer: React.FC<KnowledgeTrainerProps> = ({ knowledge, onChange, isParentView = true }) => {
  const [input, setInput] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const add = () => {
    if (!input.trim()) return;
    
    const newEntry: MimiCustomTrainingEntry = {
      id: `tr_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      content: input.trim()
    };

    onChange([newEntry, ...knowledge]);
    setInput("");
    
    // Feedback AAA
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const remove = (id: string) => {
    onChange(knowledge.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Barra de Entrada de Treinamento */}
      <div className="relative">
        <div className="flex gap-3">
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={isParentView ? "Adicione um fato ou instrução..." : "Ex: Eu amo morangos!"}
            onKeyDown={e => e.key === 'Enter' && add()}
            className="flex-1 p-5 bg-[var(--surface-elevated)] rounded-[var(--ui-radius)] border-[var(--ui-border-width)] border-transparent focus:border-[var(--primary)] outline-none text-sm font-medium transition-all shadow-inner"
          />
          <button 
            onClick={add}
            disabled={!input.trim()}
            className="w-16 h-16 btn-dynamic text-white flex items-center justify-center shadow-lg disabled:opacity-50 disabled:scale-100"
          >
            <MagicIcon icon={Plus} size={24} color="white" />
          </button>
        </div>

        {/* Toast de Sucesso Integrado */}
        {showSuccess && (
          <div className="absolute -top-12 left-0 right-0 flex justify-center animate-fade-in">
             <div className="bg-emerald-500 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl">
                <MagicIcon icon={CheckCircle2} size={14} color="white" /> Treinamento Salvo! ✨
             </div>
          </div>
        )}
      </div>

      {/* Listagem de Governança */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar">
        {knowledge.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center justify-between p-5 bg-[var(--surface)] border-[var(--ui-border-width)] border-[var(--border-color)] rounded-[var(--ui-radius)] group animate-fade-in shadow-sm hover:shadow-md transition-all border-l-[var(--ui-border-width)] border-l-[var(--primary)]"
          >
            <div className="flex-1 flex flex-col gap-1 pr-4">
              <div className="flex items-center gap-2">
                <MagicIcon icon={Sparkles} size={12} color="var(--primary)" />
                <span className="text-sm font-bold text-[var(--text-primary)]">{item.content}</span>
              </div>
              <div className="flex items-center gap-2 text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-tighter">
                <MagicIcon icon={Clock} size={10} color="var(--text-muted)" />
                {new Date(item.createdAt).toLocaleDateString('pt-BR')} às {new Date(item.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <button 
              onClick={() => remove(item.id)}
              className="p-3 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Excluir Treinamento"
            >
              <MagicIcon icon={Trash2} size={18} color="currentColor" />
            </button>
          </div>
        ))}

        {knowledge.length === 0 && (
          <div className="text-center py-10 opacity-30 flex flex-col items-center gap-3">
             <MagicIcon icon={BrainCircuit} size={48} color="var(--text-muted)" />
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mimi ainda não tem treinamentos personalizados.</p>
          </div>
        )}
      </div>
    </div>
  );
};
