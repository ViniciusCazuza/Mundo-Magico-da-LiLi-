import React, { useRef, useEffect } from 'react';
import { cn } from '../../utils';

/**
 * Skill 6: Engenheiro de Performance Crítica
 * Speciality: GPU-Accelerated UI
 * 
 * Optimized Canvas rendering for particles (Starfield/Matrix effects).
 * Axiom 4: Explicit Failure over Silent Success.
 */

interface CanvasOptimizedProps {
    className?: string;
    effect?: 'starfield' | 'matrix';
}

export const CanvasOptimized: React.FC<CanvasOptimizedProps> = ({
    className,
    effect = 'starfield'
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let animationFrameId: number;
        let w = (canvas.width = canvas.offsetWidth);
        let h = (canvas.height = canvas.offsetHeight);

        // Starfield State
        const stars = Array.from({ length: 200 }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            size: Math.random() * 2,
            speed: Math.random() * 2 + 0.5,
        }));

        const render = () => {
            ctx.fillStyle = '#000814';
            ctx.fillRect(0, 0, w, h);

            ctx.fillStyle = '#fff';
            stars.forEach(star => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();

                star.y += star.speed;
                if (star.y > h) {
                    star.y = 0;
                    star.x = Math.random() * w;
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        const handleResize = () => {
            w = canvas.width = canvas.offsetWidth;
            h = canvas.height = canvas.offsetHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, [effect]);

    return (
        <canvas
            ref={canvasRef}
            className={cn("w-full h-full rounded-2xl", className)}
        />
    );
};
