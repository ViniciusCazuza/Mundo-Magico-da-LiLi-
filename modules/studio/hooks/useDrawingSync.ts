
import { HubConnection, HubConnectionBuilder, LogLevel, HubConnectionState } from '@microsoft/signalr';
import { useState, useEffect, useRef, useCallback } from 'react';
import { IdentityManager } from '../../../core/ecosystem/IdentityManager';

/**
 * useDrawingSync - Hook para sincronização em tempo real (SignalR)
 */

const HUB_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5180') + '/hubs/drawing';

export interface RemoteCursor {
  userId: string;
  userName: string;
  x: number;
  y: number;
}

export function useDrawingSync(drawingId: string | undefined) {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [remoteCursors, setRemoteCursors] = useState<Record<string, RemoteCursor>>({});
  const [lastUpdate, setLastUpdate] = useState<any>(null);
  
  const profile = IdentityManager.getActiveProfile();

  // Inicializa conexão
  useEffect(() => {
    if (!drawingId || !profile) return;

    const newConnection = new HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          // Estratégia de Backoff Exponencial (máximo 10 segundos entre tentativas)
          return Math.min(retryContext.elapsedMilliseconds + 1000, 10000);
        }
      })
      .configureLogging(LogLevel.Information)
      .build();

    newConnection.onclose((error) => {
      console.error('[SignalR] Connection closed. Diagnostic:', error);
    });

    newConnection.onreconnected((connectionId) => {
      console.log('[SignalR] Reconnected. SyncId:', connectionId);
      if (drawingId) newConnection.invoke('JoinDrawing', drawingId);
    });

    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, [drawingId, profile?.id]);

  // Registra Listeners e Inicia Conexão
  useEffect(() => {
    if (connection && drawingId) {
      if (connection.state !== HubConnectionState.Disconnected) return;

      // OMNI-SKILL: Registrar Handlers ANTES do start() para não perder mensagens iniciais
      connection.on('ReceiveUpdate', (payload) => {
        setLastUpdate(payload);
      });

      connection.on('ReceiveCursorPosition', (cursor: RemoteCursor) => {
        setRemoteCursors(prev => ({
          ...prev,
          [cursor.userId]: cursor
        }));
      });

      connection.start()
        .then(() => {
          console.log('[SignalR] Connected to DrawingHub. Session:', connection.connectionId);
          connection.invoke('JoinDrawing', drawingId)
            .catch(err => console.error('[SignalR] Initial JoinDrawing Error:', err));
        })
        .catch(err => console.error('[SignalR] Connection Start Error:', err));
    }
  }, [connection, drawingId]);

  const sendUpdate = useCallback((payload: any) => {
    if (!connection || connection.state !== HubConnectionState.Connected || !drawingId) {
      return;
    }

    connection.invoke('SendUpdate', drawingId, payload)
      .catch(err => {
        if (connection.state !== HubConnectionState.Connected) {
          console.warn('[SignalR] SendUpdate aborted: Connection lost.');
        } else {
          console.error('[SignalR] SendUpdate Method Error:', err);
        }
      });
  }, [connection, drawingId]);

  const sendCursorPosition = useCallback((x: number, y: number) => {
    if (!connection || connection.state !== HubConnectionState.Connected || !drawingId || !profile) {
      return;
    }

    connection.invoke('SendCursorPosition', drawingId, profile.id, profile.nickname, x, y)
      .catch(err => {
        if (connection.state !== HubConnectionState.Connected) {
          console.warn('[SignalR] SendCursorPosition aborted: Connection lost.');
        } else {
          console.error('[SignalR] SendCursorPosition Method Error:', err);
        }
      });
  }, [connection, drawingId, profile]);

  return {
    sendUpdate,
    sendCursorPosition,
    remoteCursors: Object.values(remoteCursors),
    lastUpdate
  };
}
