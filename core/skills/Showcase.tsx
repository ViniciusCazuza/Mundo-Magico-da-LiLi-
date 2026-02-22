import React from 'react';
import { HybridCard } from '../ui/HybridCard';
import { MotionWrapper } from '../motion/MotionWrapper';

import React from 'react';
import { HybridCard } from '../ui/HybridCard';
import { MotionWrapper } from '../motion/MotionWrapper';
import { useTheme } from '../theme/useTheme';
import { DecryptText } from '../components/effects/DecryptText';

export const AI_SKILLS_SHOWCASE = () => {
    const { themeId } = useTheme();
    const isHackerMode = themeId === "binary-night";

    return (
        <div className="p-10 space-y-10 bg-[var(--bg-app)] min-h-screen text-[var(--text-primary)]">
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-8">
                {isHackerMode ? <DecryptText text="GENESIS_APEX_COGNITIVE_MODULES" /> : "AI Skills Showcase - Genesis APEX"}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Skill 1 Showcase */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-[var(--primary)]">
                        {isHackerMode ? <DecryptText text="HYBRID_MORPHISM_ARCHITECT" /> : "Skill 1: Hybrid Morphism Architect"}
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        <HybridCard variant="glass" className="w-64 h-40 flex items-center justify-center">
                            <span className="text-[var(--text-primary)] font-medium">
                                {isHackerMode ? <DecryptText text="GLASSMORPHISM" /> : "Glassmorphism"}
                            </span>
                        </HybridCard>
                        <HybridCard variant="neumorphic" className="w-64 h-40 flex items-center justify-center text-[var(--text-primary)]">
                            <span className="font-medium">
                                {isHackerMode ? <DecryptText text="NEUMORPHISM" /> : "Neumorphism"}
                            </span>
                        </HybridCard>
                        <HybridCard variant="neubrutalism" className="w-64 h-40 flex items-center justify-center">
                            <span className="text-[var(--text-on-accent)] font-bold">
                                {isHackerMode ? <DecryptText text="NEUBRUTALISM" /> : "Neubrutalism"}
                            </span>
                        </HybridCard>
                    </div>
                </section>

                {/* Skill 2 Showcase */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-[var(--accent)]">
                        {isHackerMode ? <DecryptText text="SPRING_PHYSICS_MAESTRO" /> : "Skill 2: Spring Physics Maestro"}
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        <MotionWrapper preset="bounce">
                            <HybridCard variant="glass" className="w-40 h-20 flex items-center justify-center text-[var(--text-primary)]">
                                {isHackerMode ? <DecryptText text="BOUNCE" /> : "Bounce"}
                            </HybridCard>
                        </MotionWrapper>
                        <MotionWrapper preset="elastic">
                            <HybridCard variant="glass" className="w-40 h-20 flex items-center justify-center text-[var(--text-primary)]">
                                {isHackerMode ? <DecryptText text="ELASTIC" /> : "Elastic"}
                            </HybridCard>
                        </MotionWrapper>
                    </div>
                </section>

                {/* Skill 3: JIT Renderer */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-[var(--status-warning)]">
                        {isHackerMode ? <DecryptText text="JIT_COMPONENT_COMPILER" /> : "Skill 3: JIT Component Compiler"}
                    </h2>
                    <JITRenderer schema={{
                        type: 'card',
                        props: { variant: 'glass' },
                        children: [
                            { type: 'text', props: { className: 'text-[var(--text-primary)]' }, children: ['Renderizado via JSON!'] },
                            { type: 'button', props: { onClick: () => alert('JIT Click!') }, children: ['Botão Dinâmico'] }
                        ]
                    }} />
                </section>

                {/* Skill 6: GPU Canvas */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-[var(--status-success)]">
                        {isHackerMode ? <DecryptText text="CRITICAL_PERFORMANCE_ENGINEER" /> : "Skill 6: Critical Performance Engineer"}
                    </h2>
                    <div className="w-full h-40">
                        <CanvasOptimized effect="starfield" />
                    </div>
                </section>

                {/* Skill 9: Hacker Aesthetics */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-[var(--primary)]">
                        {isHackerMode ? <DecryptText text="CYBER_SURVEILLANCE_STYLIST" /> : "Skill 9: Cyber-Surveillance Stylist"}
                    </h2>
                    <HackerOverlay>
                        <div className="space-y-2">
                            <DecryptionText text="SISTEMA MONITORADO" className="text-xl block text-[var(--primary)]" />
                            <p className="text-xs opacity-70 text-[var(--text-primary)]">
                                {isHackerMode ? <DecryptText text="ACCESSING_ALICE_DATABASE..." /> : "Acessando banco de dados..."}
                            </p>
                        </div>
                    </HackerOverlay>
                </section>

                {/* Skill 7: Error Boundary */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-[var(--secondary)]">
                        {isHackerMode ? <DecryptText text="PEDAGOGICAL_DIAGNOSTIC" /> : "Skill 7: Pedagogical Diagnostic"}
                    </h2>
                    <PedagogicalErrorBoundary>
                        <BuggyComponent />
                    </PedagogicalErrorBoundary>
                </section>
            </div>
        </div>
    );
};

const BuggyComponent = () => {
    const [crash, setCrash] = React.useState(false);
    if (crash) throw new Error("Falha intencional de demonstração.");
    return (
        <button
            onClick={() => setCrash(true)}
            className="bg-[var(--status-error)] text-[var(--text-on-primary)] px-4 py-2 rounded-lg"
        >
            Simular Erro Crítico
        </button>
    );
};

import { JITRenderer } from './jit/JITRenderer';
import { CanvasOptimized } from './performance/CanvasOptimized';
import { HackerOverlay, DecryptionText } from './hacker/HackerOverlay';
import { PedagogicalErrorBoundary } from './diagnostics/PedagogicalErrorBoundary';

