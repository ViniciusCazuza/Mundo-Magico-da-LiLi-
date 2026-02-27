
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { MIMI_PERSONALITY } from "../config/mimi.personality";
import { withRetry } from "../../../core/utils";
import { UserProfile } from "../../../core/types";
import { IdentityManager } from "../../../core/ecosystem/IdentityManager";
import { perfilStorage } from "../../perfil/services/perfilStorage";

export interface AtomicMimiResponse {
  text: string;
  audioBase64: string | null;
  monitoring: any;
  speechEnabled: boolean;
}

/**
 * Orquestrador Multimodal Condicional:
 * Gerencia a geração de texto e áudio com base nas configurações de soberania do usuário.
 */
export const getAtomicMimiResponse = async (history: any[], profile: UserProfile): Promise<AtomicMimiResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // 1. Snapshot de Contexto e Preferências
    const latestProfile = IdentityManager.getActiveProfile() || profile;
    const familyContext = IdentityManager.getFamilyContext();
    const perfilState = perfilStorage.getInitialState();
    
    const enhancedProfile = {
      ...latestProfile,
      additionalKnowledge: perfilState.mimi.additionalKnowledge
    };

    const systemInstruction = MIMI_PERSONALITY.systemInstruction(enhancedProfile, familyContext);

    // 2. Pipeline de Texto (Obrigatório)
    const textResponse = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history,
      config: {
        systemInstruction,
        responseMimeType: 'application/json'
      }
    }));

    if (!textResponse || !textResponse.text) throw new Error("IA offline");
    const result = JSON.parse(textResponse.text.trim());
    const mimiReply = result.mimiReply;

    // 3. Pipeline de Áudio Condicional (Bypass de Latência)
    // Se a fala estiver desativada, pulamos COMPLETAMENTE a instância do serviço TTS
    let audioData: string | null = null;
    const isSpeechEnabled = latestProfile.autoAudio;

    if (isSpeechEnabled) {
      try {
        // Apenas disparamos o serviço de áudio se explicitamente habilitado nas configurações
        audioData = await fetchMimiTTS(mimiReply);
      } catch (audioErr) {
        console.warn("[Mimi API] Falha silenciosa no TTS (Fallback para Texto):", audioErr);
      }
    }

    return {
      text: mimiReply,
      audioBase64: audioData,
      monitoring: result.monitoring,
      speechEnabled: isSpeechEnabled
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

export const fetchMimiTTS = async (text: string): Promise<string | null> => {
  if (!text) return null;
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Diga carinhosamente: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
      }
    }));
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (e) { 
    console.error("[Mimi API] Falha técnica no Gemini TTS:", e);
    return null; 
  }
};

export const fetchMimiResponse = async (history: any[], profile: UserProfile) => {
  const atomic = await getAtomicMimiResponse(history, profile);
  return { mimiReply: atomic.text, monitoring: atomic.monitoring };
};
