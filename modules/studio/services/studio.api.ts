/**
 * Studio API - Cliente para Backend Seguro
 * 
 * IMPORTANTE: Este módulo foi refatorado para usar o backend .NET
 * como gateway seguro para a API do Google Gemini.
 * 
 * A chave da API NUNCA é exposta no cliente - ela permanece
 * segura no servidor backend.
 */

import { UserProfile } from "../../../core/types";

// URL base do backend .NET
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export interface StudioOptions {
  artStyle: string;
  fantasyLevel: number;
  detailLevel: string;
  illustrationType: string; // 'scene' | 'character'
  framing?: 'full' | 'portrait'; // Corpo Inteiro | Perfil/Busto
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
