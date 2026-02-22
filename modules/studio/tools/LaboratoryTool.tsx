import React, { useState, useEffect, useMemo } from "react";
import { 
  Palette, Wand2, Sparkles, Download, RefreshCw, 
  Image as ImageIcon, Cat, AlertCircle, Wand, Type, Image as ImageLucide, ChevronRight,
  Layout, Heart, BookOpen, Eraser, Save, Layers
} from "lucide-react";
import { IdentityManager } from "../../../core/ecosystem/IdentityManager";
import { mimiEvents, MIMI_EVENT_TYPES, ObservabilityEvent } from "../../../core/events";
import { generateMagicImage, generateInspirationPrompt, StudioImageResponse, StudioOptions } from "../services/studio.api";
import { LibraryItem } from "../../../core/types";
import { STORAGE_KEYS } from "../../../core/config";
import { safeJsonParse } from "../../../core/utils";
import { TactileButton } from "../../../core/components/ui/TactileButton";
import { useStudio } from "../hooks/useStudio";
import { DrawingLayerType } from "../types";

const MIMI_PRAISES = [
  "Uau, que imaginação linda!",
  "Esse desenho ficou mágico!",
  "Olha como ficou colorido!",
  "Amei as cores que você escolheu!",
  "Você é uma grande artista!",
  "Miau! Que ideia incrível!",
];

const ART_STYLES = [
  { id: 'watercolor', label: 'Aquarela', icon: '🎨' },
  { id: '3d', label: '3D Fofo', icon: '🧸' },
  { id: 'crayon', label: 'Giz de Cera', icon: '🖍️' },
  { id: 'papercut', label: 'Papel', icon: '✂️' },
  { id: 'storybook', label: 'Livro', icon: '📚' },
];

const INSPIRING_PHRASES = [
  "Onde a mágica ganha vida...",
  "Sua próxima obra de arte...",
  "O que o seu coração vê hoje?",
  "Pintando sonhos com a Alice...",
  "Um mundo de cores espera por você.",
  "Miau! Vamos criar algo incrível?"
];

const SESSION_STORAGE_KEY = "alice_studio_session_v2";

export interface LaboratoryToolProps {
  onUseInCanvas?: (imageUrl: string) => void;
}

export const LaboratoryTool: React.FC<LaboratoryToolProps> = ({ onUseInCanvas }) => {
  const profile = IdentityManager.getActiveProfile();
  const { addLayer, createNewDrawing, saveLayer } = useStudio(profile?.id);
  
  const savedSession = useMemo(() => {
    const data = localStorage.getItem(SESSION_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }, []);

  const [prompt, setPrompt] = useState(savedSession?.prompt || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGettingInspiration, setIsGettingInspiration] = useState(false);
  const [lastCreation, setLastCreation] = useState<StudioImageResponse | null>(savedSession?.lastCreation || null);
  const [error, setError] = useState<string | null>(null);
  const [mimiMessage, setMimiMessage] = useState<string>("");
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const [isSavingToGallery, setIsSavingToGallery] = useState(false);

  const [artStyle, setArtStyle] = useState(savedSession?.artStyle || 'watercolor');
  const [fantasyLevel, setFantasyLevel] = useState(savedSession?.fantasyLevel || 3);
  const [detailLevel, setDetailLevel] = useState(savedSession?.detailLevel || 'medium');
  const [illustrationType, setIllustrationType] = useState<'scene' | 'character'>(savedSession?.illustrationType || 'scene');
  const [framing, setFraming] = useState<'full' | 'portrait'>(savedSession?.framing || 'full');
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical' | 'square'>(savedSession?.orientation || 'horizontal');
  const [includeText, setIncludeText] = useState(savedSession?.includeText || false);
  const [textInImage, setTextInImage] = useState(savedSession?.textInImage || "");

  useEffect(() => {
    const sessionData = {
      prompt, lastCreation, artStyle, fantasyLevel, detailLevel, 
      illustrationType, framing, orientation, includeText, textInImage
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
  }, [prompt, lastCreation, artStyle, fantasyLevel, detailLevel, illustrationType, framing, orientation, includeText, textInImage]);

  if (!profile) return null;

  const handleClearArt = () => {
    if (isGenerating) return;
    setPrompt("");
    setLastCreation(null);
    setError(null);
    setMimiMessage("");
    setTextInImage("");
    setIncludeText(false);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const handleGenerate = async () => {
    if (isGenerating || !prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    setMimiMessage("Invocando as tintas mágicas...");

    const options: StudioOptions = {
      artStyle, fantasyLevel, detailLevel, illustrationType, framing, orientation,
      textConfig: { enabled: includeText, content: textInImage }
    };

    try {
      const result = await generateMagicImage(prompt, profile, options);
      setLastCreation(result);
      setMimiMessage(MIMI_PRAISES[Math.floor(Math.random() * MIMI_PRAISES.length)]);
    } catch (err: any) {
      setError(err.message || "Erro nos pincéis!");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToGallery = async () => {
    if (!lastCreation?.imageUrl) return;
    setIsSavingToGallery(true);
    
    try {
      // Cria um novo desenho se não existir, ou adiciona como camada
      const result = await addLayer(
        DrawingLayerType.Raster,
        `Lab: ${prompt.slice(0, 30)}...`,
        lastCreation.imageUrl
      );
      
      if (result.success) {
        setShowSavedFeedback(true);
        setMimiMessage("Salvo na galeria! Miau!");
        setTimeout(() => setShowSavedFeedback(false), 2000);
      } else {
        setError("Erro ao salvar na galeria");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao salvar");
    } finally {
      setIsSavingToGallery(false);
    }
  };

  const handleUseInCanvas = async () => {
    if (!lastCreation?.imageUrl) return;
    
    if (onUseInCanvas) {
      onUseInCanvas(lastCreation.imageUrl);
    } else {
      // Fallback: adiciona como nova camada via useStudio
      await addLayer(
        DrawingLayerType.Raster,
        `IA: ${prompt.slice(0, 30)}...`,
        lastCreation.imageUrl
      );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent overflow-hidden relative">
      {/* TOOLBAR SECUNDÁRIA */}
      <div className="shrink-0 h-12 bg-[var(--surface)]/10 px-6 flex items-center justify-between border-b border-[var(--border-color)] z-40">
        <div className="flex items-center gap-3">
          {(mimiMessage || isGenerating) && (
            <div className="animate-fade-in flex items-center gap-2 bg-[var(--surface-elevated)] px-3 py-1 rounded-full border border-[var(--primary)]/20 shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
              <p className="text-[10px] font-bold text-[var(--text-primary)] italic">{isGenerating ? "Pintando..." : mimiMessage}</p>
            </div>
          )}
        </div>
        <button 
          onClick={handleClearArt} 
          className="flex items-center gap-2 px-3 py-1.5 tactile-base bg-[var(--surface-elevated)] text-[var(--text-primary)] text-[8px] font-black uppercase tracking-widest transition-all active:scale-95"
        >
          <Eraser size={12} /> Limpar
        </button>
      </div>

      <main className="flex-1 min-h-0 relative flex flex-col lg:flex-row overflow-hidden">
        {/* ÁREA DA TELA */}
        <section className="flex-1 min-h-0 flex items-center justify-center relative p-4 md:p-10 bg-[var(--bg-app)]/5">
          <div className={`relative p-6 md:p-8 bg-gradient-to-br from-[#5D4037] to-[#3E2723] rounded-[var(--ui-radius)] shadow-2xl z-10 flex items-center justify-center
                ${orientation === 'horizontal' ? 'w-full max-w-[min(100%,calc(100vh-280px)*1.33)] aspect-[4/3]' : 
                  orientation === 'vertical' ? 'h-full max-h-[min(100%,calc(100vw-450px)*1.33)] aspect-[3/4]' : 
                  'w-full max-w-[min(100%,calc(100vh-280px))] aspect-square'}
            `}>
              <div className="w-full h-full paper-texture rounded-[var(--ui-radius)] shadow-inner overflow-hidden flex items-center justify-center relative">
                {isGenerating ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] z-20 space-y-4">
                     <Wand2 size={40} className="text-[var(--primary)] animate-mimi-float" />
                     <p className="font-hand text-2xl text-[var(--primary)] animate-pulse">A mágica começou...</p>
                  </div>
                ) : lastCreation ? (
                  <div className="relative w-full h-full">
                    <img src={lastCreation.imageUrl} className="w-full h-full object-cover animate-fade-in" alt="Arte" />
                    {/* Botões de ação sobre a imagem */}
                    <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={handleSaveToGallery}
                        disabled={isSavingToGallery}
                        className="p-2 bg-[var(--primary)] text-black rounded-full shadow-lg hover:scale-110 transition-transform"
                        title="Salvar na Galeria"
                      >
                        <Save size={18} />
                      </button>
                      <button 
                        onClick={handleUseInCanvas}
                        className="p-2 bg-[var(--surface-elevated)] text-[var(--text-primary)] rounded-full shadow-lg hover:scale-110 transition-transform"
                        title="Usar no Canvas"
                      >
                        <Layers size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center opacity-30 flex flex-col items-center gap-4">
                    <ImageIcon size={48} className="text-[var(--primary)]" />
                    <p className="font-hand text-4xl text-[var(--text-primary)]">{INSPIRING_PHRASES[0]}</p>
                  </div>
                )}
              </div>
          </div>
        </section>

        {/* PAINEL DE CONTROLE LATERAL */}
        <aside className="w-full lg:w-[400px] shrink-0 bg-[var(--surface)]/80 backdrop-blur-xl border-l border-[var(--border-color)] flex flex-col min-h-0 z-30 shadow-2xl">
          <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-8 space-y-8">
            
            {/* Estilo */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-[var(--primary)]"><Palette size={18} /><h4 className="text-[11px] font-black uppercase tracking-widest">1. Estilo Artístico</h4></div>
              <div className="grid grid-cols-3 gap-2">
                {ART_STYLES.map(s => (
                  <button key={s.id} onClick={() => setArtStyle(s.id)} className={`flex flex-col items-center gap-2 p-3 tactile-base transition-all ${artStyle === s.id ? 'bg-[var(--primary)] text-black shadow-lg' : 'bg-[var(--surface-elevated)] text-[var(--text-muted)]'}`}>
                    <span className="text-xl">{s.icon}</span><span className="text-[9px] font-bold">{s.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Composição */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-[var(--primary)]"><ImageLucide size={18} /><h4 className="text-[11px] font-black uppercase tracking-widest">2. Composição</h4></div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setIllustrationType('scene')} className={`flex items-center gap-2 px-4 py-3 tactile-base transition-all ${illustrationType === 'scene' ? 'bg-[var(--primary)] text-black shadow-lg' : 'bg-[var(--surface-elevated)] text-[var(--text-muted)]'}`}>
                  <Sparkles size={16} /><span className="text-[9px] font-black uppercase">Cena</span>
                </button>
                <button onClick={() => setIllustrationType('character')} className={`flex items-center gap-2 px-4 py-3 tactile-base transition-all ${illustrationType === 'character' ? 'bg-[var(--primary)] text-black shadow-lg' : 'bg-[var(--surface-elevated)] text-[var(--text-muted)]'}`}>
                  <Cat size={16} /><span className="text-[9px] font-black uppercase">Personagem</span>
                </button>
              </div>
            </section>

            {/* Prompt Mágico */}
            <section className="space-y-4">
               <div className="flex items-center gap-2 text-[var(--primary)]"><Wand size={18} /><h4 className="text-[11px] font-black uppercase tracking-widest">3. Sua Ideia</h4></div>
               <textarea 
                 value={prompt} 
                 onChange={e => setPrompt(e.target.value)} 
                 placeholder="O que vamos pintar?"
                 className="w-full h-32 p-4 bg-[var(--surface-elevated)] rounded-[var(--ui-radius)] border-[var(--ui-border-width)] border-[var(--border-color)] outline-none font-hand text-2xl text-[var(--text-primary)] placeholder:opacity-30 focus:border-[var(--primary)] transition-all"
               />
            </section>

          </div>

          {/* BOTÃO DE AÇÃO */}
          <div className="p-6 bg-[var(--surface)] border-t border-[var(--border-color)] space-y-3">
             <button 
               onClick={handleGenerate} 
               disabled={isGenerating || !prompt.trim()} 
               className="w-full py-5 btn-dynamic text-black font-black uppercase tracking-widest shadow-2xl disabled:opacity-50"
             >
                {isGenerating ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
                <span className="ml-2">{isGenerating ? 'Pintando...' : 'Pintar Agora! ✨'}</span>
             </button>
             
             {lastCreation && (
               <div className="flex gap-3">
                 <button 
                   onClick={handleSaveToGallery}
                   disabled={isSavingToGallery}
                   className="flex-1 py-3 bg-[var(--surface-elevated)] text-[var(--text-primary)] font-bold text-xs uppercase tracking-wider rounded-[var(--ui-radius)] hover:bg-[var(--primary)] hover:text-black transition-colors flex items-center justify-center gap-2"
                 >
                   <Save size={16} />
                   {isSavingToGallery ? 'Salvando...' : 'Salvar na Galeria'}
                 </button>
                 <button 
                   onClick={handleUseInCanvas}
                   className="flex-1 py-3 bg-[var(--surface-elevated)] text-[var(--text-primary)] font-bold text-xs uppercase tracking-wider rounded-[var(--ui-radius)] hover:bg-[var(--primary)] hover:text-black transition-colors flex items-center justify-center gap-2"
                 >
                   <Layers size={16} />
                   Usar no Canvas
                 </button>
               </div>
             )}
          </div>
        </aside>
      </main>
      <style>{`.paper-texture { background-image: url("https://www.transparenttextures.com/patterns/p6.png"); background-color: #fdfdfd; background-size: 150px; }`}</style>
    </div>
  );
};
