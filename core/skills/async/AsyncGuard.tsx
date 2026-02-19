import React, { useState, useEffect } from 'react';
import { Result, withRetry } from '../../utils';
import { MotionWrapper } from '../motion/MotionWrapper';
import { HybridCard } from '../ui/HybridCard';

/**
 * Skill 10: Mestre do Fluxo Assíncrono
 * Speciality: Resiliência de Rede
 * 
 * Axiom 4: Explicit Failure.
 * Implements Retry logic and visual feedback for async operations.
 */

interface AsyncGuardProps<T> {
    action: () => Promise<T>;
    onSuccess: (data: T) => void;
    renderTrigger: (isLoading: boolean) => React.ReactNode;
}

export function AsyncGuard<T>({ action, onSuccess, renderTrigger }: AsyncGuardProps<T>) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = async () => {
        setLoading(true);
        setError(null);
        try {
            // Axiom 1: Correctness over Speed - using the retry utility from utils.ts
            const data = await withRetry(action, 3, 1000);
            onSuccess(data);
        } catch (e: any) {
            setError(e.message || 'Falha na conexão mágica.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div onClick={!loading ? execute : undefined}>
                {renderTrigger(loading)}
            </div>

            {error && (
                <MotionWrapper preset="bounce">
                    <HybridCard variant="neubrutalism" className="bg-red-50 border-red-500 p-3">
                        <p className="text-red-600 text-sm font-bold">⚠️ {error}</p>
                        <button
                            onClick={execute}
                            className="text-xs underline text-red-700 font-bold block mt-1"
                        >
                            Tentar Novamente
                        </button>
                    </HybridCard>
                </MotionWrapper>
            )}
        </div>
    );
}
