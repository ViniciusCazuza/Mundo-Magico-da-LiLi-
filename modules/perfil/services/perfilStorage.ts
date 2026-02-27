
import { PerfilState, PerfilStorageSchemaV2, MimiCustomTrainingEntry } from "../types";
import { STORAGE_KEYS, THEMES } from "../../../core/config";
import { safeJsonParse, safeLocalStorageSetItem } from "../../../core/utils";

const STORAGE_KEY_V2 = "mimi_perfil_aggregate_v2";

export const perfilStorage = {
  getInitialState: (): PerfilState => {
    const saved = localStorage.getItem(STORAGE_KEY_V2);
    if (saved) {
      try {
        const schema = JSON.parse(saved) as PerfilStorageSchemaV2;
        if (schema.version === 2) {
          const data = schema.data;
          
          if (Array.isArray(data.mimi.additionalKnowledge) && (data.mimi.additionalKnowledge.length === 0 || typeof data.mimi.additionalKnowledge[0] === 'string')) {
            data.mimi.additionalKnowledge = (data.mimi.additionalKnowledge as unknown as string[]).map(content => ({
              id: `tr_${Math.random().toString(36).substr(2, 9)}`,
              createdAt: Date.now(),
              content
            }));
          }

          if (!data.mimi.languageComplexity) data.mimi.languageComplexity = "simple";
          if (!data.mimi.praiseFrequency) data.mimi.praiseFrequency = 3;
          if (!data.app.animationIntensity) data.app.animationIntensity = "medium";
          
          if (!data.mimi.protocolGovernance) {
            data.mimi.protocolGovernance = {
              enabled: true,
              sensitivityLevel: 3,
              monitoredCategories: ['emoção', 'segurança'],
              notificationStrategy: 'immediate'
            };
          }
          
          return data;
        }
      } catch (e) {
        console.error("Erro ao carregar perfil agregado v2:", e);
      }
    }

    const legacyProfile = safeJsonParse(STORAGE_KEYS.PROFILE, {});
    const legacyTheme = safeJsonParse(STORAGE_KEYS.THEME, THEMES[0]);

    return {
      profileSchemaVersion: "3.5.0",
      child: {
        name: legacyProfile.name || "Alice",
        nickname: legacyProfile.nickname || "Alice",
        age: parseInt(legacyProfile.age) || 8,
        birthday: "",
        favoriteColor: legacyProfile.favoriteColor || "",
        favoriteAnimal: legacyProfile.favoriteAnimal || "Gatinho",
        favoriteEmoji: legacyProfile.favoriteEmoji || "✨",
        nameMeaning: "",
        calledHow: "",
        
        profileImage: undefined,
        hairType: "Cacheado",
        hairColor: "Preto",
        eyeColor: "Castanho",
        skinTone: "Claro",
        hasGlasses: false,
        hasBraces: false,

        favoriteDrawing: "",
        favoriteCharacter: "",
        favoritePlay: "",
        favoriteMusic: "",
        favoritePlace: "",
        favoriteSeason: "",
        dreamDrawing: "",
        dreamCharacter: "",
        dreamJob: "",
        dreamPower: legacyProfile.dreamPower || "",
        dreamPlace: "",
        biggestDream: "",
        favoriteHobby: "",

        favoriteFood: legacyProfile.favoriteFood || "",
        dislikedFood: "",
        bestMomentOfDay: "",
        favoriteSubject: "",
        afterSchoolActivity: "",
        
        wakeUpTime: "07:00",
        sleepTime: "21:00",
        preferences: legacyProfile.preferences || "",

        happyWhen: "",
        sadWhen: "",
        whenSadILike: "",
        courageousWhen: "",
        scaredWhen: "",
        proudOf: "",
        goodAt: "",
        learningNow: "",
        howIAmWithFriends: "",
        calmsMe: "",
        cheersMeUp: "",
        likesBeingSpokenToHow: "",
        dislikesWhen: ""
      },
      mimi: {
        additionalKnowledge: [],
        preferredTone: "affectionate",
        languageComplexity: "simple",
        emotionalSensitivity: legacyProfile.emotionalSensitivity || 3,
        empathyIntensity: 4,
        praiseFrequency: 4,
        riskMonitoringSensitivity: 3,
        sensitiveTopics: [],
        encouragedPhrases: [],
        protocolGovernance: {
          enabled: true,
          sensitivityLevel: 3,
          monitoredCategories: ['emoção', 'segurança'],
          notificationStrategy: 'immediate'
        }
      },
      app: {
        theme: legacyTheme,
        language: "pt-BR",
        voiceVolume: 0.8,
        autoVoiceEnabled: legacyProfile.autoAudio ?? true,
        animationIntensity: "medium",
        callAliceBy: "nickname"
      },
      parent: {
        passwordEnabled: false
      }
    };
  },

  saveState: (state: PerfilState) => {
    const schema: PerfilStorageSchemaV2 = {
      version: 2,
      data: state
    };
    // Salva o estado principal agregado
    safeLocalStorageSetItem(STORAGE_KEY_V2, JSON.stringify(schema));
    
    // Salva cópias leves para compatibilidade com outros módulos (sem redundância de imagens pesadas)
    const { profileImage, ...lightChild } = state.child;
    
    safeLocalStorageSetItem(STORAGE_KEYS.PROFILE, JSON.stringify({
      ...lightChild,
      age: state.child.age.toString(),
      emotionalSensitivity: state.mimi.emotionalSensitivity,
      autoAudio: state.app.autoVoiceEnabled,
      voiceVolume: state.app.voiceVolume
    }));
    
    safeLocalStorageSetItem(STORAGE_KEYS.THEME, JSON.stringify(state.app.theme));
  }
};
