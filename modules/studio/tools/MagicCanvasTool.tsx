
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Undo2, Redo2, Activity, RefreshCw,
  Download, Sliders, Palette, Wand2, Eraser
} from "lucide-react";
import { BrushEngine, BrushConfig } from "../engine/BrushEngine";
import { StudioPanel } from "../components/StudioPanel";
import { MagicColorSystem } from "../ui/ColorSystem";
import { Dock } from "../ui/WindowSystem/Dock";
import { LayerPanel } from "../ui/Layers/LayerPanel";
import { useLayoutPersistence } from "../hooks/useLayoutPersistence";
import {
  PencilIcon, NibIcon, SprayIcon, BrushRoundIcon, EraserIcon, DropperIcon, LayersIcon
} from "../ui/Icons";


const CANVAS_WIDTH = 3200;
const CANVAS_HEIGHT = 2000;

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  locked: boolean;
  blendMode: GlobalCompositeOperation;
  canvas: HTMLCanvasElement;
  isBackground?: boolean;
  backgroundColor?: string;
  isTransparent?: boolean;
}

const TOOLS_DEF = [
  { id: 'pencil', name: 'Lápis Mágico', icon: PencilIcon, defaults: { size: 4, opacity: 1, flow: 1, hardness: 1, spacing: 0.05 } },
  { id: 'nib', name: 'Pena Clássica', icon: NibIcon, defaults: { size: 12, opacity: 1, flow: 0.8, hardness: 0.9, spacing: 0.02 } },
  { id: 'brush', name: 'Pincel Artístico', icon: BrushRoundIcon, defaults: { size: 50, opacity: 1, flow: 0.4, hardness: 0.6, spacing: 0.1 } },
  { id: 'spray', name: 'Spray de Estrelas', icon: SprayIcon, defaults: { size: 120, opacity: 0.3, flow: 0.2, hardness: 0.1, spacing: 0.4 } },
  { id: 'eraser', name: 'Borracha Mágica', icon: EraserIcon, defaults: { size: 60, opacity: 1, flow: 1, hardness: 0.9, spacing: 0.05, blendMode: 'destination-out' } },
];

const createDefaultBrush = (toolDef: any): BrushConfig => ({
  id: toolDef.id,
  name: toolDef.name,
  shapeTexture: null,
  spacing: toolDef.defaults.spacing,
  size: toolDef.defaults.size,
  opacity: toolDef.defaults.opacity,
  flow: toolDef.defaults.flow,
  hardness: toolDef.defaults.hardness,
  rotation: 0,
  pressureSize: true,
  pressureOpacity: true,
  blendMode: toolDef.defaults.blendMode || 'source-over'
});

export const MagicCanvasTool: React.FC = () => {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string>("");
  const [activeToolId, setActiveToolId] = useState('pencil');
  const [activeColor, setActiveColor] = useState("#818CF8");
  const [renderTick, setRenderTick] = useState(0);
  const [isMouseOverDrawingSurface, setIsMouseOverDrawingSurface] = useState(false); // New state

  // Detecção de Hardware (Retina/4K)
  const [dpr, setDpr] = useState(window.devicePixelRatio || 1);
  // BASE DE CÁLCULO PURA (Geometry Root)
  const drawingSurfaceRef = useRef<HTMLDivElement>(null);
  const rectCache = useRef<DOMRect | null>(null);

  const { layouts, saveLayout } = useLayoutPersistence(rectCache.current);

  const engineRef = useRef<BrushEngine>(new BrushEngine());
  const drawingRef = useRef(false);
  const rafRef = useRef<number>(0);
  const pointQueue = useRef<{ x: number, y: number, pressure: number }[]>([]);
  const leaveTimeoutRef = useRef<number | null>(null);

  // Fix: Move toolSettings and updateBrushSetting before currentBrush to resolve "used before declaration" error
  const [toolSettings, setToolSettings] = useState<Record<string, BrushConfig>>(() => {
    const initial: Record<string, BrushConfig> = {};
    TOOLS_DEF.forEach(t => { initial[t.id] = createDefaultBrush(t); });
    return initial;
  });

  const updateBrushSetting = (updates: Partial<BrushConfig>) => {
    setToolSettings(prev => ({
      ...prev,
      [activeToolId]: { ...prev[activeToolId], ...updates }
    }));
  };

  const currentBrush = toolSettings[activeToolId];

  useEffect(() => {
    const isDrawingTool = ['pencil', 'nib', 'brush', 'spray', 'eraser'].includes(activeToolId);

    // Dispatch 'garra' only if a drawing tool is active AND mouse is over the drawing surface
    const cursorType = isDrawingTool && isMouseOverDrawingSurface ? 'garra' : null;

    const event = new CustomEvent('set-cursor', {
      detail: { cursorType: cursorType }
    });
    document.dispatchEvent(event);
  }, [activeToolId, isMouseOverDrawingSurface]); // Add isMouseOverDrawingSurface to dependencies



  const handlePointerEnterDrawingSurface = useCallback(() => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setIsMouseOverDrawingSurface(true);
  }, []);

  const handlePointerLeaveDrawingSurface = useCallback((e: React.PointerEvent) => {
    if (drawingSurfaceRef.current && e.relatedTarget instanceof Node && drawingSurfaceRef.current.contains(e.relatedTarget)) {
      return; // Pointer moved to a child element within the drawing surface, do not set to false
    }

    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }
    leaveTimeoutRef.current = setTimeout(() => {
      setIsMouseOverDrawingSurface(false);
    }, 50) as unknown as number; // Small delay to debounce leave events
  }, []);

  // 1. Monitoramento de DPI e Resize Industrial
  useEffect(() => {
    const updateDpr = () => setDpr(window.devicePixelRatio || 1);
    const mediaQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    mediaQuery.addEventListener('change', updateDpr);

    if (!drawingSurfaceRef.current) return;

    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        rectCache.current = entry.target.getBoundingClientRect();
      }
    });

    obs.observe(drawingSurfaceRef.current);
    rectCache.current = drawingSurfaceRef.current.getBoundingClientRect();

    return () => {
      obs.disconnect();
      mediaQuery.removeEventListener('change', updateDpr);
    };
  }, []);

  useEffect(() => {
    if (layers.length === 0) {
      const bg = createLayer("Fundo", true);
      const l1 = createLayer("Camada 1");
      setLayers([l1, bg]);
      setActiveLayerId(l1.id);
    }
  }, [dpr]); // Recria se o DPI mudar drasticamente

  const createLayer = (name: string, isBackground = false): Layer => {
    const canvas = document.createElement('canvas');
    // Tamanho físico real = lógico * densidade
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (ctx) {
      // Normalizamos o contexto para trabalhar sempre em unidades lógicas (0-3200)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    return {
      id: isBackground ? 'layer_background' : `layer_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name, visible: true, opacity: 1, locked: false, blendMode: 'source-over', canvas,
      isBackground, backgroundColor: isBackground ? '#FFFFFF' : undefined, isTransparent: isBackground ? false : undefined
    };
  };

  const handleAddLayer = () => {
    const newLayer = createLayer(`Camada ${layers.length}`);
    setLayers(prev => [newLayer, ...prev]);
    setActiveLayerId(newLayer.id);
  };

  const handleMerge = (id: string) => {
    setLayers(prev => {
      const index = prev.findIndex(l => l.id === id);
      if (index === -1 || index >= prev.length - 1) return prev;
      const topLayer = prev[index];
      const bottomLayer = prev[index + 1];
      if (topLayer.isBackground) return prev;

      const destCtx = bottomLayer.canvas.getContext('2d');
      if (destCtx) {
        destCtx.save();
        destCtx.setTransform(dpr, 0, 0, dpr, 0, 0); // Garante escala correta na mesclagem
        destCtx.globalAlpha = topLayer.opacity;
        destCtx.globalCompositeOperation = topLayer.blendMode;
        // Desenhamos o canvas físico original
        destCtx.drawImage(topLayer.canvas, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        destCtx.restore();
      }

      const next = [...prev];
      next.splice(index, 1);
      if (activeLayerId === id) setActiveLayerId(bottomLayer.id);
      return next;
    });
  };

  useEffect(() => {
    const activeLayer = layers.find(l => l.id === activeLayerId);
    if (activeLayer && !activeLayer.locked && !activeLayer.isBackground) {
      const ctx = activeLayer.canvas.getContext('2d', { alpha: true, desynchronized: true });
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        engineRef.current.setContext(ctx, dpr);
      }
    } else {
      engineRef.current.setContext(null as any, dpr);
    }
  }, [activeLayerId, layers, dpr]);

  useEffect(() => {
    engineRef.current.setColor(activeColor);
    engineRef.current.prepareStamp(currentBrush);
  }, [activeColor, currentBrush]);

  const processQueue = useCallback(() => {
    if (pointQueue.current.length > 0 && drawingRef.current) {
      const points = [...pointQueue.current];
      pointQueue.current = [];
      points.forEach(p => engineRef.current.drawStroke(p.x, p.y, p.pressure, currentBrush));
      setRenderTick(t => t + 1);
    }
    rafRef.current = requestAnimationFrame(processQueue);
  }, [currentBrush]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(processQueue);
    return () => cancelAnimationFrame(rafRef.current);
  }, [processQueue]);

  // MATEMÁTICA DE PRECISÃO INDUSTRIAL
  const handleGlobalPointerMove = (e: React.PointerEvent) => {
    if (!drawingSurfaceRef.current || !rectCache.current) return;

    const rect = rectCache.current;

    // Cálculo de Coordenadas com Multiplicadores Inversos
    const invWidth = 1 / rect.width;
    const invHeight = 1 / rect.height;
    const scaleX = CANVAS_WIDTH * invWidth;
    const scaleY = CANVAS_HEIGHT * invHeight;

    const rawX = (e.clientX - rect.left) * scaleX;
    const rawY = (e.clientY - rect.top) * scaleY;

    // Clamping de Segurança (Anti-Drift)
    const x = Math.min(Math.max(rawX, 0), CANVAS_WIDTH);
    const y = Math.min(Math.max(rawY, 0), CANVAS_HEIGHT);

    const isInside =
      e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

    // Optimization: Only update state if it changed to prevent excessive re-renders
    if (isInside !== isMouseOverDrawingSurface) {
      setIsMouseOverDrawingSurface(isInside);
    }

    if (drawingRef.current && isInside) {
      const pressure = e.pressure || 0.5;
      pointQueue.current.push({ x, y, pressure });
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 || !activeLayerId || !rectCache.current) return;

    const rect = rectCache.current;
    const activeLayer = layers.find(l => l.id === activeLayerId);
    if (!activeLayer || activeLayer.locked || activeLayer.isBackground) return;

    drawingRef.current = true;
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    const x = Math.min(Math.max((e.clientX - rect.left) * scaleX, 0), CANVAS_WIDTH);
    const y = Math.min(Math.max((e.clientY - rect.top) * scaleY, 0), CANVAS_HEIGHT);
    const pressure = e.pressure || 0.5;

    engineRef.current.startStroke(x, y, pressure, currentBrush);
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    drawingRef.current = false;
    engineRef.current.endStroke();
    (e.currentTarget as Element).releasePointerCapture(e.pointerId);
  };

  const handleExport = () => {
    const composite = document.createElement('canvas');
    composite.width = CANVAS_WIDTH * dpr;
    composite.height = CANVAS_HEIGHT * dpr;
    const ctx = composite.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    [...layers].reverse().forEach(l => {
      if (!l.visible) return;
      if (l.isBackground) {
        if (!l.isTransparent) {
          ctx.fillStyle = l.backgroundColor || '#FFFFFF';
          ctx.globalAlpha = l.opacity;
          ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
      } else {
        ctx.globalAlpha = l.opacity;
        ctx.globalCompositeOperation = l.blendMode;
        ctx.drawImage(l.canvas, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }
    });
    const link = document.createElement('a');
    link.href = composite.toDataURL('image/png');
    link.download = `Arte_Alice_${Date.now()}.png`;
    link.click();
  };

  const togglePanelMinimize = (id: string) => {
    const current = layouts[id];
    saveLayout(id, { isMinimized: !current.isMinimized });
  };

  const updatePanelPos = (id: string, pos: { x: number, y: number }) => {
    saveLayout(id, { pos });
  };

  const dockItems = [
    { id: 'colors', title: 'Paleta de Cores', icon: Palette },
    { id: 'brush-settings', title: 'Ponta do Pincel', icon: Sliders },
    { id: 'layers', title: 'Painel de Camadas', icon: LayersIcon }
  ].filter(item => layouts[item.id]?.isMinimized);




  return (
    <div
      className="flex-1 flex flex-col bg-transparent overflow-hidden relative select-none"
      onPointerMove={handleGlobalPointerMove}
    >
      <header className="h-14 shrink-0 bg-[var(--surface)]/95 border-b border-[var(--border-color)] flex items-center justify-between px-6 z-[100] backdrop-blur-2xl">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-1.5 p-1 bg-black/10 rounded-2xl border border-[var(--border-color)]">
            <button className="p-2.5 text-[var(--text-muted)] hover:text-[var(--primary)] transition-all hover:bg-white/5 rounded-xl"><Undo2 size={16} /></button>
            <button className="p-2.5 text-[var(--text-muted)] hover:text-[var(--primary)] transition-all hover:bg-white/5 rounded-xl"><Redo2 size={16} /></button>
          </div>

          <div className="flex items-center gap-4 border-l border-[var(--border-color)] pl-6">
            {TOOLS_DEF.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveToolId(t.id)}
                title={t.name}
                className={`relative p-3 rounded-2xl transition-all group ${activeToolId === t.id ? 'bg-[var(--primary)] text-[var(--text-on-primary)] shadow-lg' : 'text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-primary)]'}`}
              >
                <t.icon size={20} />
                {activeToolId === t.id && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--text-on-primary)] rounded-full" />
                )}
              </button>
            ))}
            <div className="w-px h-6 bg-[var(--border-color)]" />
            <button title="Conta-gotas" className="p-3 rounded-2xl text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--primary)] transition-all">
              <DropperIcon size={20} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-[var(--primary)]/10 rounded-full border border-[var(--primary)]/20 shadow-inner">
            <Activity size={12} className="text-[var(--primary)] animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[var(--primary)]">Engine Alice v4.0 Industrial</span>
          </div>
          <div className="w-px h-6 bg-[var(--border-color)] mx-2" />
          <button onClick={handleExport} className="mimi-button !py-2.5 !px-6 !text-[10px] !uppercase !tracking-[0.15em]">
            <Download size={14} /> Exportar
          </button>
        </div>
      </header>

      <main className="flex-1 relative bg-[var(--bg-app)] flex items-center justify-center p-8 transition-all overflow-hidden">
        {/* PAPEL VISUAL (ESTÉTICA) */}
        <div
          className="relative w-full h-full max-w-[1600px] aspect-[1.6] rounded-3xl border border-[var(--border-color)] bg-white shadow-[var(--shadow-elevated)] overflow-hidden pointer-events-auto"
          style={{ boxSizing: 'content-box' }}
        >
          {/* GEOMETRY ROOT (REFERÊNCIA MATEMÁTICA PURA) */}
          <div
            ref={drawingSurfaceRef}
            className="absolute inset-0 w-full h-full touch-none"
            style={{
              transform: 'none',
              transition: 'none'
            }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerEnter={() => setIsMouseOverDrawingSurface(true)}
            onPointerLeave={() => setIsMouseOverDrawingSurface(false)}
          >
            {[...layers].reverse().map((layer) => (
              layer.isBackground ? (
                <div key={layer.id} className="absolute inset-0 w-full h-full" style={{ backgroundColor: layer.isTransparent ? 'transparent' : layer.backgroundColor, opacity: layer.opacity, display: layer.visible ? 'block' : 'none' }} />
              ) : (
                <canvas
                  key={layer.id}
                  ref={(el) => {
                    if (el) {
                      const ctx = el.getContext('2d')!;
                      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                      ctx.drawImage(layer.canvas, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                    }
                  }}
                  width={CANVAS_WIDTH * dpr}
                  height={CANVAS_HEIGHT * dpr}
                  style={{
                    opacity: layer.opacity,
                    display: layer.visible ? 'block' : 'none',
                    mixBlendMode: layer.blendMode as any,
                    pointerEvents: (layer.id === activeLayerId && !layer.locked) ? 'auto' : 'none',
                    width: '100%',
                    height: '100%'
                  }}
                  className="absolute inset-0 w-full h-full"
                />
              )
            ))}

          </div>
        </div>
      </main>

      <div className="pointer-events-none fixed inset-0 z-[150]">
        <div className="pointer-events-auto">
          {Object.keys(layouts).map(id => {
            const layout = layouts[id];
            let Icon: React.ElementType = Palette;
            let title = "";
            let children = null;

            if (id === 'colors') {
              Icon = Palette; title = "Cores e Magia";
              children = <MagicColorSystem color={activeColor} onChange={setActiveColor} opacity={currentBrush.opacity} onOpacityChange={v => updateBrushSetting({ opacity: v })} />;
            }
            if (id === 'brush-settings') {
              Icon = Sliders; title = "Configuração do Traço";
              children = (
                <div className="space-y-6">
                  <div className="w-full h-20 bg-black/10 rounded-2xl border border-white/5 shadow-inner overflow-hidden mb-4 relative">
                    <BrushStrokePreview config={currentBrush} color={activeColor} dpr={dpr} />
                    <span className="absolute bottom-1 right-2 text-[6px] font-black text-white/30 uppercase tracking-widest">Preview HD</span>
                  </div>

                  <StudioSlider label="Tamanho" value={currentBrush.size} min={1} max={500} unit="px" onChange={v => updateBrushSetting({ size: v })} />
                  <StudioSlider label="Dureza" value={currentBrush.hardness} min={0} max={1} step={0.01} unit="%" isPercent onChange={v => updateBrushSetting({ hardness: v })} />
                  <StudioSlider label="Fluxo de Tinta" value={currentBrush.flow} min={0.01} max={1} step={0.01} unit="%" isPercent onChange={v => updateBrushSetting({ flow: v })} />
                  <StudioSlider label="Espaçamento" value={currentBrush.spacing} min={0.01} max={2} step={0.01} unit="%" isPercent onChange={v => updateBrushSetting({ spacing: v })} />
                </div>
              );
            }
            if (id === 'layers') {
              Icon = LayersIcon; title = "Camadas";
              children = <LayerPanel
                layers={layers} activeLayerId={activeLayerId} onAddLayer={handleAddLayer} onSelectLayer={setActiveLayerId}
                onToggleVisibility={(id, iso) => setLayers(prev => prev.map(l => iso ? { ...l, visible: l.id === id } : (l.id === id ? { ...l, visible: !l.visible } : l)))}
                onToggleLock={id => setLayers(prev => prev.map(l => l.id === id ? { ...l, locked: !l.locked } : l))}
                onUpdateName={(id, n) => setLayers(prev => prev.map(l => l.id === id ? { ...l, name: n } : l))}
                onDuplicate={id => { const s = layers.find(l => l.id === id); if (s) { const nl = createLayer(s.name + ' (Cópia)'); const nctx = nl.canvas.getContext('2d')!; nctx.setTransform(dpr, 0, 0, dpr, 0, 0); nctx.drawImage(s.canvas, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); setLayers([nl, ...layers]); } }}
                onDelete={id => setLayers(prev => prev.filter(l => l.id !== id || l.isBackground))}
                onUpdateSettings={(id, s) => setLayers(prev => prev.map(l => l.id === id ? { ...l, ...s } : l))}
                onReorder={(id, d) => setLayers(prev => {
                  const i = prev.findIndex(l => l.id === id); const ni = d === 'up' ? i - 1 : i + 1;
                  if (ni < 0 || ni >= prev.length || prev[i].isBackground || prev[ni].isBackground) return prev;
                  const next = [...prev]; const [r] = next.splice(i, 1); next.splice(ni, 0, r); return next;
                })}
                onMerge={handleMerge}
              />;
            }

            return (
              <StudioPanel key={id} id={id} title={title} icon={Icon} initialPos={layout.pos} width={layout.width} isMinimized={layout.isMinimized} onMinimize={togglePanelMinimize} onPositionChange={updatePanelPos}>
                {children}
              </StudioPanel>
            );
          })}
          <Dock items={dockItems} onRestore={togglePanelMinimize} />
        </div>
      </div>
    </div>
  );
};

const BrushStrokePreview = ({ config, color, dpr }: { config: BrushConfig, color: string, dpr: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewEngine = useRef<BrushEngine>(new BrushEngine());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    previewEngine.current.setContext(ctx, dpr);
    previewEngine.current.setColor(color);

    const y = 40;
    const padding = 40;
    const w = 160;

    previewEngine.current.startStroke(padding, y, 0.4, config);
    for (let i = 0; i <= 1; i += 0.01) {
      const px = padding + w * i;
      const pressure = 0.4 + Math.sin(i * Math.PI) * 0.4;
      previewEngine.current.drawStroke(px, y, pressure, config);
    }
    previewEngine.current.endStroke();
  }, [config, color, dpr]);

  return <canvas ref={canvasRef} width={240 * dpr} height={80 * dpr} className="w-full h-full object-contain" />;
};

const StudioSlider = ({ label, value, min, max, step = 1, unit, isPercent, onChange }: any) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">
      <span>{label}</span>
      <div className="flex items-center gap-1"><span className="text-[var(--primary)] font-black">{isPercent ? Math.round(value * 100) : value}</span><span>{unit}</span></div>
    </div>
    <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(parseFloat(e.target.value))} className="w-full h-1 bg-black/20 rounded-full appearance-none accent-[var(--primary)]" />
  </div>
);
