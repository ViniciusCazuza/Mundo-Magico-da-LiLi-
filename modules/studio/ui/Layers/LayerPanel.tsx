
import React, { useState } from 'react';
import { Plus, LayoutGrid, List, ArrowUp, ArrowDown, Merge, ChevronsUp, ChevronsDown, Image as ImageIcon } from 'lucide-react';
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
  onReorder: (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => void;
  onMerge: (id: string) => void;
  setLayers: (layers: any[]) => void;
}

export const LayerPanel: React.FC<LayerPanelProps> = (props) => {
  const [isCompact, setIsCompact] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  
  const activeLayer = props.layers.find(l => l.id === props.activeLayerId);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Estética do Ghost Image (Opcional)
    const target = e.target as HTMLElement;
    target.style.opacity = '0.5';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const newLayers = [...props.layers];
    const item = newLayers[draggedItemIndex];
    
    // Impede mover o Fundo
    if (item.isBackground || newLayers[index].isBackground) return;

    newLayers.splice(draggedItemIndex, 1);
    newLayers.splice(index, 0, item);
    
    setDraggedItemIndex(index);
    props.setLayers(newLayers);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedItemIndex(null);
    const target = e.target as HTMLElement;
    target.style.opacity = '1';
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in h-full">
      {/* Header Controls */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsCompact(false)}
            className={`p-2 transition-all ${!isCompact ? 'btn-dynamic text-black shadow-md' : 'text-[var(--text-muted)] hover:bg-black/5'}`}
            style={{ borderRadius: 'var(--ui-component-radius)' }}
          >
            <LayoutGrid size={14} />
          </button>
          <button 
            onClick={() => setIsCompact(true)}
            className={`p-2 transition-all ${isCompact ? 'btn-dynamic text-black shadow-md' : 'text-[var(--text-muted)] hover:bg-black/5'}`}
            style={{ borderRadius: 'var(--ui-component-radius)' }}
          >
            <List size={14} />
          </button>
        </div>

        <div className="flex items-center gap-1">
          {!activeLayer?.isBackground && (
            <>
              <button 
                onClick={() => props.onReorder(props.activeLayerId, 'top')}
                className="p-2 hover:bg-black/5 text-[var(--text-muted)] transition-all active:scale-90"
                style={{ borderRadius: 'var(--ui-component-radius)' }}
                title="Mover para o Topo"
              >
                <ChevronsUp size={14} />
              </button>
              <button 
                onClick={() => props.onReorder(props.activeLayerId, 'bottom')}
                className="p-2 hover:bg-black/5 text-[var(--text-muted)] transition-all active:scale-90"
                style={{ borderRadius: 'var(--ui-component-radius)' }}
                title="Mover para o Fundo"
              >
                <ChevronsDown size={14} />
              </button>
              <div className="w-px h-4 bg-[var(--border-color)] mx-1" />
            </>
          )}
          <button 
            onClick={() => props.onMerge(props.activeLayerId)}
            disabled={activeLayer?.isBackground}
            className="p-2 hover:bg-black/5 text-[var(--text-muted)] transition-all active:scale-90 disabled:opacity-20"
            style={{ borderRadius: 'var(--ui-component-radius)' }}
            title="Mesclar com Abaixo"
          >
            <Merge size={14} />
          </button>
          <div className="w-px h-4 bg-[var(--border-color)] mx-1" />
          <button 
            onClick={props.onAddLayer}
            className="p-2.5 btn-dynamic text-black transition-all active:scale-90 shadow-lg"
            style={{ borderRadius: 'var(--ui-component-radius)' }}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Layers List */}
      <div className={`flex-1 overflow-y-auto no-scrollbar min-h-[100px] flex ${isCompact ? 'flex-col space-y-2' : 'flex-row flex-wrap gap-2 content-start'}`}>
        {props.layers.map((layer, index) => (
          <div key={layer.id} className={isCompact ? 'w-full' : 'w-[calc(50%-4px)]'}>
            <LayerItem 
              index={index}
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
              onReorder={props.onReorder}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
