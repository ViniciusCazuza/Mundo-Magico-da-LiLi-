import { z } from 'zod';
import { Result, ok, err } from '../utils';

/**
 * Skill 4: Sentinela de Estado e Tipagem
 * Speciality: Segurança de Domínio
 */

// --- Schemas ---

export const UserRoleSchema = z.enum(['child', 'parent', 'admin']);

export const UserProfileSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2),
    role: UserRoleSchema,
    theme: z.string().default('default'),
    lastLogin: z.date().optional(),
});

export const GameStateSchema = z.object({
    score: z.number().int().nonnegative(),
    level: z.number().int().positive(),
    inventory: z.array(z.string()),
    metadata: z.record(z.unknown()),
});

// --- Types ---

export type UserProfile = z.infer<typeof UserProfileSchema>;
export type GameState = z.infer<typeof GameStateSchema>;

// --- Guards & Validators (Axiom 4: Explicit Failure) ---

/**
 * Validates a profile and returns a Result pattern response.
 * Blocks illegal states before they reach the UI.
 */
export function validateProfile(data: unknown): Result<UserProfile, z.ZodError> {
    const parsed = UserProfileSchema.safeParse(data);
    if (parsed.success) {
        return ok(parsed.data);
    }
    return err(parsed.error);
}

/**
 * Guard to ensure child users cannot access parent data.
 */
export function isParent(user: UserProfile): boolean {
    return user.role === 'parent' || user.role === 'admin';
}
