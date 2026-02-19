
import { BreakpointKey, ResponsiveValue } from './types'; // Import new types

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
  const rgb = hex.replace(/^#/, '').match(/.{2}/g)?.map(x => parseInt(x, 16) / 255) || [0, 0, 0];
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

// --- Responsive Utilities ---
const BREAKPOINTS: Record<BreakpointKey, number> = {
  base: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const getCurrentBreakpoint = (): BreakpointKey => {
  if (typeof window === 'undefined') return 'base'; // Default for SSR
  const width = window.innerWidth;
  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'base';
};

export const getResponsiveValue = <T>(
  value: ResponsiveValue<T> | undefined,
  currentBreakpoint: BreakpointKey
): T | undefined => {
  if (value === undefined) return undefined;
  if (typeof value !== 'object' || value === null) {
    return value as T;
  }

  // Find the largest breakpoint key that is less than or equal to the current breakpoint
  const breakpointKeys = Object.keys(BREAKPOINTS) as BreakpointKey[];
  const sortedBreakpoints = breakpointKeys.sort((a, b) => BREAKPOINTS[a] - BREAKPOINTS[b]);

  let bestMatch: T | undefined = undefined;
  let currentBreakpointIndex = sortedBreakpoints.indexOf(currentBreakpoint);

  // Iterate backwards from the current breakpoint to 'base'
  for (let i = currentBreakpointIndex; i >= 0; i--) {
    const bp = sortedBreakpoints[i];
    if (value[bp] !== undefined) {
      bestMatch = value[bp];
      break;
    }
  }

  // Fallback to 'base' if no specific breakpoint is found for a smaller one
  if (bestMatch === undefined && value.base !== undefined) {
    bestMatch = value.base;
  }

  // If no base value, just return the first available responsive value
  if (bestMatch === undefined && Object.values(value).length > 0) {
    return Object.values(value)[0] as T;
  }

  return bestMatch;
};

/**
 * --- APEX v2.0 Core Utilities ---
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes with clsx and tailwind-merge.
 * This is an essential utility for clean component-based styling.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Result Pattern Implementation (APEX v2.0 Axiom 4)
 * Type-safe way to handle success and failure without exceptions for control flow.
 */
export type Result<T, E = Error> =
  | { ok: true; value: T; error: null }
  | { ok: false; value: null; error: E };

export const ok = <T>(value: T): Result<T, never> => ({
  ok: true,
  value,
  error: null
});

export const err = <E>(error: E): Result<null, E> => ({
  ok: false,
  value: null,
  error
});

