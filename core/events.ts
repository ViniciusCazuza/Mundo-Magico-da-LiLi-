
/**
 * MimiEvents - Barramento de eventos interno.
 * Permite que módulos se comuniquem sem imports diretos.
 */
class MimiEventDispatcher extends EventTarget {
  dispatch(type: string, detail: any) {
    this.dispatchEvent(new CustomEvent(type, { detail }));
  }

  on(type: string, callback: (detail: any) => void) {
    const listener = (event: Event) => {
      callback((event as CustomEvent).detail);
    };
    this.addEventListener(type, listener);
    return () => this.removeEventListener(type, listener);
  }
}

export const mimiEvents = new MimiEventDispatcher();

export const MIMI_EVENT_TYPES = {
  REPORT_CREATED: "REPORT_CREATED",
  CONVERSATION_UPDATED: "CONVERSATION_UPDATED",
  THEME_CHANGED: "THEME_CHANGED",
  QUOTA_EXCEEDED: "QUOTA_EXCEEDED",
  SAVE_TO_LIBRARY: "SAVE_TO_LIBRARY",
  // Fluxo de Observabilidade Parental (Transversal)
  OBSERVABILITY_ACTIVITY: "OBSERVABILITY_ACTIVITY"
};

export interface ObservabilityEvent {
  module: 'chat' | 'studio' | 'library' | 'agenda' | 'profile';
  type: 'interaction' | 'creation' | 'access' | 'system';
  action: string;
  payload: any;
  timestamp: number;
}
