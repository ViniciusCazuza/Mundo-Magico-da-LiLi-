
import { AliceProfile, EcosystemData, ECOSYSTEM_EVENTS, FamilyContext, EcosystemSession } from "./types";
import { mimiEvents } from "../events";
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

  // Hash determinístico seguro para browser
  private static hashPin(pin: string): string {
    return btoa(unescape(encodeURIComponent(`alice_salt_v2_${pin}`)));
  }

  static init(): EcosystemData {
    if (this.instance) return this.instance;

    const saved = localStorage.getItem(ECOSYSTEM_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.profiles) {
          // MIGRAÇÃO v2.9.0: Move PIN global para perfis administrativos
          parsed.profiles = parsed.profiles.map((p: any) => {
            if (p.role === "parent_admin") {
              if (!p.pinHash && parsed.parentPinHash) {
                p.pinHash = parsed.parentPinHash;
              }
              if (!p.pinHash) {
                p.pinHash = this.hashPin("0000");
              }
              p.failedAttempts = p.failedAttempts ?? 0;
              p.lockUntil = p.lockUntil ?? null;
            }
            return p;
          });

          // Remove campo legado da raiz
          delete parsed.parentPinHash;
          
          this.instance = parsed;
          this.instance.version = "2.9.0";
          this.restoreSession();
          this.save();
          return this.instance;
        }
      } catch (e) {
        console.error("Falha ao carregar ecossistema:", e);
      }
    }

    // Estrutura Inicial se for a primeira vez
    const parentId = `p_admin_${Date.now()}`;
    const childId = `p_child_${Date.now()}`;
    
    this.instance = {
      version: "2.9.0",
      activeProfileId: childId,
      ecosystemId: `eco_${Math.random().toString(36).substr(2, 9)}`,
      familyContext: { pets: [], familyValues: "" },
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
          pinHash: this.hashPin("0000"),
          failedAttempts: 0,
          lockUntil: null,
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
        if (parsed.isAuthenticated) {
          this.session = parsed;
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
    const inst = this.ensureInstance();
    const target = inst.profiles.find(p => p.id === id);
    if (!target) return false;

    // Se for admin, exige e verifica PIN vinculado ao perfil
    if (target.role === "parent_admin") {
      if (!pin || !this.verifyPin(id, pin)) return false;
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
    this.session = { activeProfileId: null, isAuthenticated: false, role: null, sessionStartedAt: null };
    localStorage.removeItem(SESSION_STORAGE_KEY);
    mimiEvents.dispatch(ECOSYSTEM_EVENTS.SESSION_ENDED, null);
  }

  static verifyPin(profileId: string, pin: string): boolean {
    const inst = this.ensureInstance();
    const profile = inst.profiles.find(p => p.id === profileId);
    if (!profile || profile.role !== "parent_admin" || !profile.pinHash) return false;

    // Bloqueio Progressivo
    if (profile.lockUntil && Date.now() < profile.lockUntil) {
      console.warn("Acesso bloqueado temporariamente.");
      return false;
    }

    const isValid = this.hashPin(pin) === profile.pinHash;

    if (!isValid) {
      profile.failedAttempts = (profile.failedAttempts || 0) + 1;
      if (profile.failedAttempts >= 5) {
        profile.lockUntil = Date.now() + 5 * 60 * 1000; // 5 min
        profile.failedAttempts = 0;
      }
      this.save();
      return false;
    }

    profile.failedAttempts = 0;
    profile.lockUntil = null;
    this.save();
    return true;
  }

  static setPin(newPin: string) {
    const active = this.getActiveProfile();
    if (!active || active.role !== "parent_admin") return;
    active.pinHash = this.hashPin(newPin);
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
      pinHash: role === "parent_admin" ? this.hashPin("0000") : undefined,
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
  }

  private static save() {
    if (!this.instance) return;
    safeLocalStorageSetItem(ECOSYSTEM_STORAGE_KEY, JSON.stringify(this.instance));
  }
}
