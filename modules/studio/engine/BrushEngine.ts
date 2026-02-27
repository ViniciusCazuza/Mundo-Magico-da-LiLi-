import { BrushConfig, BrushEngineType, VectorPoint } from "../types";
import { PerspectiveEngine, PerspectiveGrid } from "./PerspectiveEngine";

/**
 * BrushEngine.ts - Motor de Pintura Multi-Engine APEX v3.0
 * Implementa arquitetura plugável de motores inspirada em Krita e Procreate.
 */

export class BrushEngine {
  private mainCtx: CanvasRenderingContext2D | null = null;
  private offscreenCanvas: HTMLCanvasElement;
  private offscreenCtx: CanvasRenderingContext2D;
  
  // Memória de Traço
  private lastPos: VectorPoint | null = null;
  private lastPressure: number = 0.5;
  private lastVelocity: number = 0;
  private lastTimestamp: number = 0;

  // Estabilização (EMA - Exponential Moving Average)
  private smoothPos: VectorPoint | null = null;
  private smoothingFactor: number = 0.3; 

  private activeColor: string = "#000000";
  private dpr: number = 1;

  // Perspectiva e Guias
  private activeGrid: PerspectiveGrid | null = null;

  // Análise de Humor (Interoperabilidade v1.0)
  private colorHistory: string[] = [];

  // Cache de Textura
  private currentTexture: HTMLImageElement | null = null;

  constructor() {
    this.offscreenCanvas = document.createElement("canvas");
    this.offscreenCtx = this.offscreenCanvas.getContext("2d", { willReadFrequently: true })!;
  }

  public setContext(ctx: CanvasRenderingContext2D, dpr: number = 1) {
    this.mainCtx = ctx;
    this.dpr = dpr;
  }

  public setColor(color: string) {
    this.activeColor = color;
    
    // Rastreia histórico de cores para análise de humor
    if (!this.colorHistory.includes(color)) {
      this.colorHistory.unshift(color);
      if (this.colorHistory.length > 10) this.colorHistory.pop();
    }
  }

  /**
   * Analisa as cores recentes e retorna uma descrição semântica do "humor" da obra.
   */
  public getColorMood(): string {
    if (this.colorHistory.length === 0) return "Início de uma nova aventura";

    let warmCount = 0;
    let coolCount = 0;
    let darkCount = 0;

    this.colorHistory.forEach(hex => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      
      if (brightness < 60) darkCount++;
      if (r > b) warmCount++;
      else coolCount++;
    });

    if (darkCount > this.colorHistory.length / 2) return "Misterioso e Profundo";
    if (warmCount > coolCount) return "Alegre e Vibrante";
    if (coolCount > warmCount) return "Calmo e Sereno";
    
    return "Colorido e Equilibrado";
  }

  public setPerspectiveGrid(grid: PerspectiveGrid | null) {
    this.activeGrid = grid;
  }

  /**
   * Prepara o carimbo (stamp) baseado no engine selecionado.
   */
  private async prepareStamp(config: BrushConfig) {
    const logicalSize = Math.max(1, config.size);
    const physicalSize = Math.ceil(logicalSize * this.dpr);
    const padding = Math.ceil(4 * this.dpr);
    const canvasSize = physicalSize + padding * 2;

    if (this.offscreenCanvas.width !== canvasSize || this.offscreenCanvas.height !== canvasSize) {
      this.offscreenCanvas.width = canvasSize;
      this.offscreenCanvas.height = canvasSize;
    }

    this.offscreenCtx.clearRect(0, 0, canvasSize, canvasSize);

    // Carregamento de Textura (Lazy Load)
    if (config.shapeTexture && (!this.currentTexture || this.currentTexture.src !== config.shapeTexture)) {
      this.currentTexture = new Image();
      this.currentTexture.src = config.shapeTexture;
      await new Promise(r => this.currentTexture!.onload = r);
    }

    switch (config.engine) {
      case BrushEngineType.Binary:
        this.renderBinaryStamp(canvasSize, physicalSize, padding, config);
        break;
      case BrushEngineType.Hairy:
        this.renderHairyStamp(canvasSize, physicalSize, padding, config);
        break;
      case BrushEngineType.Smudge:
        this.renderSmudgeStamp(canvasSize, physicalSize, padding, config);
        break;
      default:
        this.renderStandardStamp(canvasSize, physicalSize, padding, config);
    }
  }

  private renderSmudgeStamp(canvasSize: number, size: number, padding: number, config: BrushConfig) {
    const ctx = this.offscreenCtx;
    const center = canvasSize / 2;
    const radius = size / 2;

    // Amostra a cor do canvas na posição atual para criar o efeito de mistura
    if (this.mainCtx && this.lastPos) {
      const imageData = this.mainCtx.getImageData(
        this.lastPos.x * this.dpr - radius, 
        this.lastPos.y * this.dpr - radius, 
        size, 
        size
      );
      ctx.putImageData(imageData, padding, padding);
    }

    // Aplica máscara de suavidade
    ctx.globalCompositeOperation = 'destination-in';
    const grad = ctx.createRadialGradient(center, center, radius * config.hardness, center, center, radius);
    grad.addColorStop(0, "rgba(0,0,0,1)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  private renderStandardStamp(canvasSize: number, size: number, padding: number, config: BrushConfig) {
    const ctx = this.offscreenCtx;
    const center = canvasSize / 2;
    const radius = size / 2;

    if (this.currentTexture && this.currentTexture.complete) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(this.currentTexture, padding, padding, size, size);
      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = this.activeColor;
      ctx.fillRect(0, 0, canvasSize, canvasSize);
    } else {
      const grad = ctx.createRadialGradient(center, center, radius * config.hardness, center, center, radius);
      grad.addColorStop(0, this.activeColor);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private renderHairyStamp(canvasSize: number, size: number, padding: number, config: BrushConfig) {
    const ctx = this.offscreenCtx;
    const count = config.bristleCount || 15;
    ctx.fillStyle = this.activeColor;
    
    for (let i = 0; i < count; i++) {
      const r = (size / 2) * Math.sqrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const x = (canvasSize / 2) + r * Math.cos(theta);
      const y = (canvasSize / 2) + r * Math.sin(theta);
      const bSize = Math.max(1, (size / 10) * Math.random());
      
      ctx.beginPath();
      ctx.arc(x, y, bSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private renderBinaryStamp(canvasSize: number, size: number, padding: number, config: BrushConfig) {
    const ctx = this.offscreenCtx;
    const payload = config.binaryPayload || "01";
    const char = payload[Math.floor(Math.random() * payload.length)];
    
    ctx.fillStyle = this.activeColor;
    ctx.font = `bold ${size}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(char, canvasSize / 2, canvasSize / 2);
    
    // Glow tático para o modo binário
    ctx.shadowColor = this.activeColor;
    ctx.shadowBlur = size / 4;
  }

  private paintStamp(x: number, y: number, pressure: number, velocity: number, config: BrushConfig) {
    if (!this.mainCtx) return;

    // Sensores de Dinâmica
    let dSize = 1;
    if (config.pressureSize) dSize *= (0.2 + pressure * 0.8);
    if (config.velocitySize) dSize *= Math.max(0.1, 1 - (velocity / 500));

    let dAlpha = 1;
    if (config.pressureOpacity) dAlpha *= (0.1 + pressure * 0.9);
    if (config.velocityOpacity) dAlpha *= Math.max(0.1, 1 - (velocity / 1000));

    const renderSize = config.size * dSize;

    this.mainCtx.save();
    
    // Aplica Snapping de Perspectiva se disponível
    let renderX = x;
    let renderY = y;
    if (this.activeGrid) {
      const snapped = PerspectiveEngine.snapToGrid({ x, y }, this.activeGrid);
      renderX = snapped.x;
      renderY = snapped.y;
    }

    this.mainCtx.translate(renderX, renderY);
    if (config.rotation) this.mainCtx.rotate((config.rotation * Math.PI) / 180);
    
    this.mainCtx.globalAlpha = config.opacity * config.flow * dAlpha;
    this.mainCtx.globalCompositeOperation = config.blendMode;

    this.mainCtx.drawImage(
      this.offscreenCanvas,
      -renderSize / 2,
      -renderSize / 2,
      renderSize,
      renderSize
    );

    this.mainCtx.restore();
  }

  public async startStroke(x: number, y: number, pressure: number, config: BrushConfig) {
    await this.prepareStamp(config);
    this.lastPos = { x, y };
    this.smoothPos = { x, y };
    this.lastPressure = pressure;
    this.lastTimestamp = Date.now();
    this.lastVelocity = 0;
    
    this.paintStamp(x, y, pressure, 0, config);
  }

  public drawStroke(x: number, y: number, pressure: number, config: BrushConfig) {
    if (!this.lastPos || !this.smoothPos) return;

    const now = Date.now();
    const dt = Math.max(1, now - this.lastTimestamp);
    
    // Estabilização Preditiva
    this.smoothPos.x += (x - this.smoothPos.x) * this.smoothingFactor;
    this.smoothPos.y += (y - this.smoothPos.y) * this.smoothingFactor;

    const dx = this.smoothPos.x - this.lastPos.x;
    const dy = this.smoothPos.y - this.lastPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const velocity = (distance / dt) * 1000; // pixels per second

    // Interpolação de Traço (DDA Algorithm)
    const stepSize = Math.max(0.5, config.size * config.spacing);
    const steps = Math.floor(distance / stepSize);

    if (steps > 0) {
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const ix = this.lastPos.x + dx * t;
        const iy = this.lastPos.y + dy * t;
        const ip = this.lastPressure + (pressure - this.lastPressure) * t;
        const iv = this.lastVelocity + (velocity - this.lastVelocity) * t;
        
        this.paintStamp(ix, iy, ip, iv, config);
      }
      this.lastPos = { ...this.smoothPos };
      this.lastPressure = pressure;
      this.lastVelocity = velocity;
      this.lastTimestamp = now;
    }
  }

  public endStroke() {
    this.lastPos = null;
    this.smoothPos = null;
  }
}
