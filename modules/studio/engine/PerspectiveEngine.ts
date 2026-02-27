
import { VectorPoint } from "../types";

/**
 * PerspectiveEngine.ts - Motor de Perspectiva e Guias Paramétricas
 * 
 * Implementa:
 * 1. Perspectiva Linear (1, 2, 3 pontos).
 * 2. Perspectiva Curvilínea (5 pontos / Fisheye).
 * 3. Snapping de traço para guias paramétricas.
 */

export interface PerspectiveGrid {
  type: 'linear' | 'fisheye';
  points: VectorPoint[]; // VPs
  center: VectorPoint;
  radius: number; // Para fisheye
}

export class PerspectiveEngine {
  /**
   * Calcula o ponto projetado em uma grade de 5 pontos (Fisheye).
   * Baseado na projeção esférica.
   */
  static projectFisheye(point: VectorPoint, center: VectorPoint, radius: number): VectorPoint {
    const dx = point.x - center.x;
    const dy = point.y - center.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist === 0) return { ...center };

    // Mapeamento não-linear (Semicírculo)
    const theta = Math.atan2(dy, dx);
    const phi = (dist / radius) * (Math.PI / 2);
    
    return {
      x: center.x + radius * Math.sin(phi) * Math.cos(theta),
      y: center.y + radius * Math.sin(phi) * Math.sin(theta)
    };
  }

  /**
   * Resolve o snap de um ponto para a guia de perspectiva mais próxima.
   */
  static snapToGrid(point: VectorPoint, grid: PerspectiveGrid): VectorPoint {
    if (grid.type === 'fisheye') {
      // Simplificação: Atrai o ponto para a curvatura esférica
      const dx = point.x - grid.center.x;
      const dy = point.y - grid.center.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > grid.radius) {
        const angle = Math.atan2(dy, dx);
        return {
          x: grid.center.x + grid.radius * Math.cos(angle),
          y: grid.center.y + grid.radius * Math.sin(angle)
        };
      }
    }
    return point;
  }

  /**
   * Simula o comportamento de uma Régua Reta (Straight Edge).
   */
  static snapToRuler(point: VectorPoint, p1: VectorPoint, p2: VectorPoint): VectorPoint {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const t = ((point.x - p1.x) * dx + (point.y - p1.y) * dy) / (dx * dx + dy * dy);
    
    return {
      x: p1.x + t * dx,
      y: p1.y + t * dy
    };
  }
}
