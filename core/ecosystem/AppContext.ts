
/**
 * AppContext.ts - Orquestrador de Contexto Transversal (Nível 15)
 * 
 * Permite que módulos compartilhem estados efêmeros (como humor da cor ou ferramentas ativas)
 * sem acoplamento direto, garantindo interatividade Mimi + Ecossistema.
 */

export interface StudioContext {
  colorMood: string;
  activeLayerType: string;
  drawingTitle: string;
  lastUpdate: number;
}

class AppContextManager {
  private studioContext: StudioContext | null = null;

  public setStudioContext(ctx: Partial<StudioContext>) {
    this.studioContext = {
      ...this.studioContext,
      ...ctx,
      lastUpdate: Date.now()
    } as StudioContext;
  }

  public getStudioContext(): StudioContext | null {
    // Validade do contexto: 5 minutos
    if (!this.studioContext || Date.now() - this.studioContext.lastUpdate > 300000) {
      return null;
    }
    return this.studioContext;
  }
}

export const appContext = new AppContextManager();
