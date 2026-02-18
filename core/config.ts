
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
        shadow: '0 0 20px -5px rgba(129, 140, 248, 0.4)',
        shadowElevated: '0 0 30px -5px rgba(129, 140, 248, 0.5)'
      },
      layout: {
        cardStyle: 'glass',
        spacingScale: { base: 'compact', md: 'comfortable' },
        borderRadius: '24px',
        borderWidth: '0px',
        shadowIntensity: 'medium',
        blurIntensity: '20px'
      },
      typography: {
        fontFamily: "'Inter', sans-serif",
        headingStyle: 'elegant',
        baseSize: { base: '14px', md: '16px', lg: '18px' },
        lineHeight: { base: '1.5', md: '1.6' },
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
        surfaceElevated: '#ffeaf6',
        text: '#831843',
        textSecondary: '#9D174D',
        textMuted: '#BE185D',
        textOnPrimary: '#FFFFFF',
        textOnAccent: '#FFFFFF',
        border: 'rgba(244, 114, 182, 0.5)',
        shadow: '0 15px 35px -10px rgba(244, 114, 182, 0.4)',
        shadowElevated: '0 25px 50px -12px rgba(244, 114, 182, 0.3)'
      },
      layout: {
        cardStyle: 'pillow',
        spacingScale: { base: 'comfortable', md: 'spacious' },
        borderRadius: '40px',
        borderWidth: '1px',
        shadowIntensity: 'strong',
        blurIntensity: '0px'
      },
      typography: {
        fontFamily: "'Fredoka', sans-serif",
        headingStyle: 'playful',
        baseSize: { base: '15px', md: '17px', lg: '19px' },
        lineHeight: { base: '1.4', md: '1.5' },
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
        surfaceElevated: '#ececec',
        text: '#0F172A',
        textSecondary: '#334155',
        textMuted: '#64748B',
        textOnPrimary: '#FFFFFF',
        textOnAccent: '#FFFFFF',
        border: '#E2E8F0',
        shadow: '0 2px 10px rgba(0, 0, 0, 35%)',
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
  },
  {
    id: 'binary-night',
    name: 'Noite Binária',
    breed: 'Hacker Dark',
    description: 'Imersão profunda em um console de hacking noturno.',
    tokens: {
      colors: {
        primary: '#00FF41',
        secondary: '#0F172A',
        accent: '#00BFFF',
        background: 'linear-gradient(135deg, #000000 0%, #050505 100%)',
        surface: 'rgba(15, 23, 42, 0.85)',
        surfaceElevated: 'rgba(30, 41, 59, 0.9)',
        text: '#00FF41',
        textSecondary: '#00BFFF',
        textMuted: '#94A3B8',
        textOnPrimary: '#000000',
        textOnAccent: '#FFFFFF',
        border: 'rgba(0, 255, 65, 0.3)',
        shadow: '0 0 25px -5px rgba(0, 255, 65, 0.5)',
        shadowElevated: '0 0 40px -5px rgba(0, 255, 65, 0.6)'
      },
      layout: {
        cardStyle: 'glass',
        spacingScale: { base: 'compact', md: 'comfortable' },
        borderRadius: '8px',
        borderWidth: '1px',
        shadowIntensity: 'medium',
        blurIntensity: '15px'
      },
      typography: {
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        headingStyle: 'bold',
        baseSize: { base: '13px', md: '15px', lg: '16px' },
        lineHeight: { base: '1.6', md: '1.7' },
        letterSpacingHeading: '0.05em'
      },
      motion: {
        animationLevel: 'soft',
        transitionSpeed: '0.2s',
        hoverScale: '1.02',
        ease: 'ease-in-out'
      },
      decorative: {
        backgroundPattern: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h1v1H0V0zm20 0h1v1h-1V0zm0 20h1v1h-1v-1zM0 20h1v1H0v-1z\' fill=\'%2300FF41\' fill-opacity=\'0.05\'/%3E%3C/svg%3E")',
        ambientElements: 'geometric',
        logoVariant: 'glow'
      }
    }
  },
  {
    id: 'luminous-interface',
    name: 'Interface Luminosa',
    breed: 'Hacker Light',
    description: 'Ambiente de codificação diurno, limpo e focado.',
    tokens: {
      colors: {
        primary: '#007BFF',
        secondary: '#F8FAFC',
        accent: '#00FFFF',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F9FF 100%)',
        surface: '#FFFFFF',
        surfaceElevated: '#F0F9FF',
        text: '#0F172A',
        textSecondary: '#1E3A8A',
        textMuted: '#64748B',
        textOnPrimary: '#FFFFFF',
        textOnAccent: '#000000',
        border: 'rgba(0, 123, 255, 0.2)',
        shadow: '0 2px 15px rgba(0, 123, 255, 0.1)',
        shadowElevated: '0 4px 25px rgba(0, 123, 255, 0.15)'
      },
      layout: {
        cardStyle: 'flat',
        spacingScale: 'comfortable',
        borderRadius: '8px',
        borderWidth: '1px',
        shadowIntensity: 'soft',
        blurIntensity: '0px'
      },
      typography: {
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        headingStyle: 'clean',
        baseSize: '15px',
        lineHeight: '1.7',
        letterSpacingHeading: '0.03em'
      },
      motion: {
        animationLevel: 'soft',
        transitionSpeed: '0.25s',
        hoverScale: '1.02',
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
    id: 'maternal-sweetness',
    name: 'Doçura Maternal',
    breed: 'Coração de Mãe',
    description: 'Um abraço suave e acolhedor, com tons de carinho.',
    tokens: {
      colors: {
        primary: '#FFB6C1',
        secondary: '#FFFACD',
        accent: '#FFDAB9',
        background: 'linear-gradient(135deg, #FFF5F7 0%, #FFFACD 50%, #FFE4E1 100%)',
        surface: '#FFFFFF',
        surfaceElevated: '#FFF5F7',
        text: '#5D4037',
        textSecondary: '#8D6E63',
        textMuted: '#BCAAA4',
        textOnPrimary: '#FFFFFF',
        textOnAccent: '#5D4037',
        border: 'rgba(255, 182, 193, 0.4)',
        shadow: '0 10px 30px -10px rgba(255, 182, 193, 0.3)',
        shadowElevated: '0 15px 40px -10px rgba(255, 182, 193, 0.4)'
      },
      layout: {
        cardStyle: 'pillow',
        spacingScale: 'spacious',
        borderRadius: '32px',
        borderWidth: '0px',
        shadowIntensity: 'medium',
        blurIntensity: '0px'
      },
      typography: {
        fontFamily: "'Quicksand', 'Comfortaa', sans-serif",
        headingStyle: 'playful',
        baseSize: '16px',
        lineHeight: '1.6',
        letterSpacingHeading: '0.02em'
      },
      motion: {
        animationLevel: 'playful',
        transitionSpeed: '0.5s',
        hoverScale: '1.05',
        ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      },
      decorative: {
        backgroundPattern: 'url("data:image/svg+xml,%3Csvg width=\'30\' height=\'30\' viewBox=\'0 0 30 30\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'15\' cy=\'15\' r=\'3\' fill=\'%23FFB6C1\' fill-opacity=\'0.15\'/%3E%3C/svg%3E")',
        ambientElements: 'clouds',
        logoVariant: 'soft'
      }
    }
  },
  {
    id: 'maternal-strength',
    name: 'Força e Calma',
    breed: 'Coração de Mãe',
    description: 'Inspira confiança e serenidade, com cores terrosas e naturais.',
    tokens: {
      colors: {
        primary: '#98FB98',
        secondary: '#F5F5DC',
        accent: '#DAA520',
        background: 'linear-gradient(135deg, #F5F5DC 0%, #E8E4D8 100%)',
        surface: '#FFFFFF',
        surfaceElevated: '#FAF8F3',
        text: '#3E2723',
        textSecondary: '#4E342E',
        textMuted: '#8D6E63',
        textOnPrimary: '#FFFFFF',
        textOnAccent: '#FFFFFF',
        border: 'rgba(152, 251, 152, 0.3)',
        shadow: '0 4px 20px rgba(152, 251, 152, 0.2)',
        shadowElevated: '0 6px 30px rgba(152, 251, 152, 0.25)'
      },
      layout: {
        cardStyle: 'outlined',
        spacingScale: 'comfortable',
        borderRadius: '16px',
        borderWidth: '2px',
        shadowIntensity: 'soft',
        blurIntensity: '0px'
      },
      typography: {
        fontFamily: "'Lora', 'Georgia', serif",
        headingStyle: 'elegant',
        baseSize: '16px',
        lineHeight: '1.65',
        letterSpacingHeading: '0.01em'
      },
      motion: {
        animationLevel: 'soft',
        transitionSpeed: '0.35s',
        hoverScale: '1.03',
        ease: 'ease-in-out'
      },
      decorative: {
        backgroundPattern: 'url("data:image/svg+xml,%3Csvg width=\'50\' height=\'50\' viewBox=\'0 0 50 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M25 0L30 15L45 15L33 24L38 40L25 31L12 40L17 24L5 15L20 15Z\' fill=\'%23B2AC88\' fill-opacity=\'0.08\'/%3E%3C/svg%3E")',
        ambientElements: 'none',
        logoVariant: 'soft'
      }
    }
  },
  {
    id: 'neuro-gentle-embrace',
    name: 'Abraço Gentil',
    breed: 'Mães Neurodivergentes',
    description: 'Um ambiente digital calmante, seguro e compreensivo.',
    tokens: {
      colors: {
        primary: '#ADD8E6',
        secondary: '#98FF98',
        accent: '#FFFFE0',
        background: 'linear-gradient(135deg, #F8FBFF 0%, #F0FFF0 50%, #FFFEF0 100%)',
        surface: '#FFFFFF',
        surfaceElevated: '#FAFCFF',
        text: '#4A4A4A',
        textSecondary: '#6B6B6B',
        textMuted: '#9E9E9E',
        textOnPrimary: '#4A4A4A',
        textOnAccent: '#4A4A4A',
        border: 'rgba(173, 216, 230, 0.25)',
        shadow: '0 2px 10px rgba(173, 216, 230, 0.15)',
        shadowElevated: '0 4px 15px rgba(173, 216, 230, 0.2)'
      },
      layout: {
        cardStyle: 'flat',
        spacingScale: 'spacious',
        borderRadius: '20px',
        borderWidth: '1px',
        shadowIntensity: 'soft',
        blurIntensity: '0px'
      },
      typography: {
        fontFamily: "'Open Sans', 'Lato', sans-serif",
        headingStyle: 'clean',
        baseSize: '17px',
        lineHeight: '1.75',
        letterSpacingHeading: '0.02em'
      },
      motion: {
        animationLevel: 'soft',
        transitionSpeed: '0.4s',
        hoverScale: '1.02',
        ease: 'ease-out'
      },
      decorative: {
        backgroundPattern: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'50\' viewBox=\'0 0 100 50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M 25 25 C 25 15, 15 10, 10 15 C 5 20, 5 30, 10 35 C 15 40, 25 35, 25 25\' fill=\'none\' stroke=\'url(%23g1)\' stroke-width=\'2\' stroke-opacity=\'0.15\'/%3E%3Cpath d=\'M 25 25 C 25 35, 35 40, 40 35 C 45 30, 45 20, 40 15 C 35 10, 25 15, 25 25\' fill=\'none\' stroke=\'url(%23g2)\' stroke-width=\'2\' stroke-opacity=\'0.15\' transform=\'translate(50, 0)\'/%3E%3Cdefs%3E%3ClinearGradient id=\'g1\'%3E%3Cstop offset=\'0%25\' stop-color=\'%23FFB6C1\'/%3E%3Cstop offset=\'50%25\' stop-color=\'%23ADD8E6\'/%3E%3Cstop offset=\'100%25\' stop-color=\'%2398FF98\'/%3E%3C/linearGradient%3E%3ClinearGradient id=\'g2\'%3E%3Cstop offset=\'0%25\' stop-color=\'%23E6E6FA\'/%3E%3Cstop offset=\'50%25\' stop-color=\'%23FFDAB9\'/%3E%3Cstop offset=\'100%25\' stop-color=\'%23DDA0DD\'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E")',
        ambientElements: 'none',
        logoVariant: 'soft'
      }
    }
  }
];
