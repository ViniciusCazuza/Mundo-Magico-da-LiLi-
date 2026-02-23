/**
 * MagicCanvasTool.tsx
 * Canvas de pintura com múltiplas camadas integrado ao backend
 * 
 * Integração completa com useStudio hook (APEX Pattern)
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useStudio } from '../hooks/useStudio';
import { LayerPanel } from '../ui/Layers/LayerPanel';
import { BrushEngine } from '../engine/BrushEngine';
import { DrawingLayerType, Layer, RasterLayer } from '../types';

interface Point {
  x: number;
  y: number;
  pressure: number;
}

interface Stroke {
  points: Point[];
  color: string;
  size: number;
}

export const MagicCanvasTool: React.FC = () => {
  // ========================================================================
  // Hooks e Estado
  // ========================================================================
  
  const {
    drawing,
    layers,
    activeLayer,
    brushEngine,
    isLoading,
    error,
    loadDrawing,
    saveLayer,
    setActiveLayer,
    addLayer,
    deleteLayer,
    updateLayer,
    reorderLayer,
    toggleLayerVisibility,
    toggleLayerLock,
    duplicateLayer,
    undo,
    redo,
    canUndo,
    canRedo,
    isSaving,
    lastSavedAt,
  } = useStudio();

  // Refs para canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Estado local de interação
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [brushConfig, setBrushConfig] = useState({
    size: 15,
    color: '#5D4037',
    opacity: 1,
    flow: 0.8,
    hardness: 0.8,
    spacing: 0.2,
    pressureSize: true,
    pressureOpacity: true,
    blendMode: 'source-over' as GlobalCompositeOperation,
  });

  // ========================================================================
  // Inicialização
  // ========================================================================

  useEffect(() => {
    // Inicializa com drawing default ou carrega existente
    const initDrawing = async () => {
      // Tenta carregar drawing existente ou cria novo
      await loadDrawing('default');
    };
    initDrawing();
  }, [loadDrawing]);

  // Configura o brushEngine quando o contexto do canvas muda
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !brushEngine) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    brushEngine.setContext(ctx, dpr);
  }, [brushEngine, activeLayer]);

  // Redimensiona canvas quando necessário
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !drawing) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [drawing]);

  // Renderiza a camada ativa quando mudar
  useEffect(() => {
    renderActiveLayer();
  }, [activeLayer, layers]);

  // ========================================================================
  // Handlers de Desenho
  // ========================================================================

  const getCanvasPoint = useCallback((e: React.PointerEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, pressure: 0.5 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pressure: e.pressure || 0.5,
    };
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!activeLayer || activeLayer.type !== DrawingLayerType.Raster) return;
    if ('isLocked' in activeLayer && (activeLayer as any).isLocked) return;

    e.preventDefault();
    setIsDrawing(true);
    
    const point = getCanvasPoint(e);
    setCurrentStroke({
      points: [point],
      color: brushConfig.color,
      size: brushConfig.size,
    });

    // Inicia stroke no BrushEngine
    brushEngine?.startStroke(point.x, point.y, point.pressure, {
      id: 'default',
      name: 'Default Brush',
      shapeTexture: null,
      spacing: brushConfig.spacing,
      size: brushConfig.size,
      opacity: brushConfig.opacity,
      flow: brushConfig.flow,
      hardness: brushConfig.hardness,
      rotation: 0,
      pressureSize: brushConfig.pressureSize,
      pressureOpacity: brushConfig.pressureOpacity,
      blendMode: brushConfig.blendMode,
    });
  }, [activeLayer, brushEngine, brushConfig, getCanvasPoint]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDrawing || !currentStroke) return;

    e.preventDefault();
    const point = getCanvasPoint(e);
    
    setCurrentStroke(prev => prev ? {
      ...prev,
      points: [...prev.points, point],
    } : null);

    // Continua stroke no BrushEngine
    brushEngine?.drawStroke(point.x, point.y, point.pressure, {
      id: 'default',
      name: 'Default Brush',
      shapeTexture: null,
      spacing: brushConfig.spacing,
      size: brushConfig.size,
      opacity: brushConfig.opacity,
      flow: brushConfig.flow,
      hardness: brushConfig.hardness,
      rotation: 0,
      pressureSize: brushConfig.pressureSize,
      pressureOpacity: brushConfig.pressureOpacity,
      blendMode: brushConfig.blendMode,
    });
  }, [isDrawing, currentStroke, brushEngine, brushConfig, getCanvasPoint]);

  const handlePointerUp = useCallback(async () => {
    if (!isDrawing || !currentStroke || !activeLayer) return;

    setIsDrawing(false);
    brushEngine?.endStroke();

    // Salva a camada no backend
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      await saveLayer(activeLayer.id, dataUrl);
    }

    setCurrentStroke(null);
  }, [isDrawing, currentStroke, activeLayer, brushEngine, saveLayer]);

  // ========================================================================
  // Renderização
  // ========================================================================

  const renderActiveLayer = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Se for camada raster, renderiza a imagem
    if (activeLayer?.type === DrawingLayerType.Raster) {
      const rasterLayer = activeLayer as RasterLayer;
      if (rasterLayer.dataUrl) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
        img.src = rasterLayer.dataUrl;
      }
    }
  }, [activeLayer]);

  // ========================================================================
  // Handlers do LayerPanel
  // ========================================================================

  const handleAddLayer = useCallback(async () => {
    await addLayer(DrawingLayerType.Raster, `Camada ${layers.length + 1}`);
  }, [addLayer, layers.length]);

  const handleSelectLayer = useCallback((id: string) => {
    setActiveLayer(id);
  }, [setActiveLayer]);

  const handleToggleVisibility = useCallback((id: string, isolate: boolean) => {
    toggleLayerVisibility(id, isolate);
  }, [toggleLayerVisibility]);

  const handleToggleLock = useCallback((id: string) => {
    toggleLayerLock(id);
  }, [toggleLayerLock]);

  const handleUpdateName = useCallback((id: string, name: string) => {
    updateLayer(id, { name });
  }, [updateLayer]);

  const handleDuplicate = useCallback((id: string) => {
    duplicateLayer(id);
  }, [duplicateLayer]);

  const handleDelete = useCallback((id: string) => {
    deleteLayer(id);
  }, [deleteLayer]);

  const handleReorder = useCallback((id: string, direction: 'up' | 'down' | 'top' | 'bottom') => {
    reorderLayer(id, direction);
  }, [reorderLayer]);

  const handleUpdateSettings = useCallback((id: string, settings: any) => {
    updateLayer(id, { settings });
  }, [updateLayer]);

  // ========================================================================
  // Render
  // ========================================================================

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-[var(--primary)]">
          Carregando estúdio...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Erro: {error}
      </div>
    );
  }

  return (
    <div className="flex h-full bg-[var(--bg-app)]">
      {/* Área do Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar superior */}
        <div className="h-12 bg-[var(--surface)] border-b border-[var(--border-color)] flex items-center px-4 gap-4">
          {/* Controles de Brush */}
          <div className="flex items-center gap-2">
            <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">
              Tamanho
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={brushConfig.size}
              onChange={(e) => setBrushConfig(prev => ({ ...prev, size: parseInt(e.target.value) }))}
              className="w-24"
            />
            <span className="text-[10px] font-mono w-8">{brushConfig.size}</span>
          </div>

          <div className="w-px h-6 bg-[var(--border-color)]" />

          <div className="flex items-center gap-2">
            <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">
              Cor
            </label>
            <input
              type="color"
              value={brushConfig.color}
              onChange={(e) => setBrushConfig(prev => ({ ...prev, color: e.target.value }))}
              className="w-8 h-8 rounded cursor-pointer"
            />
          </div>

          <div className="w-px h-6 bg-[var(--border-color)]" />

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="p-2 hover:bg-black/5 disabled:opacity-30 transition-colors"
              title="Desfazer"
            >
              ↶
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="p-2 hover:bg-black/5 disabled:opacity-30 transition-colors"
              title="Refazer"
            >
              ↷
            </button>
          </div>

          <div className="flex-1" />

          {/* Indicador de Salvamento */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100/50 text-[10px] font-medium text-neutral-500">
            {isSaving ? (
              <>
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                Sincronizando...
              </>
            ) : lastSavedAt ? (
              <>
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Sincronizado às {lastSavedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-neutral-300" />
                Aguardando alterações
              </>
            )}
          </div>
        </div>

        {/* Canvas Container */}
        <div 
          ref={containerRef}
          className="flex-1 relative overflow-hidden bg-[var(--surface-elevated)] m-4 rounded-[var(--ui-radius)]"
        >
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="absolute inset-0 touch-none cursor-crosshair"
            style={{ touchAction: 'none' }}
          />
        </div>
      </div>

      {/* Painel de Camadas */}
      <div className="w-80 bg-[var(--surface)] border-l border-[var(--border-color)] flex flex-col">
        <div className="p-4 border-b border-[var(--border-color)]">
          <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)]">
            Camadas
          </h3>
        </div>
        <div className="flex-1 overflow-hidden p-4">
          <LayerPanel
            layers={layers.map(layer => ({
              id: layer.id,
              name: layer.name,
              isVisible: layer.isVisible,
              isLocked: (layer as any).isLocked || false,
              isBackground: layer.zIndex === 0,
              opacity: layer.opacity,
              thumbnail: layer.type === DrawingLayerType.Raster ? (layer as RasterLayer).dataUrl : undefined,
            }))}
            activeLayerId={activeLayer?.id || ''}
            onAddLayer={handleAddLayer}
            onSelectLayer={handleSelectLayer}
            onToggleVisibility={handleToggleVisibility}
            onToggleLock={handleToggleLock}
            onUpdateName={handleUpdateName}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onUpdateSettings={handleUpdateSettings}
            onReorder={handleReorder}
            onMerge={() => {}} // TODO: Implementar merge
            setLayers={() => {}} // Gerenciado pelo hook
          />
        </div>
      </div>
    </div>
  );
};