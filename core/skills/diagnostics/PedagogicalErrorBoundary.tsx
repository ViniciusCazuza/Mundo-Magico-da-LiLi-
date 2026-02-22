import React, { Component, ErrorInfo, ReactNode } from 'react';
import { HybridCard } from '../ui/HybridCard';
import { MotionWrapper } from '../motion/MotionWrapper';

/**
 * Skill 7: Agente de Diagnóstico Pedagógico
 * Speciality: UX Educacional
 * 
 * Transforms technical failures into learning journeys (Axiom 4).
 */

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class PedagogicalErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Pedagogical Error Boundary caught an error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center p-8 min-h-[400px]">
                    <MotionWrapper preset="bounce">
                        <HybridCard variant="neubrutalism" className="max-w-md text-center space-y-4">
                            <h2 className="text-2xl font-bold text-red-600">Ops! Um Glem técnico apareceu! 👾</h2>
                            <p className="text-gray-700">
                                Parece que um pequeno erro de "Código Vivo" aconteceu.
                                Não se preocupe, a Mimi está cuidando disso!
                            </p>
                            <div className="bg-slate-100 p-3 rounded-lg text-xs font-mono text-left overflow-auto">
                                Código do Erro: {this.state.error?.message || 'Erro Desconhecido'}
                            </div>
                            <button
                                onClick={() => this.setState({ hasError: false })}
                                className="bg-black text-white px-6 py-2 rounded-full font-bold hover:bg-gray-800 transition-colors"
                            >
                                Tentar Novamente
                            </button>
                        </HybridCard>
                    </MotionWrapper>
                </div>
            );
        }

        return this.props.children;
    }
}
