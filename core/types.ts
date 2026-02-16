
export interface UserProfile {
  id?: string;
  name: string;
  nickname: string;
  age: string;
  preferences: string;
  emotionalSensitivity: number; 
  autoAudio: boolean;
  
  profileImage?: {
    data: string;
    mimeType: string;
    version: string;
    updatedAt: number;
  };

  // Identidade & Características Físicas (Alice v2.2)
  nameMeaning?: string;
  calledHow?: string;
  hairType?: string;
  hairColor?: string;
  eyeColor?: string;
  skinTone?: string;
  hasGlasses?: boolean;
  hasBraces?: boolean;
  visualNotes?: string;

  // Gostos & Preferências
  birthday?: string;
  favoriteColor?: string;
  favoriteAnimal?: string;
  favoriteEmoji?: string;
  favoriteDrawing?: string;
  favoriteCharacter?: string;
  favoritePlay?: string;
  favoriteMusic?: string;
  favoritePlace?: string;
  favoriteSeason?: string;
  
  // Sonhos & Imaginação
  dreamDrawing?: string;
  dreamCharacter?: string;
  dreamJob?: string;
  dreamPower?: string;
  dreamPlace?: string;
  biggestDream?: string;
  
  // Rotina & Comportamento
  favoriteFood?: string;
  dislikedFood?: string;
  bestMomentOfDay?: string;
  favoriteSubject?: string;
  afterSchoolActivity?: string;

  // Inteligência Afetiva (O meu Jeitinho)
  happyWhen?: string;
  sadWhen?: string;
  whenSadILike?: string;
  courageousWhen?: string;
  scaredWhen?: string;
  proudOf?: string;
  goodAt?: string;
  learningNow?: string;
  howIAmWithFriends?: string;
  calmsMe?: string;
  cheersMeUp?: string;
  likesBeingSpokenToHow?: string;
  dislikesWhen?: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
}

export interface UsageLog {
  id: string;
  timestamp: number;
  model: string;
  type: 'chat' | 'analysis' | 'tts';
  inputTokens?: number;
  outputTokens?: number;
  characters?: number;
  cost: number;
  conversationId?: string;
  userId: string;
}

export interface ReportEvent {
  timestamp: number;
  text: string;
  severity: number;
}

export interface ParentReport {
  id: string;
  conversationId: string;
  date: string;
  timestamp: number;
  riskLevel: 'info' | 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  category: string;
  mimiAnalysis: string;
  suggestedParentAction: string;
  involvedParties: string[];
  locations: string[];
  keywords: string[];
  timeline: ReportEvent[];
  lastUpdated: number;
}

export interface CalendarEvent {
  id: string;
  date: string; 
  type: 'happy' | 'sad' | 'school' | 'family' | 'other';
  title: string;
  description?: string;
  reportId?: string;
  timestamp: number;
}

export interface LibraryItem {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  timestamp: number;
  category: 'story' | 'message' | 'educational' | 'other';
  origin: 'mimi' | 'manual';
  isFavorite: boolean;
}

export type AppSection = "chat" | "studio" | "library" | "profile" | "parent-zone" | "calendar";

export interface AppTheme {
  id: 'siamese' | 'persian' | 'bengal' | 'british' | 'ragdoll';
  name: string;
  breed: string;
  description: string;
  
  tokens: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      surface: string;
      surfaceElevated: string;
      text: string;
      textSecondary: string;
      textMuted: string;
      textOnPrimary: string;
      textOnAccent: string;
      border: string;
      shadow: string;
      shadowElevated: string;
    };
    layout: {
      cardStyle: 'glass' | 'pillow' | 'flat' | 'outlined' | 'minimal';
      spacingScale: 'compact' | 'comfortable' | 'spacious';
      borderRadius: string;
      borderWidth: string;
      shadowIntensity: 'none' | 'soft' | 'medium' | 'strong';
      blurIntensity: string;
    };
    typography: {
      fontFamily: string;
      headingStyle: 'playful' | 'elegant' | 'bold' | 'clean';
      baseSize: string;
      lineHeight: string;
      letterSpacingHeading: string;
    };
    motion: {
      animationLevel: 'none' | 'soft' | 'playful' | 'energetic';
      transitionSpeed: string;
      hoverScale: string;
      ease: string;
    };
    decorative: {
      backgroundPattern: string;
      ambientElements: 'none' | 'sparkles' | 'clouds' | 'geometric';
      logoVariant: 'default' | 'glow' | 'minimal' | 'soft';
    };
  };
}
