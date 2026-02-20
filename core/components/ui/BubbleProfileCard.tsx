import React, { useState, useRef } from 'react';
import { AliceProfile } from '../../../core/ecosystem/types';
import { Lock } from 'lucide-react';
import { Result } from '../../../core/utils/result';

interface PopEvent {
  profileId: string;
  x: number;
  y: number;
}

interface BubbleProfileCardProps {
  profile: AliceProfile;
  onPop: (event: PopEvent) => Promise<Result<void>>;
  canPop: boolean;
}

export const BubbleProfileCard: React.FC<BubbleProfileCardProps> = ({ profile, onPop, canPop }) => {
  const [isPopping, setIsPopping] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePop = async () => {
    if (isPopping || !canPop) return;

    const bubble = bubbleRef.current;
    if (!bubble) return;

    const rect = bubble.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // 1. Anticipation
    const anticipation = bubble.animate([
      { transform: 'scale(1)', filter: 'brightness(1) blur(0px)' },
      { transform: 'scale(0.85)', filter: 'brightness(1.4) blur(2px)' }
    ], { duration: 60, easing: 'ease-out', fill: 'forwards' });

    await anticipation.finished;
    setIsPopping(true);

    // 2. Fragmentação
    const drops = containerRef.current?.querySelectorAll('.liquid-drop');
    drops?.forEach((drop, i) => {
      const angle = (i / 15) * Math.PI * 2;
      const velocity = 80 + Math.random() * 120;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;

      (drop as HTMLElement).animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
      ], {
        duration: 500,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fill: 'forwards'
      });
    });

    // 3. Feedback Visual
    bubble.animate([
      { transform: 'scale(0.85)', opacity: 1 },
      { transform: 'scale(2)', opacity: 0 }
    ], { duration: 150, easing: 'ease-out', fill: 'forwards' });

    setTimeout(async () => {
      await onPop({ profileId: profile.id, x: centerX, y: centerY });
    }, 300);
  };

  return (
    <div ref={containerRef} className="relative group cursor-pointer select-none">
      {/* Gotas de fragmentação */}
      {isPopping && Array.from({ length: 15 }).map((_, i) => (
        <div 
          key={i}
          className="liquid-drop absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-white/60 pointer-events-none z-50 shadow-sm"
          style={{ marginLeft: '-6px', marginTop: '-6px' }}
        />
      ))}

      <div 
        ref={bubbleRef}
        onClick={handlePop}
        className={`
          relative liquid-bubble w-32 h-32 md:w-40 md:h-40 flex items-center justify-center 
          overflow-hidden border-4 border-white/40 shadow-2xl transition-all
          ${!isPopping ? 'animate-float-slow hover:border-yellow-300' : 'pointer-events-none'}
        `}
      >
        <div className="absolute inset-0 opacity-20 mix-blend-overlay animate-spin-slow bg-[conic-gradient(from_0deg,pink,cyan,yellow,pink)]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent" />
        
        {profile.profileImage?.data ? (
          <img src={profile.profileImage.data} className="w-full h-full object-cover opacity-90 transition-opacity" />
        ) : (
          <span className="text-5xl font-black text-indigo-950 drop-shadow-sm">{profile.nickname[0]}</span>
        )}

        {profile.role === 'parent_admin' && (
          <div className="absolute bottom-3 right-3 bg-black/60 p-2 rounded-full backdrop-blur-md border border-white/20">
            <Lock size={16} className="text-white" />
          </div>
        ) }
      </div>

      <span className={`
        block mt-4 text-center text-xl font-bold text-white drop-shadow-md uppercase tracking-wider transition-opacity
        ${isPopping ? 'opacity-0' : 'opacity-100 group-hover:text-yellow-300'}
      `}>
        {profile.nickname}
      </span>
    </div>
  );
};
