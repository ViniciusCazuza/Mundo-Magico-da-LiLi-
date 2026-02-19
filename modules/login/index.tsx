import React, { useState, useEffect, useRef } from 'react';
import { IdentityManager } from '../../core/ecosystem/IdentityManager';
import { AliceProfile } from '../../core/ecosystem/types';
import { LiquidAssets } from '../../core/components/effects/LiquidAssets';
import { Cat, Lock, User, ArrowRight, ShieldAlert, Plus, Baby, ShieldCheck, Sparkles } from 'lucide-react';
import { Result } from '../../core/utils/result';
import GatinhaLogo from '../../core/assets/GATINHA_LOGO.svg?react';
import { BubbleProfileCard } from '../../core/components/ui/BubbleProfileCard';

export const LoginScreen: React.FC = () => {
  const [profiles, setProfiles] = useState<AliceProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<AliceProfile | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'child' | 'parent_admin'>('child');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [popOrigin, setPopOrigin] = useState<{x: number, y: number} | null>(null);
  const mimiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Carrega perfis (Simulação de Backend)
    setProfiles(IdentityManager.getProfiles());
  }, []);

  // Mimi segue o mouse (Magnetic Liquid)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (mimiRef.current) {
      const { left, top, width, height } = mimiRef.current.getBoundingClientRect();
      const x = (e.clientX - (left + width / 2)) / 15;
      const y = (e.clientY - (top + height / 2)) / 15;
      mimiRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }
  };

  const handleProfileClick = async (event: { profileId: string, x: number, y: number }): Promise<Result<void>> => {
    if (isLoggingIn || selectedProfile) return Result.fail(new Error("Transition in progress"));

    const profile = profiles.find(p => p.id === event.profileId);
    if (!profile) return Result.fail(new Error("Profile not found"));

    setPopOrigin({ x: event.x, y: event.y });

    if (profile.role === 'parent_admin') {
      setSelectedProfile(profile);
      setPin('');
      setError(null);
      return Result.ok(undefined);
    } else {
      await performLogin(profile.id);
      return Result.ok(undefined);
    }
  };

  const handleCreateProfile = () => {
    if (!newName.trim()) {
      setError("Por favor, digite um nome!");
      return;
    }
    const newP = IdentityManager.addProfile(newName, newRole);
    setProfiles(IdentityManager.getProfiles());
    setIsCreating(false);
    setNewName('');
    setPopOrigin(null);
    handleProfileClick({ profileId: newP.id, x: window.innerWidth/2, y: window.innerHeight/2 });
  };

  const handlePinSubmit = async () => {
    if (!selectedProfile) return;
    
    setIsLoggingIn(true);
    // Simulação de delay de rede para efeito líquido
    await new Promise(r => setTimeout(r, 800));

    const result = IdentityManager.login(selectedProfile.id, pin);
    if (result.success) {
      window.location.reload();
    } else {
      setError(result.error.message);
      setIsLoggingIn(false);
      // Efeito de tremor na Mimi (Deep Diagnostics)
      if(mimiRef.current) {
        mimiRef.current.animate([
          { transform: 'translateX(0)' },
          { transform: 'translateX(-10px)' },
          { transform: 'translateX(10px)' },
          { transform: 'translateX(0)' }
        ], { duration: 400 });
      }
    }
  };

  const performLogin = async (id: string) => {
    setIsLoggingIn(true);
    await new Promise(r => setTimeout(r, 1500)); // Transição líquida
    const result = IdentityManager.login(id);
    if (result.success) {
      window.location.reload();
    } else {
      setError(result.error.message);
      setIsLoggingIn(false);
    }
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center liquid-bg-anim font-sans"
      onMouseMove={handleMouseMove}
    >
      <LiquidAssets />
      
      {/* Liquid Mimi (Portadora do Portal) */}
      <div className="absolute top-10 pointer-events-none gooey-container z-20">
        <div ref={mimiRef} className="liquid-bubble w-48 h-48 flex items-center justify-center text-white relative">
          <GatinhaLogo className="w-full h-full p-8 fill-white" />
          {error && <div className="absolute -right-12 -bottom-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full animate-bounce">Ops!</div>}
        </div>
      </div>

      {/* Main Glass Panel */}
      <div className="glass-panel p-12 rounded-[3rem] max-w-4xl w-full mx-4 relative z-10 animate-fade-in flex flex-col items-center">
        
        <header className="text-center mb-12 transition-opacity">
          <h1 className="text-5xl md:text-6xl font-black text-white drop-shadow-lg mb-2 font-hand">
            {isCreating ? 'Novo Amigo' : selectedProfile ? `Olá, ${selectedProfile.nickname}` : 'Quem está aqui?'}
          </h1>
          <p className="text-white/80 font-medium tracking-widest uppercase text-xs">
            {isCreating ? 'Crie um novo perfil mágico' : 'Selecione seu perfil para mergulhar'}
          </p>
        </header>

        {!selectedProfile && !isCreating ? (
          <div className="gooey-container flex flex-wrap justify-center gap-8">
            {profiles.map((p) => (
              <BubbleProfileCard 
                key={p.id} 
                profile={p} 
                canPop={!isLoggingIn}
                onPop={handleProfileClick} 
              />
            ))}
            
            {/* Botão de Novo Perfil (Líquido) */}
            <button 
              className="group flex flex-col items-center gap-4 hover:scale-105 transition-transform" 
              onClick={() => { setIsCreating(true); setError(null); }}
            >
               <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-dashed border-white/30 flex items-center justify-center text-white/50 group-hover:bg-white/10 transition-colors">
                 <Plus size={40} />
               </div>
               <span className="text-lg font-bold text-white/50 uppercase tracking-widest">Novo</span>
            </button>
          </div>
        ) : isCreating ? (
          /* FORMULÁRIO DE CRIAÇÃO (Liquid Morphism) */
          <div className="w-full max-w-md animate-fade-in space-y-8">
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={newName}
                  onChange={e => { setNewName(e.target.value); setError(null); }}
                  placeholder="Nome do aventureiro"
                  className="w-full bg-black/20 border-2 border-white/10 rounded-2xl px-6 py-5 text-xl text-white outline-none focus:border-[var(--primary)] focus:bg-black/30 transition-all placeholder:text-white/30"
                  autoFocus
                />
                <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" size={24} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setNewRole('child')}
                  className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${newRole === 'child' ? 'bg-[var(--primary)] border-white text-white shadow-lg scale-105' : 'bg-black/10 border-white/10 text-white/40 hover:bg-black/20'}`}
                >
                  <Baby size={32} />
                  <span className="font-black uppercase text-xs tracking-widest">Criança</span>
                </button>
                <button 
                  onClick={() => setNewRole('parent_admin')}
                  className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${newRole === 'parent_admin' ? 'bg-indigo-600 border-white text-white shadow-lg scale-105' : 'bg-black/10 border-white/10 text-white/40 hover:bg-black/20'}`}
                >
                  <ShieldCheck size={32} />
                  <span className="font-black uppercase text-xs tracking-widest">Guardião</span>
                </button>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setIsCreating(false)}
                className="flex-1 py-4 px-6 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleCreateProfile}
                className="flex-[2] py-4 px-6 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white font-black uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-95 transition-all"
              >
                Criar Perfil
              </button>
            </div>
            {error && <div className="text-center text-red-300 font-bold animate-pulse text-sm uppercase tracking-wide">{error}</div>}
          </div>
        ) : (
          /* Modal de Senha que EMERGE do ponto do estouro */
          <div 
            className="w-full max-w-sm animate-pop-in"
            style={{ 
              transformOrigin: popOrigin ? `${popOrigin.x}px ${popOrigin.y}px` : 'center'
            }}
          >
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => { setSelectedProfile(null); setPin(''); setError(null); }} className="text-white/60 hover:text-white transition-colors">
                ← Voltar
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white liquid-bubble">
                   {selectedProfile?.profileImage?.data ? <img src={selectedProfile.profileImage.data} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-indigo-500 flex items-center justify-center font-bold text-white">{selectedProfile?.nickname[0]}</div>}
                </div>
                <span className="text-xl font-bold text-white uppercase tracking-wider">{selectedProfile?.nickname}</span>
              </div>
            </div>

            <div className="relative">
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={e => { setPin(e.target.value); setError(null); }}
                onKeyDown={e => e.key === 'Enter' && pin.length === 4 && handlePinSubmit()}
                placeholder="PIN"
                className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-center text-3xl text-white tracking-[1em] focus:outline-none focus:bg-black/30 transition-all placeholder:text-white/20 placeholder:tracking-normal placeholder:text-lg"
                autoFocus
              />
              <button 
                onClick={handlePinSubmit}
                disabled={pin.length < 4 || isLoggingIn}
                className="absolute right-2 top-2 bottom-2 bg-white text-indigo-600 rounded-xl px-4 flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {isLoggingIn ? <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /> : <ArrowRight size={24} />}
              </button>
            </div>
            
            {error && (
              <div className="mt-4 flex items-center justify-center gap-2 text-red-200 bg-red-500/20 py-2 rounded-lg animate-pulse">
                <ShieldAlert size={16} />
                <span className="text-sm font-bold uppercase tracking-widest">{error}</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Efeito de carregamento líquido (Overlay) */}
      {isLoggingIn && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-indigo-900/80 backdrop-blur-md animate-fade-in">
           <div className="gooey-container flex gap-4">
             <div className="liquid-bubble w-16 h-16 bg-white animate-bounce shadow-[0_0_30px_rgba(255,255,255,0.5)]"></div>
             <div className="liquid-bubble w-12 h-12 bg-[var(--primary)] animate-bounce shadow-lg" style={{ animationDelay: '0.2s' }}></div>
             <div className="liquid-bubble w-8 h-8 bg-[var(--accent)] animate-bounce shadow-lg" style={{ animationDelay: '0.4s' }}></div>
           </div>
        </div>
      )}

      <style>{`
        @keyframes pop-in {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in {
          animation: pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
};
