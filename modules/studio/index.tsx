
import React, { useState, useMemo, useEffect } from "react";
import { 
  Sparkles, Pencil, ChevronLeft, LayoutGrid, MousePointer2, Box, ArrowLeft, Star, Palette as PaletteIcon
} from "lucide-react";
import { IdentityManager } from "../../core/ecosystem/IdentityManager";
import { LaboratoryTool } from "./tools/LaboratoryTool";
import { MagicCanvasTool } from "./tools/MagicCanvasTool";

type StudioToolId = 'laboratory' | 'canvas';

interface StudioToolDefinition {
  id: StudioToolId;
  name: string;
  icon: any;
  component: React.FC;
  description: string;
  color: string;
  illustration: string;
  bannerGradient: string;
}

const ATELIER_TOOLS: StudioToolDefinition[] = [
  { 
    id: 'laboratory', 
    name: 'Laboratório Mágico', 
    icon: Sparkles, 
    component: LaboratoryTool,
    description: 'Transforme seus pensamentos em arte com a ajuda da Gatinha Mimi!',
    color: '#818CF8',
    illustration: '🪄',
    bannerGradient: 'from-indigo-400 to-indigo-600'
  },
  { 
    id: 'canvas', 
    name: 'Pincel de Sonhos', 
    icon: Pencil, 
    component: MagicCanvasTool,
    description: 'Um quadro em branco esperando por suas cores e sua imaginação infinita.',
    color: '#F472B6',
    illustration: '🎨',
    bannerGradient: 'from-pink-400 to-pink-600'
  }
];

const STORAGE_KEY_ACTIVE_TOOL = "alice_atelier_active_tool";

export const StudioModule: React.FC = () => {
  const profile = IdentityManager.getActiveProfile();
  
  const [activeToolId, setActiveToolId] = useState<StudioToolId | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_TOOL);
    return ATELIER_TOOLS.some(t => t.id === saved) ? (saved as StudioToolId) : null;
  });

  useEffect(() => {
    if (activeToolId) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_TOOL, activeToolId);
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_TOOL);
    }
  }, [activeToolId]);

  if (!profile) return null;

  const activeTool = useMemo(() => {
    if (!activeToolId) return null;
    return ATELIER_TOOLS.find(t => t.id === activeToolId);
  }, [activeToolId]);

  if (!activeToolId) {
    return (
      <div className="flex-1 flex flex-col bg-transparent overflow-y-auto no-scrollbar animate-fade-in font-sans p-8 md:p-16 lg:p-24 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary)]/10 blur-[100px] rounded-full animate-aurora pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--accent)]/10 blur-[100px] rounded-full animate-aurora pointer-events-none" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-6xl mx-auto w-full space-y-20 relative z-10">
          <header className="text-center space-y-6">
             <div className="inline-flex items-center gap-3 px-8 py-3 bg-[var(--surface)] border-2 border-[var(--border-color)] rounded-full text-[var(--primary)] shadow-sm animate-mimi-float">
                <PaletteIcon size={20} />
                <span className="text-[11px] font-black uppercase tracking-[0.4em]">Ateliê de Descobertas</span>
             </div>
             <h1 className="font-hand text-7xl md:text-9xl text-slate-800 leading-none">
               O que vamos <span className="text-[var(--primary)]">criar</span> agora?
             </h1>
             <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
               Escolha uma ferramenta mágica para começar sua próxima aventura artística.
             </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {ATELIER_TOOLS.map(tool => (
              <button 
                key={tool.id}
                onClick={() => setActiveToolId(tool.id)}
                className="group relative flex flex-col text-left bg-white border-8 border-white rounded-[4rem] overflow-hidden transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] active:scale-95"
              >
                <div className={`h-64 w-full bg-gradient-to-br ${tool.bannerGradient} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                  <span className="text-9xl select-none filter drop-shadow-2xl transition-all duration-700 group-hover:scale-125 group-hover:rotate-12">
                    {tool.illustration}
                  </span>
                </div>

                <div className="p-12 space-y-6 relative">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl bg-indigo-500 text-[var(--text-on-primary)] flex items-center justify-center shadow-xl transition-all duration-500 group-hover:rotate-[-10deg]" style={{ backgroundColor: tool.color }}>
                      <tool.icon size={36} />
                    </div>
                    <div>
                      <h3 className="font-hand text-5xl text-slate-800 transition-colors group-hover:text-[var(--primary)]">
                        {tool.name}
                      </h3>
                      <p className="text-[11px] font-black uppercase tracking-widest text-slate-300">Portal Criativo</p>
                    </div>
                  </div>
                  
                  <p className="text-lg text-slate-400 leading-relaxed font-medium">
                    {tool.description}
                  </p>

                                       <div className="pt-6 flex items-center justify-between">
                                          <div className="flex items-center gap-3 px-8 py-4 bg-slate-50 rounded-full text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:bg-[var(--primary)] group-hover:text-[var(--text-on-primary)] group-hover:shadow-lg transition-all">
                                             Começar <ArrowLeft size={16} className="rotate-180" />
                                          </div>                     <Star size={32} className="text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          <footer className="text-center opacity-30">
            <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
               <MousePointer2 size={14} /> Solte a sua imaginação, Alice
            </div>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent overflow-hidden relative">
      <header className="shrink-0 h-20 bg-white/80 backdrop-blur-xl border-b-2 border-dashed border-indigo-100 px-8 flex items-center justify-between z-[100] animate-fade-in shadow-sm">
        <button 
          onClick={() => setActiveToolId(null)}
          className="flex items-center gap-3 px-6 py-3 bg-[var(--primary)]/10 text-[var(--primary)] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[var(--primary)] hover:text-[var(--text-on-primary)] transition-all active:scale-95 shadow-sm"
        >
          <ChevronLeft size={20} strokeWidth={3} />
          <span>Voltar</span>
        </button>

        <div className="text-center">
          <h2 className="font-hand text-4xl text-slate-800 leading-none">
            {activeTool?.name}
          </h2>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 mt-1">
            Espaço de Arte da Alice
          </p>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] animate-breathing shadow-inner border border-[var(--primary)]/20">
          {activeTool && <activeTool.icon size={24} />}
        </div>
      </header>

      <div className="flex-1 flex flex-col min-h-0 relative">
        {activeTool && <activeTool.component />}
      </div>
    </div>
  );
};
