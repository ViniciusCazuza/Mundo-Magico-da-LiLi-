
import React, { useState, useMemo, useEffect } from "react";
import { 
  Sparkles, Pencil, ChevronLeft, LayoutGrid, MousePointer2, Box, ArrowLeft, Star, Palette as PaletteIcon
} from "lucide-react";
import { IdentityManager } from "../../core/ecosystem/IdentityManager";
import { LaboratoryTool } from "./tools/LaboratoryTool";
import { MagicCanvasTool } from "./tools/MagicCanvasTool";
import { useTheme } from "../../core/theme/useTheme";
import { HackerOverlay } from "../../core/components/MatrixRain";
import { HackerSimulator } from "../../core/components/HackerSimulator";

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
  const { themeId } = useTheme();
  const isHackerMode = themeId === "binary-night";
  
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
          <header className="text-center space-y-4">
             <div className="inline-flex items-center gap-3 px-6 py-2 btn-dynamic text-black shadow-lg animate-mimi-float"
                  style={{ borderRadius: 'var(--ui-radius)', border: '2px solid var(--border-color)' }}>
                <PaletteIcon size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Ateliê de Descobertas</span>
             </div>
             <h1 className="font-hand text-5xl md:text-7xl text-[var(--text-primary)] leading-none">
               O que vamos <span className="text-[var(--primary)]">criar</span> agora?
             </h1>
             <p className="text-lg text-[var(--text-muted)] max-w-xl mx-auto font-medium">
               Escolha uma ferramenta mágica para sua aventura artística.
             </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {ATELIER_TOOLS.map(tool => (
              <button 
                key={tool.id}
                onClick={() => setActiveToolId(tool.id)}
                className="group relative flex flex-col text-left bg-[var(--surface)] border-[var(--ui-border-width)] border-[var(--border-color)] mimi-card overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] active:scale-95"
                style={{ borderRadius: 'var(--ui-radius)' }}
              >
                {/* Efeito de Brilho no Hover */}
                <div className="absolute inset-0 bg-[var(--primary)] opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" />
                
                <div className={`h-32 sm:h-40 w-full bg-gradient-to-br ${tool.bannerGradient} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  <span className="text-5xl sm:text-6xl select-none filter drop-shadow-xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
                    {tool.illustration}
                  </span>
                </div>

                <div className="p-6 space-y-4 relative">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[var(--ui-component-radius)] bg-[var(--primary)] text-black flex items-center justify-center shadow-lg transition-all duration-500 group-hover:rotate-[-10deg]">
                      <tool.icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-hand text-3xl text-[var(--text-primary)] transition-colors group-hover:text-[var(--primary)]">
                        {tool.name}
                      </h3>
                      <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-60">Ferramenta</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium line-clamp-2">
                    {tool.description}
                  </p>

                  <div className="pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 px-6 py-2 btn-dynamic text-black text-[9px] font-black uppercase tracking-[0.2em] transition-all shadow-md group-hover:shadow-lg group-hover:scale-105">
                      Entrar <ArrowLeft size={12} className="rotate-180" />
                    </div>
                    <Star size={20} className="text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
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
      <header className="shrink-0 h-16 sm:h-20 bg-[var(--surface)]/80 backdrop-blur-xl border-b-[var(--ui-border-width)] border-dashed border-[var(--border-color)] px-8 flex items-center justify-between z-[100] animate-fade-in shadow-sm">
        <button 
          onClick={() => setActiveToolId(null)}
          className="flex items-center gap-3 px-6 py-3 btn-dynamic text-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-sm"
        >
          <ChevronLeft size={20} strokeWidth={3} />
          <span>Voltar</span>
        </button>

        <div className="text-center">
          <h2 className="font-hand text-3xl sm:text-4xl text-[var(--text-primary)] leading-none">
            {activeTool?.name}
          </h2>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] mt-1">
            Espaço de Arte da Alice
          </p>
        </div>

        <div className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-black animate-breathing shadow-inner border-[var(--ui-border-width)] border-[var(--primary)]/20`}
             style={{ backgroundColor: 'var(--primary)', borderRadius: 'var(--ui-component-radius)' }}>
          {activeTool && <activeTool.icon size={24} />}
        </div>
      </header>

      <div className="flex-1 flex flex-col min-h-0 relative">
        {isHackerMode && (
          <div className="absolute inset-0 z-50 pointer-events-none opacity-60 bg-black/40">
            <HackerOverlay />
            <HackerSimulator />
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500/20 animate-pulse"></div>
            <div className="absolute bottom-4 right-4 z-50 p-2 border border-green-500/30 bg-black/80 font-mono text-[9px] text-green-500 animate-pulse">
               {`[ATELIER_OVERRIDE_ACTIVE: ${activeToolId || 'STANDBY'}]`}
            </div>
            <StrategicHackGif url="./Gifs_Loading_Cat/siames_gif/fundo_preto(exclusivo tema hacker).gif" />
          </div>
        )}
        {activeTool && <activeTool.component />}
      </div>
    </div>
  );
};
