
import { AliceProfile, EcosystemData, ECOSYSTEM_EVENTS, FamilyContext, EcosystemSession } from "./types";
import { mimiEvents } from "../events";
import { STORAGE_KEYS } from "../config";
import { safeLocalStorageSetItem } from "../utils";

const ECOSYSTEM_STORAGE_KEY = "alice_ecosystem_v2";
const SESSION_STORAGE_KEY = "alice_session_v1";

export class IdentityManager {
  private static instance: EcosystemData;
  private static session: EcosystemSession = {
    activeProfileId: null,
    isAuthenticated: false,
    role: null,
    sessionStartedAt: null
  };

  private static ensureInstance(): EcosystemData {
    if (!this.instance) return this.init();
    return this.instance;
  }

  static init(): EcosystemData {
    if (this.instance) return this.instance;

    const saved = localStorage.getItem(ECOSYSTEM_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.profiles) {
          this.instance = parsed;
          this.restoreSession();
          return this.instance;
        }
      } catch (e) {
        console.error("Falha ao carregar ecossistema:", e);
      }
    }

    const parentId = `p_admin_${Date.now()}`;
    const childId = `p_child_${Date.now()}`;

    this.instance = {
      version: "2.8.0",
      activeProfileId: childId,
      ecosystemId: `eco_${Math.random().toString(36).substr(2, 9)}`,
      parentPinHash: null,
      familyContext: {
        pets: [],
        familyValues: ""
      },
      profiles: [
        {
          id: parentId,
          role: "parent_admin",
          name: "Adulto Responsável",
          nickname: "Pai/Mãe",
          age: "30",
          preferences: "Gerenciar o ambiente da Alice",
          emotionalSensitivity: 3,
          autoAudio: true,
          parentRelationship: "Responsável",
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          id: childId,
          role: "child",
          name: "Alice",
          nickname: "Alice",
          age: "8",
          preferences: "Contar histórias e desenhar gatinhos",
          emotionalSensitivity: 3,
          autoAudio: true,
          hairType: "Cacheado",
          hairColor: "Preto",
          hasGlasses: false,
          hasBraces: false,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      ]
    };
    this.save();
    return this.instance;
  }

  private static restoreSession() {
    const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed.role === 'child' && parsed.isAuthenticated) {
          this.session = parsed;
        } else {
          this.logout();
        }
      } catch (e) {
        this.logout();
      }
    }
  }

  static getSession(): EcosystemSession {
    return this.session;
  }

  static getProfiles(): AliceProfile[] {
    return this.ensureInstance().profiles;
  }

  static getActiveProfile(): AliceProfile | null {
    if (!this.session.activeProfileId || !this.session.isAuthenticated) return null;
    const inst = this.ensureInstance();
    return inst.profiles.find(p => p.id === this.session.activeProfileId) || null;
  }

  static getFamilyContext(): FamilyContext {
    return this.ensureInstance().familyContext;
  }

  static login(id: string, pin?: string): boolean {
    if (this.session.isAuthenticated) {
      console.warn("[IdentityManager] Bloqueio de sessão: Encerre a sessão atual antes de trocar de perfil.");
      return false;
    }

    const inst = this.ensureInstance();
    const target = inst.profiles.find(p => p.id === id);
    if (!target) return false;

    if (target.role === "parent_admin") {
      // Se nenhum PIN estiver definido (parentPinHash é null ou vazio), permite o login sem PIN.
      // Caso contrário, o PIN está definido e precisa ser verificado.
      if (!inst.parentPinHash) {
        // Nenhuma verificação de PIN necessária
      } else {
        // PIN está definido, verifica o PIN fornecido
        if (!pin || !this.verifyPin(pin)) return false;
      }
    }

    this.session = {
      activeProfileId: id,
      isAuthenticated: true,
      role: target.role,
      sessionStartedAt: Date.now()
    };

    safeLocalStorageSetItem(SESSION_STORAGE_KEY, JSON.stringify(this.session));
    mimiEvents.dispatch(ECOSYSTEM_EVENTS.PROFILE_SWITCHED, target);
    return true;
  }

  static logout() {
    this.session = {
      activeProfileId: null,
      isAuthenticated: false,
      role: null,
      sessionStartedAt: null
    };
    localStorage.removeItem(SESSION_STORAGE_KEY);
    this.instance = null; // Clear the in-memory instance to force reload from localStorage on next init
    mimiEvents.dispatch(ECOSYSTEM_EVENTS.SESSION_ENDED, null);
    console.debug("[IdentityManager] Sessão encerrada e estado limpo.");
  }

  static verifyPin(pin: string): boolean {
    const hashedInputPin = this.hashPin(pin);
    const storedPinHash = this.ensureInstance().parentPinHash;
    console.log("[IdentityManager] Verifying PIN:");
    console.log("[IdentityManager]   Hashed Input PIN:", hashedInputPin);
    console.log("[IdentityManager]   Stored PIN Hash:", storedPinHash);
    console.log("[IdentityManager]   Match:", hashedInputPin === storedPinHash);
    return hashedInputPin === storedPinHash;
  }

  private static hashPin(pin: string): string {
    return btoa(`alice_salt_${pin}_secure_v2`);
  }

  static setPin(newPin: string) {
    const inst = this.ensureInstance();
    inst.parentPinHash = this.hashPin(newPin);
    this.save();
  }

  static updateProfile(id: string, data: Partial<AliceProfile>) {
    const inst = this.ensureInstance();
    const index = inst.profiles.findIndex(p => p.id === id);
    if (index === -1) return;
    inst.profiles[index] = { ...inst.profiles[index], ...data, updatedAt: Date.now() };
    this.save();
    if (this.session.activeProfileId === id) {
      mimiEvents.dispatch(ECOSYSTEM_EVENTS.PROFILE_UPDATED, inst.profiles[index]);
    }
  }

  static addProfile(name: string, role: "child" | "parent_admin" = "child"): AliceProfile {
    const inst = this.ensureInstance();
    const newProfile: AliceProfile = {
      id: `p_${Date.now()}`,
      role: role,
      name: name,
      nickname: name,
      age: role === "child" ? "8" : "30",
      preferences: "",
      emotionalSensitivity: 3,
      autoAudio: true,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    inst.profiles.push(newProfile);
    this.save();
    mimiEvents.dispatch(ECOSYSTEM_EVENTS.PROFILE_CREATED, newProfile);
    return newProfile;
  }

  static deleteProfile(id: string) {
    const inst = this.ensureInstance();
    if (inst.profiles.length <= 1) return;
    inst.profiles = inst.profiles.filter(p => p.id !== id);
    if (this.session.activeProfileId === id) this.logout();
    this.save();
    mimiEvents.dispatch(ECOSYSTEM_EVENTS.PROFILE_DELETED, id);
  }

  static updateFamilyContext(ctx: Partial<FamilyContext>) {
    const inst = this.ensureInstance();
    inst.familyContext = { ...inst.familyContext, ...ctx };
    this.save();
    mimiEvents.dispatch(ECOSYSTEM_EVENTS.PROFILE_UPDATED, this.getActiveProfile());
  }

  /**
   * Verifica se existe um PIN parental configurado
   * (Método público seguro para UI)
   */
  public static hasStoredPin(): boolean {
    const instance = this.ensureInstance();
    return !!instance.parentPinHash;
  }

  private static save() {
    if (!this.instance) {
      console.warn("[IdentityManager] save() called but instance is null. Nothing to save.");
      return;
    }
    const dataToSave = JSON.stringify(this.instance);
    safeLocalStorageSetItem(ECOSYSTEM_STORAGE_KEY, dataToSave);
  }
}
