
import { AppTheme } from "../../core/types";

export interface MimiCustomTrainingEntry {
  id: string;
  createdAt: number;
  content: string;
  category?: 'behavior' | 'fact' | 'rule';
}

export interface ChildProfile {
  // 1. Identidade Principal
  name: string;
  nickname: string;
  age: number;
  birthday: string;
  favoriteColor: string;
  favoriteAnimal: string;
  favoriteEmoji: string;
  nameMeaning?: string;
  calledHow?: string;
  
  // Imagem e Características
  profileImage?: {
    data: string;
    mimeType: string;
    version: string;
    updatedAt: number;
  };
  hairType: string;
  hairColor: string;
  eyeColor?: string;
  skinTone?: string;
  hasGlasses: boolean;
  hasBraces: boolean;

  // 2. Mundo dos Sonhos & Gostos
  favoriteDrawing?: string;
  favoriteCharacter?: string;
  favoritePlay?: string;
  favoriteMusic?: string;
  favoritePlace?: string;
  favoriteSeason?: string;
  dreamDrawing: string;
  dreamCharacter: string;
  dreamJob: string;
  dreamPower: string;
  dreamPlace: string;
  biggestDream?: string;
  favoriteHobby: string;

  // 3. Rotina
  favoriteFood: string;
  dislikedFood: string;
  bestMomentOfDay: string;
  favoriteSubject: string;
  afterSchoolActivity: string;
  wakeUpTime: string;
  sleepTime: string;
  preferences: string;

  // 4. Perfil Emocional e "Jeitinho"
  happyWhen: string;
  sadWhen: string;
  whenSadILike: string;
  courageousWhen: string;
  scaredWhen: string;
  proudOf?: string;
  goodAt?: string;
  learningNow?: string;
  howIAmWithFriends?: string;
  calmsMe?: string;
  cheersMeUp?: string;
  likesBeingSpokenToHow?: string;
  dislikesWhen?: string;
  
  avatarUrl?: string;
  emotionalSensitivity?: number;
}

export type MimiTemperament = "affectionate" | "playful" | "calm" | "protective" | "balanced";
export type LanguageComplexity = "simple" | "intermediate" | "rich";

export interface ProtocolGovernance {
  enabled: boolean;
  sensitivityLevel: number; // 1-5
  monitoredCategories: string[]; // ['emoção', 'segurança', 'linguagem', 'saúde']
  notificationStrategy: 'immediate' | 'daily_summary' | 'critical_only';
}

export interface MimiPersonalityConfig {
  additionalKnowledge: MimiCustomTrainingEntry[];
  preferredTone: MimiTemperament;
  languageComplexity: LanguageComplexity;
  emotionalSensitivity: number; 
  empathyIntensity: number;
  praiseFrequency: number;
  riskMonitoringSensitivity: number;
  sensitiveTopics: string[];
  encouragedPhrases: string[];
  protocolGovernance: ProtocolGovernance;
}

export interface AppSettings {
  theme: AppTheme;
  language: "pt-BR" | "en-US";
  voiceVolume: number; 
  autoVoiceEnabled: boolean;
  animationIntensity: "low" | "medium" | "magical";
  callAliceBy: "name" | "nickname";

  customBackgroundByThemeId?: Record<string, string>; // New field for custom backgrounds per theme ID
}

export interface ParentAreaConfig {
  passwordEnabled: boolean;
  passwordHash?: string;
}

export interface PerfilState {
  child: ChildProfile;
  mimi: MimiPersonalityConfig;
  app: AppSettings;
  parent: ParentAreaConfig;
  profileSchemaVersion: string;
}

export interface PerfilStorageSchemaV2 {
  version: 2;
  data: PerfilState;
}
