
export const safeJsonParse = (key: string, fallback: any) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    return fallback;
  }
};

/**
 * Tenta salvar no localStorage com tratamento de erro para QuotaExceededError.
 */
export const safeLocalStorageSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    if (e instanceof DOMException && (
      e.code === 22 || 
      e.code === 1014 || 
      e.name === 'QuotaExceededError' || 
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
    ) {
      console.warn(`[Storage] Limite excedido para a chave: ${key}. Tentando liberar espaço...`);
      // Estratégia simples: remover dados temporários se o limite for atingido
      localStorage.removeItem("alice_studio_session_v2");
      try {
        localStorage.setItem(key, value);
      } catch (retryError) {
        console.error("[Storage] Falha crítica: não foi possível salvar mesmo após limpeza.", retryError);
      }
    }
  }
};

/**
 * Redimensiona uma imagem base64 para economizar espaço no localStorage.
 */
export const resizeImage = (base64Str: string, maxWidth = 400, maxHeight = 400): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.7)); // Salva como JPEG com compressão
    };
    img.onerror = () => resolve(base64Str);
  });
};

export const fetchWithTimeout = async <T,>(promise: Promise<T>, timeoutMs: number = 15000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Timeout da API")), timeoutMs))
  ]);
};

export const withRetry = async <T,>(fn: () => Promise<T>, ret = 2, del = 1000, timeout?: number): Promise<T> => {
  try {
    return await fetchWithTimeout(fn(), timeout || 15000);
  } catch (e: any) {
    if (ret > 0) {
      await new Promise(r => setTimeout(r, del));
      return withRetry(fn, ret - 1, del * 2, timeout);
    }
    throw e;
  }
};

export const decode = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
};

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

const getLuminance = (hex: string) => {
  const rgb = hex.replace(/^#/, '').match(/.{2}/g)?.map(x => parseInt(x, 16) / 255) || [0,0,0];
  const [r, g, b] = rgb.map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const getContrastRatio = (color1: string, color2: string) => {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

export const isColorSafe = (foreground: string, background: string) => {
  return getContrastRatio(foreground, background) >= 4.5;
};
