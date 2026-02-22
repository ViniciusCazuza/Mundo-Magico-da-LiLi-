import React from 'react';
import { cn } from '../../utils';

/**
 * Skill 1: Arquiteto de Morfismo Híbrido
 * Speciality: UI/UX Sensorial
 * 
 * This component fuses Neumorphism, Glassmorphism, and Neubrutalism.
 * Axiom 3: Simplicity is Sophistication.
 */

interface HybridCardProps {
    children: React.ReactNode;
    variant?: 'glass' | 'neumorphic' | 'neubrutalism';
    className?: string;
    onClick?: () => void;
}

export const HybridCard: React.FC<HybridCardProps> = ({
    children,
    variant = 'glass',
    className,
    onClick
}) => {
    const baseStyles = "relative overflow-hidden transition-all duration-300 p-6 rounded-3xl";

    const variants = {
        glass: "bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]",
        neumorphic: "bg-[#e0e0e0] shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] border-none",
        neubrutalism: "bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1",
    };

    return (
        <div
            className={cn(baseStyles, variants[variant], className)}
            onClick={onClick}
        >
            {/* Visual Depth Overlay for Glassmorphism */}
            {variant === 'glass' && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
            )}

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};
