import React, { useState, useEffect, useRef, useCallback } from 'react';

// Define the shape of a particle
interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
}

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdCounter = useRef(0);

  // Get current primary and accent colors from CSS variables
  const getThemedColors = useCallback(() => {
    if (typeof document === 'undefined') return { primary: 'rgb(129, 140, 248)', accent: 'rgb(244, 114, 182)' }; // Default if not in browser env
    const style = getComputedStyle(document.documentElement);
    return {
      primary: style.getPropertyValue('--primary').trim() || 'rgb(129, 140, 248)',
      accent: style.getPropertyValue('--accent').trim() || 'rgb(244, 114, 182)',
    };
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });

    // Add a new particle periodically
    if (Math.random() < 0.3) { // Adjust frequency as desired (e.g., 0.3 for 30% chance)
      const themedColors = getThemedColors();
      setParticles(prev => [
        ...prev.slice(-30), // Keep max 30 particles to avoid performance issues
        {
          id: particleIdCounter.current++,
          x: e.clientX + (Math.random() - 0.5) * 20, // Slight random offset
          y: e.clientY + (Math.random() - 0.5) * 20,
          color: Math.random() < 0.5 ? themedColors.primary : themedColors.accent, // Alternate between primary and accent
        },
      ]);
    }
  }, [getThemedColors]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  // Clean up particles after their animation
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => {
        setParticles(prev => prev.slice(1)); // Remove the oldest particle
      }, 1000); // Particles fade out over 1s, remove them after that
      return () => clearTimeout(timer);
    }
  }, [particles]);

  return (
    <>
      {/* Main Cursor Element */}
      <div
        className="fixed z-[99999] pointer-events-none" // Removed transition-transform, duration-75, ease-out-sine
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%) scale(1)', // Center the cursor
          backgroundColor: getThemedColors().primary,
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          opacity: 0.9,
          boxShadow: `0 0 10px 3px ${getThemedColors().primary}, 0 0 20px 6px ${getThemedColors().accent}, 0 0 30px 9px ${getThemedColors().primary}`, // Glowing effect
          transition: 'transform 0s, background-color 0.4s ease, box-shadow 0.4s ease' // Transform transition to 0s
        }}
      ></div>

      {/* Particle Effects */}
      {particles.map(p => (
        <div
          key={p.id}
          className="fixed z-[99998] pointer-events-none animate-cursor-particle"
          style={{
            left: p.x,
            top: p.y,
            backgroundColor: p.color,
            width: '8px', // Slightly larger particles
            height: '8px',
            borderRadius: '50%',
            opacity: 0, // Starts invisible, animated to fade in/out
            transform: 'translate(-50%, -50%) scale(0)', // Starts small
            animation: 'sparkle-fade-out 1s ease-out forwards',
          }}
        ></div>
      ))}

      {/* Define keyframes for particle animation (can be moved to global CSS if preferred) */}
      <style>{`
        @keyframes sparkle-fade-out {
          0% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
        }
      `}</style>
    </>
  );
};

export default CustomCursor;