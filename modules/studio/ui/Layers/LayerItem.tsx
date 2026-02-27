
import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Lock, Unlock, Copy, Trash2, ChevronDown, ChevronUp, ChevronsUp, ChevronsDown, Image as ImageIcon, Pencil, GripVertical } from 'lucide-react';
import { LayerThumbnail } from './LayerThumbnail';

interface LayerItemProps {
  layer: any;
  isActive: boolean;
  isCompact: boolean;
  index: number;
  onSelect: (id: string) => void;
  onToggleVisibility: (id: string, isolate: boolean) => void;
  onToggleLock: (id: string) => void;
  onUpdateName: (id: string, name: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateSettings: (id: string, settings: any) => void;
  onReorder: (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

export const LayerItem: React.FC<LayerItemProps> = ({
  layer, isActive, isCompact, index, onSelect, onToggleVisibility, 
  onToggleLock, onUpdateName, onDuplicate, onDelete, onUpdateSettings,
  onReorder, onDragStart, onDragOver, onDragEnd
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(layer.name);
  const [showSettings, setShowSettings] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [canDrag, setCanDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) setTempName(layer.name);
  }, [layer.name, isEditing]);

  const handleEyeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleVisibility(layer.id, e.altKey);
  };

  const handleRenameSubmit = () => {
    const trimmed = tempName.trim();
    if (trimmed && trimmed !== layer.name) {
      onUpdateName(layer.id, trimmed);
    } else {
      setTempName(layer.name);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRenameSubmit();
    if (e.key === 'Escape') {
      setTempName(layer.name);
      setIsEditing(false);
    }
  };

  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!layer.isBackground) setIsEditing(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isConfirmingDelete) {
        onDelete(layer.id);
        setIsConfirmingDelete(false);
    } else {
        setIsConfirmingDelete(true);
        setTimeout(() => setIsConfirmingDelete(false), 3000);
    }
  };

  return (
    <div 
      draggable={canDrag && !layer.isBackground}
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnd={onDragEnd}
      onClick={() => onSelect(layer.id)}
      className={`
        group relative flex flex-col transition-all duration-500 cursor-pointer rounded-[12px]
        ${isActive 
          ? 'bg-[var(--primary)] text-black shadow-lg scale-[1.02] z-10 border-[var(--border-color)]' 
          : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] border-transparent hover:brightness-105 hover:shadow-md'}
        ${layer.isBackground ? 'border-dashed border-[var(--border-color)] opacity-80' : ''}
      `}
      style={{ 
        padding: '0.5rem',
        borderWidth: 'var(--ui-border-width)',
        backgroundColor: isActive ? 'var(--primary)' : undefined,
        boxShadow: isActive ? 'var(--ui-shadow-elevated)' : 'var(--ui-shadow)'
      }}
    >
      <div className={`flex ${isCompact ? 'items-center gap-2' : 'flex-col items-center gap-3 text-center'}`}>
        <div className={`flex items-center gap-2 flex-1 min-w-0 ${!isCompact && 'w-full flex-col'}`}>
          {!layer.isBackground && (
            <div 
              onMouseEnter={() => setCanDrag(true)}
              onMouseLeave={() => setCanDrag(false)}
              className={`${isActive ? 'text-black' : 'text-current'} opacity-30 cursor-grab active:cursor-grabbing shrink-0 ${!isCompact && 'order-last mt-2'}`}
            >
              <GripVertical size={isCompact ? 14 : 18} className={!isCompact ? 'rotate-90' : ''} />
            </div>
          )}

          <div className={`flex items-center gap-2 ${!isCompact ? 'w-full justify-between mb-1' : ''}`}>
            <button 
              onClick={handleEyeClick}
              className={`p-1.5 rounded-lg transition-colors shrink-0 ${layer.visible ? (isActive ? 'text-black' : 'text-current') : 'opacity-30'}`}
              title="Visibilidade"
            >
              {layer.visible ? <Eye size={14}/> : <EyeOff size={14}/>}
            </button>

            <div className="shrink-0">
              <LayerThumbnail 
                  sourceCanvas={layer.canvas} 
                  thumbnail={layer.thumbnail}
                  isBackground={layer.isBackground}
                  backgroundColor={layer.backgroundColor}
                  isTransparent={layer.isTransparent}
              />
            </div>
          </div>

          <div className="flex-1 min-w-0 flex items-center gap-2 relative overflow-hidden w-full">
            {isEditing && !layer.isBackground ? (
              <input 
                ref={inputRef} autoFocus
                className="w-full bg-white/20 text-[11px] font-black text-black px-2 py-1 outline-none border-none"
                style={{ borderRadius: '8px' }}
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                onBlur={handleRenameSubmit}
                onKeyDown={handleKeyDown}
                onClick={e => e.stopPropagation()}
              />
            ) : (
              <div className={`flex items-center gap-2 overflow-hidden flex-1 group/label ${!isCompact && 'justify-center'}`} onClick={startEditing}>
                  <p className={`text-[11px] font-black truncate uppercase tracking-tight flex-1 ${isActive ? 'text-black' : 'text-current'}`}>
                    {layer.name}
                  </p>
                  {layer.isBackground && (
                      <span className={`text-[6px] font-black bg-black/10 px-1 py-0.5 rounded uppercase tracking-widest shrink-0 ${isActive ? 'text-black' : 'text-current'}`}>Fundo</span>
                  )}
              </div>
            )}
          </div>
        </div>

        <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 overflow-hidden shrink-0 ${isCompact ? 'w-0 group-hover:w-auto' : 'w-full justify-center mt-2'}`}>
          {!layer.isBackground && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); onReorder(layer.id, 'up'); }}
                className={`p-1.5 rounded-lg hover:bg-black/10 ${isActive ? 'text-black' : 'text-current'} transition-all active:scale-90`}
                title="Subir Camada"
              >
                <ChevronUp size={14} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onReorder(layer.id, 'down'); }}
                className={`p-1.5 rounded-lg hover:bg-black/10 ${isActive ? 'text-black' : 'text-current'} transition-all active:scale-90`}
                title="Descer Camada"
              >
                <ChevronDown size={14} />
              </button>
              <button 
                onClick={handleDeleteClick}
                className={`p-1.5 rounded-lg transition-all ${isConfirmingDelete ? 'bg-red-500 text-black animate-pulse' : `hover:bg-red-500/20 ${isActive ? 'text-black' : 'text-current'}`}`}
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}
            className={`p-1.5 rounded-lg hover:bg-black/10 transition-all ${isActive ? 'text-black' : 'text-current'} ${showSettings ? 'rotate-180' : ''}`}
          >
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className={`mt-3 pt-3 border-t ${isActive ? 'border-black/20 text-black' : 'border-current/10 text-current'} space-y-4 animate-fade-in`} onClick={e => e.stopPropagation()}>
          {/* Controle de Opacidade */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[8px] font-black uppercase opacity-60">
              <span>Opacidade</span>
              <span>{Math.round(layer.opacity * 100)}%</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.01" 
              value={layer.opacity} 
              onChange={e => onUpdateSettings(layer.id, { opacity: parseFloat(e.target.value) })}
              className={`w-full h-1 bg-black/10 rounded-full appearance-none ${isActive ? 'accent-black' : 'accent-current'}`}
            />
          </div>
          
          {/* Modo de Mesclagem (apenas se não for fundo) */}
          {!layer.isBackground && (
              <div className="flex flex-col gap-1.5">
                <span className="text-[8px] font-black uppercase opacity-60">Modo de Mesclagem</span>
                <select 
                  value={layer.blendMode}
                  onChange={e => onUpdateSettings(layer.id, { blendMode: e.target.value })}
                  className={`bg-black/5 text-[9px] font-bold border ${isActive ? 'border-black/20' : 'border-current/10'} px-2 py-1.5 outline-none w-full`}
                  style={{ borderRadius: '8px' }}
                >
                  <option value="source-over">Normal</option>
                  <option value="multiply">Multiplicar</option>
                  <option value="screen">Divisão</option>
                  <option value="overlay">Sobrepor</option>
                  <option value="difference">Diferença</option>
                  <option value="destination-out">Borracha</option>
                </select>
              </div>
          )}

          {/* Organização de Camadas */}
          {!layer.isBackground && (
            <div className="space-y-2">
              <span className="text-[8px] font-black uppercase opacity-60">Posicionamento</span>
              <div className={`grid ${isCompact ? 'grid-cols-4' : 'grid-cols-2'} gap-1`}>
                <button onClick={(e) => { e.stopPropagation(); onReorder(layer.id, 'top'); }} className={`flex items-center justify-center p-2 hover:bg-black/10 rounded-lg border ${isActive ? 'border-black/10' : 'border-current/5'} transition-all`} title="Mover para o Topo">
                  <ChevronsUp size={14} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onReorder(layer.id, 'up'); }} className={`flex items-center justify-center p-2 hover:bg-black/10 rounded-lg border ${isActive ? 'border-black/10' : 'border-current/5'} transition-all`} title="Subir">
                  <ChevronUp size={14} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onReorder(layer.id, 'down'); }} className={`flex items-center justify-center p-2 hover:bg-black/10 rounded-lg border ${isActive ? 'border-black/10' : 'border-current/5'} transition-all`} title="Descer">
                  <ChevronDown size={14} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onReorder(layer.id, 'bottom'); }} className={`flex items-center justify-center p-2 hover:bg-black/10 rounded-lg border ${isActive ? 'border-black/10' : 'border-current/5'} transition-all`} title="Mover para o Fundo">
                  <ChevronsDown size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Ações Rápidas */}
          <div className="flex items-center justify-between pt-2 border-t border-black/5">
             <div className="flex gap-1">
                {!layer.isBackground && (
                    <button onClick={() => onDuplicate(layer.id)} className="p-2 hover:bg-black/10 rounded-lg transition-all" title="Duplicar">
                        <Copy size={14} />
                    </button>
                )}
                <button onClick={() => onToggleLock(layer.id)} className={`p-2 rounded-lg transition-all ${layer.locked ? 'bg-black/20' : 'hover:bg-black/10'}`}>
                    {layer.locked ? <Lock size={14}/> : <Unlock size={14}/>}
                </button>
             </div>
             
             {!layer.isBackground && (
                <button 
                    onClick={handleDeleteClick}
                    className={`p-2 rounded-lg transition-all ${isConfirmingDelete ? 'bg-red-500 text-black animate-pulse' : 'hover:bg-red-500/20'}`}
                    title="Excluir Camada"
                >
                    <Trash2 size={14} />
                </button>
             )}
          </div>
        </div>
      )}
    </div>
  );
};
