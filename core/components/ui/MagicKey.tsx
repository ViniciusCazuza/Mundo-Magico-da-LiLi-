
import React, { useRef, useState, useEffect } from 'react';
import { Key, Lock, Sparkles, User, Fingerprint } from 'lucide-react';

interface MagicKeyProps {
  onUnlock: () => void;
  isUnlocked: boolean;
}

export const MagicKey: React.FC<MagicKeyProps> = ({ onUnlock, isUnlocked }) => {
  const keyRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const origin = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isUnlocked) return;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    origin.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - origin.current.x;
    const dy = e.clientY - origin.current.y;
    setPosition({ x: dx, y: dy });
    
    // Check Proximity (Haptic Feedback Simulation)
    if (lockRef.current) {
      const lockRect = lockRef.current.getBoundingClientRect();
      const keyRect = keyRef.current!.getBoundingClientRect();
      const distance = Math.hypot(
        (lockRect.x + lockRect.width/2) - (keyRect.x + keyRect.width/2),
        (lockRect.y + lockRect.height/2) - (keyRect.y + keyRect.height/2)
      );

      if (distance < 50) {
        lockRef.current.style.transform = 'scale(1.1)';
        lockRef.current.style.filter = 'drop-shadow(0 0 10px gold)';
      } else {
        lockRef.current.style.transform = 'scale(1)';
        lockRef.current.style.filter = 'none';
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);

    if (lockRef.current && keyRef.current) {
      const lockRect = lockRef.current.getBoundingClientRect();
      const keyRect = keyRef.current.getBoundingClientRect();
      
      // Hit Test (Simple AABB + Center Distance)
      const distance = Math.hypot(
        (lockRect.x + lockRect.width/2) - (keyRect.x + keyRect.width/2),
        (lockRect.y + lockRect.height/2) - (keyRect.y + keyRect.height/2)
      );

      if (distance < 60) {
        // Success!
        onUnlock();
        setPosition({ x: 0, y: 0 }); // Reset for animation logic handled by parent
      } else {
        // Snap Back (Spring Physics via Web Animations API)
        const element = keyRef.current;
        element.animate([
          { transform: `translate(${position.x}px, ${position.y}px)` },
          { transform: 'translate(0, 0)' }
        ], {
          duration: 500,
          easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Spring
          fill: 'forwards'
        }).onfinish = () => setPosition({ x: 0, y: 0 });
      }
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 relative h-64 justify-end">
      {/* The Lock (Target) */}
      <div 
        ref={lockRef}
        className={`
          w-24 h-24 rounded-full flex items-center justify-center 
          transition-all duration-300
          ${isUnlocked 
            ? 'bg-green-400 shadow-[0_0_30px_#4ade80]' 
            : 'bg-black/20 border-4 border-white/10 backdrop-blur-sm shadow-inner'
          }
        `}
      >
        <Lock 
          size={40} 
          className={`text-white/80 transition-all ${isUnlocked ? 'scale-0' : 'scale-100'}`} 
        />
        <Sparkles 
          size={40} 
          className={`absolute text-white transition-all ${isUnlocked ? 'scale-150 animate-spin-slow' : 'scale-0'}`} 
        />
      </div>

      {/* The Key (Draggable) */}
      <div 
        ref={keyRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`
          cursor-grab active:cursor-grabbing p-4 rounded-full 
          bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600
          shadow-[0_10px_20px_rgba(234,179,8,0.4)]
          border-2 border-yellow-200 z-50
          transition-transform
          ${isUnlocked ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
        `}
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px)`,
          touchAction: 'none' // Prevent scrolling while dragging
        }}
      >
        <Key size={32} className="text-white drop-shadow-md rotate-45" />
      </div>
      
      {!isDragging && !isUnlocked && (
        <div className="absolute bottom-[-40px] text-white/50 text-xs uppercase tracking-widest animate-pulse pointer-events-none">
          Arraste a chave
        </div>
      )}
    </div>
  );
};
