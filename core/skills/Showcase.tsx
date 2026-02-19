import React from 'react';
import { HybridCard } from '../ui/HybridCard';
import { MotionWrapper } from '../motion/MotionWrapper';

export const AI_SKILLS_SHOWCASE = () => {
    return (
        <div className="p-10 space-y-10 bg-slate-900 min-h-screen">
            <h1 className="text-4xl font-bold text-white mb-8">AI Skills Showcase - Antigravity v2.0</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Skill 1 Showcase */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-sky-400">Skill 1: Hybrid Morphism Architect</h2>
                    <div className="flex flex-wrap gap-4">
                        <HybridCard variant="glass" className="w-64 h-40 flex items-center justify-center">
                            <span className="text-white font-medium">Glassmorphism</span>
                        </HybridCard>
                        <HybridCard variant="neumorphic" className="w-64 h-40 flex items-center justify-center text-gray-700">
                            <span className="font-medium">Neumorphism</span>
                        </HybridCard>
                        <HybridCard variant="neubrutalism" className="w-64 h-40 flex items-center justify-center">
                            <span className="text-black font-bold">Neubrutalism</span>
                        </HybridCard>
                    </div>
                </section>

                {/* Skill 2 Showcase */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-pink-400">Skill 2: Spring Physics Maestro</h2>
                    <div className="flex flex-wrap gap-4">
                        <MotionWrapper preset="bounce">
                            <HybridCard variant="glass" className="w-40 h-20 flex items-center justify-center text-white">
                                Bounce
                            </HybridCard>
                        </MotionWrapper>
                        <MotionWrapper preset="elastic">
                            <HybridCard variant="glass" className="w-40 h-20 flex items-center justify-center text-white">
                                Elastic
                            </HybridCard>
                        </MotionWrapper>
                    </div>
                </section>

                {/* Skill 3: JIT Renderer */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-yellow-400">Skill 3: JIT Component Compiler</h2>
                    <JITRenderer schema={{
                        type: 'card',
                        props: { variant: 'glass' },
                        children: [
                            { type: 'text', props: { className: 'text-white' }, children: ['Renderizado via JSON!'] },
                            { type: 'button', props: { onClick: () => alert('JIT Click!') }, children: ['Botão Dinâmico'] }
                        ]
                    }} />
                </section>

                {/* Skill 6: GPU Canvas */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-emerald-400">Skill 6: Critical Performance Engineer</h2>
                    <div className="w-full h-40">
                        <CanvasOptimized effect="starfield" />
                    </div>
                </section>

                {/* Skill 9: Hacker Aesthetics */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-green-500">Skill 9: Cyber-Surveillance Stylist</h2>
                    <HackerOverlay>
                        <div className="space-y-2">
                            <DecryptionText text="SISTEMA MONITORADO" className="text-xl block" />
                            <p className="text-xs opacity-70">Acessando banco de dados da Alice...</p>
                        </div>
                    </HackerOverlay>
                </section>

                {/* Skill 7: Error Boundary */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-purple-400">Skill 7: Pedagogical Diagnostic</h2>
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
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
            Simular Erro Crítico
        </button>
    );
};

import { JITRenderer } from './jit/JITRenderer';
import { CanvasOptimized } from './performance/CanvasOptimized';
import { HackerOverlay, DecryptionText } from './hacker/HackerOverlay';
import { PedagogicalErrorBoundary } from './diagnostics/PedagogicalErrorBoundary';

