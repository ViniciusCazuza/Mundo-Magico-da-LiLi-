
import React, { useEffect, useRef } from 'react';

/**
 * Sistema de Partículas "Magic Dust"
 * Executa uma vez e limpa a si mesmo para economizar memória (Axioma 1).
 */
export const MagicDust: React.FC<{ active: boolean; onComplete?: () => void }> = ({ active, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const colors = ['#FFD700', '#FF69B4', '#00FFFF', '#ADFF2F'];

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      life: number;

      constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.size = Math.random() * 8 + 2; 
        this.speedX = Math.random() * 10 - 5;
        this.speedY = Math.random() * 10 - 5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.life = 100;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 1.5; 
        this.size *= 0.96; 
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < 50; i++) {
      particles.push(new Particle());
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].life <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }

      if (particles.length > 0) {
        animationId = requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    };

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };

  }, [active, onComplete]);

  if (!active) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-[9999] pointer-events-none"
    />
  );
};
