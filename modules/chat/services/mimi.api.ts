/**
 * Mimi API - Cliente para Backend Seguro
 * 
 * IMPORTANTE: Este módulo foi refatorado para usar o backend .NET
 * como gateway seguro para a API do Google Gemini.
 * 
 * A chave da API NUNCA é exposta no cliente - ela permanece
 * segura no servidor backend.
 */

import { UserProfile } from "../../../core/types";
import { IdentityManager } from "../../../core/ecosystem/IdentityManager";
import { perfilStorage } from "../../perfil/services/perfilStorage";
import { appContext } from "../../../core/ecosystem/AppContext";

// URL base do backend .NET
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5180';

export interface AtomicMimiResponse {
  text: string;
  audioBase64: string | null;
  monitoring: any;
  speechEnabled: boolean;
}

/**
 * Interface para mensagens do histórico
 */
interface MessageDto {
  role: 'user' | 'model';
  text: string;
  timestamp?: number;
}

/**
 * Interface para a requisição de chat
 */
interface ChatRequestDto {
  history: MessageDto[];
  profile: UserProfile;
  familyContext?: {
    motherName?: string;
    fatherName?: string;
    siblings?: string[];
    pets?: string[];
    familyValues?: string;
  };
  studioContext?: {
    colorMood?: string;
    activeLayerType?: string;
    drawingTitle?: string;
  };
}

/**
 * Interface para a resposta do chat
 */
interface ChatResponseDto {
  mimiReply: string;
  monitoring: {
    riskLevel: number;
    category?: string;
    analysis?: string;
  };
  audioBase64?: string | null;
  speechEnabled: boolean;
}

/**
 * Prepara o perfil enriquecido com dados do contexto
 */
const prepareEnhancedProfile = (profile: UserProfile) => {
  const latestProfile = IdentityManager.getActiveProfile() || profile;
  const perfilState = perfilStorage.getInitialState();

  return {
    ...latestProfile,
    additionalKnowledge: perfilState.mimi.additionalKnowledge
  };
};

/**
 * Prepara o contexto familiar
 */
const prepareFamilyContext = () => {
  return IdentityManager.getFamilyContext();
};

/**
 * Converte histórico para o formato esperado pelo backend
 */
const prepareHistory = (history: any[]): MessageDto[] => {
  return history.map(msg => ({
    role: msg.role || 'user',
    text: msg.text || msg.parts?.[0]?.text || '',
    timestamp: msg.timestamp
  }));
};

/**
 * Orquestrador Multimodal Condicional:
 * Gerencia a geração de texto e áudio através do backend seguro.
 */
export const getAtomicMimiResponse = async (history: any[], profile: UserProfile): Promise<AtomicMimiResponse> => {
  try {
    // 1. Preparar dados para envio ao backend
    const enhancedProfile = prepareEnhancedProfile(profile);
    const familyContext = prepareFamilyContext();
    const formattedHistory = prepareHistory(history);
    const studioContext = appContext.getStudioContext();

    const requestBody: ChatRequestDto = {
      history: formattedHistory,
      profile: enhancedProfile,
      familyContext: familyContext ? {
        motherName: familyContext.motherName,
        fatherName: familyContext.fatherName,
        siblings: familyContext.siblings,
        pets: familyContext.pets,
        familyValues: familyContext.familyValues
      } : undefined,
      studioContext: studioContext ? {
        colorMood: studioContext.colorMood,
        activeLayerType: studioContext.activeLayerType,
        drawingTitle: studioContext.drawingTitle
      } : undefined
    };

    // 2. Chamar o endpoint seguro do backend
    const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Mimi API] Erro HTTP:", response.status, errorText);
      throw new Error(`Erro na comunicação com o servidor: ${response.status}`);
    }

    const result: ChatResponseDto = await response.json();

    // 3. Retornar resposta formatada
    return {
      text: result.mimiReply,
      audioBase64: result.audioBase64 || null,
      monitoring: result.monitoring,
      speechEnabled: result.speechEnabled
    };
  } catch (e) {
    console.error("[Mimi API] Erro na orquestração atômica:", e);
    return {
      text: "Miau! Tive um soluço mágico. Pode repetir o que disse?",
      audioBase64: null,
      monitoring: { riskLevel: 0 },
      speechEnabled: false
    };
  }
};

/**
 * Busca áudio TTS através do backend seguro
 */
export const fetchMimiTTS = async (text: string): Promise<string | null> => {
  if (!text) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      console.warn("[Mimi API] Falha no TTS:", response.status);
      return null;
    }

    const result = await response.json();
    return result.audioBase64 || null;
  } catch (e) {
    console.error("[Mimi API] Falha técnica no TTS:", e);
    return null;
  }
};

/**
 * Função de compatibilidade - retorna resposta simples
 */
export const fetchMimiResponse = async (history: any[], profile: UserProfile) => {
  const atomic = await getAtomicMimiResponse(history, profile);
  return { mimiReply: atomic.text, monitoring: atomic.monitoring };
};
