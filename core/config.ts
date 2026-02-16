
import { AppTheme } from "./types";

export const STORAGE_KEYS = {
  PROFILE: "mimi_profile_v7",
  CONVERSATIONS: "mimi_convs_v7",
  THEME: "mimi_theme_v7",
  REPORTS: "mimi_reports_v7",
  CALENDAR: "mimi_calendar_v7",
  USAGE: "mimi_usage_v7",
  ACTIVE_ID: "mimi_active_id_v7",
  LIBRARY: "mimi_library_v7"
};

export const DAILY_LIMITS = {
  CHAT_TOKENS: 100000,
  TTS_CHARS: 50000,
  TOTAL_COST: 1.0 
};

export const INITIAL_GREETINGS = [
  "Oi {name}! ✨ Eu estava com saudades, miau! O que vamos criar de mágico hoje?",
  "Miau! Que bom te ver aqui, {name}! Estava olhando as estrelas e pensando em você. 🌟",
  "Olá {name}! ✨ Pronta para mais uma aventura no nosso reino encantado?"
];

export const THEMES: AppTheme[] = [
  { 
    id: 'siamese', 
    name: 'Siamês', 
    breed: 'Siamês',
    description: 'Elegância Mágica e Noite Estrelada.',
    tokens: {
      colors: {
        primary: '#818CF8',
        secondary: '#1E1B4B',
        accent: '#C084FC',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
        surface: 'rgba(30, 41, 59, 0.65)',
        surfaceElevated: 'rgba(51, 65, 85, 0.8)',
        text: '#F8FAFC',
        textSecondary: '#CBD5E1',
        textMuted: '#94A3B8',
        textOnPrimary: '#FFFFFF',
        textOnAccent: '#FFFFFF',
        border: 'rgba(129, 140, 248, 0.3)',
        shadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
        shadowElevated: '0 20px 40px -12px rgba(0,0,0,0.6)'
      },
      layout: {
        cardStyle: 'glass',
        spacingScale: 'comfortable',
        borderRadius: '24px',
        borderWidth: '1px',
        shadowIntensity: 'medium',
        blurIntensity: '20px'
      },
      typography: {
        fontFamily: "'Inter', sans-serif",
        headingStyle: 'elegant',
        baseSize: '16px',
        lineHeight: '1.6',
        letterSpacingHeading: '0.04em'
      },
      motion: {
        animationLevel: 'soft',
        transitionSpeed: '0.4s',
        hoverScale: '1.04',
        ease: 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      decorative: {
        backgroundPattern: 'none',
        ambientElements: 'sparkles',
        logoVariant: 'glow'
      }
    }
  },
  { 
    id: 'persian', 
    name: 'Persa', 
    breed: 'Persa',
    description: 'Mundo Doce e Macio de Algodão.',
    tokens: {
      colors: {
        primary: '#F472B6',
        secondary: '#FFF5F7',
        accent: '#FB923C',
        background: 'linear-gradient(135deg, #FFF1F2 0%, #FCE7F3 100%)',
        surface: '#FFFFFF',
        surfaceElevated: '#FFF5F7',
        text: '#831843',
        textSecondary: '#9D174D',
        textMuted: '#BE185D',
        textOnPrimary: '#FFFFFF',
        textOnAccent: '#FFFFFF',
        border: 'rgba(244, 114, 182, 0.2)',
        shadow: '0 15px 35px -10px rgba(244, 114, 182, 0.2)',
        shadowElevated: '0 25px 50px -12px rgba(244, 114, 182, 0.3)'
      },
      layout: {
        cardStyle: 'pillow',
        spacingScale: 'spacious',
        borderRadius: '40px',
        borderWidth: '0px',
        shadowIntensity: 'strong',
        blurIntensity: '0px'
      },
      typography: {
        fontFamily: "'Fredoka', sans-serif",
        headingStyle: 'playful',
        baseSize: '17px',
        lineHeight: '1.5',
        letterSpacingHeading: '-0.01em'
      },
      motion: {
        animationLevel: 'playful',
        transitionSpeed: '0.6s',
        hoverScale: '1.08',
        ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      },
      decorative: {
        backgroundPattern: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'2\' fill=\'%23FBCFE8\' fill-opacity=\'0.3\'/%3E%3C/svg%3E")',
        ambientElements: 'clouds',
        logoVariant: 'soft'
      }
    }
  },
  { 
    id: 'bengal', 
    name: 'Bengal', 
    breed: 'Bengal',
    description: 'Aventura Selvagem e Energética.',
    tokens: {
      colors: {
        primary: '#F59E0B',
        secondary: '#FEF3C7',
        accent: '#D97706',
        background: '#FFFBEB',
        surface: '#FFFFFF',
        surfaceElevated: '#FEF3C7',
        text: '#78350F',
        textSecondary: '#92400E',
        textMuted: '#B45309',
        textOnPrimary: '#FFFFFF',
        textOnAccent: '#FFFFFF',
        border: '#F59E0B',
        shadow: '4px 4px 0px rgba(120, 53, 15, 0.15)',
        shadowElevated: '8px 8px 0px rgba(120, 53, 15, 0.2)'
      },
      layout: {
        cardStyle: 'outlined',
        spacingScale: 'compact',
        borderRadius: '12px',
        borderWidth: '3px',
        shadowIntensity: 'medium',
        blurIntensity: '0px'
      },
      typography: {
        fontFamily: "'Nunito', sans-serif",
        headingStyle: 'bold',
        baseSize: '15px',
        lineHeight: '1.4',
        letterSpacingHeading: '0.02em'
      },
      motion: {
        animationLevel: 'energetic',
        transitionSpeed: '0.2s',
        hoverScale: '1.03',
        ease: 'linear'
      },
      decorative: {
        backgroundPattern: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 30c5 0 5-10 10-10s5 10 10 10\' fill=\'none\' stroke=\'%23FEF3C7\' stroke-width=\'2\'/%3E%3C/svg%3E")',
        ambientElements: 'geometric',
        logoVariant: 'default'
      }
    }
  },
  { 
    id: 'british', 
    name: 'British', 
    breed: 'British Shorthair',
    description: 'Minimalismo Inteligente e Estável.',
    tokens: {
      colors: {
        primary: '#475569',
        secondary: '#F1F5F9',
        accent: '#334155',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        surfaceElevated: '#F1F5F9',
        text: '#0F172A',
        textSecondary: '#334155',
        textMuted: '#64748B',
        textOnPrimary: '#FFFFFF',
        textOnAccent: '#FFFFFF',
        border: '#E2E8F0',
        shadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        shadowElevated: '0 4px 20px rgba(0, 0, 0, 0.08)'
      },
      layout: {
        cardStyle: 'flat',
        spacingScale: 'comfortable',
        borderRadius: '10px',
        borderWidth: '1px',
        shadowIntensity: 'soft',
        blurIntensity: '0px'
      },
      typography: {
        fontFamily: "'Inter', sans-serif",
        headingStyle: 'clean',
        baseSize: '16px',
        lineHeight: '1.6',
        letterSpacingHeading: '-0.01em'
      },
      motion: {
        animationLevel: 'soft',
        transitionSpeed: '0.3s',
        hoverScale: '1.01',
        ease: 'ease-out'
      },
      decorative: {
        backgroundPattern: 'none',
        ambientElements: 'none',
        logoVariant: 'minimal'
      }
    }
  },
  {
    id: 'ragdoll',
    name: 'Ragdoll',
    breed: 'Ragdoll',
    description: 'Serenidade e Silêncio Sensorial.',
    tokens: {
      colors: {
        primary: '#64748B',
        secondary: '#F8FAFC',
        accent: '#94A3B8',
        background: '#F1F5F9',
        surface: '#FFFFFF',
        surfaceElevated: '#F8FAFC',
        text: '#334155',
        textSecondary: '#475569',
        textMuted: '#94A3B8',
        textOnPrimary: '#FFFFFF',
        textOnAccent: '#FFFFFF',
        border: '#CBD5E1',
        shadow: 'none',
        shadowElevated: 'none'
      },
      layout: {
        cardStyle: 'minimal',
        spacingScale: 'spacious',
        borderRadius: '4px',
        borderWidth: '0px',
        shadowIntensity: 'none',
        blurIntensity: '0px'
      },
      typography: {
        fontFamily: "'Inter', sans-serif",
        headingStyle: 'clean',
        baseSize: '18px',
        lineHeight: '1.8',
        letterSpacingHeading: '0.01em'
      },
      motion: {
        animationLevel: 'none',
        transitionSpeed: '0.8s',
        hoverScale: '1.0',
        ease: 'ease'
      },
      decorative: {
        backgroundPattern: 'none',
        ambientElements: 'none',
        logoVariant: 'soft'
      }
    }
  }
];
