
import React, { useRef, useEffect } from 'react';

export const Nebula: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High Performance Rendering (Axioma 1)
    let animationFrameId: number;
    let particles: Particle[] = [];
    let mouse = { x: 0, y: 0 };
    let isMoving = false;
    let lastMove = 0;

    const colors = [
      'rgba(255, 183, 197, 0.8)', // Primary (Pink)
      'rgba(152, 251, 152, 0.8)', // Secondary (Mint)
      'rgba(255, 255, 255, 0.9)', // White
      'rgba(0, 255, 255, 0.6)'    // Cyan accent
    ];

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      life: number;

      constructor(x?: number, y?: number) {
        this.x = x || Math.random() * canvas!.width;
        this.y = y || Math.random() * canvas!.height;
        this.size = Math.random() * 3 + 0.5;
        this.speedX = (Math.random() * 2 - 1) * 0.5;
        this.speedY = (Math.random() * 2 - 1) * 0.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.life = 100;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Wrap edges
        if (this.x > canvas!.width) this.x = 0;
        if (this.x < 0) this.x = canvas!.width;
        if (this.y > canvas!.height) this.y = 0;
        if (this.y < 0) this.y = canvas!.height;

        // Interaction with mouse (Repel gently)
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100 && isMoving) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (100 - distance) / 100;
          const directionX = forceDirectionX * force * 2;
          const directionY = forceDirectionY * force * 2;
          this.speedX -= directionX;
          this.speedY -= directionY;
        }

        // Friction
        this.speedX *= 0.98;
        this.speedY *= 0.98;

        // Restore gentle ambient motion
        if (Math.abs(this.speedX) < 0.2) this.speedX += (Math.random() * 0.2 - 0.1);
        if (Math.abs(this.speedY) < 0.2) this.speedY += (Math.random() * 0.2 - 0.1);
      }

      draw() {
        ctx!.fillStyle = this.color;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      const density = (canvas.width * canvas.height) / 15000; // Responsive density
      for (let i = 0; i < density; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 20, 0.1)'; // Trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // Spawn trail particles
      if (isMoving && Date.now() - lastMove < 100) {
        for(let i=0; i<2; i++) {
           particles.push(new Particle(mouse.x, mouse.y));
           if(particles.length > 200) particles.shift(); // Limit max particles
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      isMoving = true;
      lastMove = Date.now();
      setTimeout(() => isMoving = false, 200);
    });

    init();
    animate();

    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[-1] bg-[#0F172A]" />;
};
