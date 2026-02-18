
import React, { useState, useMemo, useEffect } from "react";
import { 
  BookOpen, 
  Search, 
  Heart, 
  Trash2, 
  ChevronLeft, 
  Type, 
  Sparkles, 
  History, 
  X,
  MessageCircle,
  GraduationCap,
  Download
} from "lucide-react";
import { LibraryItem } from "../../core/types";
import { STORAGE_KEYS } from "../../core/config";
import { safeJsonParse } from "../../core/utils";
import { mimiEvents, MIMI_EVENT_TYPES, ObservabilityEvent } from "../../core/events";

export const LibraryModule: React.FC = () => {
  const [items, setItems] = useState<LibraryItem[]>(() => safeJsonParse(STORAGE_KEYS.LIBRARY, []));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<LibraryItem['category'] | 'all'>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [readingItem, setReadingItem] = useState<LibraryItem | null>(null);
  const [fontSize, setFontSize] = useState(20);

  // Escuta por novos itens salvos enquanto o módulo está aberto ou quando ele monta
  useEffect(() => {
    const unsubSave = mimiEvents.on(MIMI_EVENT_TYPES.SAVE_TO_LIBRARY, (savedItem: LibraryItem) => {
      setItems(prev => {
        // Evita duplicatas se o componente acabou de montar e já leu do storage
        if (prev.some(item => item.id === savedItem.id)) return prev;
        const next = [savedItem, ...prev];
        // O salvamento em localStorage já foi feito pelo emissor (Ateliê), 
        // mas aqui mantemos o estado da UI sincronizado.
        return next;
      });
      
      // Observabilidade
      mimiEvents.dispatch(MIMI_EVENT_TYPES.OBSERVABILITY_ACTIVITY, {
        module: 'library',
        type: 'creation',
        action: 'ui_refreshed_from_save',
        payload: { title: savedItem.title },
        timestamp: Date.now()
      } as ObservabilityEvent);
    });
    return unsubSave;
  }, []);

  const handleOpenReading = (item: LibraryItem) => {
    setReadingItem(item);
    // Observabilidade
    mimiEvents.dispatch(MIMI_EVENT_TYPES.OBSERVABILITY_ACTIVITY, {
      module: 'library',
      type: 'access',
      action: 'item_read',
      payload: { title: item.title },
      timestamp: Date.now()
    } as ObservabilityEvent);
  };

  // Sincroniza deleções e favoritados de volta para o storage
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
        <header className="h-20 shrink-0 border-b border-[var(--border-color)] flex items-center justify-between px-6 bg-[var(--surface-elevated)] backdrop-blur-md">
          <button 
            onClick={() => setReadingItem(null)}
            className="flex items-center gap-2 text-[var(--primary)] font-bold hover:bg-[var(--secondary)] px-4 py-2 rounded-2xl transition-all"
          >
            <ChevronLeft size={20} /> Voltar para a Estante
          </button>
          
          <div className="flex items-center gap-4 bg-[var(--bg-app)]/30 p-1 rounded-2xl">
            {readingItem.imageUrl && (
              <button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = readingItem.imageUrl!;
                  link.download = `${readingItem.title}.png`;
                  link.click();
                }}
                className="p-2 hover:bg-[var(--surface)] rounded-xl text-[var(--primary)]"
                title="Baixar Arte"
              >
                <Download size={18} />
              </button>
            )}
            <button onClick={() => setFontSize(Math.max(16, fontSize - 2))} className="p-2 hover:bg-[var(--surface)] rounded-xl text-[var(--text-muted)]"><Type size={16} /></button>
            <span className="text-[10px] font-black uppercase text-[var(--text-muted)] w-8 text-center">{fontSize}</span>
            <button onClick={() => setFontSize(Math.min(32, fontSize + 2))} className="p-2 hover:bg-[var(--surface)] rounded-xl text-[var(--text-muted)]"><Type size={24} /></button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-12 lg:p-24 flex flex-col items-center">
          <article className="max-w-3xl w-full space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] bg-[var(--secondary)] px-3 py-1 rounded-full border border-[var(--border-color)]">
                  {readingItem.category}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                  {new Date(readingItem.timestamp).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <h1 className="font-hand text-5xl md:text-6xl text-[var(--text-primary)] leading-tight">{readingItem.title}</h1>
            </div>

            {readingItem.imageUrl && (
              <div className="w-full rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl mb-12 group relative">
                <img src={readingItem.imageUrl} alt={readingItem.title} className="w-full h-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}

            <div 
              className="font-sans leading-relaxed text-[var(--text-primary)] transition-all duration-300"
              style={{ fontSize: `${fontSize}px` }}
            >
              {readingItem.content.split('\n').map((para, i) => (
                para ? <p key={i} className="mb-6">{para}</p> : <div key={i} className="h-4" />
              ))}
            </div>

            <div className="pt-12 border-t border-[var(--border-color)] flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-[var(--secondary)] rounded-full flex items-center justify-center text-[var(--primary)]">
                <Sparkles size={32} />
              </div>
              <p className="font-hand text-2xl text-[var(--primary)]">Fim da Aventura</p>
            </div>
          </article>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--bg-app)]/30 overflow-hidden animate-fade-in">
      <header className="p-6 md:p-8 shrink-0 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="font-hand text-4xl md:text-5xl text-[var(--primary)]">Minha Biblioteca</h1>
            <p className="text-sm text-[var(--text-muted)] font-medium">Guarde aqui suas histórias e artes preferidas!</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Pesquisar..." 
                className="w-full pl-10 pr-4 py-3 bg-[var(--surface)] rounded-2xl border-2 border-[var(--border-color)] focus:border-[var(--primary)] shadow-sm outline-none font-bold text-sm transition-all text-[var(--text-primary)]"
              />
            </div>
            <button 
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`p-3 rounded-2xl transition-all border-2 ${showFavoritesOnly ? 'bg-[var(--primary)] border-[var(--primary)] text-[var(--text-on-primary)] shadow-lg' : 'bg-[var(--surface)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--primary)]'}`}
            >
              <Heart size={20} className={showFavoritesOnly ? 'fill-white' : ''} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {([['all', 'Todos'], ['story', 'Artes & Histórias'], ['message', 'Recadinhos'], ['educational', 'Aprender'], ['other', 'Outros']] as const).map(([id, label]) => (
            <button 
              key={id}
              onClick={() => setSelectedCategory(id)}
              className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 ${selectedCategory === id ? 'bg-[var(--primary)] text-[var(--text-on-primary)] shadow-md' : 'bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border-color)] hover:bg-[var(--surface-elevated)]'}`}
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
              className="group mimi-card-elevated p-0 flex flex-col h-[280px] sm:h-[340px] relative overflow-hidden animate-fade-in hover:scale-[1.02] cursor-pointer"
            >
              {/* Thumbnail de Imagem */}
              {item.imageUrl ? (
                <div className="h-32 sm:h-40 w-full overflow-hidden bg-slate-100 relative">
                  <img src={item.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={item.title} />
                  <div className="absolute top-3 left-3 p-2 bg-white/90 backdrop-blur-sm rounded-xl text-[var(--primary)] shadow-sm">
                    <Sparkles size={14} />
                  </div>
                </div>
              ) : (
                <div className="h-24 w-full flex items-center justify-center bg-[var(--secondary)]/30">
                   <div className="p-4 bg-[var(--surface)] rounded-2xl text-[var(--primary)]">
                    {getCategoryIcon(item.category)}
                   </div>
                </div>
              )}

              <div className="flex-1 p-5 space-y-2 overflow-hidden flex flex-col">
                <div className="flex justify-between items-start">
                   <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
                    {new Date(item.timestamp).toLocaleDateString('pt-BR')}
                  </p>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => toggleFavorite(item.id, e)}
                      className={`p-1.5 rounded-lg transition-all ${item.isFavorite ? 'text-[var(--primary)]' : 'text-[var(--text-muted)] hover:text-[var(--primary)]'}`}
                    >
                      <Heart size={16} className={item.isFavorite ? 'fill-current' : ''} />
                    </button>
                    <button 
                      onClick={(e) => deleteItem(item.id, e)}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <h3 className="font-hand text-xl md:text-2xl text-[var(--text-primary)] leading-tight line-clamp-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed flex-1">
                  {item.content}
                </p>

                <div className="pt-3 mt-auto border-t border-[var(--border-color)] flex items-center justify-between">
                  <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                    {item.origin === 'mimi' ? 'Gatinha Mimi' : 'Manual'}
                  </span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-[var(--primary)]">
                    Ver mais →
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="col-span-full h-80 sm:h-96 flex flex-col items-center justify-center text-center space-y-4 opacity-30 text-[var(--text-muted)]">
              <History size={48} className="md:size-64 mb-2" />
              <h3 className="font-hand text-2xl md:text-3xl">Sua estante está vazia...</h3>
              <p className="max-w-xs text-sm font-medium">Crie desenhos mágicos no Ateliê para guardá-los aqui!</p>
            </div>
          )}
        </div>
      </main>

      <style>{`
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
};
