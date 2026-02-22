import { useState, useCallback, useRef } from 'react';

/**
 * Skill 5: Orquestrador Multimodal Síncrono
 * Speciality: Voz e Visão
 * 
 * Coordinates Speech Synthesis with visual mouth/character movement.
 * Axiom 1: Correctness over Speed.
 */

interface VoiceSyncState {
    isSpeaking: boolean;
    mouthOpen: number; // 0 to 1
    currentWord: string;
}

export function useVoiceSync() {
    const [state, setState] = useState<VoiceSyncState>({
        isSpeaking: false,
        mouthOpen: 0,
        currentWord: '',
    });

    const animationFrameRef = useRef<number>(null);

    const speak = useCallback((text: string) => {
        if (!window.speechSynthesis) return;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';

        utterance.onstart = () => {
            setState(prev => ({ ...prev, isSpeaking: true }));
            animateMouth();
        };

        utterance.onend = () => {
            setState(prev => ({ ...prev, isSpeaking: false, mouthOpen: 0, currentWord: '' }));
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };

        utterance.onboundary = (event) => {
            if (event.name === 'word') {
                const word = text.slice(event.charIndex, event.charIndex + event.charLength);
                setState(prev => ({ ...prev, currentWord: word }));
            }
        };

        const animateMouth = () => {
            setState(prev => ({
                ...prev,
                mouthOpen: Math.random() > 0.5 ? Math.random() : 0, // Mocked lip sync logic
            }));
            animationFrameRef.current = requestAnimationFrame(animateMouth);
        };

        window.speechSynthesis.speak(utterance);
    }, []);

    return { ...state, speak };
}
