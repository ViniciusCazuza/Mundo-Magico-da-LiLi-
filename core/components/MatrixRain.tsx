
import React, { useEffect, useRef } from 'react';

export const MatrixRain: React.FC<{ container?: boolean }> = ({ container = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;

    const resize = () => {
      canvas.width = container && parent ? parent.offsetWidth : window.innerWidth;
      canvas.height = container && parent ? parent.offsetHeight : window.innerHeight;
    };
    
    if (!container) window.addEventListener('resize', resize);
    resize();

    const characters = "0123456789ABCDEFHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(0).map(() => Math.random() * -100);

    const draw = () => {
      // Usar preto puro para o rastro, sem transparência de fundo do canvas
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00FF41"; 
      ctx.font = `bold ${fontSize}px monospace`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#00FF41";

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      
      // Reset shadow for performance
      ctx.shadowBlur = 0;
    };

    let animationId: number;
    const animate = () => {
      draw();
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [container]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 pointer-events-none opacity-100"
    />
  );
};

export const HackerOverlay: React.FC<{ container?: boolean }> = ({ container = false }) => {
  return (
    <div className={`${container ? 'absolute' : 'fixed'} inset-0 z-[1] pointer-events-none overflow-hidden`}>
      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-60" />
      
      {/* Grid Overlay */}
      {!container && <div className="absolute inset-0 border-[20px] border-green-500/5 clip-path-polygon" />}
      
      {/* Status Indicators */}
      <div className={`absolute ${container ? 'bottom-2 right-2' : 'top-4 left-4'} font-mono text-[8px] md:text-[10px] text-green-500/60 flex flex-col gap-1`}>
        <span className="animate-pulse">● {container ? 'DEMO_MODE' : 'SYSTEM_MONITOR_ACTIVE'}</span>
        {!container && (
          <>
            <span>ENC: AES-256-GCM</span>
            <span>LAT: -23.55 | LON: -46.63</span>
          </>
        )}
      </div>
    </div>
  );
};
