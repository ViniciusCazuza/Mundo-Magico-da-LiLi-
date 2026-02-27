import React from 'react';
import { MatrixRain, HackerOverlay } from '../MatrixRain';
import { HackerSimulator, StrategicHackGif } from '../HackerSimulator';

interface AmbientThemeEffectProps {
  themeId: string;
  container?: boolean;
  section?: string;
}

/**
 * Componente Omni-Skill para gerenciar efeitos de ambiente.
 * Pode ser usado globalmente (App.tsx) ou localmente (ThemeCards).
 */
export const AmbientThemeEffect: React.FC<AmbientThemeEffectProps> = ({ themeId, container = false, section }) => {
  const positioning = container ? 'absolute' : 'fixed';

  return (
    <div className={`${positioning} inset-0 pointer-events-none z-0 overflow-hidden`}>
      {renderEffect(themeId, container, section)}
    </div>
  );
};

const renderEffect = (themeId: string, container: boolean, section?: string) => {
  switch (themeId) {
    case 'binary-night':
      return (
        <>
          <MatrixRain container={container} />
          <HackerOverlay container={container} />
          {!container && <HackerSimulator section={section} />}
          {container ? (
            <div className="absolute bottom-4 right-4 scale-50 origin-bottom-right">
               <StrategicHackGif url="/assets/loading/siames_gif/fundo_preto(exclusivo tema hacker).gif" />
            </div>
          ) : (
            <div className="fixed bottom-24 right-4 scale-75 origin-bottom opacity-20 z-[-1] hidden md:block">
               <StrategicHackGif url="/assets/loading/siames_gif/fundo_preto(exclusivo tema hacker).gif" />
            </div>
          )}
        </>
      );

    case 'siamese':
      return (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] to-[#1E1B4B]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-screen" />
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_50%)] opacity-20 animate-pulse" />
        </>
      );

    case 'luminous-interface':
      return (
        <>
          <div className="absolute inset-0 bg-[#050505]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--accent)_0%,_transparent_75%)] animate-pulse opacity-60 will-change-transform" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay" />
          <div className="absolute top-0 left-0 w-full h-full shadow-[inset_0_0_100px_rgba(255,0,230,0.2)]" />
        </>
      );

    case 'fluid-vision':
      return (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)]" />
          <div className="absolute top-[-20%] left-[-20%] w-[100%] h-[100%] bg-white/20 blur-[120px] rounded-full animate-aurora will-change-transform" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[100%] h-[100%] bg-[var(--accent)]/30 blur-[150px] rounded-full animate-aurora will-change-transform" style={{ animationDelay: '5s' }} />
        </>
      );

    case 'glass-elite':
      return (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] to-[#1E1B4B]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/glass-pass.png')] opacity-20" />
          <div className="absolute top-1/4 left-1/4 w-[150%] h-[150%] bg-[var(--primary)]/20 blur-[120px] rounded-full animate-breathing will-change-transform" />
        </>
      );

    case 'neubrutalist-raw':
      return (
        <>
          <div className="absolute inset-0 bg-white" />
          <div className="absolute inset-0 bg-[radial-gradient(#000_2px,transparent_2px)] [background-size:40px_40px] opacity-10" />
          <div className="absolute top-0 left-0 w-full h-full border-[10px] border-black opacity-10" />
        </>
      );

    case 'neumorphic-tactile':
      return (
        <>
          <div className="absolute inset-0 bg-[#E0E5EC]" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/5" />
        </>
      );

    default:
      return null;
  }
};
