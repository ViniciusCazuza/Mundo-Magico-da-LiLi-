
import React, { useState } from 'react';
import { Plus, LayoutGrid, List, Trash2, ArrowUp, ArrowDown, Merge, Image as ImageIcon, Ghost } from 'lucide-react';
import { LayerItem } from './LayerItem';

interface LayerPanelProps {
  layers: any[];
  activeLayerId: string;
  onAddLayer: () => void;
  onSelectLayer: (id: string) => void;
  onToggleVisibility: (id: string, isolate: boolean) => void;
  onToggleLock: (id: string) => void;
  onUpdateName: (id: string, name: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateSettings: (id: string, settings: any) => void;
  onReorder: (id: string, direction: 'up' | 'down') => void;
  onMerge: (id: string) => void;
}

export const LayerPanel: React.FC<LayerPanelProps> = (props) => {
  const [isCompact, setIsCompact] = useState(false);
  const activeLayer = props.layers.find(l => l.id === props.activeLayerId);

  return (
    <div className="flex flex-col gap-4 animate-fade-in h-full">
      {/* Header Controls */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsCompact(false)}
            className={`p-2 rounded-xl transition-all ${!isCompact ? 'bg-[var(--primary)] text-[var(--text-on-primary)] shadow-md' : 'text-[var(--text-muted)] hover:bg-white/5'}`}
          >
            <LayoutGrid size={14} />
          </button>
          <button 
            onClick={() => setIsCompact(true)}
            className={`p-2 rounded-xl transition-all ${isCompact ? 'bg-[var(--primary)] text-[var(--text-on-primary)] shadow-md' : 'text-[var(--text-muted)] hover:bg-white/5'}`}
          >
            <List size={14} />
          </button>
        </div>

        <div className="flex items-center gap-1">
           <button 
            onClick={() => props.onReorder(props.activeLayerId, 'up')}
            disabled={activeLayer?.isBackground}
            className="p-2 hover:bg-white/5 rounded-xl text-[var(--text-muted)] transition-all active:scale-90 disabled:opacity-20"
            title="Mover para Cima"
          >
            <ArrowUp size={14} />
          </button>
          <button 
            onClick={() => props.onReorder(props.activeLayerId, 'down')}
            disabled={activeLayer?.isBackground}
            className="p-2 hover:bg-white/5 rounded-xl text-[var(--text-muted)] transition-all active:scale-90 disabled:opacity-20"
            title="Mover para Baixo"
          >
            <ArrowDown size={14} />
          </button>
          <button 
            onClick={() => props.onMerge(props.activeLayerId)}
            disabled={activeLayer?.isBackground}
            className="p-2 hover:bg-white/5 rounded-xl text-[var(--text-muted)] transition-all active:scale-90 disabled:opacity-20"
            title="Mesclar com Abaixo"
          >
            <Merge size={14} />
          </button>
          <div className="w-px h-4 bg-[var(--border-color)] mx-1" />
          <button 
            onClick={props.onAddLayer}
            className="p-2.5 bg-[var(--primary)] hover:brightness-110 text-[var(--text-on-primary)] rounded-xl transition-all active:scale-90 shadow-lg shadow-[var(--primary)]/20"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Background Specific Controls */}
      {activeLayer?.isBackground && (
        <div className="bg-black/5 rounded-2xl p-4 space-y-4 border border-[var(--border-color)] animate-fade-in">
            <div className="flex items-center justify-between">
                <h6 className="text-[8px] font-black uppercase text-[var(--text-muted)] tracking-[0.2em] flex items-center gap-2"><ImageIcon size={10}/> Ajustes do Fundo</h6>
                <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black uppercase text-[var(--text-muted)]">Transparência</span>
                    <button 
                        onClick={() => props.onUpdateSettings(activeLayer.id, { isTransparent: !activeLayer.isTransparent })}
                        className={`w-9 h-5 rounded-full relative transition-all ${activeLayer.isTransparent ? 'bg-[var(--primary)] shadow-md' : 'bg-black/30'}`}
                    >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${activeLayer.isTransparent ? 'left-5' : 'left-1 shadow-sm'}`} />
                    </button>
                </div>
            </div>

            {!activeLayer.isTransparent && (
                <div className="flex items-center gap-4 animate-fade-in">
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-[var(--border-color)] shrink-0">
                        <input 
                            type="color" 
                            value={activeLayer.backgroundColor} 
                            onChange={(e) => props.onUpdateSettings(activeLayer.id, { backgroundColor: e.target.value })}
                            className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                        />
                    </div>
                    <div className="flex-1 space-y-1">
                        <span className="text-[8px] font-black uppercase text-[var(--text-muted)]">Cor do Fundo</span>
                        <div className="bg-black/20 p-1.5 rounded-lg border border-[var(--border-color)] flex items-center justify-between">
                            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">{activeLayer.backgroundColor}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
      )}

      {/* Layers List */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-1 min-h-[100px]">
        {props.layers.map((layer) => (
          <LayerItem 
            key={layer.id}
            layer={layer}
            isActive={props.activeLayerId === layer.id}
            isCompact={isCompact}
            onSelect={props.onSelectLayer}
            onToggleVisibility={props.onToggleVisibility}
            onToggleLock={props.onToggleLock}
            onUpdateName={props.onUpdateName}
            onDuplicate={props.onDuplicate}
            onDelete={props.onDelete}
            onUpdateSettings={props.onUpdateSettings}
          />
        ))}
      </div>
    </div>
  );
};
