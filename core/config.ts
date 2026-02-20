
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
        primary: '#818CF8', secondary: '#1E1B4B', accent: '#C084FC',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
        surface: 'rgba(30, 41, 59, 0.65)', surfaceElevated: 'rgba(51, 65, 85, 0.8)',
        text: '#F8FAFC', textSecondary: '#CBD5E1', textMuted: '#94A3B8',
        textOnPrimary: '#FFFFFF', textOnAccent: '#FFFFFF', border: 'rgba(129, 140, 248, 0.3)',
        shadow: '0 0 20px -5px rgba(129, 140, 248, 0.4)', shadowElevated: '0 0 30px -5px rgba(129, 140, 248, 0.5)'
      },
      layout: {
        cardStyle: 'glass', spacingScale: { base: 'compact', md: 'comfortable' },
        borderRadius: '24px', borderWidth: '0px', shadowIntensity: 'medium', blurIntensity: '20px',
        componentShape: 'rounded', edgeStyle: 'smooth'
      },
      typography: { fontFamily: "'Inter', sans-serif", headingStyle: 'elegant', baseSize: '16px', lineHeight: '1.6', letterSpacingHeading: '0.04em' },
      motion: { animationLevel: 'soft', transitionSpeed: '0.4s', hoverScale: '1.04', ease: 'cubic-bezier(0.4, 0, 0.2, 1)' },
      decorative: { backgroundPattern: 'none', ambientElements: 'sparkles', logoVariant: 'glow' }
    }
  },
  {
    id: 'persian',
    name: 'Persa',
    breed: 'Persa',
    description: 'Mundo Doce e Macio de Algodão.',
    tokens: {
      colors: {
        primary: '#F472B6', secondary: '#FFF5F7', accent: '#FB923C',
        background: 'linear-gradient(135deg, #FFF1F2 0%, #FCE7F3 100%)',
        surface: '#FFFFFF', surfaceElevated: '#ffeaf6',
        text: '#4d0b26', textSecondary: '#701037', textMuted: '#941549',
        textOnPrimary: '#FFFFFF', textOnAccent: '#FFFFFF', border: 'rgba(244, 114, 182, 0.5)',
        shadow: '0 15px 35px -10px rgba(244, 114, 182, 0.4)', shadowElevated: '0 25px 50px -12px rgba(244, 114, 182, 0.3)'
      },
      layout: {
        cardStyle: 'pillow', spacingScale: { base: 'comfortable', md: 'spacious' },
        borderRadius: '40px', borderWidth: '1px', shadowIntensity: 'strong', blurIntensity: '0px',
        componentShape: 'pill', edgeStyle: 'smooth'
      },
      typography: { fontFamily: "'Fredoka', sans-serif", headingStyle: 'playful', baseSize: '17px', lineHeight: '1.5', letterSpacingHeading: '-0.01em' },
      motion: { animationLevel: 'playful', transitionSpeed: '0.6s', hoverScale: '1.08', ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
      decorative: { backgroundPattern: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'2\' fill=\'%23FBCFE8\' fill-opacity=\'0.3\'/%3E%3C/svg%3E")', ambientElements: 'clouds', logoVariant: 'soft' }
    }
  },
  {
    id: 'bengal',
    name: 'Bengal',
    breed: 'Bengal',
    description: 'Aventura Selvagem e Energética.',
    tokens: {
      colors: {
        primary: '#F59E0B', secondary: '#FEF3C7', accent: '#D97706',
        background: '#FFFBEB', surface: '#FFFFFF', surfaceElevated: '#FEF3C7',
        text: '#451a03', textSecondary: '#78350f', textMuted: '#92400e',
        textOnPrimary: '#000000', textOnAccent: '#000000', border: '#000000',
        shadow: '5px 5px 0px #000000', shadowElevated: '8px 8px 0px #000000'
      },
      layout: {
        cardStyle: 'outlined', spacingScale: 'compact',
        borderRadius: '0px', borderWidth: '4px', shadowIntensity: 'strong', blurIntensity: '0px',
        componentShape: 'square', edgeStyle: 'brutal'
      },
      typography: { fontFamily: "'Nunito', sans-serif", headingStyle: 'bold', baseSize: '15px', lineHeight: '1.4', letterSpacingHeading: '0.02em' },
      motion: { animationLevel: 'energetic', transitionSpeed: '0.2s', hoverScale: '1.03', ease: 'linear' },
      decorative: { backgroundPattern: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 30c5 0 5-10 10-10s5 10 10 10\' fill=\'none\' stroke=\'%23FEF3C7\' stroke-width=\'2\'/%3E%3C/svg%3E")', ambientElements: 'geometric', logoVariant: 'default' }
    }
  },
  {
    id: 'british',
    name: 'British',
    breed: 'British Shorthair',
    description: 'Minimalismo Inteligente e Estável.',
    tokens: {
      colors: {
        primary: '#475569', secondary: '#F1F5F9', accent: '#334155',
        background: '#F8FAFC', surface: '#FFFFFF', surfaceElevated: '#ececec',
        text: '#020617', textSecondary: '#0f172a', textMuted: '#334155',
        textOnPrimary: '#FFFFFF', textOnAccent: '#FFFFFF', border: '#E2E8F0',
        shadow: '0 2px 10px rgba(0, 0, 0, 35%)', shadowElevated: '0 4px 20px rgba(0, 0, 0, 0.08)'
      },
      layout: {
        cardStyle: 'flat', spacingScale: 'comfortable',
        borderRadius: '10px', borderWidth: '1px', shadowIntensity: 'soft', blurIntensity: '0px',
        componentShape: 'rounded', edgeStyle: 'smooth'
      },
      typography: { fontFamily: "'Inter', sans-serif", headingStyle: 'clean', baseSize: '16px', lineHeight: '1.6', letterSpacingHeading: '-0.01em' },
      motion: { animationLevel: 'soft', transitionSpeed: '0.3s', hoverScale: '1.01', ease: 'ease-out' },
      decorative: { backgroundPattern: 'none', ambientElements: 'none', logoVariant: 'minimal' }
    }
  },
  {
    id: 'ragdoll',
    name: 'Ragdoll',
    breed: 'Ragdoll',
    description: 'Serenidade e Silêncio Sensorial.',
    tokens: {
      colors: {
        primary: '#64748B', secondary: '#F8FAFC', accent: '#94A3B8',
        background: '#F1F5F9', surface: '#FFFFFF', surfaceElevated: '#F8FAFC',
        text: '#020617', textSecondary: '#0f172a', textMuted: '#334155',
        textOnPrimary: '#FFFFFF', textOnAccent: '#FFFFFF', border: '#CBD5E1',
        shadow: 'none', shadowElevated: 'none'
      },
      layout: {
        cardStyle: 'minimal', spacingScale: 'spacious',
        borderRadius: '4px', borderWidth: '0px', shadowIntensity: 'none', blurIntensity: '0px',
        componentShape: 'pill', edgeStyle: 'smooth'
      },
      typography: { fontFamily: "'Inter', sans-serif", headingStyle: 'clean', baseSize: '18px', lineHeight: '1.8', letterSpacingHeading: '0.01em' },
      motion: { animationLevel: 'none', transitionSpeed: '0.8s', hoverScale: '1.0', ease: 'ease' },
      decorative: { backgroundPattern: 'none', ambientElements: 'none', logoVariant: 'soft' }
    }
  },
  {
    id: 'binary-night',
    name: 'Noite Binária',
    breed: 'Hacker Elite',
    description: 'Imersão absoluta em um console de comando avançado com efeitos de matrix e glitching tático.',
    tokens: {
      colors: {
        primary: '#00FF41', secondary: '#0F172A', accent: '#00BFFF',
        background: '#000000', surface: 'rgba(0, 0, 0, 0.9)', surfaceElevated: 'rgba(20, 20, 20, 0.95)',
        text: '#00FF41', textSecondary: '#00BFFF', textMuted: '#1A3300',
        textOnPrimary: '#000000', textOnAccent: '#000000', border: '#00FF41',
        shadow: '0 0 20px #00FF41, 0 0 5px #00FF41', shadowElevated: '0 0 40px #00FF41, 0 0 10px #00FF41'
      },
      layout: {
        cardStyle: 'glass', spacingScale: 'compact',
        borderRadius: '0px', borderWidth: '1px', shadowIntensity: 'strong', blurIntensity: '15px',
        componentShape: 'square', edgeStyle: 'sharp'
      },
      typography: { fontFamily: "'JetBrains Mono', 'Fira Code', monospace", headingStyle: 'bold', baseSize: '14px', lineHeight: '1.6', letterSpacingHeading: '0.1em' },
      motion: { animationLevel: 'energetic', transitionSpeed: '0.15s', hoverScale: '1.02', ease: 'steps(4, end)', glitchEnabled: true },
      decorative: { backgroundPattern: 'none', ambientElements: 'geometric', logoVariant: 'glow' }
    }
  },
  {
    id: 'neumorphic-tactile',
    name: 'Neumorfismo Pro',
    breed: 'Tactile Interface',
    description: 'Interface tátil soft-touch com relevo físico, sombras duplas realistas e ergonomia visual superior.',
    tokens: {
      colors: {
        primary: '#E0E5EC', secondary: '#A3B1C6', accent: '#D1D9E6',
        background: '#E0E5EC', surface: '#E0E5EC', surfaceElevated: '#EBECF0',
        text: '#2D3748', textSecondary: '#4A5568', textMuted: '#718096',
        textOnPrimary: '#2D3748', textOnAccent: '#2D3748', border: 'transparent',
        shadow: '12px 12px 24px rgba(163,177,198,0.7), -12px -12px 24px rgba(255,255,255,0.8)',
        shadowElevated: 'inset 8px 8px 16px rgba(163,177,198,0.8), inset -8px -8px 16px rgba(255,255,255,0.9)'
      },
      layout: {
        cardStyle: 'neumorphic', spacingScale: 'comfortable',
        borderRadius: '32px', borderWidth: '0px', shadowIntensity: 'strong', blurIntensity: '0px',
        componentShape: 'pill', edgeStyle: 'smooth'
      },
      typography: { fontFamily: "'Inter', sans-serif", headingStyle: 'clean', baseSize: '16px', lineHeight: '1.6', letterSpacingHeading: '0.01em' },
      motion: { animationLevel: 'soft', transitionSpeed: '0.4s', hoverScale: '1.02', ease: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' },
      decorative: { backgroundPattern: 'none', ambientElements: 'none', logoVariant: 'soft' }
    }
  },
  {
    id: 'maternal-sweetness',
    name: 'Doçura Maternal',
    breed: 'Coração de Mãe',
    description: 'Um abraço suave e acolhedor, com tons de carinho.',
    tokens: {
      colors: {
        primary: '#FFB6C1', secondary: '#FFFACD', accent: '#FFDAB9',
        background: 'linear-gradient(135deg, #FFF5F7 0%, #FFFACD 50%, #FFE4E1 100%)',
        surface: '#FFFFFF', surfaceElevated: '#FFF5F7',
        text: '#3b231c', textSecondary: '#543228', textMuted: '#734436',
        textOnPrimary: '#FFFFFF', textOnAccent: '#000000', border: 'rgba(255, 182, 193, 0.4)',
        shadow: '0 10px 30px -10px rgba(255, 182, 193, 0.3)', shadowElevated: '0 15px 40px -10px rgba(255, 182, 193, 0.4)'
      },
      layout: {
        cardStyle: 'pillow', spacingScale: 'comfortable',
        borderRadius: '32px', borderWidth: '0px', shadowIntensity: 'medium', blurIntensity: '0px',
        componentShape: 'rounded', edgeStyle: 'smooth'
      },
      typography: { fontFamily: "'Quicksand', sans-serif", headingStyle: 'playful', baseSize: '16px', lineHeight: '1.6', letterSpacingHeading: '0.02em' },
      motion: { animationLevel: 'playful', transitionSpeed: '0.5s', hoverScale: '1.05', ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
      decorative: { backgroundPattern: 'none', ambientElements: 'clouds', logoVariant: 'soft' }
    }
  },
  {
    id: 'maternal-strength',
    name: 'Força e Calma',
    breed: 'Coração de Mãe',
    description: 'Inspira confiança e serenidade, com cores terrosas e naturais.',
    tokens: {
      colors: {
        primary: '#98FB98', secondary: '#F5F5DC', accent: '#DAA520',
        background: 'linear-gradient(135deg, #F5F5DC 0%, #E8E4D8 100%)',
        surface: '#FFFFFF', surfaceElevated: '#FAF8F3',
        text: '#1c1210', textSecondary: '#3E2723', textMuted: '#4E342E',
        textOnPrimary: '#000000', textOnAccent: '#000000', border: 'rgba(152, 251, 152, 0.3)',
        shadow: '0 4px 20px rgba(152, 251, 152, 0.2)', shadowElevated: '0 6px 30px rgba(152, 251, 152, 0.25)'
      },
      layout: {
        cardStyle: 'outlined', spacingScale: 'comfortable',
        borderRadius: '16px', borderWidth: '2px', shadowIntensity: 'soft', blurIntensity: '0px',
        componentShape: 'rounded', edgeStyle: 'smooth'
      },
      typography: { fontFamily: "'Lora', serif", headingStyle: 'elegant', baseSize: '16px', lineHeight: '1.65', letterSpacingHeading: '0.01em' },
      motion: { animationLevel: 'soft', transitionSpeed: '0.35s', hoverScale: '1.03', ease: 'ease-in-out' },
      decorative: { backgroundPattern: 'none', ambientElements: 'none', logoVariant: 'soft' }
    }
  },
  {
    id: 'neuro-gentle-embrace',
    name: 'Abraço Gentil',
    breed: 'Mães Neurodivergentes',
    description: 'Um ambiente digital calmante, seguro e compreensivo.',
    tokens: {
      colors: {
        primary: '#ADD8E6', secondary: '#98FF98', accent: '#FFFFE0',
        background: 'linear-gradient(135deg, #F8FBFF 0%, #F0FFF0 50%, #FFFEF0 100%)',
        surface: '#FFFFFF', surfaceElevated: '#FAFCFF',
        text: '#1a1a1a', textSecondary: '#333333', textMuted: '#4d4d4d',
        textOnPrimary: '#000000', textOnAccent: '#000000', border: 'rgba(173, 216, 230, 0.25)',
        shadow: '0 2px 10px rgba(173, 216, 230, 0.15)', shadowElevated: '0 4px 15px rgba(173, 216, 230, 0.2)'
      },
      layout: {
        cardStyle: 'flat', spacingScale: 'comfortable',
        borderRadius: '20px', borderWidth: '1px', shadowIntensity: 'soft', blurIntensity: '0px',
        componentShape: 'rounded', edgeStyle: 'smooth'
      },
      typography: { fontFamily: "'Open Sans', sans-serif", headingStyle: 'clean', baseSize: '17px', lineHeight: '1.75', letterSpacingHeading: '0.02em' },
      motion: { animationLevel: 'soft', transitionSpeed: '0.4s', hoverScale: '1.02', ease: 'ease-out' },
      decorative: { backgroundPattern: 'none', ambientElements: 'none', logoVariant: 'soft' }
    }
  },
  {
    id: 'glass-elite',
    name: 'Glassmorphism Elite',
    breed: 'Design Futurista',
    description: 'Estética de transparência máxima, profundidade visual com multicamadas e desfoque dinâmico.',
    tokens: {
      colors: {
        primary: '#C084FC', secondary: '#1E1B4B', accent: '#22D3EE',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)',
        surface: 'rgba(255, 255, 255, 0.05)', surfaceElevated: 'rgba(255, 255, 255, 0.12)',
        text: '#F8FAFC', textSecondary: '#CBD5E1', textMuted: '#64748B',
        textOnPrimary: '#FFFFFF', textOnAccent: '#FFFFFF', border: 'rgba(255, 255, 255, 0.15)',
        shadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)', shadowElevated: '0 12px 48px 0 rgba(0, 0, 0, 0.5)'
      },
      layout: {
        cardStyle: 'glass', spacingScale: 'comfortable',
        borderRadius: '28px', borderWidth: '1px', shadowIntensity: 'strong', blurIntensity: '30px',
        componentShape: 'rounded', edgeStyle: 'smooth'
      },
      typography: { fontFamily: "'Inter', sans-serif", headingStyle: 'elegant', baseSize: '16px', lineHeight: '1.6', letterSpacingHeading: '0.06em' },
      motion: { animationLevel: 'soft', transitionSpeed: '0.5s', hoverScale: '1.03', ease: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      decorative: { backgroundPattern: 'none', ambientElements: 'sparkles', logoVariant: 'glow' }
    }
  },
  {
    id: 'neubrutalist-raw',
    name: 'Neubrutalismo Raw',
    breed: 'Vanguarda Digital',
    description: 'Contraste máximo, sombras sólidas e tipografia impactante para um controle visceral.',
    tokens: {
      colors: {
        primary: '#FFEA00', secondary: '#000000', accent: '#FF00FF',
        background: '#F0F0F0', surface: '#FFFFFF', surfaceElevated: '#FFEA00',
        text: '#000000', textSecondary: '#000000', textMuted: '#444444',
        textOnPrimary: '#000000', textOnAccent: '#FFFFFF', border: '#000000',
        shadow: '10px 10px 0px #000000', shadowElevated: '16px 16px 0px #000000'
      },
      layout: {
        cardStyle: 'neubrutalist', spacingScale: 'compact',
        borderRadius: '0px', borderWidth: '5px', shadowIntensity: 'strong', blurIntensity: '0px',
        componentShape: 'square', edgeStyle: 'brutal'
      },
      typography: { fontFamily: "'Space Grotesk', sans-serif", headingStyle: 'bold', baseSize: '15px', lineHeight: '1.4', letterSpacingHeading: '-0.03em' },
      motion: { animationLevel: 'energetic', transitionSpeed: '0.1s', hoverScale: '1.01', ease: 'steps(2, end)' },
      decorative: { backgroundPattern: 'none', ambientElements: 'geometric', logoVariant: 'default' }
    }
  },
  {
    id: 'fluid-vision',
    name: 'Fluidmorphism',
    breed: 'Visual Orgânico',
    description: 'Formas líquidas e gradientes de aurora animados, criando uma interface de baixa fricção cognitiva.',
    tokens: {
      colors: {
        primary: '#FF9EB5', secondary: '#FFE4E9', accent: '#80EEFF',
        background: 'linear-gradient(225deg, #FF9EB5 0%, #FFD1DC 40%, #80EEFF 100%)',
        surface: 'rgba(255, 255, 255, 0.45)', surfaceElevated: 'rgba(255, 255, 255, 0.8)',
        text: '#3D0A0A', textSecondary: '#6B1A1A', textMuted: '#944D4D',
        textOnPrimary: '#FFFFFF', textOnAccent: '#000000', border: 'transparent',
        shadow: '0 20px 50px rgba(255, 158, 181, 0.4)', shadowElevated: '0 30px 70px rgba(255, 158, 181, 0.5)'
      },
      layout: {
        cardStyle: 'fluid', spacingScale: 'spacious',
        borderRadius: '60px', borderWidth: '0px', shadowIntensity: 'medium', blurIntensity: '25px',
        componentShape: 'pill', edgeStyle: 'smooth'
      },
      typography: { fontFamily: "'Plus Jakarta Sans', sans-serif", headingStyle: 'clean', baseSize: '17px', lineHeight: '1.6', letterSpacingHeading: '-0.04em' },
      motion: { animationLevel: 'playful', transitionSpeed: '0.8s', hoverScale: '1.05', ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
      decorative: { backgroundPattern: 'none', ambientElements: 'clouds', logoVariant: 'soft' }
    }
  },
  {
    id: 'luminous-interface',
    name: 'Interface Luminosa',
    breed: 'Cyberpunk Elite',
    description: 'Brilhos neon sobre fundo escuro, com alto contraste e estética tecnológica.',
    tokens: {
      colors: {
        primary: '#39FF14', secondary: '#0D0D0D', accent: '#FF00E6',
        background: '#050505', surface: '#121212', surfaceElevated: '#1A1A1A',
        text: '#39FF14', textSecondary: '#FF00E6', textMuted: '#444444',
        textOnPrimary: '#000000', textOnAccent: '#000000', border: '#39FF14',
        shadow: '0 0 10px #39FF14, 0 0 20px #39FF14', shadowElevated: '0 0 20px #FF00E6, 0 0 40px #FF00E6'
      },
      layout: {
        cardStyle: 'glass', spacingScale: 'compact',
        borderRadius: '4px', borderWidth: '1px', shadowIntensity: 'strong', blurIntensity: '5px',
        componentShape: 'square', edgeStyle: 'sharp'
      },
      typography: { fontFamily: "'Orbitron', sans-serif", headingStyle: 'bold', baseSize: '14px', lineHeight: '1.5', letterSpacingHeading: '0.1em' },
      motion: { animationLevel: 'energetic', transitionSpeed: '0.3s', hoverScale: '1.03', ease: 'ease-in-out', glitchEnabled: true },
      decorative: { backgroundPattern: 'none', ambientElements: 'geometric', logoVariant: 'glow' }
    }
  },
  {
    id: 'skeuomorph-command',
    name: 'Comando Esqueuomórfico',
    breed: 'Retro Moderno',
    description: 'Texturas físicas realistas, profundidade tátil e controles mecânicos.',
    tokens: {
      colors: {
        primary: '#475569', secondary: '#CBD5E1', accent: '#1E293B',
        background: '#94A3B8', surface: '#E2E8F0', surfaceElevated: '#F1F5F9',
        text: '#0F172A', textSecondary: '#334155', textMuted: '#64748B',
        textOnPrimary: '#FFFFFF', textOnAccent: '#FFFFFF', border: '#94A3B8',
        shadow: '6px 6px 12px #94A3B8, -6px -6px 12px #FFFFFF',
        shadowElevated: 'inset 4px 4px 8px #94A3B8, inset -4px -4px 8px #FFFFFF'
      },
      layout: {
        cardStyle: 'pillow', spacingScale: 'comfortable',
        borderRadius: '16px', borderWidth: '1px', shadowIntensity: 'strong', blurIntensity: '0px',
        componentShape: 'rounded', edgeStyle: 'smooth'
      },
      typography: { fontFamily: "'Inter', sans-serif", headingStyle: 'clean', baseSize: '16px', lineHeight: '1.6', letterSpacingHeading: '0em' },
      motion: { animationLevel: 'soft', transitionSpeed: '0.4s', hoverScale: '1.02', ease: 'ease-out' },
      decorative: { backgroundPattern: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.05\'/%3E%3C/svg%3E")', ambientElements: 'none', logoVariant: 'minimal' }
    }
  }
];
