
import React, { useState, useMemo, useEffect } from "react";
import { 
  BookOpen, Search, Heart, Trash2, ChevronLeft, Type, 
  Sparkles, History, MessageCircle, GraduationCap, Download
} from "lucide-react";
import { LibraryItem } from "../../core/types";
import { STORAGE_KEYS } from "../../core/config";
import { safeJsonParse } from "../../core/utils";
import { mimiEvents, MIMI_EVENT_TYPES, ObservabilityEvent } from "../../core/events";
import { TactileButton } from "../../core/components/ui/TactileButton";
import { useTheme } from "../../core/theme/useTheme";
import { DecryptText } from "../../core/components/effects/DecryptText";
import { HackerSimulator, StrategicHackGif } from "../../core/components/HackerSimulator";

export const LibraryModule: React.FC = () => {
  const { themeId } = useTheme();
  const isHackerMode = themeId === "binary-night";
  // ... rest of the component state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<LibraryItem['category'] | 'all'>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [readingItem, setReadingItem] = useState<LibraryItem | null>(null);
  const [fontSize, setFontSize] = useState(20);

  useEffect(() => {
    const unsubSave = mimiEvents.on(MIMI_EVENT_TYPES.SAVE_TO_LIBRARY, (savedItem: LibraryItem) => {
      setItems(prev => prev.some(item => item.id === savedItem.id) ? prev : [savedItem, ...prev]);
    });
    return unsubSave;
  }, []);

  const handleOpenReading = (item: LibraryItem) => setReadingItem(item);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(items));
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesFavorite = !showFavoritesOnly || item.isFavorite;
      return matchesSearch && matchesCategory && matchesFavorite;
    }).sort((a, b) => b.timestamp - a.timestamp);
  }, [items, searchQuery, selectedCategory, showFavoritesOnly]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems(prev => prev.map(item => item.id === id ? { ...item, isFavorite: !item.isFavorite } : item));
  };

  const deleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Quer mesmo apagar essa lembrança mágica?")) {
      setItems(prev => prev.filter(item => item.id !== id));
      if (readingItem?.id === id) setReadingItem(null);
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'story': return <Sparkles size={16} />;
      case 'message': return <MessageCircle size={16} />;
      case 'educational': return <GraduationCap size={16} />;
      default: return <BookOpen size={16} />;
    }
  };

  if (readingItem) {
    return (
      <div className="flex-1 flex flex-col bg-[var(--surface)] animate-fade-in relative z-50 overflow-hidden">
        <header className="h-20 shrink-0 border-b border-[var(--border-color)] flex items-center justify-between px-6 bg-[var(--surface)]/80 backdrop-blur-xl">
          <TactileButton 
            variant="secondary"
            size="md"
            onClick={() => setReadingItem(null)}
            icon={ChevronLeft}
          >
            Voltar
          </TactileButton>
          
          <div className="flex items-center gap-4 bg-[var(--surface-elevated)] p-1.5 rounded-[var(--ui-radius)]">
            {readingItem.imageUrl && (
              <TactileButton 
                variant="primary"
                size="icon"
                onClick={() => { const link = document.createElement('a'); link.href = readingItem.imageUrl!; link.download = `${readingItem.title}.png`; link.click(); }}
              >
                <Download size={18} />
              </TactileButton>
            )}
            <TactileButton variant="ghost" size="icon" onClick={() => setFontSize(Math.max(16, fontSize - 2))}><Type size={16} /></TactileButton>
            <TactileButton variant="ghost" size="icon" onClick={() => setFontSize(Math.min(32, fontSize + 2))}><Type size={24} /></TactileButton>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-12 lg:p-24 flex flex-col items-center">
          <article className="max-w-3xl w-full space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] bg-[var(--surface-elevated)] px-3 py-1 rounded-full">
                {readingItem.category}
              </span>
              <h1 className="font-hand text-5xl md:text-6xl text-[var(--text-primary)] leading-tight">{readingItem.title}</h1>
            </div>

            {readingItem.imageUrl && (
              <div className="w-full rounded-[var(--ui-radius)] overflow-hidden border-[var(--ui-border-width)] border-white shadow-2xl mb-12">
                <img src={readingItem.imageUrl} alt={readingItem.title} className="w-full h-auto" />
              </div>
            )}

            <div className="font-main leading-relaxed text-[var(--text-primary)]" style={{ fontSize: `${fontSize}px` }}>
              {readingItem.content.split('\n').map((para, i) => para ? <p key={i} className="mb-6">{para}</p> : <div key={i} className="h-4" />)}
            </div>
          </article>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-transparent overflow-hidden animate-fade-in relative">
      {isHackerMode && (
        <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
           <HackerSimulator section="library" />
           <StrategicHackGif url="/assets/loading/siames_gif/fundo_preto(exclusivo tema hacker).gif" />
        </div>
      )}
      
      {/* MAINTENANCE OVERLAY (APEX v3.2) */}
      <div className="absolute inset-0 z-[100] flex items-center justify-center p-8 bg-black/60 backdrop-blur-xl">
        <div className={`max-w-xl w-full p-12 mimi-card text-center space-y-8 border-2 ${isHackerMode ? 'border-green-500 bg-black' : 'border-[var(--primary)] bg-white'}`}>
           <div className="flex justify-center">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center animate-pulse ${isHackerMode ? 'bg-green-500/10 text-green-500' : 'bg-[var(--primary)]/10 text-[var(--primary)]'}`}>
                 <History size={48} />
              </div>
           </div>
           <div className="space-y-4">
              <h2 className={`font-hand text-5xl ${isHackerMode ? 'text-green-500' : 'text-[var(--text-primary)]'}`}>
                {isHackerMode ? <DecryptText text="SISTEMA_EM_MANUTENCAO" /> : "Baú em Manutenção"}
              </h2>
              <p className={`font-medium text-lg leading-relaxed ${isHackerMode ? 'text-green-600' : 'text-[var(--text-secondary)]'}`}>
                {isHackerMode 
                  ? <DecryptText text="UPGRADING_CORE_INFRASTRUCTURE. NEW_TACTICAL_TOOL_PENDING_INSTALLATION_V3.5" /> 
                  : "Mimi está organizando suas memórias para liberar espaço para uma nova surpresa mágica!"}
              </p>
           </div>
           <div className="flex justify-center gap-4">
              <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${isHackerMode ? 'bg-green-500/20 text-green-400' : 'bg-slate-100 text-slate-400'}`}>
                 Progresso: 88%
              </div>
           </div>
        </div>
      </div>

      <header className="p-6 md:p-8 shrink-0 space-y-6 opacity-20 pointer-events-none">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-hand text-4xl md:text-5xl text-[var(--primary)]">
              {isHackerMode ? <DecryptText text="BAU_DE_DADOS_CRIPTOGRAFADOS" /> : "Minha Biblioteca"}
            </h1>
            <p className="text-sm text-[var(--text-muted)] font-medium">
              {isHackerMode ? <DecryptText text="REGISTROS_DE_ATIVIDADE_E_MIDIA_SALVOS" /> : "Guarde aqui suas histórias preferidas!"}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Pesquisar..." 
                className="pl-10 pr-4 py-3 bg-[var(--surface)] rounded-[var(--ui-radius)] border-2 border-[var(--border-color)] focus:border-[var(--primary)] shadow-sm outline-none text-sm transition-all text-[var(--text-primary)]"
              />
            </div>
            <TactileButton 
              variant={showFavoritesOnly ? "primary" : "secondary"}
              size="icon"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              <Heart size={20} className={showFavoritesOnly ? 'fill-white' : ''} />
            </TactileButton>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {([['all', 'Todos'], ['story', 'Artes'], ['message', 'Recados'], ['educational', 'Aulas']] as const).map(([id, label]) => (
            <button 
              key={id}
              onClick={() => setSelectedCategory(id)}
              className={`px-6 py-2.5 transition-all tactile-base whitespace-nowrap text-[10px] font-black uppercase tracking-widest
                ${selectedCategory === id 
                  ? 'bg-[var(--primary)] text-black shadow-md border-[var(--border-color)]' 
                  : 'bg-[var(--surface-elevated)] text-[var(--text-muted)] opacity-60 border-transparent'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-6 md:px-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div 
              key={item.id}
              onClick={() => handleOpenReading(item)}
              className="group mimi-card p-0 flex flex-col h-[300px] sm:h-[360px] relative overflow-hidden animate-fade-in hover:scale-[1.02] cursor-pointer"
            >
              {item.imageUrl ? (
                <div className="h-32 sm:h-40 w-full overflow-hidden bg-[var(--surface-elevated)] relative">
                  <img src={item.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={item.title} />
                </div>
              ) : (
                <div className="h-32 sm:h-40 w-full flex items-center justify-center bg-[var(--secondary)]/20 text-[var(--primary)]">
                  {getCategoryIcon(item.category)}
                </div>
              )}

              <div className="flex-1 p-5 space-y-2 overflow-hidden flex flex-col">
                <div className="flex justify-between items-start">
                   <p className="text-[9px] font-black text-[var(--text-muted)] uppercase">{new Date(item.timestamp).toLocaleDateString('pt-BR')}</p>
                   <button onClick={(e) => deleteItem(item.id, e)} className="p-1.5 text-[var(--text-muted)] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                </div>
                <h3 className="font-hand text-xl text-[var(--text-primary)] leading-tight">
                  {isHackerMode ? <DecryptText text={item.title.toUpperCase().replace(/\s/g, '_')} /> : item.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">{item.content}</p>
                <div className="pt-3 mt-auto border-t border-[var(--border-color)]/20 flex items-center justify-between">
                  <span className="text-[8px] font-black uppercase text-[var(--text-muted)]">{item.category}</span>
                  <span className="text-[8px] font-black uppercase text-[var(--primary)] font-bold">Abrir →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
