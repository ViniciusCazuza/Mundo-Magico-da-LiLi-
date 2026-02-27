
/**
 * BrushEngine.ts - Motor de Pintura HyperPaint Pro
 * Responsável pela matemática de interpolação, suavidade e dinâmica de fluxo.
 */

export interface BrushConfig {
  id: string;
  name: string;
  shapeTexture: HTMLImageElement | null;
  spacing: number;
  size: number;
  opacity: number;
  flow: number;
  hardness: number;
  rotation: number;
  pressureSize: boolean;
  pressureOpacity: boolean;
  blendMode: GlobalCompositeOperation;
}

export class BrushEngine {
  private ctx: CanvasRenderingContext2D | null = null;
  private scratchCanvas: HTMLCanvasElement;
  private scratchCtx: CanvasRenderingContext2D;
  private lastX: number | null = null;
  private lastY: number | null = null;
  private lastPressure: number = 0.5;
  private activeColor: string = "#000000";
  private dpr: number = 1;

  constructor() {
    this.scratchCanvas = document.createElement("canvas");
    this.scratchCtx = this.scratchCanvas.getContext("2d", { willReadFrequently: true })!;
  }

  public setContext(ctx: CanvasRenderingContext2D, dpr: number = 1) {
    this.ctx = ctx;
    this.dpr = dpr;
  }

  public setColor(color: string) {
    this.activeColor = color;
  }

  /**
   * Prepara o carimbo (stamp) respeitando dureza, cor e densidade de pixels (DPR).
   */
  public prepareStamp(config: BrushConfig) {
    // Calculamos o tamanho físico real baseado no dpr da tela
    const logicalSize = Math.max(1, config.size);
    const physicalSize = Math.ceil(logicalSize * this.dpr);
    const padding = Math.ceil(2 * this.dpr);
    const canvasSize = physicalSize + padding * 2;
    
    if (this.scratchCanvas.width !== canvasSize || this.scratchCanvas.height !== canvasSize) {
      this.scratchCanvas.width = canvasSize;
      this.scratchCanvas.height = canvasSize;
    }

    this.scratchCtx.clearRect(0, 0, canvasSize, canvasSize);

    if (config.shapeTexture && config.shapeTexture.complete) {
      this.scratchCtx.globalCompositeOperation = 'source-over';
      this.scratchCtx.drawImage(config.shapeTexture, padding, padding, physicalSize, physicalSize);
      this.scratchCtx.globalCompositeOperation = 'source-in';
      this.scratchCtx.fillStyle = this.activeColor;
      this.scratchCtx.fillRect(0, 0, canvasSize, canvasSize);
    } else {
      const center = canvasSize / 2;
      const radius = physicalSize / 2;
      const grad = this.scratchCtx.createRadialGradient(center, center, radius * config.hardness, center, center, radius);
      
      grad.addColorStop(0, this.activeColor);
      grad.addColorStop(1, 'transparent');
      
      this.scratchCtx.fillStyle = grad;
      this.scratchCtx.beginPath();
      this.scratchCtx.arc(center, center, radius, 0, Math.PI * 2);
      this.scratchCtx.fill();
    }
  }

  private paintStamp(x: number, y: number, pressure: number, config: BrushConfig) {
    if (!this.ctx) return;

    const dynamicSize = config.pressureSize ? pressure : 1;
    const dynamicFlow = config.pressureOpacity ? pressure : 1;
    
    const renderSize = config.size * dynamicSize;
    const renderFlow = config.flow * dynamicFlow;

    this.ctx.save();
    // O CTX já está escalado pelo dpr no setTransform do componente pai,
    // então desenhamos em unidades lógicas (0-3200).
    this.ctx.translate(x, y);
    if (config.rotation) {
      this.ctx.rotate((config.rotation * Math.PI) / 180);
    }
    
    this.ctx.globalAlpha = config.opacity * renderFlow;
    this.ctx.globalCompositeOperation = config.blendMode;

    // Como o scratchCanvas está em tamanho físico (DPR), 
    // precisamos desenhá-lo de volta para o tamanho lógico.
    this.ctx.drawImage(
      this.scratchCanvas,
      -renderSize / 2,
      -renderSize / 2,
      renderSize,
      renderSize
    );

    this.ctx.restore();
  }

  public startStroke(x: number, y: number, pressure: number, config: BrushConfig) {
    this.prepareStamp(config);
    this.lastX = x;
    this.lastY = y;
    this.lastPressure = pressure;
    this.paintStamp(x, y, pressure, config);
  }

  public drawStroke(x: number, y: number, pressure: number, config: BrushConfig) {
    if (this.lastX === null || this.lastY === null) {
      this.startStroke(x, y, pressure, config);
      return;
    }

    const dx = x - this.lastX;
    const dy = y - this.lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const stepSize = Math.max(0.5, config.size * config.spacing);
    const steps = Math.floor(distance / stepSize);

    if (steps > 0) {
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const ix = this.lastX + dx * t;
        const iy = this.lastY + dy * t;
        const ip = this.lastPressure + (pressure - this.lastPressure) * t;
        this.paintStamp(ix, iy, ip, config);
      }
      this.lastX = x;
      this.lastY = y;
      this.lastPressure = pressure;
    }
  }

  public endStroke() {
    this.lastX = null;
    this.lastY = null;
  }
}
