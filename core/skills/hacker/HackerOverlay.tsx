import React, { useState, useEffect } from 'react';
import { cn } from '../../utils';

/**
 * Skill 9: Cyber-Surveillance Stylist
 * Speciality: Anomalia e Glitch UI
 * 
 * Creates hacker terminal effects and decryption animations.
 */

export const DecryptionText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
    const [display, setDisplay] = useState('');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';

    useEffect(() => {
        let iteration = 0;
        const interval = setInterval(() => {
            setDisplay(text.split('').map((char, index) => {
                if (index < iteration) return text[index];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join(''));

            if (iteration >= text.length) clearInterval(interval);
            iteration += 1 / 3;
        }, 30);

        return () => clearInterval(interval);
    }, [text]);

    return <span className={cn("font-mono", className)}>{display}</span>;
};

export const HackerOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="relative overflow-hidden bg-black text-green-500 font-mono p-4 rounded-xl border border-green-900/50">
            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%]" />

            {/* Flicker Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-green-500 animate-pulse z-30" />

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};
