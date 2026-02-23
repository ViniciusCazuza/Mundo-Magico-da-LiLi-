
/**
 * VectorEngine.ts - Motor de Geometria Vetorial (APEX Level 15)
 * Responsável pela renderização de curvas de Bézier e manipulação de caminhos.
 * Axioma: "Make illegal states unrepresentable"
 */

import { VectorPoint, BezierControlPoint, VectorLayer } from '../types';

export class VectorEngine {
  private ctx: CanvasRenderingContext2D | null = null;
  private dpr: number = 1;

  public setContext(ctx: CanvasRenderingContext2D, dpr: number = 1) {
    this.ctx = ctx;
    this.dpr = dpr;
  }

  /**
   * Renderiza uma camada vetorial completa.
   */
  public renderLayer(layer: VectorLayer) {
    if (!this.ctx || !layer.isVisible || layer.path.length === 0) return;

    this.ctx.save();

    // Configurações Globais
    this.ctx.globalAlpha = layer.opacity;
    this.ctx.globalCompositeOperation = layer.blendMode as GlobalCompositeOperation;

    // Configurações de Traço/Preenchimento
    this.ctx.strokeStyle = layer.strokeColor;
    this.ctx.lineWidth = layer.strokeWidth;
    this.ctx.fillStyle = layer.fillColor;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    this.ctx.beginPath();

    // Início do Caminho
    const firstPoint = layer.path[0].anchor;
    this.ctx.moveTo(firstPoint.x, firstPoint.y);

    // Desenho das Curvas
    for (let i = 1; i < layer.path.length; i++) {
      const prev = layer.path[i - 1];
      const curr = layer.path[i];

      this.ctx.bezierCurveTo(
        prev.controlPoint2.x, prev.controlPoint2.y,
        curr.controlPoint1.x, curr.controlPoint1.y,
        curr.anchor.x, curr.anchor.y
      );
    }

    if (layer.isClosed) {
      this.ctx.closePath();
      if (layer.fillColor !== 'transparent') {
        this.ctx.fill();
      }
    }

    if (layer.strokeWidth > 0) {
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  /**
   * Helper para calcular distância entre pontos (Análise Matemática).
   */
  public distance(p1: VectorPoint, p2: VectorPoint): number {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  /**
   * Simplificação de caminho RDP (Douglas-Peucker) - Para Resiliência de Performance.
   * Reduz o número de pontos sem perder a fidelidade visual significativa.
   */
  public simplifyPath(points: VectorPoint[], epsilon: number): VectorPoint[] {
    if (points.length <= 2) return points;

    let dmax = 0;
    let index = 0;
    const end = points.length - 1;

    for (let i = 1; i < end; i++) {
      const d = this.perpendicularDistance(points[i], points[0], points[end]);
      if (d > dmax) {
        index = i;
        dmax = d;
      }
    }

    if (dmax > epsilon) {
      const recResults1 = this.simplifyPath(points.slice(0, index + 1), epsilon);
      const recResults2 = this.simplifyPath(points.slice(index), epsilon);
      return [...recResults1.slice(0, -1), ...recResults2];
    } else {
      return [points[0], points[end]];
    }
  }

  private perpendicularDistance(p: VectorPoint, p1: VectorPoint, p2: VectorPoint): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const mag = Math.sqrt(dx * dx + dy * dy);
    if (mag > 0) {
      return Math.abs(dy * p.x - dx * p.y + p2.x * p1.y - p2.y * p1.x) / mag;
    }
    return this.distance(p, p1);
  }
}
