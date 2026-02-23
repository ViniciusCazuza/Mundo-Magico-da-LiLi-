/**
 * Studio API - Cliente para Backend .NET
 * 
 * Integração Frontend-Backend para o Studio Mágico.
 * Segue o padrão APEX Nível 15 com Result Pattern e tipos rigorosos.
 * 
 * Endpoints cobertos:
 * - Operações CRUD de Desenhos
 * - Operações de Camadas (Add, Update, Remove)
 * - Geração de Imagens via IA
 * - Inspiração Criativa
 */

import {
  Drawing,
  Layer,
  LayerBase,
  RasterLayer,
  VectorLayer,
  SkeletalLayer,
  PagedList,
  CreateDrawingRequest,
  UpdateDrawingRequest,
  AddLayerRequest,
  UpdateLayerRequest,
  Result,
  DrawingLayerType,
} from '../types';
import { UserProfile } from '../../../core/types';

// ============================================================================
// Configuração
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5180';
const API_TIMEOUT = 30000;

// ============================================================================
// Configurações do Studio (Geração de Imagens)
// ============================================================================

export interface StudioOptions {
  artStyle: string;
  fantasyLevel: number;
  detailLevel: string;
  illustrationType: string; // 'scene' | 'character'
  framing?: 'full' | 'portrait';
  orientation: 'horizontal' | 'vertical' | 'square';
  textConfig: {
    enabled: boolean;
    content: string;
  };
}

export interface StudioImageResponse {
  imageUrl: string;
  revisedPrompt: string;
  generationHash: string;
}

// Cache local para evitar gerações idênticas na mesma sessão
let lastGeneration: StudioImageResponse | null = null;

// ============================================================================
// Helpers
// ============================================================================

/**
 * Helper para fazer requisições HTTP com timeout e tratamento de erros.
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number = API_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('REQUEST_TIMEOUT');
    }
    throw error;
  }
}

/**
 * Converte uma resposta HTTP em Result<T> tipado.
 */
function handleResponse<T>(response: Response, data: T): Result<T> {
  if (!response.ok) {
    return {
      success: false,
      error: `HTTP ${response.status}: ${response.statusText}`,
      errorCode: `HTTP_${response.status}`,
    };
  }
  return { success: true, data };
}

/**
 * Converte um erro em Result<T> tipado.
 */
function handleError<T>(error: unknown): Result<T> {
  console.error('[Studio API] Error Details:', {
    error,
    message: error instanceof Error ? error.message : 'Unknown',
    stack: error instanceof Error ? error.stack : 'No stack'
  });
  
  if (error instanceof Error) {
    if (error.message === 'REQUEST_TIMEOUT') {
      return {
        success: false,
        error: 'A Mimi demorou muito para responder. Verifique sua internet!',
        errorCode: 'REQUEST_TIMEOUT',
      };
    }

    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      // Deteção determinística de estado de rede (Axioma 4)
      const isOffline = !window.navigator.onLine;

      return {
        success: false,
        error: isOffline
          ? 'Miau! Parece que você está sem internet. Verifique sua conexão!'
          : 'A Mimi não conseguiu alcançar o servidor. Pode ser um erro de CORS ou o servidor está offline.',
        errorCode: isOffline ? 'NETWORK_OFFLINE' : 'BACKEND_UNREACHABLE',
      };
    }

    return {
      success: false,
      error: `Erro Mágico: ${error.message}`,
      errorCode: 'NETWORK_ERROR',
    };
  }
  
  return {
    success: false,
    error: 'Um mistério aconteceu no Ateliê. Tente novamente!',
    errorCode: 'UNKNOWN_ERROR',
  };
}

// ============================================================================
// API de Desenhos (CRUD)
// ============================================================================

/**
 * Cria um novo desenho.
 */
export async function createDrawing(
  request: CreateDrawingRequest
): Promise<Result<Drawing>> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/studio/drawings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      return handleResponse<Drawing>(response, {} as Drawing);
    }

    const data: Drawing = await response.json();
    return { success: true, data };
  } catch (error) {
    return handleError<Drawing>(error);
  }
}

/**
 * Recupera um desenho por ID.
 */
export async function getDrawingById(id: string): Promise<Result<Drawing>> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/studio/drawings/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return handleResponse<Drawing>(response, {} as Drawing);
    }

    const data: Drawing = await response.json();
    return { success: true, data };
  } catch (error) {
    return handleError<Drawing>(error);
  }
}

/**
 * Atualiza um desenho existente.
 */
export async function updateDrawing(
  id: string,
  request: UpdateDrawingRequest
): Promise<Result<Drawing>> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/studio/drawings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      return handleResponse<Drawing>(response, {} as Drawing);
    }

    const data: Drawing = await response.json();
    return { success: true, data };
  } catch (error) {
    return handleError<Drawing>(error);
  }
}

/**
 * Exclui um desenho por ID.
 */
export async function deleteDrawing(id: string): Promise<Result<boolean>> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/studio/drawings/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return handleResponse<boolean>(response, false);
    }

    return { success: true, data: true };
  } catch (error) {
    return handleError<boolean>(error);
  }
}

/**
 * Lista desenhos de um autor com paginação.
 */
export async function getDrawingsByAuthor(
  authorId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<Result<PagedList<Drawing>>> {
  try {
    const queryParams = new URLSearchParams({
      authorId,
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/studio/drawings?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return handleResponse<PagedList<Drawing>>(response, {} as PagedList<Drawing>);
    }

    const data: PagedList<Drawing> = await response.json();
    return { success: true, data };
  } catch (error) {
    return handleError<PagedList<Drawing>>(error);
  }
}

// ============================================================================
// API de Camadas
// ============================================================================

/**
 * Converte uma camada do frontend para o formato de requisição da API.
 */
function layerToRequest(layer: Layer): AddLayerRequest {
  return {
    layerType: layer.type,
    name: layer.name,
    content: JSON.stringify(layer),
  };
}

/**
 * Adiciona uma camada a um desenho existente.
 */
export async function addLayerToDrawing(
  drawingId: string,
  layer: Layer
): Promise<Result<Drawing>> {
  try {
    const request = layerToRequest(layer);
    
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/studio/drawings/${drawingId}/layers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      return handleResponse<Drawing>(response, {} as Drawing);
    }

    const data: Drawing = await response.json();
    return { success: true, data };
  } catch (error) {
    return handleError<Drawing>(error);
  }
}

/**
 * Atualiza uma camada existente em um desenho.
 */
export async function updateLayer(
  drawingId: string,
  layerId: string,
  layer: Layer
): Promise<Result<Drawing>> {
  try {
    const request: UpdateLayerRequest = {
      layerId,
      name: layer.name,
      content: JSON.stringify(layer),
    };

    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/studio/drawings/${drawingId}/layers/${layerId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      return handleResponse<Drawing>(response, {} as Drawing);
    }

    const data: Drawing = await response.json();
    return { success: true, data };
  } catch (error) {
    return handleError<Drawing>(error);
  }
}

/**
 * Remove uma camada de um desenho.
 */
export async function removeLayerFromDrawing(
  drawingId: string,
  layerId: string
): Promise<Result<Drawing>> {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/studio/drawings/${drawingId}/layers/${layerId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return handleResponse<Drawing>(response, {} as Drawing);
    }

    const data: Drawing = await response.json();
    return { success: true, data };
  } catch (error) {
    return handleError<Drawing>(error);
  }
}

// ============================================================================
// API de IA (Geração de Imagens)
// ============================================================================

/**
 * Gera uma inspiração criativa baseada no perfil e nas configurações do laboratório.
 */
export const generateInspirationPrompt = async (
  profile: UserProfile,
  options: StudioOptions
): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/studio/inspiration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profile: {
          ...profile,
          nickname: profile.nickname || profile.name,
          age: profile.age || '8'
        },
        options: {
          artStyle: options.artStyle,
          fantasyLevel: options.fantasyLevel,
          orientation: options.orientation
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const result = await response.json();
    return result.inspiration || "Um jardim de flores que cantam e brilham!";
  } catch (error) {
    console.error("[Studio API] Erro ao obter inspiração:", error);
    return "Miau! Que tal a gente voando em um balão de sabão?";
  }
};

/**
 * Gera uma imagem mágica usando IA.
 */
export const generateMagicImage = async (
  prompt: string,
  profile: UserProfile,
  options: StudioOptions
): Promise<StudioImageResponse> => {
  const optionsKey = JSON.stringify({
    s: options.artStyle,
    f: options.fantasyLevel,
    d: options.detailLevel,
    i: options.illustrationType,
    fr: options.framing || 'none',
    o: options.orientation,
    t: options.textConfig.enabled ? options.textConfig.content : 'no-text'
  });

  // Hash inclui características físicas críticas do perfil para garantir regeneração se o perfil mudar
  const profileKey = `${profile.id}_${profile.skinTone}_${profile.hairColor}_${profile.hairType}`;
  const currentHash = btoa(encodeURIComponent(prompt.trim().toLowerCase() + profileKey + optionsKey));

  if (lastGeneration && lastGeneration.generationHash === currentHash) {
    return lastGeneration;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/studio/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        profile: {
          ...profile,
          nickname: profile.nickname || profile.name,
          age: profile.age || '8'
        },
        options: {
          artStyle: options.artStyle,
          fantasyLevel: options.fantasyLevel,
          detailLevel: options.detailLevel,
          illustrationType: options.illustrationType,
          framing: options.framing,
          orientation: options.orientation,
          textConfig: options.textConfig
        }
      })
    });

    if (!response.ok) {
      throw new Error("A Mimi tentou pintar, mas a tinta mágica acabou.");
    }

    const result = await response.json();

    const studioResult: StudioImageResponse = {
      imageUrl: result.imageUrl,
      revisedPrompt: result.revisedPrompt || '',
      generationHash: result.generationHash || currentHash
    };

    lastGeneration = studioResult;
    return studioResult;
  } catch (error: any) {
    console.error("[Studio API] Erro na geração:", error);
    throw error;
  }
};

// ============================================================================
// Factory Functions para Criar Camadas
// ============================================================================

/**
 * Cria uma nova camada Raster.
 */
export function createRasterLayer(
  id: string,
  name: string,
  zIndex: number,
  dataUrl: string
): RasterLayer {
  return {
    id,
    name,
    type: DrawingLayerType.Raster,
    zIndex,
    opacity: 1.0,
    isVisible: true,
    blendMode: 'normal',
    dataUrl,
  };
}

/**
 * Cria uma nova camada Vector.
 */
export function createVectorLayer(
  id: string,
  name: string,
  zIndex: number,
  path: VectorLayer['path'] = []
): VectorLayer {
  return {
    id,
    name,
    type: DrawingLayerType.Vector,
    zIndex,
    opacity: 1.0,
    isVisible: true,
    blendMode: 'normal',
    path,
    strokeColor: '#000000',
    strokeWidth: 2,
    fillColor: 'transparent',
    isClosed: false,
  };
}

/**
 * Cria uma nova camada Skeletal.
 */
export function createSkeletalLayer(
  id: string,
  name: string,
  zIndex: number,
  bones: SkeletalLayer['bones'] = []
): SkeletalLayer {
  return {
    id,
    name,
    type: DrawingLayerType.Skeletal,
    zIndex,
    opacity: 1.0,
    isVisible: true,
    blendMode: 'normal',
    bones,
    ikChains: [],
  };
}