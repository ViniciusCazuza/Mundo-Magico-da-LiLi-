/**
 * MagicCanvasTool.tsx
 * Canvas de pintura com múltiplas camadas integrado ao backend
 * 
 * Integração completa com useStudio hook (APEX Pattern)
 * Suporte a Raster, Vector (Multi-Path) e Skeletal (IK).
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useStudio } from '../hooks/useStudio';
import { LayerPanel } from '../ui/Layers/LayerPanel';
import { BrushEngine } from '../engine/BrushEngine';
import { 
  DrawingLayerType, Layer, RasterLayer, VectorLayer, 
  SkeletalLayer, Bone, BrushConfig, BrushEngineType, BezierControlPoint 
} from '../types';
import { BoneOverlay } from '../ui/Skeletal/BoneOverlay';
import { 
  Sparkles, Wand2, Scissors, Terminal, Zap, 
  MousePointer2, Pencil, Eraser, Fingerprint, Type,
  ZoomIn, ZoomOut, Maximize, Download, Share
} from 'lucide-react';
import { useTheme } from '../../../core/theme/useTheme';
import { VectorEngine } from '../engine/VectorEngine';
import { useDrawingSync } from '../hooks/useDrawingSync';
import { IdentityManager } from '../../../core/ecosystem/IdentityManager';

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
    loadDrawings,
    createNewDrawing,
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
    setIsDirty,
    autoRigCharacter,
  } = useStudio();

  const { sendUpdate, sendCursorPosition, remoteCursors, lastUpdate } = useDrawingSync(drawing?.id);

  const { themeId } = useTheme();
  const isHackerMode = themeId === 'binary-night';

  // Refs para canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Estado local de interação
  const [isDrawing, setIsDrawing] = useState(false);
  const [isRigging, setIsRigging] = useState(false);
  const [isEraser, setIsEraser] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [currentVectorPath, setCurrentVectorPath] = useState<BezierControlPoint[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  
  // Zoom e Pan (UX v3.0)
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  
  const [brushConfig, setBrushConfig] = useState<BrushConfig>({
    id: 'default',
    name: 'Pincel Mágico',
    engine: isHackerMode ? BrushEngineType.Binary : BrushEngineType.Pixel,
    shapeTexture: null,
    spacing: 0.15,
    size: 25,
    opacity: 1,
    flow: 0.8,
    hardness: 0.5,
    rotation: 0,
    pressureSize: true,
    pressureOpacity: true,
    velocitySize: true,
    velocityOpacity: false,
    tiltSize: false,
    tiltAngle: false,
    blendMode: 'source-over',
    binaryPayload: '01'
  });

  // Atalhos de Teclado (Axioma 3)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'Z')) {
        e.preventDefault();
        redo();
      } else if (e.key === 'b') {
        setIsEraser(false);
        setBrushConfig(prev => ({ ...prev, engine: BrushEngineType.Pixel }));
      } else if (e.key === 'e') {
        setIsEraser(true);
      } else if (e.key === 's') {
        setIsEraser(false);
        setBrushConfig(prev => ({ ...prev, engine: BrushEngineType.Smudge }));
      } else if (e.key === 'h') {
        setIsEraser(false);
        setBrushConfig(prev => ({ ...prev, engine: BrushEngineType.Hairy }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Sincroniza engine com tema
  useEffect(() => {
    setBrushConfig(prev => ({
      ...prev,
      engine: isHackerMode ? BrushEngineType.Binary : BrushEngineType.Pixel,
      binaryPayload: isHackerMode ? '01' : undefined
    }));
  }, [isHackerMode]);

  // ========================================================================
  // Handlers de Exportação
  // ========================================================================

  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${drawing?.title || 'meu-desenho'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleExportJSON = () => {
    if (!drawing) return;
    const blob = new Blob([JSON.stringify(drawing, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${drawing.title || 'meu-desenho'}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  // ========================================================================
  // Inicialização
  // ========================================================================

  useEffect(() => {
    const initDrawing = async () => {
      if (drawing) return;

      const result = await loadDrawings();
      // OMNI-SKILL: Verificação de Sucesso Robusta
      const status = result as any; 
      if (status.success) {
        // Busca desenhos existentes (v2.2)
        const drawingsResult = await loadDrawings();
        const data = drawingsResult as any;
        if (data.success && data.data && data.data.items.length > 0) {
          await loadDrawing(data.data.items[0].id);
        } else {
          await createNewDrawing('Meu Primeiro Desenho');
        }
      }
    };
    initDrawing();
  }, [loadDrawing, loadDrawings, createNewDrawing, drawing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !brushEngine) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    brushEngine.setContext(ctx, dpr);
  }, [brushEngine, activeLayer]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !drawing) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      setCanvasSize({ width: rect.width, height: rect.height });
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

  // ========================================================================
  // Renderização
  // ========================================================================

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // OMNI-SKILL: Se não houver desenho, renderiza um fundo neutro para evitar "vazio absoluto"
    if (!drawing) {
      const currentThemeId = localStorage.getItem('mimi_theme_v7') || 'siamese';
      ctx.fillStyle = currentThemeId === 'binary-night' ? '#000000' : '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return;
    }

    // Renderiza todas as camadas visíveis em ordem de zIndex (Axioma 1)
    const sortedLayers = [...drawing.layers].sort((a, b) => a.zIndex - b.zIndex);

    sortedLayers.forEach(layer => {
      if (!layer.isVisible) return;

      ctx.save();
      ctx.globalAlpha = layer.opacity;
      ctx.globalCompositeOperation = layer.blendMode as GlobalCompositeOperation;

      // 1. Renderiza Fundo Sólido se existir
      if (layer.backgroundColor) {
        ctx.fillStyle = layer.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // 2. Renderiza Conteúdo da Camada
      if (layer.type === DrawingLayerType.Raster) {
        const rasterLayer = layer as RasterLayer;
        if (rasterLayer.dataUrl) {
          const img = new Image();
          img.src = rasterLayer.dataUrl;
          if (img.complete) {
            ctx.drawImage(img, 0, 0);
          }
        }
      } else if (layer.type === DrawingLayerType.Vector) {
        const vectorLayer = layer as VectorLayer;
        ctx.strokeStyle = vectorLayer.strokeColor || '#000';
        ctx.lineWidth = vectorLayer.strokeWidth || 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (vectorLayer.paths) {
          vectorLayer.paths.forEach(path => {
            if (path.length < 2) return;
            ctx.beginPath();
            ctx.moveTo(path[0].anchor.x, path[0].anchor.y);
            for (let i = 0; i < path.length - 1; i++) {
              const p1 = path[i];
              const p2 = path[i+1];
              ctx.bezierCurveTo(
                p1.controlPoint2.x, p1.controlPoint2.y,
                p2.controlPoint1.x, p2.controlPoint1.y,
                p2.anchor.x, p2.anchor.y
              );
            }
            ctx.stroke();
          });
        }
      }
      ctx.restore();
    });

    // Renderiza caminho vetorial atual (preview)
    if (activeLayer?.type === DrawingLayerType.Vector && currentVectorPath.length > 1) {
      const vectorLayer = activeLayer as VectorLayer;
      ctx.save();
      ctx.strokeStyle = vectorLayer.strokeColor || '#000';
      ctx.lineWidth = vectorLayer.strokeWidth || 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(currentVectorPath[0].anchor.x, currentVectorPath[0].anchor.y);
      for (let i = 0; i < currentVectorPath.length - 1; i++) {
        const p1 = currentVectorPath[i];
        const p2 = currentVectorPath[i+1];
        ctx.bezierCurveTo(
          p1.controlPoint2.x, p1.controlPoint2.y,
          p2.controlPoint1.x, p2.controlPoint1.y,
          p2.anchor.x, p2.anchor.y
        );
      }
      ctx.stroke();
      ctx.restore();
    }
  }, [drawing, activeLayer, currentVectorPath]);

  useEffect(() => {
    if (!lastUpdate || !brushEngine) return;

    if (lastUpdate.type === 'stroke') {
      const { x, y, pressure, config } = lastUpdate;
      brushEngine.drawStroke(x, y, pressure, config);
    }
  }, [lastUpdate, brushEngine]);

  useEffect(() => {
    renderCanvas();
  }, [drawing?.layers, currentVectorPath, renderCanvas]);

  // ========================================================================
  // Handlers de Desenho
  // ========================================================================

  const handleAutoRig = async () => {
    if (!activeLayer || activeLayer.type !== DrawingLayerType.Raster) return;
    setIsRigging(true);
    try {
      await autoRigCharacter(activeLayer.id);
    } finally {
      setIsRigging(false);
    }
  };

  const getCanvasPoint = useCallback((e: React.PointerEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, pressure: 0.5 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - pan.x) / zoom,
      y: (e.clientY - rect.top - pan.y) / zoom,
      pressure: e.pressure || 0.5,
    };
  }, [zoom, pan]);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom(prev => Math.min(Math.max(0.1, prev * delta), 10));
    }
  }, []);

  useEffect(() => {
    const canvas = containerRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      return () => canvas.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true);
      return;
    }

    if (!activeLayer) return;
    if ('isLocked' in activeLayer && (activeLayer as any).isLocked) return;

    e.preventDefault();
    setIsDrawing(true);
    
    const point = getCanvasPoint(e);

    if (isEraser && activeLayer.type === DrawingLayerType.Vector) {
      const vectorLayer = activeLayer as VectorLayer;
      if (vectorLayer.paths) {
        const newPaths = VectorEngine.eraseToIntersection(point, vectorLayer.paths);
        if (newPaths.length !== vectorLayer.paths.length) {
          updateLayer(activeLayer.id, { paths: newPaths } as Partial<Layer>);
          if (setIsDirty) setIsDirty(true);
        }
      }
      setIsDrawing(false);
      return;
    }

    if (activeLayer.type === DrawingLayerType.Raster) {
      setCurrentStroke({
        points: [point],
        color: brushConfig.color,
        size: brushConfig.size,
      });

      brushEngine?.setColor(brushConfig.color);
      brushEngine?.startStroke(point.x, point.y, point.pressure, brushConfig);
    } else if (activeLayer.type === DrawingLayerType.Vector) {
      const newPoint: BezierControlPoint = {
        anchor: { x: point.x, y: point.y },
        controlPoint1: { x: point.x, y: point.y },
        controlPoint2: { x: point.x, y: point.y }
      };
      setCurrentVectorPath([newPoint]);
    }
  }, [activeLayer, brushEngine, brushConfig, getCanvasPoint, isEraser, setIsDirty, updateLayer]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const point = getCanvasPoint(e);
    
    sendCursorPosition(point.x, point.y);

    if (isPanning) {
      setPan(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
      return;
    }

    if (!isDrawing || !activeLayer) return;

    e.preventDefault();
    
    if (activeLayer.type === DrawingLayerType.Raster && currentStroke) {
      setCurrentStroke(prev => prev ? {
        ...prev,
        points: [...prev.points, point],
      } : null);

      brushEngine?.drawStroke(point.x, point.y, point.pressure, brushConfig);
      
      sendUpdate({
        type: 'stroke',
        layerId: activeLayer.id,
        x: point.x,
        y: point.y,
        pressure: point.pressure,
        config: brushConfig
      });
    } else if (activeLayer.type === DrawingLayerType.Vector) {
      const lastPoint = currentVectorPath[currentVectorPath.length - 1];
      const dist = Math.sqrt(Math.pow(point.x - lastPoint.anchor.x, 2) + Math.pow(point.y - lastPoint.anchor.y, 2));
      
      if (dist > 10 / zoom) {
        const newPoint: BezierControlPoint = {
          anchor: { x: point.x, y: point.y },
          controlPoint1: { x: point.x, y: point.y },
          controlPoint2: { x: point.x, y: point.y }
        };
        setCurrentVectorPath(prev => [...prev, newPoint]);
      }
    }
  }, [isDrawing, isPanning, activeLayer, currentStroke, currentVectorPath, brushEngine, brushConfig, getCanvasPoint, zoom, sendCursorPosition, sendUpdate]);

  const handlePointerUp = useCallback(async () => {
    setIsPanning(false);
    if (!isDrawing || !activeLayer) return;

    setIsDrawing(false);

    if (activeLayer.type === DrawingLayerType.Raster) {
      brushEngine?.endStroke();

      const canvas = canvasRef.current;
      if (canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        await saveLayer(activeLayer.id, dataUrl);
        if (setIsDirty) setIsDirty(true);
      }
      setCurrentStroke(null);
    } else if (activeLayer.type === DrawingLayerType.Vector) {
      if (currentVectorPath.length > 1) {
        const vectorLayer = activeLayer as VectorLayer;
        const newPaths = [...(vectorLayer.paths || []), currentVectorPath];
        await updateLayer(activeLayer.id, { paths: newPaths } as Partial<Layer>);
        if (setIsDirty) setIsDirty(true);
      }
      setCurrentVectorPath([]);
    }
  }, [isDrawing, activeLayer, currentVectorPath, brushEngine, saveLayer, updateLayer, setIsDirty]);

  const handleUpdateBones = useCallback(async (bones: Bone[]) => {
    if (activeLayer?.type === DrawingLayerType.Skeletal) {
      await updateLayer(activeLayer.id, { bones } as Partial<Layer>);
    }
  }, [activeLayer, updateLayer]);

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
        <div className="animate-pulse text-[var(--primary)] font-hand text-3xl">
          Carregando estúdio...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500 font-hand text-3xl">
        Erro: {error}
      </div>
    );
  }

  return (
    <div className="flex h-full bg-[var(--bg-app)]">
      <div className="flex-1 flex flex-col min-w-0">
        <div className={`h-12 border-b flex items-center px-4 gap-4 transition-all
          ${isHackerMode ? 'bg-black border-green-500/30' : 'bg-[var(--surface)] border-[var(--border-color)]'}
        `}>
          <div className="flex items-center gap-1">
            <button
              onClick={() => { setIsEraser(false); setBrushConfig(prev => ({ ...prev, engine: BrushEngineType.Pixel })); }}
              className={`p-2 rounded-lg transition-all ${!isEraser && brushConfig.engine === BrushEngineType.Pixel ? 'bg-[var(--primary)] text-black' : 'text-[var(--text-muted)]'}`}
              title="Pincel Normal (B)"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => { setIsEraser(false); setBrushConfig(prev => ({ ...prev, engine: BrushEngineType.Smudge })); }}
              className={`p-2 rounded-lg transition-all ${!isEraser && brushConfig.engine === BrushEngineType.Smudge ? 'bg-[var(--primary)] text-black' : 'text-[var(--text-muted)]'}`}
              title="Esfumar (S)"
            >
              <Fingerprint size={16} />
            </button>
            <button
              onClick={() => { setIsEraser(false); setBrushConfig(prev => ({ ...prev, engine: BrushEngineType.Hairy })); }}
              className={`p-2 rounded-lg transition-all ${!isEraser && brushConfig.engine === BrushEngineType.Hairy ? 'bg-[var(--primary)] text-black' : 'text-[var(--text-muted)]'}`}
              title="Pincel de Cerdas (H)"
            >
              <Scissors size={16} className="rotate-90" />
            </button>
            {isHackerMode && (
              <button
                onClick={() => { setIsEraser(false); setBrushConfig(prev => ({ ...prev, engine: BrushEngineType.Binary })); }}
                className={`p-2 rounded-lg transition-all ${!isEraser && brushConfig.engine === BrushEngineType.Binary ? 'bg-green-500 text-black' : 'text-green-500/50'}`}
                title="Pincel de Código"
              >
                <Type size={16} />
              </button>
            )}
            
            <div className={`w-px h-6 ${isHackerMode ? 'bg-green-500/20' : 'bg-[var(--border-color)]'} mx-1`} />
            
            <button
              onClick={() => setIsEraser(!isEraser)}
              className={`p-2 rounded-lg transition-all
                ${isEraser 
                  ? (isHackerMode ? 'bg-green-500 text-black shadow-[0_0_10px_rgba(0,255,65,0.4)]' : 'bg-[var(--primary)] text-black shadow-md') 
                  : (isHackerMode ? 'text-green-500/50 hover:text-green-500' : 'text-[var(--text-muted)] hover:bg-black/5')}
              `}
              title="Borracha (E)"
            >
              <Eraser size={18} />
            </button>
          </div>

          <div className={`w-px h-6 ${isHackerMode ? 'bg-green-500/20' : 'bg-[var(--border-color)]'}`} />

          {!isEraser && (
            <>
              <div className="flex items-center gap-2">
                <label className={`text-[10px] uppercase font-bold ${isHackerMode ? 'text-green-500/50' : 'text-[var(--text-muted)]'}`}>
                  Tam
                </label>
                <input
                  type="range"
                  min="1"
                  max="150"
                  value={brushConfig.size}
                  onChange={(e) => setBrushConfig(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                  className={`w-20 ${isHackerMode ? 'accent-green-500' : ''}`}
                />
              </div>

              <div className="flex items-center gap-2">
                <label className={`text-[10px] uppercase font-bold ${isHackerMode ? 'text-green-500/50' : 'text-[var(--text-muted)]'}`}>
                  Cor
                </label>
                <input
                  type="color"
                  value={brushConfig.color}
                  onChange={(e) => setBrushConfig(prev => ({ ...prev, color: e.target.value }))}
                  className={`w-6 h-6 rounded-full overflow-hidden cursor-pointer border-2 ${isHackerMode ? 'border-green-500/50' : 'border-white shadow-sm'}`}
                />
              </div>
            </>
          )}

          <div className={`w-px h-6 ${isHackerMode ? 'bg-green-500/20' : 'bg-[var(--border-color)]'}`} />

          <div className="flex items-center gap-1">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={`p-2 transition-colors disabled:opacity-30
                ${isHackerMode ? 'hover:bg-green-500/10 text-green-500' : 'hover:bg-black/5'}
              `}
              title="Desfazer (Ctrl+Z)"
            >
              ↶
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={`p-2 transition-colors disabled:opacity-30
                ${isHackerMode ? 'hover:bg-green-500/10 text-green-500' : 'hover:bg-black/5'}
              `}
              title="Refazer (Ctrl+Y)"
            >
              ↷
            </button>
          </div>

          <div className={`w-px h-6 ${isHackerMode ? 'bg-green-500/20' : 'bg-[var(--border-color)]'}`} />

          <div className="flex items-center gap-2">
            {activeLayer?.type === DrawingLayerType.Raster && (
              <button
                onClick={handleAutoRig}
                disabled={isRigging}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all
                  ${isRigging 
                    ? (isHackerMode ? 'bg-green-500 text-black animate-pulse' : 'bg-yellow-400 text-black animate-pulse') 
                    : (isHackerMode ? 'bg-black border border-green-500 text-green-500 hover:bg-green-500 hover:text-black shadow-[0_0_10px_rgba(0,255,65,0.3)]' : 'bg-[var(--primary)] text-black hover:scale-105 active:scale-95 shadow-md')}
                `}
              >
                {isHackerMode ? <Zap size={14} /> : <Sparkles size={14} />}
                <span className="hidden sm:inline">{isRigging ? 'ANALYZING...' : 'Auto-Rig'}</span>
              </button>
            )}
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-1">
            <button onClick={handleExportPNG} className={`p-2 rounded-lg ${isHackerMode ? 'text-green-500 hover:bg-green-500/10' : 'text-[var(--text-muted)] hover:bg-black/5'}`} title="Exportar PNG">
              <Download size={18} />
            </button>
            <button onClick={handleExportJSON} className={`p-2 rounded-lg ${isHackerMode ? 'text-green-500 hover:bg-green-500/10' : 'text-[var(--text-muted)] hover:bg-black/5'}`} title="Exportar JSON">
              <Share size={18} />
            </button>
          </div>

          <div className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-medium transition-all
            ${isHackerMode ? 'bg-black border border-green-500/20 text-green-500/70' : 'bg-neutral-100/50 text-neutral-500'}
          `}>
            {isSaving ? (
              <div className={`w-2 h-2 rounded-full animate-pulse ${isHackerMode ? 'bg-green-500' : 'bg-yellow-400'}`} />
            ) : lastSavedAt ? (
              <div className={`w-2 h-2 rounded-full ${isHackerMode ? 'bg-green-500' : 'bg-green-500'}`} />
            ) : (
              <div className={`w-2 h-2 rounded-full ${isHackerMode ? 'bg-green-500/20' : 'bg-neutral-300'}`} />
            )}
            <span className="max-w-[80px] truncate">{isSaving ? 'SYNC...' : lastSavedAt ? 'SYNCED' : 'IDLE'}</span>
          </div>
        </div>

        <div 
          ref={containerRef}
          className="flex-1 relative overflow-hidden bg-[var(--surface-elevated)] m-4 rounded-[var(--ui-radius)] cursor-crosshair"
          style={{ isolation: 'isolate' }}
        >
          <div className="absolute bottom-6 left-6 z-[200] flex items-center gap-2 p-2 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-black/5">
            <button onClick={() => setZoom(z => Math.max(0.1, z - 0.1))} className="p-2 hover:bg-black/5 rounded-xl"><ZoomOut size={16}/></button>
            <span className="text-[10px] font-black w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(10, z + 0.1))} className="p-2 hover:bg-black/5 rounded-xl"><ZoomIn size={16}/></button>
            <div className="w-px h-4 bg-black/10 mx-1" />
            <button onClick={() => { setZoom(1); setPan({x:0, y:0}); }} className="p-2 hover:bg-black/5 rounded-xl" title="Resetar View"><Maximize size={16}/></button>
          </div>

          <div 
            style={{ 
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
              transition: isPanning ? 'none' : 'transform 0.1s ease-out'
            }}
            className="absolute inset-0"
          >
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="absolute inset-0 touch-none"
              style={{ touchAction: 'none' }}
            />

            {activeLayer?.type === DrawingLayerType.Skeletal && (
              <BoneOverlay 
                layer={activeLayer as SkeletalLayer}
                onUpdateBones={handleUpdateBones}
                width={canvasSize.width}
                height={canvasSize.height}
              />
            )}

            {remoteCursors.map(cursor => (
              <div 
                key={cursor.userId}
                className="absolute pointer-events-none z-[300] transition-all duration-75 ease-linear"
                style={{ 
                  left: cursor.x, 
                  top: cursor.y,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="relative">
                  <MousePointer2 size={20} className="text-[var(--primary)] drop-shadow-md fill-white" />
                  <div className="absolute left-4 top-4 bg-[var(--primary)] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-md uppercase tracking-tighter">
                    {cursor.userName}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`w-80 border-l flex flex-col transition-all
        ${isHackerMode ? 'bg-black/90 border-green-500/30 shadow-[-10px_0_30px_rgba(0,255,65,0.1)]' : 'bg-[var(--surface)] border-[var(--border-color)]'}
      `}>
        <div className={`p-4 border-b ${isHackerMode ? 'border-green-500/20' : 'border-[var(--border-color)]'}`}>
          <h3 className={`text-xs font-black uppercase tracking-widest ${isHackerMode ? 'text-green-500' : 'text-[var(--text-primary)]'}`}>
            {isHackerMode ? 'LAYER_STACK_DUMP' : 'Camadas'}
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
              backgroundColor: layer.backgroundColor,
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
            onMerge={() => {}} 
            setLayers={() => {}} 
          />
        </div>
      </div>
    </div>
  );
};
