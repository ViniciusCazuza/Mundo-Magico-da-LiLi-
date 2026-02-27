
import React, { useState, useEffect, useMemo } from "react";
import { 
  Palette, Wand2, Sparkles, Download, RefreshCw, 
  Image as ImageIcon, Cat, AlertCircle, Wand, Type, Image as ImageLucide, ChevronRight,
  Layout, Heart, BookOpen, Eraser
} from "lucide-react";
import { IdentityManager } from "../../../core/ecosystem/IdentityManager";
import { mimiEvents, MIMI_EVENT_TYPES, ObservabilityEvent } from "../../../core/events";
import { generateMagicImage, generateInspirationPrompt, StudioImageResponse, StudioOptions } from "../services/studio.api";
import { LibraryItem } from "../../../core/types";
import { STORAGE_KEYS } from "../../../core/config";
import { safeJsonParse } from "../../../core/utils";

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

export const LaboratoryTool: React.FC = () => {
  const profile = IdentityManager.getActiveProfile();
  
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
      prompt,
      lastCreation,
      artStyle,
      fantasyLevel,
      detailLevel,
      illustrationType,
      framing,
      orientation,
      includeText,
      textInImage
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
  }, [prompt, lastCreation, artStyle, fantasyLevel, detailLevel, illustrationType, framing, orientation, includeText, textInImage]);

  if (!profile) return null;

  const praise = useMemo(() => {
    return MIMI_PRAISES[Math.floor(Math.random() * MIMI_PRAISES.length)];
  }, [lastCreation]);

  const inspiringPhrase = useMemo(() => {
    return INSPIRING_PHRASES[Math.floor(Math.random() * INSPIRING_PHRASES.length)];
  }, [lastCreation]);

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

  const handleInspiration = async () => {
    if (isGettingInspiration) return;
    setIsGettingInspiration(true);
    setMimiMessage("Huum... deixe-me ver...");
    
    const options: StudioOptions = {
      artStyle, fantasyLevel, detailLevel, illustrationType, framing, orientation,
      textConfig: { enabled: includeText, content: textInImage }
    };

    try {
      const suggestion = await generateInspirationPrompt(profile, options);
      setPrompt(suggestion);
      setMimiMessage("Que tal essa ideia?");
      mimiEvents.dispatch(MIMI_EVENT_TYPES.OBSERVABILITY_ACTIVITY, {
        module: 'studio', type: 'interaction', action: 'inspiration_generated',
        payload: { suggestion }, timestamp: Date.now()
      } as ObservabilityEvent);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGettingInspiration(false);
    }
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
      setMimiMessage(praise);
      mimiEvents.dispatch(MIMI_EVENT_TYPES.OBSERVABILITY_ACTIVITY, {
        module: 'studio', type: 'creation', action: 'image_generated',
        payload: { prompt, imageUrl: result.imageUrl }, timestamp: Date.now()
      } as ObservabilityEvent);
    } catch (err: any) {
      setError(err.message || "Ops, a gatinha Mimi tropeçou nos pincéis.");
      setMimiMessage("Ops, a tinta secou!");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToLibrary = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!lastCreation) return;
    const newItem: LibraryItem = {
      id: `lib_${Date.now()}`, timestamp: Date.now(), isFavorite: false,
      title: prompt || "Minha Criação Mágica",
      content: `Estilo: ${artStyle} | Composição: ${illustrationType} | Enquadramento: ${framing}\nPrompt: ${prompt}`,
      imageUrl: lastCreation.imageUrl, category: 'story', origin: 'mimi'
    };
    const existingLibrary = safeJsonParse(STORAGE_KEYS.LIBRARY, []);
    localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify([newItem, ...existingLibrary]));
    mimiEvents.dispatch(MIMI_EVENT_TYPES.SAVE_TO_LIBRARY, newItem);
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent overflow-hidden relative">
      {/* TOOLBAR SECUNDÁRIA (AÇÕES DO LABORATÓRIO) */}
      <div className="shrink-0 h-12 bg-[var(--surface)]/10 px-6 flex items-center justify-between border-b border-[var(--border-color)] z-40">
        <div className="flex items-center gap-3">
          {(mimiMessage || isGenerating || isGettingInspiration) && (
            <div className="animate-fade-in flex items-center gap-2 bg-[var(--surface-elevated)] px-3 py-1 rounded-full border border-[var(--primary)]/20 shadow-sm max-w-[200px] overflow-hidden">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
              <p className="text-[10px] font-bold text-[var(--text-primary)] italic truncate">
                {isGenerating ? "Pintando..." : isGettingInspiration ? "Huum..." : mimiMessage}
              </p>
            </div>
          )}
        </div>
        <button 
          onClick={handleClearArt} 
          className="flex items-center gap-2 px-3 py-1.5 bg-white/50 hover:bg-white text-[var(--text-primary)] rounded-xl text-[8px] font-black uppercase tracking-widest transition-all active:scale-95 border border-[var(--border-color)]"
        >
          <Eraser size={12} /> Limpar Tudo
        </button>
      </div>

      <main className="flex-1 min-h-0 relative flex flex-col lg:flex-row overflow-hidden">
        <section className="flex-1 min-h-0 flex items-center justify-center relative p-4 md:p-10 bg-[var(--bg-app)]/5">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className={`absolute inset-0 bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] rounded-full opacity-0 blur-[80px] transition-opacity duration-1000 ${isGenerating ? 'opacity-30 animate-aurora' : ''}`} style={{ backgroundSize: '200% 200%' }}></div>
            <div className={`relative transition-all duration-700 ease-in-out p-6 md:p-8 bg-gradient-to-br from-[#5D4037] to-[#3E2723] rounded-[1rem] md:rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] z-10 flex items-center justify-center
                ${orientation === 'horizontal' ? 'w-full max-w-[min(100%,calc(100vh-280px)*1.33)] aspect-[4/3]' : 
                  orientation === 'vertical' ? 'h-full max-h-[min(100%,calc(100vw-450px)*1.33)] aspect-[3/4]' : 
                  'w-full max-w-[min(100%,calc(100vh-280px))] aspect-square'}
            `}>
              <div className="absolute inset-2 border-[1px] border-white/20 rounded-[0.8rem] md:rounded-[1.8rem] pointer-events-none z-10"></div>
              <div className="w-full h-full paper-texture rounded-[0.5rem] md:rounded-[1.5rem] shadow-[inset_0_5px_15px_rgba(0,0,0,0.2)] overflow-hidden flex items-center justify-center relative group">
                {lastCreation && !isGenerating && (
                  <div className="absolute top-6 left-6 flex flex-col gap-3 z-[60] animate-fade-in transition-all">
                    <button onClick={handleSaveToLibrary} className="w-14 h-14 bg-white/95 backdrop-blur-md rounded-2xl text-slate-900 shadow-[0_10px_30px_rgba(0,0,0,0.2)] flex items-center justify-center border-2 border-white hover:scale-110 active:scale-95 transition-all group/btn">
                      <BookOpen size={24}/><div className="absolute left-16 bg-[var(--primary)] text-white text-[8px] font-black uppercase px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Guardar no Baú</div>
                    </button>
                    <button onClick={() => { const l = document.createElement('a'); l.href = lastCreation.imageUrl; l.download = `arte-alice-${Date.now()}.png`; l.click(); }} className="w-14 h-14 bg-slate-900/95 backdrop-blur-md rounded-2xl text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)] flex items-center justify-center border-2 border-slate-700 hover:scale-110 active:scale-95 transition-all group/btn">
                      <Download size={24}/><div className="absolute left-16 bg-slate-900 text-white text-[8px] font-black uppercase px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Baixar Arte</div>
                    </button>
                  </div>
                )}
                {isGenerating ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] z-20 space-y-4">
                     <div className="relative"><div className="w-20 h-20 md:w-32 md:h-32 border-4 border-dashed border-[var(--primary)]/40 rounded-full animate-spin-slow"></div><Wand2 size={40} className="absolute inset-0 m-auto text-[var(--primary)] animate-mimi-float" /></div>
                     <p className="font-hand text-2xl md:text-5xl text-[var(--primary)] animate-pulse drop-shadow-sm">A mágica está acontecendo...</p>
                  </div>
                ) : lastCreation ? (
                  <div className="w-full h-full relative animate-fade-in">
                    <img src={lastCreation.imageUrl} className="w-full h-full object-cover" alt="Arte Mágica da Alice" />
                    <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.05)] pointer-events-none"></div>
                    {showSavedFeedback && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[70]">
                         <div className="bg-[var(--primary)] text-white px-8 py-4 rounded-full shadow-2xl animate-fade-in flex items-center gap-3">
                            <Heart size={24} className="fill-white animate-bounce" /><span className="font-hand text-2xl uppercase tracking-widest">Guardado no Baú! ✨</span>
                         </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-12 space-y-6 animate-fade-in">
                    <div className="w-24 h-24 bg-[var(--primary)]/10 rounded-full flex items-center justify-center text-[var(--primary)] animate-breathing"><ImageIcon size={48} /></div>
                    <div className="space-y-2"><h2 className="font-hand text-4xl md:text-6xl text-[var(--text-primary)] leading-tight opacity-80">{inspiringPhrase}</h2><p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)]">Criação Instantânea</p></div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {error && <div className="absolute top-10 left-1/2 -translate-x-1/2 z-30 px-6 py-3 bg-red-50 border-2 border-red-200 rounded-full text-red-600 text-xs font-bold animate-fade-in flex items-center gap-3 shadow-2xl"><AlertCircle size={18} /> {error}</div>}
        </section>

        <aside className="w-full lg:w-[420px] shrink-0 bg-[var(--surface)]/80 backdrop-blur-xl border-l border-[var(--border-color)] flex flex-col min-h-0 z-30 shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
          <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-8 space-y-6">
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-[var(--primary)]"><Palette size={18} /><h4 className="text-[11px] font-black uppercase tracking-widest">1. Estilo Artístico</h4></div>
              <div className="grid grid-cols-3 lg:grid-cols-2 gap-2">
                {ART_STYLES.map(s => (
                  <button key={s.id} onClick={() => setArtStyle(s.id)} className={`flex flex-col lg:flex-row items-center gap-2 p-2 rounded-xl border-2 transition-all ${artStyle === s.id ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--text-primary)] shadow-sm' : 'border-transparent bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:brightness-110'}`}>
                    <span className="text-xl">{s.icon}</span><span className="text-[9px] font-bold">{s.label}</span>
                  </button>
                ))}
              </div>
            </section>
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-[var(--primary)]"><ImageLucide size={18} /><h4 className="text-[11px] font-black uppercase tracking-widest">2. Composição</h4></div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setIllustrationType('scene')} className={`flex flex-col items-center gap-2 py-3 rounded-2xl border-2 transition-all ${illustrationType === 'scene' ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--text-primary)]' : 'border-transparent bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:brightness-110'}`}>
                  <Sparkles size={18} /><span className="text-[9px] font-black uppercase">Cena Completa</span>
                </button>
                <button onClick={() => setIllustrationType('character')} className={`flex flex-col items-center gap-2 py-3 rounded-2xl border-2 transition-all ${illustrationType === 'character' ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--text-primary)]' : 'border-transparent bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:brightness-110'}`}>
                  <Cat size={18} /><span className="text-[9px] font-black uppercase">Só Personagem</span>
                </button>
              </div>
              {illustrationType === 'character' && (
                <div className="animate-fade-in p-4 bg-[var(--primary)]/5 rounded-3xl border border-dashed border-[var(--primary)]/20 grid grid-cols-2 gap-2">
                  <button onClick={() => setFraming('full')} className={`py-2 rounded-xl text-[8px] font-black uppercase transition-all ${framing === 'full' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface-elevated)] text-[var(--text-muted)] opacity-60'}`}>Corpo Inteiro</button>
                  <button onClick={() => setFraming('portrait')} className={`py-2 rounded-xl text-[8px] font-black uppercase transition-all ${framing === 'portrait' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface-elevated)] text-[var(--text-muted)] opacity-60'}`}>Perfil</button>
                </div>
              )}
            </section>
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-[var(--primary)]"><Layout size={18} /><h4 className="text-[11px] font-black uppercase tracking-widest">3. Formato</h4></div>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setOrientation('horizontal')} className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all ${orientation === 'horizontal' ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--text-primary)]' : 'border-transparent bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:brightness-110'}`}><div className="w-8 h-5 border-2 border-current rounded-sm" /><span className="text-[8px] font-black uppercase">Horizontal</span></button>
                <button onClick={() => setOrientation('square')} className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all ${orientation === 'square' ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--text-primary)]' : 'border-transparent bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:brightness-110'}`}><div className="w-6 h-6 border-2 border-current rounded-sm" /><span className="text-[8px] font-black uppercase">Quadrado</span></button>
                <button onClick={() => setOrientation('vertical')} className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all ${orientation === 'vertical' ? 'border(--primary)] bg-[var(--primary)]/10 text-[var(--text-primary)]' : 'border-transparent bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:brightness-110'}`}><div className="w-5 h-8 border-2 border-current rounded-sm" /><span className="text-[8px] font-black uppercase">Vertical</span></button>
              </div>
            </section>
            <div className="grid grid-cols-2 gap-4">
               <section className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase text-[var(--primary)]">Magia</h4>
                  <div className="flex gap-1 bg-[var(--surface-elevated)] p-1 rounded-full border border-[var(--border-color)]">
                    {[1, 2, 3, 4, 5].map(lv => (
                      <button key={lv} onClick={() => setFantasyLevel(lv)} className={`flex-1 h-6 rounded-full transition-all text-[8px] font-black ${fantasyLevel === lv ? 'bg-[var(--primary)] text-white shadow-md' : 'text-[var(--text-muted)] hover:brightness-110'}`}>{lv}</button>
                    ))}
                  </div>
               </section>
               <section className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase text-[var(--primary)]">Detalhes</h4>
                  <div className="flex gap-1 bg-[var(--surface-elevated)] p-1 rounded-full border border-[var(--border-color)]">
                    {['simple', 'medium', 'cinematic'].map(d => (
                      <button key={d} onClick={() => setDetailLevel(d)} className={`flex-1 h-6 rounded-full transition-all text-[7px] font-black uppercase ${detailLevel === d ? 'bg-[var(--primary)] text-white shadow-md' : 'text-[var(--text-muted)] hover:brightness-110'}`}>{d === 'cinematic' ? 'Cine' : d === 'medium' ? 'Méd' : 'Simp'}</button>
                    ))}
                  </div>
               </section>
            </div>
            <section className="p-4 bg-[var(--primary)]/5 rounded-[2rem] border border-[var(--primary)]/10 space-y-3">
              <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-[var(--primary)]"><Type size={16} /><h4 className="text-[11px] font-black uppercase tracking-widest">Texto Especial</h4></div><button onClick={() => setIncludeText(!includeText)} className={`w-10 h-5 rounded-full relative transition-colors ${includeText ? 'bg-[var(--primary)]' : 'bg-slate-300'}`}><div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${includeText ? 'left-5.5' : 'left-0.5'}`} /></button></div>
              {includeText && <input value={textInImage} onChange={e => setTextInImage(e.target.value)} placeholder="Escreva algo lindo..." className="w-full bg-[var(--surface-elevated)] p-3 rounded-xl text-xs font-bold border-2 border-[var(--primary)]/10 outline-none focus:border-[var(--primary)] transition-all text-[var(--text-primary)] placeholder:text-[var(--text-muted)]" />}
            </section>
          </div>
          <div className="p-6 bg-[var(--surface)] border-t border-[var(--border-color)]">
             <button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className={`w-full py-4 rounded-[2rem] flex items-center justify-center gap-4 text-[var(--text-on-primary)] font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 group overflow-hidden ${isGenerating || !prompt.trim() ? 'bg-slate-300 cursor-not-allowed' : 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] hover:brightness-110 hover:shadow-[0_20px_40px_-10px_var(--primary)]'}`}>
                {isGenerating ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} className="group-hover:scale-125 transition-transform" />}{isGenerating ? 'Pintando...' : 'Pintar Agora! ✨'}
             </button>
          </div>
        </aside>
      </main>

      <div className="hidden lg:block absolute bottom-12 left-10 right-[460px] z-[40] group">
         <div className="bg-[var(--surface)]/90 backdrop-blur-2xl p-4 rounded-[3rem] border-4 border-[var(--border-color)] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] flex items-center gap-5 focus-within:border-[var(--primary)] transition-all transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shrink-0"><Wand size={28} /></div>
            <input value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={`O que vamos criar hoje, ${profile.nickname}?`} className="flex-1 bg-transparent text-2xl font-hand placeholder:opacity-40 outline-none text-[var(--text-primary)]" />
            <div onClick={handleInspiration} className="flex items-center gap-3 px-6 border-l-2 border-[var(--border-color)] cursor-pointer hover:bg-black/5 rounded-r-[3rem] transition-colors">
               <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">{isGettingInspiration ? 'Huum...' : 'Inspiração'}</span><ChevronRight size={16} className={`text-[var(--primary)] ${isGettingInspiration ? 'animate-spin' : 'animate-pulse'}`} />
            </div>
         </div>
      </div>

      <footer className="shrink-0 p-4 bg-[var(--surface)] border-t border-[var(--border-color)] lg:hidden z-40">
         <div className="flex gap-3">
            <input value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Sua ideia..." className="flex-1 bg-[var(--surface-elevated)] px-6 py-4 rounded-2xl text-base font-medium outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)]" />
            <button onClick={handleInspiration} disabled={isGettingInspiration} className="w-14 h-14 bg-[var(--secondary)] text-[var(--primary)] rounded-2xl flex items-center justify-center shadow-lg"><Sparkles size={24} className={isGettingInspiration ? 'animate-spin' : ''} /></button>
         </div>
      </footer>
      <style>{`.paper-texture { background-image: url("https://www.transparenttextures.com/patterns/p6.png"); background-color: #fdfdfd; background-size: 150px; } .animate-spin-slow { animation: spin 15s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .no-scrollbar::-webkit-scrollbar { display: none; } .left-5.5 { left: 1.375rem; }`}</style>
    </div>
  );
};
