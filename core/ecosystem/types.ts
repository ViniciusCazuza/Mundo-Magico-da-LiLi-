
import { UserProfile } from "../types";

export type UserRole = "child" | "parent_admin";

export interface FamilyContext {
  motherName?: string;
  fatherName?: string;
  siblings?: string[];
  pets?: string[];
  familyValues?: string;
  importantDates?: { date: string; description: string }[];
  educationStyle?: string;
}

export interface AliceProfile extends UserProfile {
  id: string;
  role: UserRole;
  createdAt: number;
  updatedAt: number;
  // Segurança & Gestão
  pinHash?: string;
  failedAttempts?: number;
  lockUntil?: number | null;
  parentRelationship?: string;
  parentContact?: string;
}

export interface EcosystemSession {
  activeProfileId: string | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  sessionStartedAt: number | null;
}

export interface EcosystemData {
  version: string;
  activeProfileId: string;
  profiles: AliceProfile[];
  ecosystemId: string;
  familyContext: FamilyContext;
  // parentPinHash removido da raiz para migrar para dentro do AliceProfile (Segurança v2.9)
}

export const ECOSYSTEM_EVENTS = {
  PROFILE_UPDATED: "ECOSYSTEM_PROFILE_UPDATED",
  PROFILE_SWITCHED: "ECOSYSTEM_PROFILE_SWITCHED",
  PROFILE_CREATED: "ECOSYSTEM_PROFILE_CREATED",
  PROFILE_DELETED: "ECOSYSTEM_PROFILE_DELETED",
  AUTH_REQUIRED: "ECOSYSTEM_AUTH_REQUIRED",
  SESSION_ENDED: "ECOSYSTEM_SESSION_ENDED"
};
