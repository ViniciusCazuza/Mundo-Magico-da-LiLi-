/**
 * Hook useStudio - Gerenciamento de Estado e Integração com Backend
 * 
 * Segue o padrão APEX Nível 15 - Make Illegal States Unrepresentable
 * Integração frontend-backend para o Studio Mágico.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { UserProfile } from '../../../core/types';
import { IdentityManager } from '../../../core/ecosystem/IdentityManager';
import {
  Drawing,
  Layer,
  CreateDrawingRequest,
  UpdateDrawingRequest,
  CanvasSize,
  Result,
  DrawingLayerType,
  RasterLayer,
} from '../types';
import {
  createDrawing,
  getDrawingById,
  updateDrawing,
  deleteDrawing,
  getDrawingsByAuthor,
  addLayerToDrawing,
  updateLayer,
  removeLayerFromDrawing,
  createRasterLayer,
  createVectorLayer,
  createSkeletalLayer,
  generateMagicImage,
  generateInspirationPrompt,
  autoRig,
  StudioOptions,
  StudioImageResponse,
} from '../services/studio.api';
import { BrushEngine } from '../engine/BrushEngine';
import { appContext } from '../../../core/ecosystem/AppContext';

// ============================================================================
// Tipos de Estado
// ============================================================================

type StudioStatus = 'idle' | 'loading' | 'saving' | 'error' | 'success';

interface StudioError {
  code: string;
  message: string;
}

interface StudioState {
  currentDrawing: Drawing | null;
  drawings: Drawing[];
  selectedLayerId: string | null;
  status: StudioStatus;
  error: StudioError | null;
  lastSavedAt: Date | null;
}

// ============================================================================
// Configuração Padrão do Studio
// ============================================================================

const DEFAULT_CANVAS_SIZE: CanvasSize = { width: 800, height: 600 };

const DEFAULT_OPTIONS: StudioOptions = {
  artStyle: 'watercolor',
  fantasyLevel: 50,
  detailLevel: 'medium',
  illustrationType: 'scene',
  orientation: 'horizontal',
  textConfig: { enabled: false, content: '' },
};

// ============================================================================
// Undo/Redo History
// ============================================================================

interface HistoryState {
  layers: Layer[];
  selectedLayerId: string | null;
}

// ============================================================================
// Hook Principal
// ============================================================================

export function useStudio(authorId?: string) {
  const currentAuthorId = authorId || IdentityManager.getActiveProfile()?.id || 'default_author';

  // Estado
  const [state, setState] = useState<StudioState>({
    currentDrawing: null,
    drawings: [],
    selectedLayerId: null,
    status: 'idle',
    error: null,
    lastSavedAt: null,
  });

  // BrushEngine singleton
  const brushEngineRef = useRef<BrushEngine>(new BrushEngine());

  // Undo/Redo history
  const historyRef = useRef<HistoryState[]>([]);
  const historyIndexRef = useRef<number>(-1);

  // Ref para controlar requisições pendentes
  const abortControllerRef = useRef<AbortController | null>(null);

  // Ref para auto-save debounce
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save logic (Debounced 2s) - Previne "zombie data" (Axioma 4)
  useEffect(() => {
    if (!state.currentDrawing) return;
    
    // Cancela o timeout anterior para evitar disparos múltiplos desnecessários
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Só agenda o salvamento se estiver em estado estável
    if (state.status === 'idle' || state.status === 'success') {
      saveTimeoutRef.current = setTimeout(async () => {
        if (!state.currentDrawing) return;
        
        console.log('[useStudio] Persisting drawing state:', state.currentDrawing.id);
        const request: UpdateDrawingRequest = {
          id: state.currentDrawing.id,
          title: state.currentDrawing.title,
        };
        
        // Sincroniza o título e metadados estruturais
        // Nota: O conteúdo das camadas (dataUrl) é persistido via saveLayer/updateLayerById
        await updateDrawing(state.currentDrawing.id, request);
        
        // Atualiza Contexto Global (Interoperabilidade v1.0)
        appContext.setStudioContext({
          drawingTitle: state.currentDrawing.title,
          colorMood: brushEngineRef.current.getColorMood(),
          activeLayerType: state.currentDrawing.layers.find(l => l.id === state.selectedLayerId)?.type || 'Raster'
        });

        setState(prev => ({ ...prev, lastSavedAt: new Date() }));
      }, 2000);
    }

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
    // Monitora título e estado das camadas (incluindo zIndex e visibilidade)
    // Usamos o stringify apenas das propriedades estruturais para performance
  }, [
    state.currentDrawing?.title, 
    state.currentDrawing?.layers.map(l => `${l.id}-${l.isVisible}-${l.zIndex}`).join('|')
  ]);

  // Cleanup e Sincronização de Timestamp

  // ============================================================================
  // Undo/Redo Helpers
  // ============================================================================

  const saveToHistory = useCallback((layers: Layer[], selectedLayerId: string | null) => {
    // Remove estados futuros se estivermos no meio do histórico
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    }
    
    // Otimização APEX: Imutabilidade Baseada em Referência.
    // Como os dados vêm do backend (getDrawingById/addLayer/updateLayer), 
    // eles já são novos objetos de array. O structuredClone era redundante e lento.
    // Apenas armazenamos a referência do array de camadas.
    
    historyRef.current.push({ layers, selectedLayerId });
    historyIndexRef.current = historyRef.current.length - 1;
    
    // Limita histórico a 20 estados para equilíbrio entre UX e Performance (RAM)
    if (historyRef.current.length > 20) {
      historyRef.current.shift();
      historyIndexRef.current--;
    }
  }, []);

  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      const state = historyRef.current[historyIndexRef.current];
      setState(prev => ({
        ...prev,
        currentDrawing: prev.currentDrawing ? {
          ...prev.currentDrawing,
          layers: state.layers,
        } : null,
        selectedLayerId: state.selectedLayerId,
      }));
    }
  }, []);

  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      const state = historyRef.current[historyIndexRef.current];
      setState(prev => ({
        ...prev,
        currentDrawing: prev.currentDrawing ? {
          ...prev.currentDrawing,
          layers: state.layers,
        } : null,
        selectedLayerId: state.selectedLayerId,
      }));
    }
  }, []);

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  // ============================================================================
  // Helpers de Estado
  // ============================================================================

  const setStatus = useCallback((status: StudioStatus) => {
    setState((prev) => ({ ...prev, status, error: status === 'error' ? prev.error : null }));
  }, []);

  const setError = useCallback((code: string, message: string) => {
    setState((prev) => ({
      ...prev,
      status: 'error',
      error: { code, message },
    }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null, status: prev.status === 'error' ? 'idle' : prev.status }));
  }, []);

  // ============================================================================
  // Operações de Desenho
  // ============================================================================

  const loadDrawing = useCallback(async (drawingId: string): Promise<Result<Drawing>> => {
    setStatus('loading');
    const result = await getDrawingById(drawingId);
    
    if (result.success && result.data) {
      setState((prev) => ({
        ...prev,
        currentDrawing: result.data!,
        status: 'success',
      }));
    } else {
      setError(result.errorCode || 'LOAD_ERROR', result.error || 'Erro ao carregar desenho');
    }
    
    return result;
  }, [setStatus, setError]);

  const loadDrawings = useCallback(async (page: number = 1, pageSize: number = 10): Promise<Result<void>> => {
    setStatus('loading');
    const result = await getDrawingsByAuthor(currentAuthorId, page, pageSize);
    
    if (result.success && result.data) {
      setState((prev) => ({
        ...prev,
        drawings: result.data!.items,
        status: 'success',
      }));
      return { success: true, data: undefined };
    } else {
      setError(result.errorCode || 'LOAD_ERROR', result.error || 'Erro ao carregar desenhos');
      return { success: false, error: result.error, errorCode: result.errorCode };
    }
  }, [currentAuthorId, setStatus, setError]);

  const createNewDrawing = useCallback(async (title: string, canvasSize: CanvasSize = DEFAULT_CANVAS_SIZE): Promise<Result<Drawing>> => {
    setStatus('saving');
    const request: CreateDrawingRequest = {
      authorId: currentAuthorId,
      title,
      canvasSize,
    };

    const result = await createDrawing(request);
    
    if (result.success && result.data) {
      // Determina a cor de fundo com base no tema ativo
      const currentThemeId = localStorage.getItem('mimi_theme_v7') || 'siamese';
      const bgColor = currentThemeId === 'binary-night' ? '#000000' : '#FFFFFF';

      // Adiciona Camada de Fundo Fixa por padrão (Passo 19)
      const bgLayer = createRasterLayer(crypto.randomUUID(), 'Fundo Mágico', 0, '');
      bgLayer.backgroundColor = bgColor;
      await addLayerToDrawing(result.data.id, bgLayer);

      const refreshedResult = await getDrawingById(result.data.id);
      const finalDrawing = refreshedResult.success ? refreshedResult.data! : result.data;

      setState((prev) => ({
        ...prev,
        currentDrawing: finalDrawing,
        drawings: [finalDrawing, ...prev.drawings.filter(d => d.id !== finalDrawing.id)],
        selectedLayerId: finalDrawing.layers[0]?.id || null,
        status: 'success',
      }));
      return refreshedResult.success ? { success: true, data: finalDrawing } : result;
    } else {
      setError(result.errorCode || 'CREATE_ERROR', result.error || 'Erro ao criar desenho');
    }
    
    return result;
  }, [currentAuthorId, setStatus, setError]);

  const saveDrawing = useCallback(async (drawingId: string, updates: Partial<UpdateDrawingRequest>): Promise<Result<Drawing>> => {
    setStatus('saving');
    const request: UpdateDrawingRequest = {
      id: drawingId,
      title: updates.title || state.currentDrawing?.title || 'Sem título',
    };

    const result = await updateDrawing(drawingId, request);
    
    if (result.success && result.data) {
      setState((prev) => ({
        ...prev,
        currentDrawing: result.data!,
        drawings: prev.drawings.map((d) => (d.id === drawingId ? result.data! : d)),
        status: 'success',
      }));
    } else {
      setError(result.errorCode || 'SAVE_ERROR', result.error || 'Erro ao salvar desenho');
    }
    
    return result;
  }, [state.currentDrawing?.title, setStatus, setError]);

  const removeDrawing = useCallback(async (drawingId: string): Promise<Result<boolean>> => {
    setStatus('saving');
    const result = await deleteDrawing(drawingId);
    
    if (result.success) {
      setState((prev) => ({
        ...prev,
        currentDrawing: prev.currentDrawing?.id === drawingId ? null : prev.currentDrawing,
        drawings: prev.drawings.filter((d) => d.id !== drawingId),
        status: 'success',
      }));
    } else {
      setError(result.errorCode || 'DELETE_ERROR', result.error || 'Erro ao excluir desenho');
    }
    
    return result;
  }, [setStatus, setError]);

  // ============================================================================
  // Operações de Camadas
  // ============================================================================

  const addLayer = useCallback(async (
    type: DrawingLayerType,
    name: string,
    data?: string
  ): Promise<Result<Drawing>> => {
    if (!state.currentDrawing) {
      // Cria um novo drawing automaticamente se não existir
      const createResult = await createNewDrawing('Novo Desenho');
      if (!createResult.success || !createResult.data) {
        return { success: false, error: 'Nenhum desenho ativo' };
      }
    }

    const drawingId = state.currentDrawing!.id;
    setStatus('saving');
    
    let layer: Layer;
    const zIndex = (state.currentDrawing?.layers.length || 0) + 1;
    const layerId = crypto.randomUUID();

    switch (type) {
      case DrawingLayerType.Raster:
        layer = createRasterLayer(layerId, name, zIndex, data || '');
        break;
      case DrawingLayerType.Vector:
        layer = createVectorLayer(layerId, name, zIndex);
        break;
      case DrawingLayerType.Skeletal:
        layer = createSkeletalLayer(layerId, name, zIndex);
        break;
      default:
        setError('INVALID_LAYER_TYPE', 'Tipo de camada inválido');
        return { success: false, error: 'Tipo de camada inválido', errorCode: 'INVALID_LAYER_TYPE' };
    }

    const result = await addLayerToDrawing(drawingId, layer);
    
    if (result.success && result.data) {
      saveToHistory(result.data.layers, layerId);
      setState((prev) => ({
        ...prev,
        currentDrawing: result.data!,
        selectedLayerId: layerId,
        status: 'success',
      }));
    } else {
      setError(result.errorCode || 'LAYER_ERROR', result.error || 'Erro ao adicionar camada');
    }
    
    return result;
  }, [state.currentDrawing, state.currentDrawing?.layers.length, setStatus, setError, saveToHistory]);

  const updateLayerById = useCallback(async (
    layerId: string,
    updates: Partial<Layer>
  ): Promise<Result<Drawing>> => {
    if (!state.currentDrawing) {
      return { success: false, error: 'Nenhum desenho ativo' };
    }

    setStatus('saving');
    
    const currentLayer = state.currentDrawing.layers.find((l) => l.id === layerId);
    if (!currentLayer) {
      setError('LAYER_NOT_FOUND', 'Camada não encontrada');
      return { success: false, error: 'Camada não encontrada', errorCode: 'LAYER_NOT_FOUND' };
    }

    const updatedLayer = { ...currentLayer, ...updates } as Layer;
    const result = await updateLayer(state.currentDrawing.id, layerId, updatedLayer);
    
    if (result.success && result.data) {
      saveToHistory(result.data.layers, state.selectedLayerId);
      setState((prev) => ({
        ...prev,
        currentDrawing: result.data!,
        status: 'success',
      }));
    } else {
      setError(result.errorCode || 'LAYER_ERROR', result.error || 'Erro ao atualizar camada');
    }
    
    return result;
  }, [state.currentDrawing, state.currentDrawing?.layers, state.selectedLayerId, setStatus, setError, saveToHistory]);

  const removeLayer = useCallback(async (
    layerId: string
  ): Promise<Result<Drawing>> => {
    if (!state.currentDrawing) {
      return { success: false, error: 'Nenhum desenho ativo' };
    }

    setStatus('saving');
    const result = await removeLayerFromDrawing(state.currentDrawing.id, layerId);
    
    if (result.success && result.data) {
      saveToHistory(result.data.layers, state.selectedLayerId === layerId ? null : state.selectedLayerId);
      setState((prev) => ({
        ...prev,
        currentDrawing: result.data!,
        selectedLayerId: prev.selectedLayerId === layerId ? null : prev.selectedLayerId,
        status: 'success',
      }));
    } else {
      setError(result.errorCode || 'LAYER_ERROR', result.error || 'Erro ao remover camada');
    }
    
    return result;
  }, [state.currentDrawing, state.selectedLayerId, setStatus, setError, saveToHistory]);

  const selectLayer = useCallback((layerId: string | null) => {
    setState((prev) => ({ ...prev, selectedLayerId: layerId }));
  }, []);

  // ============================================================================
  // Operações Avançadas de Camadas
  // ============================================================================

  const reorderLayer = useCallback(async (layerId: string, direction: 'up' | 'down' | 'top' | 'bottom') => {
    if (!state.currentDrawing) return;

    const layers = [...state.currentDrawing.layers];
    const index = layers.findIndex(l => l.id === layerId);
    if (index === -1) return;

    const layer = layers[index];
    let newIndex = index;

    switch (direction) {
      case 'up':
        if (index < layers.length - 1) newIndex = index + 1;
        break;
      case 'down':
        if (index > 0) newIndex = index - 1;
        break;
      case 'top':
        newIndex = layers.length - 1;
        break;
      case 'bottom':
        newIndex = 0;
        break;
    }

    if (newIndex !== index) {
      layers.splice(index, 1);
      layers.splice(newIndex, 0, layer);
      
      // Atualiza zIndex
      layers.forEach((l, i) => { l.zIndex = i; });

      const updatedDrawing = { ...state.currentDrawing, layers };
      setState(prev => ({ ...prev, currentDrawing: updatedDrawing }));
      
      // Persiste no backend
      await updateLayer(state.currentDrawing.id, layerId, layer);
    }
  }, [state.currentDrawing]);

  const toggleLayerVisibility = useCallback(async (layerId: string, isolate?: boolean) => {
    if (!state.currentDrawing) return;
    
    if (isolate) {
      // Modo de isolamento: torna apenas esta camada visível
      const updates = state.currentDrawing.layers.map(layer => ({
        ...layer,
        isVisible: layer.id === layerId
      }));
      
      // Atualiza estado local
      setState(prev => ({
        ...prev,
        currentDrawing: prev.currentDrawing ? {
          ...prev.currentDrawing,
          layers: updates
        } : null
      }));
      
      // Persiste todas as mudanças no backend
      await Promise.all(updates.map(layer => 
        updateLayer(state.currentDrawing!.id, layer.id, layer)
      ));
    } else {
      // Comportamento normal: toggle apenas da camada selecionada
      const layer = state.currentDrawing.layers.find(l => l.id === layerId);
      if (!layer) return;
      await updateLayerById(layerId, { isVisible: !layer.isVisible });
    }
  }, [state.currentDrawing, updateLayerById]);

  const toggleLayerLock = useCallback(async (layerId: string) => {
    if (!state.currentDrawing) return;
    
    const layer = state.currentDrawing.layers.find(l => l.id === layerId);
    if (!layer) return;

    await updateLayerById(layerId, { ...(layer as any), isLocked: !(layer as any).isLocked });
  }, [state.currentDrawing, updateLayerById]);

  const duplicateLayer = useCallback(async (layerId: string) => {
    if (!state.currentDrawing) return;
    
    const layer = state.currentDrawing.layers.find(l => l.id === layerId);
    if (!layer) return;

    await addLayer(
      layer.type,
      `${layer.name} (Cópia)`,
      layer.type === DrawingLayerType.Raster ? (layer as RasterLayer).dataUrl : undefined
    );
  }, [state.currentDrawing, addLayer]);

  const saveLayer = useCallback(async (layerId: string, dataUrl: string) => {
    if (!state.currentDrawing) return;
    
    const layer = state.currentDrawing.layers.find(l => l.id === layerId);
    if (!layer || layer.type !== DrawingLayerType.Raster) return;

    await updateLayerById(layerId, { dataUrl } as Partial<Layer>);
  }, [state.currentDrawing, updateLayerById]);

  // ============================================================================
  // Operações de Geração de Imagem
  // ============================================================================

  const generateImage = useCallback(async (
    prompt: string,
    profile: UserProfile,
    options: Partial<StudioOptions> = {}
  ): Promise<StudioImageResponse | null> => {
    setStatus('loading');
    
    const mergedOptions: StudioOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    try {
      const result = await generateMagicImage(prompt, profile, mergedOptions);
      
      if (result?.imageUrl) {
        // Adiciona a imagem gerada como uma nova camada raster
        await addLayer(
          DrawingLayerType.Raster,
          `IA: ${prompt.slice(0, 30)}...`,
          result.imageUrl
        );
        
        setStatus('success');
        return result;
      } else {
        setError('GENERATION_ERROR', 'Falha na geração da imagem');
        return null;
      }
    } catch (error) {
      setError('GENERATION_ERROR', error instanceof Error ? error.message : 'Erro na geração');
      return null;
    }
  }, [state.currentDrawing, addLayer, setStatus, setError]);

  const getInspiration = useCallback(async (
    profile: UserProfile,
    options: Partial<StudioOptions> = {}
  ): Promise<string> => {
    const mergedOptions: StudioOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    try {
      return await generateInspirationPrompt(profile, mergedOptions);
    } catch (error) {
      console.error('[useStudio] Erro ao obter inspiração:', error);
      return "Miau! Que tal a gente voando em um balão de sabão?";
    }
  }, []);

  const autoRigCharacter = useCallback(async (
    layerId: string,
    characterType: string = 'humanoid'
  ): Promise<Result<any>> => {
    if (!state.currentDrawing) return { success: false, error: 'Nenhum desenho ativo' };
    
    const layer = state.currentDrawing.layers.find(l => l.id === layerId);
    if (!layer || layer.type !== DrawingLayerType.Raster) {
      return { success: false, error: 'Camada inválida para Rigging' };
    }

    setStatus('loading');
    const result = await autoRig((layer as RasterLayer).dataUrl, characterType);
    
    if (result.success && result.data) {
      // Cria a camada esquelética com os ossos detectados
      await addLayer(
        DrawingLayerType.Skeletal,
        `Esqueleto: ${layer.name}`,
        JSON.stringify(result.data.bones)
      );
      setStatus('success');
    } else {
      setError(result.errorCode || 'RIG_ERROR', result.error || 'Erro no Auto-Rigging');
    }
    
    return result;
  }, [state.currentDrawing, addLayer, setStatus, setError]);

  // ============================================================================
  // Retorno do Hook
  // ============================================================================

  return {
    // Estado
    drawing: state.currentDrawing,
    drawings: state.drawings,
    layers: state.currentDrawing?.layers || [],
    activeLayer: state.currentDrawing?.layers.find(l => l.id === state.selectedLayerId) || null,
    selectedLayerId: state.selectedLayerId,
    status: state.status,
    error: state.error?.message || null,
    isLoading: state.status === 'loading',
    isSaving: state.status === 'saving',
    lastSavedAt: state.lastSavedAt,
    
    // BrushEngine
    brushEngine: brushEngineRef.current,
    
    // Ações de Desenho
    loadDrawing,
    loadDrawings,
    createNewDrawing,
    saveDrawing,
    removeDrawing,
    
    // Ações de Camadas
    addLayer,
    updateLayer: updateLayerById,
    deleteLayer: removeLayer,
    setActiveLayer: selectLayer,
    
    // Operações Avançadas
    reorderLayer,
    toggleLayerVisibility,
    toggleLayerLock,
    duplicateLayer,
    saveLayer,
    
    // Undo/Redo
    undo,
    redo,
    canUndo,
    canRedo,
    
    // Ações de IA
    generateImage,
    getInspiration,
    autoRigCharacter,
    
    // Utilitários
    clearError,
  };
}
