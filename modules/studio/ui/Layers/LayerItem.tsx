
import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Lock, Unlock, Copy, Trash2, ChevronDown, Image as ImageIcon, Pencil } from 'lucide-react';
import { LayerThumbnail } from './LayerThumbnail';

interface LayerItemProps {
  layer: any;
  isActive: boolean;
  isCompact: boolean;
  onSelect: (id: string) => void;
  onToggleVisibility: (id: string, isolate: boolean) => void;
  onToggleLock: (id: string) => void;
  onUpdateName: (id: string, name: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateSettings: (id: string, settings: any) => void;
}

export const LayerItem: React.FC<LayerItemProps> = ({
  layer, isActive, isCompact, onSelect, onToggleVisibility, 
  onToggleLock, onUpdateName, onDuplicate, onDelete, onUpdateSettings
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(layer.name);
  const [showSettings, setShowSettings] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
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
      // Regra de segurança: se estiver vazio, restaura o nome original
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
      onClick={() => onSelect(layer.id)}
      className={`
        group relative flex flex-col border transition-all duration-200 cursor-pointer
        ${isActive 
          ? 'bg-[var(--primary)]/10 border-[var(--primary)]/40 shadow-sm' 
          : 'bg-black/5 border-transparent hover:bg-black/10'}
        ${isCompact ? 'rounded-xl p-2' : 'rounded-2xl p-3'}
        ${layer.isBackground ? 'border-dashed border-[var(--border-color)]' : ''}
      `}
    >
      <div className="flex items-center gap-3">
        <button 
          onClick={handleEyeClick}
          className={`p-1.5 rounded-lg transition-colors ${layer.visible ? 'text-[var(--text-muted)] hover:text-[var(--primary)]' : 'text-[var(--primary)] bg-[var(--primary)]/10'}`}
          title="Visibilidade (Alt+Click para isolar)"
        >
          {layer.visible ? <Eye size={14}/> : <EyeOff size={14}/>}
        </button>

        <LayerThumbnail 
            sourceCanvas={layer.canvas} 
            isBackground={layer.isBackground}
            backgroundColor={layer.backgroundColor}
            isTransparent={layer.isTransparent}
        />

        <div className="flex-1 min-w-0 flex items-center gap-2 relative">
          {isEditing && !layer.isBackground ? (
            <input 
              ref={inputRef}
              autoFocus
              className="w-full bg-[var(--surface-elevated)] text-[11px] font-bold text-[var(--text-primary)] px-2 py-1 rounded-lg outline-none border-2 border-[var(--primary)] shadow-[0_0_15px_var(--primary)]/30 animate-fade-in"
              value={tempName}
              onChange={e => setTempName(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={handleKeyDown}
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <div className="flex items-center gap-2 overflow-hidden flex-1 group/label">
                <p 
                onDoubleClick={startEditing}
                className={`text-[11px] font-bold truncate uppercase tracking-tight transition-colors flex-1 ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'}`}
                >
                {layer.name}
                </p>
                {!layer.isBackground && (
                  <button 
                    onClick={startEditing}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-lg transition-all"
                    title="Renomear Camada"
                  >
                    <Pencil size={12} strokeWidth={2.5} />
                  </button>
                )}
                {layer.isBackground && (
                    <span className="text-[7px] font-black bg-[var(--primary)]/10 text-[var(--primary)] px-1.5 py-0.5 rounded-md uppercase tracking-widest border border-[var(--primary)]/20">Fundo Estático</span>
                )}
            </div>
          )}
          
          {!isCompact && !isEditing && (
            <p className="text-[7px] font-black text-[var(--text-muted)] uppercase tracking-widest mt-0.5 opacity-40 absolute -bottom-4 left-0">
               {layer.blendMode.replace('-', ' ')} • {Math.round(layer.opacity * 100)}%
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!layer.isBackground && (
              <button 
                onClick={handleDeleteClick}
                className={`p-1.5 rounded-lg transition-all ${isConfirmingDelete ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-red-500/20 text-[var(--text-muted)] hover:text-red-400'}`}
                title={isConfirmingDelete ? 'Clique novamente para confirmar' : 'Excluir Camada'}
              >
                <Trash2 size={14} />
              </button>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}
            className={`p-1.5 rounded-lg hover:bg-white/10 text-[var(--text-muted)] transition-all ${showSettings ? 'rotate-180 text-[var(--primary)]' : ''}`}
          >
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="mt-3 pt-3 border-t border-[var(--border-color)] space-y-3 animate-fade-in" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest">Opacidade</span>
            <input 
              type="range" min="0" max="1" step="0.01" 
              value={layer.opacity} 
              onChange={e => onUpdateSettings(layer.id, { opacity: parseFloat(e.target.value) })}
              className="flex-1 h-1 bg-black/20 rounded-full appearance-none accent-[var(--primary)]"
            />
          </div>
          
          {!layer.isBackground && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest">Mesclagem</span>
                <select 
                  value={layer.blendMode}
                  onChange={e => onUpdateSettings(layer.id, { blendMode: e.target.value })}
                  className="bg-[var(--surface-elevated)] text-[9px] font-bold text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg px-2 py-1 outline-none focus:border-[var(--primary)]"
                >
                  <option value="source-over">Normal</option>
                  <option value="multiply">Multiplicar</option>
                  <option value="screen">Divisão</option>
                  <option value="overlay">Sobrepor</option>
                  <option value="hard-light">Luz Brilhante</option>
                  <option value="difference">Diferença</option>
                  <option value="destination-out">Borracha</option>
                </select>
              </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
             {!layer.isBackground && (
                 <button onClick={() => onDuplicate(layer.id)} className="p-2 hover:bg-white/5 rounded-lg text-[var(--text-muted)] hover:text-[var(--primary)]" title="Duplicar">
                    <Copy size={12} />
                 </button>
             )}
             <button onClick={() => onToggleLock(layer.id)} className={`p-2 rounded-lg ${layer.locked ? 'text-amber-500 bg-amber-500/10' : 'text-[var(--text-muted)] hover:bg-white/5'}`} title="Bloquear">
                {layer.locked ? <Lock size={12}/> : <Unlock size={12}/>}
             </button>
             {layer.isBackground && (
                 <button 
                    onClick={() => onUpdateSettings(layer.id, { backgroundColor: '#FFFFFF', isTransparent: false, opacity: 1 })}
                    className="p-2 hover:bg-white/5 rounded-lg text-[var(--text-muted)] hover:text-[var(--primary)]" 
                    title="Resetar Fundo"
                 >
                    <ImageIcon size={12} />
                 </button>
             )}
          </div>
        </div>
      )}
    </div>
  );
};
