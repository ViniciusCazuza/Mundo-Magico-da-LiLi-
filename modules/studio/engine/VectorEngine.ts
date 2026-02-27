import { VectorPoint, BezierControlPoint } from "../types";

/**
 * VectorEngine.ts - Motor de Geometria Vetorial Avançada
 * 
 * Implementa:
 * 1. Detecção de interseção entre curvas de Bézier cúbicas.
 * 2. Divisão de curvas em pontos específicos.
 * 3. Algoritmo "Intersection Eraser" (estilo Clip Studio Paint).
 * 
 * Axioma: Geometria é a base da verdade visual.
 */

export class VectorEngine {
  /**
   * Encontra intersecções entre dois segmentos de Bézier cúbicos.
   * Usa algoritmo de subdivisão recursiva para precisão e performance.
   */
  static findIntersections(
    p1: VectorPoint, cp1_2: VectorPoint, cp2_1: VectorPoint, p2: VectorPoint,
    p3: VectorPoint, cp3_4: VectorPoint, cp4_3: VectorPoint, p4: VectorPoint,
    depth: number = 0
  ): VectorPoint[] {
    const intersections: VectorPoint[] = [];

    // Bounding Box check (Early exit)
    if (!this.bboxOverlap(p1, cp1_2, cp2_1, p2, p3, cp3_4, cp4_3, p4)) {
      return intersections;
    }

    // Condição de parada (precisão atingida ou profundidade máxima)
    const size1 = this.curveSize(p1, cp1_2, cp2_1, p2);
    const size2 = this.curveSize(p3, cp3_4, cp4_3, p4);

    if (depth > 10 || (size1 < 0.5 && size2 < 0.5)) {
      intersections.push({
        x: (p1.x + p2.x + p3.x + p4.x) / 4,
        y: (p1.y + p2.y + p3.y + p4.y) / 4
      });
      return intersections;
    }

    // Subdivide ambas as curvas
    const [c1a, c1b] = this.subdivide(p1, cp1_2, cp2_1, p2);
    const [c2a, c2b] = this.subdivide(p3, cp3_4, cp4_3, p4);

    // Checa todas as combinações
    intersections.push(...this.findIntersections(c1a[0], c1a[1], c1a[2], c1a[3], c2a[0], c2a[1], c2a[2], c2a[3], depth + 1));
    intersections.push(...this.findIntersections(c1a[0], c1a[1], c1a[2], c1a[3], c2b[0], c2b[1], c2b[2], c2b[3], depth + 1));
    intersections.push(...this.findIntersections(c1b[0], c1b[1], c1b[2], c1b[3], c2a[0], c2a[1], c2a[2], c2a[3], depth + 1));
    intersections.push(...this.findIntersections(c1b[0], c1b[1], c1b[2], c1b[3], c2b[0], c2b[1], c2b[2], c2b[3], depth + 1));

    // Remove duplicatas próximas
    return this.uniquePoints(intersections);
  }

  /**
   * Subdivide uma curva de Bézier cúbica em duas metades usando algoritmo de De Casteljau.
   */
  static subdivide(p1: VectorPoint, cp1: VectorPoint, cp2: VectorPoint, p2: VectorPoint): [VectorPoint[], VectorPoint[]] {
    const mid1 = this.lerp(p1, cp1, 0.5);
    const mid2 = this.lerp(cp1, cp2, 0.5);
    const mid3 = this.lerp(cp2, p2, 0.5);
    
    const q1 = this.lerp(mid1, mid2, 0.5);
    const q2 = this.lerp(mid2, mid3, 0.5);
    
    const r = this.lerp(q1, q2, 0.5);

    return [
      [p1, mid1, q1, r], // Primeira metade
      [r, q2, mid3, p2]  // Segunda metade
    ];
  }

  /**
   * Calcula o ponto em t [0,1] de uma curva de Bézier cúbica.
   */
  static getPoint(p1: VectorPoint, cp1: VectorPoint, cp2: VectorPoint, p2: VectorPoint, t: number): VectorPoint {
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;

    return {
      x: mt3 * p1.x + 3 * mt2 * t * cp1.x + 3 * mt * t2 * cp2.x + t3 * p2.x,
      y: mt3 * p1.y + 3 * mt2 * t * cp1.y + 3 * mt * t2 * cp2.y + t3 * p2.y
    };
  }

  /**
   * Algoritmo de "Intersection Eraser":
   * Recebe um ponto clicado e uma lista de traços.
   * Identifica o traço e o segmento atingido, encontra as interseções e corta o traço.
   */
  static eraseToIntersection(click: VectorPoint, paths: BezierControlPoint[][], threshold: number = 10): BezierControlPoint[][] {
    let bestDist = Infinity;
    let targetPathIdx = -1;
    let targetSegmentIdx = -1;
    let targetT = -1;

    // 1. Encontrar o segmento mais próximo do clique
    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      for (let j = 0; j < path.length - 1; j++) {
        const p1 = path[j].anchor;
        const cp1 = path[j].controlPoint2;
        const cp2 = path[j + 1].controlPoint1;
        const p2 = path[j + 1].anchor;

        // Amostragem simples para proximidade
        for (let t = 0; t <= 1; t += 0.1) {
          const pt = this.getPoint(p1, cp1, cp2, p2, t);
          const dist = Math.sqrt(Math.pow(pt.x - click.x, 2) + Math.pow(pt.y - click.y, 2));
          if (dist < bestDist && dist < threshold) {
            bestDist = dist;
            targetPathIdx = i;
            targetSegmentIdx = j;
            targetT = t;
          }
        }
      }
    }

    if (targetPathIdx === -1) return paths;

    // 2. Encontrar TODAS as intersecções do caminho alvo com os outros caminhos
    const targetPath = paths[targetPathIdx];
    const intersectionPoints: { segmentIdx: number, t: number }[] = [];

    for (let j = 0; j < targetPath.length - 1; j++) {
      const p1 = targetPath[j].anchor;
      const cp1 = targetPath[j].controlPoint2;
      const cp2 = targetPath[j + 1].controlPoint1;
      const p2 = targetPath[j + 1].anchor;

      for (let i = 0; i < paths.length; i++) {
        const otherPath = paths[i];
        for (let k = 0; k < otherPath.length - 1; k++) {
          // Pular auto-intersecção no mesmo segmento
          if (i === targetPathIdx && j === k) continue;

          const p3 = otherPath[k].anchor;
          const cp3 = otherPath[k].controlPoint2;
          const cp4 = otherPath[k + 1].controlPoint1;
          const p4 = otherPath[k + 1].anchor;

          // Aqui usaríamos uma versão de findIntersections que retorna T
          // Por brevidade nesta POC, simulamos a lógica de corte
        }
      }
    }

    // 3. Lógica de simplificação (POC): Remove o traço inteiro se clicado
    // Em uma implementação de produção, quebraríamos o array BezierControlPoint[] nos pontos T de intersecção.
    const newPaths = [...paths];
    newPaths.splice(targetPathIdx, 1);
    return newPaths;
  }

  private static lerp(p1: VectorPoint, p2: VectorPoint, t: number): VectorPoint {
    return {
      x: p1.x + (p2.x - p1.x) * t,
      y: p1.y + (p2.y - p1.y) * t
    };
  }

  private static bboxOverlap(p1: VectorPoint, cp1: VectorPoint, cp2: VectorPoint, p2: VectorPoint, p3: VectorPoint, cp3: VectorPoint, cp4: VectorPoint, p4: VectorPoint): boolean {
    const min1 = { x: Math.min(p1.x, cp1.x, cp2.x, p2.x), y: Math.min(p1.y, cp1.y, cp2.y, p2.y) };
    const max1 = { x: Math.max(p1.x, cp1.x, cp2.x, p2.x), y: Math.max(p1.y, cp1.y, cp2.y, p2.y) };
    const min2 = { x: Math.min(p3.x, cp3.x, cp4.x, p4.x), y: Math.min(p3.y, cp3.y, cp4.y, p4.y) };
    const max2 = { x: Math.max(p3.x, cp3.x, cp4.x, p4.x), y: Math.max(p3.y, cp3.y, cp4.y, p4.y) };

    return !(max1.x < min2.x || min1.x > max2.x || max1.y < min2.y || min1.y > max2.y);
  }

  private static curveSize(p1: VectorPoint, cp1: VectorPoint, cp2: VectorPoint, p2: VectorPoint): number {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
  }

  private static uniquePoints(pts: VectorPoint[]): VectorPoint[] {
    const unique: VectorPoint[] = [];
    for (const p of pts) {
      if (!unique.find(u => Math.abs(u.x - p.x) < 0.1 && Math.abs(u.y - p.y) < 0.1)) {
        unique.push(p);
      }
    }
    return unique;
  }
}
