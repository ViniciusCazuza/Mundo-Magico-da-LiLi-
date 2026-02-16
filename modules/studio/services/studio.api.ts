
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { UserProfile } from "../../../core/types";
import { withRetry } from "../../../core/utils";

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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const context = `
    Você é a Mimi, a gatinha mágica da ${profile.nickname}. 
    Sugira uma ideia curta, mágica e visual para um desenho que ela possa fazer.
    A ideia deve combinar com:
    - Estilo: ${options.artStyle}
    - Nível de Magia: ${options.fantasyLevel}/5
    - Formato: ${options.orientation}
    
    Regras:
    - Máximo 15 palavras.
    - Linguagem infantil, doce e inspiradora.
    - Em português do Brasil.
    - Não use aspas.
    - Se você (a Mimi) aparecer na ideia, lembre-se que você é uma gatinha que se adapta ao tema.
    - Foque em algo que a Mimi e a Alice estariam fazendo juntas ou algo fantástico.
  `.trim();

  try {
    // Aumentado timeout para 30s e adicionado retry em caso de falha de conexão/tempo
    const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: context
    }), 3, 1000, 30000);

    return response.text?.trim() || "Um jardim de flores que cantam e brilham!";
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

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const styleMap: Record<string, string> = {
    'watercolor': 'estilo aquarela suave, cores pastéis, bordas orgânicas, artístico e lúdico',
    '3d': 'estilo renderização 3D fofa, tipo filme de animação premium, iluminação volumétrica, texturas macias',
    'crayon': 'estilo giz de cera vibrante, texturas táteis, traços feitos à mão, ingênuo e colorido',
    'papercut': 'estilo diorama de papel recortado, camadas de papel com sombras, profundidade real, artesanal',
    'storybook': 'estilo ilustração clássica de livro infantil europeu, traços finos, detalhamento rico e atemporal'
  };

  const aspectRatioMap: Record<string, "1:1" | "4:3" | "3:4" | "16:9" | "9:16"> = {
    'square': '1:1',
    'horizontal': '4:3',
    'vertical': '3:4'
  };

  const textInstruction = options.textConfig.enabled && options.textConfig.content 
    ? `INCORPORE O TEXTO: Escreva claramente a palavra ou frase "${options.textConfig.content}" de forma artística e integrada na composição da imagem.`
    : "IMPORTANTE: Não escreva nenhum texto ou letra na imagem.";

  const fantasyInstruction = options.fantasyLevel > 3 
    ? `MAGIA INTENSA: Adicione muitos brilhos mágicos, partículas de luz, auroras e elementos fantásticos exagerados.`
    : options.fantasyLevel < 2 
    ? `MAGIA SUTIL: Mantenha a cena realista dentro do estilo, com poucos elementos mágicos.`
    : `MAGIA EQUILIBRADA: Adicione toques de brilho e encanto moderado.`;

  const detailInstruction = options.detailLevel === 'cinematic' 
    ? "DETALHAMENTO CINEMATOGRÁFICO: Composição complexa com fundo rico e muitos micro-detalhes."
    : options.detailLevel === 'simple'
    ? "DETALHAMENTO SIMPLES: Foco total no assunto principal, fundo limpo e minimalista."
    : "DETALHAMENTO MÉDIO: Composição equilibrada e agradável.";

  const orientationInstruction = options.orientation === 'horizontal' 
    ? "COMPOSIÇÃO GLOBAL: Formato paisagem (horizontal), ideal para cenários amplos."
    : options.orientation === 'vertical'
    ? "COMPOSIÇÃO GLOBAL: Formato retrato (vertical), foco em altura e personagens."
    : "COMPOSIÇÃO GLOBAL: Formato quadrado equilibrado.";

  // REGRA DE FIDELIDADE AO PERFIL (DETERMINÍSTICA E PRIORITÁRIA)
  const profileFidelity = `
    FIDELIDADE OBRIGATÓRIA AO PERFIL DA ALICE (DETERMINÍSTICA):
    - A pele da personagem Alice DEVE ser ${profile.skinTone || 'Clara'}. 
    - Se o tom de pele for "Negra" ou "Parda", isso deve ser representado com clareza absoluta e orgulho.
    - O cabelo DEVE ser ${profile.hairType || 'Cacheado'} na cor ${profile.hairColor || 'Preto'}.
    - Se a Alice usa óculos: ${profile.hasGlasses ? 'Ela DEVE estar usando óculos fofos.' : 'Ela NÃO usa óculos.'}
    - Se a Alice usa aparelho: ${profile.hasBraces ? 'Ela DEVE mostrar um sorriso com aparelho.' : 'Ela NÃO usa aparelho.'}
    - Estas características são inegociáveis e prevalecem sobre o restante do prompt.
  `.trim();

  const mimiVisualRule = `REGRA DA MIMI: Se a gatinha Mimi aparecer na cena, ela deve ser SEMPRE representada como uma gatinha fofa e charmosa que incorpora esteticamente o estilo "${options.artStyle}" e o tema da imagem. Ela é a companheira constante da Alice.`;

  let compositionInstruction = "";
  if (options.illustrationType === 'scene') {
    compositionInstruction = "FOCO DA COMPOSIÇÃO: Cena completa com ambiente detalhado, mostrando a personagem interagindo com o cenário ao redor.";
  } else {
    const framingText = options.framing === 'full' 
      ? "Mostre o personagem de corpo inteiro, com pés e mãos visíveis."
      : "Mostre um retrato aproximado, focado no busto ou perfil do personagem.";
    compositionInstruction = `FOCO DA COMPOSIÇÃO: Apenas o personagem. ${framingText} O fundo deve ser simples ou desfocado para destacar o personagem.`;
  }

  const identityContext = `
    INSTRUÇÃO DE IMAGEM OBRIGATÓRIA:
    Estilo Artístico: ${styleMap[options.artStyle] || styleMap['watercolor']}.
    ${compositionInstruction}
    ${orientationInstruction}
    
    ${profileFidelity}
    
    Personagem principal: Uma menina chamada ${profile.nickname} que tem ${profile.age} anos. 
    Cores preferidas: ${profile.favoriteColor || 'tons pastéis e brilhos mágicos'}.
    
    ${mimiVisualRule}
    
    CONTEXTO DA AÇÃO: ${prompt || "A Alice em um momento de pura alegria"}
    
    ${fantasyInstruction}
    ${detailInstruction}
    ${textInstruction}
    
    A saída deve conter OBRIGATORIAMENTE um campo de imagem (inlineData).
  `.trim();

  try {
    const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: identityContext }] },
      config: {
        imageConfig: {
          aspectRatio: aspectRatioMap[options.orientation] || "1:1"
        }
      }
    }), 2, 2000, 60000);

    let imageUrl = "";
    let revisedPrompt = "";

    if (response.candidates && response.candidates[0] && response.candidates[0].content) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        } else if (part.text) {
          revisedPrompt = part.text;
        }
      }
    }

    if (!imageUrl) {
      throw new Error("A Mimi tentou pintar, mas a tinta mágica acabou.");
    }

    const result = { imageUrl, revisedPrompt, generationHash: currentHash };
    lastGeneration = result;
    return result;
  } catch (error: any) {
    console.error("[Studio API] Erro na geração:", error);
    throw error;
  }
};
