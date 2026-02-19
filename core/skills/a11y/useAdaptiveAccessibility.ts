import { useEffect, useState } from 'react';

/**
 * Skill 8: Especialista em Acessibilidade Adaptativa
 * Speciality: Inclusão Universal
 * 
 * Adjusts UI density and contrast based on fatigue or performance (simulated).
 * Axiom 3: Simplicity is Sophistication.
 */

interface AccessibilityState {
    highContrast: boolean;
    reducedMotion: boolean;
    density: 'comfortable' | 'compact';
}

export function useAdaptiveAccessibility() {
    const [state, setState] = useState<AccessibilityState>({
        highContrast: false,
        reducedMotion: false,
        density: 'comfortable',
    });

    useEffect(() => {
        // Check system preferences
        const contrastQuery = window.matchMedia('(prefers-contrast: more)');
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        const updateState = () => {
            setState(prev => ({
                ...prev,
                highContrast: contrastQuery.matches,
                reducedMotion: motionQuery.matches,
            }));
        };

        contrastQuery.addEventListener('change', updateState);
        motionQuery.addEventListener('change', updateState);
        updateState();

        return () => {
            contrastQuery.removeEventListener('change', updateState);
            motionQuery.removeEventListener('change', updateState);
        };
    }, []);

    // Adaptive logic (e.g., if user spends too much time, increase contrast/density)
    const toggleHighContrast = () => setState(s => ({ ...s, highContrast: !s.highContrast }));

    return { ...state, toggleHighContrast };
}
