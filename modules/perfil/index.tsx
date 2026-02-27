import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  User, Sparkles, ShieldCheck, Heart, Settings, Lock,
  BrainCircuit, Activity, Volume2, ChevronRight, Star,
  Palette, Pizza, Camera, Upload, Smile, Glasses, Scissors,
  Users, Plus, Trash2, CheckCircle2, Home, Key, LogOut, Info, BookOpen, Brain,
  Music, MapPin, Sun, Moon, Zap, Briefcase, Award, GraduationCap, CloudRain,
  Eye, Droplet, Ghost, MessageSquare, VolumeX, ShieldAlert, Sliders, Ear,
  Target, Bell, Shield, Coffee, UtensilsCrossed, MoonStar, Book, Dumbbell,
  Compass, Mountain, Wand2, Flame, HeartHandshake, CloudSun, Baby
} from "lucide-react";
import { PerfilState, MimiTemperament, LanguageComplexity, ProtocolGovernance } from "./types";
import { perfilStorage } from "./services/perfilStorage";
import { mimiEvents } from "../../core/events";
import { resizeImage } from "../../core/utils";
import { IdentityManager } from "../../core/ecosystem/IdentityManager";
import { AliceProfile, ECOSYSTEM_EVENTS, FamilyContext } from "../../core/ecosystem/types";
import { HackerSimulator, StrategicHackGif } from "../../core/components/HackerSimulator";
import { useTheme } from "../../core/theme/useTheme";
import { DecryptText } from "../../core/components/effects/DecryptText";
import { MagicIcon } from "../../core/components/ui/MagicIcon";

// Internal Components
import { ThemeCustomizer } from "./components/ThemeCustomizer";
import { KnowledgeTrainer } from "./components/KnowledgeTrainer";
import { ModernInput } from "../../core/components/ModernInput";

type AppTab = 'profiles' | 'child' | 'mimi' | 'app' | 'family' | 'security';

export const PerfilModule: React.FC<{ onOpenParentZone: () => void }> = ({ onOpenParentZone }) => {
  const activeProfile = IdentityManager.getActiveProfile();
  const isAdmin = activeProfile?.role === "parent_admin";

  const [state, setState] = useState<PerfilState>(() => perfilStorage.getInitialState());
  const [activeTab, setActiveTab] = useState<AppTab>(isAdmin ? 'profiles' : 'child');
  const [ecosystemProfiles, setEcosystemProfiles] = useState<AliceProfile[]>(() => IdentityManager.getProfiles());
  const [familyContext, setFamilyContext] = useState<FamilyContext>(() => IdentityManager.getFamilyContext());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const customBackgroundInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    perfilStorage.saveState(state);
    mimiEvents.dispatch("PROFILE_UPDATED", state);
  }, [state]);

  const updateChildState = useCallback((child: Partial<PerfilState['child']>) => {
    setState(prev => ({ ...prev, child: { ...prev.child, ...child } }));
    if (activeProfile) {
      IdentityManager.updateProfile(activeProfile.id, { ...child, age: child.age?.toString() });
    }
  }, [activeProfile]);

  const updateMimiState = useCallback((mimi: Partial<PerfilState['mimi']>) => {
    setState(prev => ({ ...prev, mimi: { ...prev.mimi, ...mimi } }));
  }, []);

  const updateAppState = useCallback((app: Partial<PerfilState['app']>) => {
    setState(prev => ({ ...prev, app: { ...prev.app, ...app } }));
    if (activeProfile && app.autoVoiceEnabled !== undefined) {
      IdentityManager.updateProfile(activeProfile.id, { autoAudio: app.autoVoiceEnabled });
    }
  }, [activeProfile]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const smallBase64 = await resizeImage(base64, 400, 400);
        updateChildState({
          profileImage: {
            data: smallBase64,
            mimeType: 'image/jpeg',
            version: "1.1",
            updatedAt: Date.now()
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && state.app.theme.id) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        updateAppState({
          customBackgroundByThemeId: {
            ...state.app.customBackgroundByThemeId,
            [state.app.theme.id]: base64,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const { themeId } = useTheme();
  const isHackerMode = themeId === "binary-night";

  if (!activeProfile) return null;

  return (
    <div className={`flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden animate-fade-in ${isAdmin ? (isHackerMode ? 'bg-transparent text-green-500' : 'bg-slate-50') : 'bg-transparent'}`}>
      {isHackerMode && (
        <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
           <HackerSimulator />
           <StrategicHackGif url="/assets/loading/siames_gif/fundo_preto(exclusivo tema hacker).gif" />
        </div>
      )}
      <nav className={`w-full md:w-28 py-6 px-4 flex md:flex-col items-center gap-6 shrink-0 md:border-r overflow-x-auto no-scrollbar ${isAdmin ? (isHackerMode ? 'bg-black/20 border-green-500/30' : 'bg-white border-slate-200') : 'border-[var(--border-color)]'}`}>
        <SidebarTab active={activeTab === 'profiles'} onClick={() => setActiveTab('profiles')} icon={Users} label="Gestão" isAdmin={isAdmin} />
        {activeProfile.role === 'child' && <SidebarTab active={activeTab === 'child'} onClick={() => setActiveTab('child')} icon={User} label="Sobre Mim" isAdmin={isAdmin} />}
        <SidebarTab active={activeTab === 'mimi'} onClick={() => setActiveTab('mimi')} icon={BrainCircuit} label="Mimi" isAdmin={isAdmin} />
        <SidebarTab active={activeTab === 'app'} onClick={() => setActiveTab('app')} icon={Palette} label="Tema" isAdmin={isAdmin} />
        {isAdmin && (
          <>
            <SidebarTab active={activeTab === 'family'} onClick={() => setActiveTab('family')} icon={Home} label="Família" isAdmin={isAdmin} />
            <SidebarTab active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={Lock} label="PIN" isAdmin={isAdmin} />
          </>
        )}
        <div className="flex-1 md:block hidden" />
        <SidebarTab active={false} onClick={() => IdentityManager.logout()} icon={LogOut} label="Sair" isAdmin={isAdmin} />
      </nav>

      <main className="flex-1 overflow-y-auto p-8 md:p-12 no-scrollbar">
        <div className="max-w-4xl mx-auto space-y-12 pb-24">
          {activeTab === 'profiles' && <ProfilesManagement activeProfile={activeProfile} isAdmin={isAdmin} profiles={ecosystemProfiles} />}
          {activeTab === 'child' && activeProfile.role === 'child' && (
            <AboutMeView state={state.child} updateChild={updateChildState} handlePhoto={handlePhotoUpload} />
          )}
          {activeTab === 'mimi' && (
            isAdmin
              ? <ParentMimiTraining mimi={state.mimi} updateMimi={updateMimiState} />
              : <ChildMimiSettings app={state.app} updateApp={updateAppState} />
          )}
          {activeTab === 'app' && (
            <section className="space-y-12 animate-fade-in">
              <header><h2 className="font-hand text-6xl text-[var(--text-primary)]">
                {isHackerMode ? <DecryptText text="MUDAR_MEU_MUNDO" /> : "Mudar meu Mundo"}
              </h2></header>
              <ThemeCustomizer currentTheme={state.app.theme} onUpdateTheme={theme => updateAppState({ theme })} />

              <div className="mimi-card p-10 space-y-6">
                <h3 className="text-lg font-black text-[var(--text-primary)]">
                  {isHackerMode ? <DecryptText text={`FUNDO_CUSTOMIZADO (${state.app.theme.name.toUpperCase()})`} /> : `Fundo Personalizado (${state.app.theme.name})`}
                </h3>
                <div className="flex items-center gap-4">
                  <button onClick={() => customBackgroundInputRef.current?.click()} className="px-6 py-3 btn-dynamic text-[var(--text-on-primary)] flex items-center gap-2 shadow-lg">
                    <MagicIcon icon={Upload} size={20} color="currentColor" variant="duotone" /> Escolher Imagem
                  </button>
                  {state.app.customBackgroundByThemeId?.[state.app.theme.id] && (
                    <button onClick={() => updateAppState({ customBackgroundByThemeId: { ...state.app.customBackgroundByThemeId, [state.app.theme.id]: undefined } })} className="px-6 py-3 bg-red-500/10 text-red-500 rounded-[var(--ui-component-radius)] border border-red-500/20 flex items-center gap-2 hover:bg-red-500 hover:text-white transition-all">
                      <MagicIcon icon={Trash2} size={20} color="currentColor" variant="duotone" /> Remover
                    </button>
                  )}
                </div>
                <input type="file" ref={customBackgroundInputRef} onChange={handleCustomBackgroundUpload} className="hidden" accept="image/*" />
              </div>
            </section>
          )}
          {activeTab === 'family' && isAdmin && (
            <FamilyContextSettings family={familyContext} updateFamily={ctx => { setFamilyContext(prev => ({ ...prev, ...ctx })); IdentityManager.updateFamilyContext(ctx); }} />
          )}
          {activeTab === 'security' && isAdmin && <SecuritySettings activeProfile={activeProfile} />}
        </div>
      </main>
    </div>
  );
};

const ProfilesManagement = ({ activeProfile, isAdmin, profiles }: any) => {
  const { themeId } = useTheme();
  const isHackerMode = themeId === "binary-night";
  return (
    <section className="space-y-12 animate-fade-in">
      <header>
        <h2 className="font-hand text-6xl text-[var(--text-primary)]">
          {isHackerMode ? <DecryptText text="GESTAO_DE_PERFIS" /> : "Gestão de Perfis"}
        </h2>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profiles.map((p: any) => (
          <div key={p.id} className="bg-[var(--surface)] p-6 mimi-card flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center text-[var(--primary)] font-black text-xl border-2 border-[var(--border-color)] overflow-hidden bg-[var(--surface-elevated)] shadow-inner"
                   style={{ borderRadius: 'var(--ui-component-radius)' }}>
                {p.profileImage?.data ? <img src={p.profileImage.data} className="w-full h-full object-cover" /> : p.nickname[0]}
              </div>
              <div>
                <h4 className="font-bold text-[var(--text-primary)]">{p.nickname}</h4>
                <p className="text-[10px] font-black uppercase text-[var(--text-muted)]">{p.role === 'child' ? 'Criança' : 'Administrador'}</p>
              </div>
            </div>
            {isAdmin && p.id !== activeProfile.id && (
              <button onClick={() => { if (confirm(`Excluir perfil ${p.nickname}?`)) IdentityManager.deleteProfile(p.id); }} className="p-3 text-[var(--text-muted)] hover:text-red-500 transition-all">
                <MagicIcon icon={Trash2} size={20} color="currentColor" />
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

const ChildMimiSettings = ({ app, updateApp }: any) => {
  const { themeId } = useTheme();
  const isHackerMode = themeId === "binary-night";
  return (
    <section className="space-y-12 animate-fade-in">
      <header>
        <h2 className="font-hand text-6xl text-[var(--primary)]">
          {isHackerMode ? <DecryptText text="MINHA_GATINHA_MIMI" /> : "Minha Gatinha Mimi"}
        </h2>
      </header>
      <div className="mimi-card p-10 space-y-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => updateApp({ autoVoiceEnabled: !app.autoVoiceEnabled })}
              className={`p-4 btn-dynamic text-white shadow-lg transition-all active:scale-95 flex items-center justify-center`}
              style={{ borderRadius: 'var(--ui-component-radius)' }}
            >
              <MagicIcon icon={app.autoVoiceEnabled ? Volume2 : VolumeX} color="white" size={24} />
            </button>
            <div><h4 className="font-bold text-[var(--text-primary)]">Mimi pode falar?</h4></div>
          </div>
          <Switch active={app.autoVoiceEnabled} onToggle={() => updateApp({ autoVoiceEnabled: !app.autoVoiceEnabled })} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-[var(--text-muted)] ml-2 flex items-center gap-2">
              <MagicIcon icon={Ear} size={14} color="var(--text-muted)" /> Como ela me chama?
            </label>
            <div className="flex bg-[var(--surface-elevated)] p-1.5 border border-[var(--border-color)]" style={{ borderRadius: 'var(--ui-radius)' }}>
              <button onClick={() => updateApp({ callAliceBy: 'name' })} className={`flex-1 py-3 text-[10px] font-black uppercase transition-all ${app.callAliceBy === 'name' ? 'btn-dynamic text-white shadow-md' : 'text-[var(--text-muted)] hover:bg-black/5'}`} style={{ borderRadius: 'var(--ui-component-radius)' }}>Nome</button>
              <button onClick={() => updateApp({ callAliceBy: 'nickname' })} className={`flex-1 py-3 text-[10px] font-black uppercase transition-all ${app.callAliceBy === 'nickname' ? 'btn-dynamic text-white shadow-md' : 'text-[var(--text-muted)] hover:bg-black/5'}`} style={{ borderRadius: 'var(--ui-component-radius)' }}>Apelido</button>
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-[var(--text-muted)] ml-2 flex items-center gap-2">
              <MagicIcon icon={Sparkles} size={14} color="var(--text-muted)" /> Intensidade Mágica
            </label>
            <div className="flex bg-[var(--surface-elevated)] p-1.5 border border-[var(--border-color)]" style={{ borderRadius: 'var(--ui-radius)' }}>
              <button onClick={() => updateApp({ animationIntensity: 'low' })} className={`flex-1 py-3 text-[10px] font-black transition-all ${app.animationIntensity === 'low' ? 'btn-dynamic text-white shadow-md' : 'text-[var(--text-muted)] hover:bg-black/5'}`} style={{ borderRadius: 'var(--ui-component-radius)' }}>Leve</button>
              <button onClick={() => updateApp({ animationIntensity: 'magical' })} className={`flex-1 py-3 text-[10px] font-black transition-all ${app.animationIntensity === 'magical' ? 'btn-dynamic text-white shadow-md' : 'text-[var(--text-muted)] hover:bg-black/5'}`} style={{ borderRadius: 'var(--ui-component-radius)' }}>Mágica!</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ParentMimiTraining = ({ mimi, updateMimi }: any) => {
  const { themeId } = useTheme();
  const isHackerMode = themeId === "binary-night";
  return (
    <section className="space-y-12 animate-fade-in">
      <header><h2 className="font-hand text-6xl text-[var(--text-primary)]">
        {isHackerMode ? <DecryptText text="TREINAMENTO_DA_MIMI" /> : "Treinamento da Mimi"}
      </h2></header>
      <div className="bg-[var(--surface)] p-10 mimi-card space-y-8">
        <h3 className="text-lg font-black text-[var(--text-primary)] flex items-center gap-3">
          <MagicIcon icon={Sliders} color="var(--primary)" /> 
          {isHackerMode ? <DecryptText text="TEMPERAMENTO" /> : "Temperamento"}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {(['affectionate', 'playful', 'calm', 'protective', 'balanced'] as MimiTemperament[]).map(t => (
            <button key={t} onClick={() => updateMimi({ preferredTone: t })} className={`p-4 border-2 transition-all flex flex-col items-center gap-2 ${mimi.preferredTone === t ? 'border-[var(--primary)] bg-[var(--primary)]/10 shadow-sm' : 'border-transparent bg-[var(--surface-elevated)] opacity-60'}`} style={{ borderRadius: 'var(--ui-component-radius)' }}>
              <span className="text-[9px] font-black uppercase">{t}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mimi-card p-10 space-y-6">
        <h3 className="text-lg font-black text-[var(--text-primary)] flex items-center gap-3">
          <MagicIcon icon={Brain} color="var(--primary)" /> 
          {isHackerMode ? <DecryptText text="MEMORIA_DE_VALORES" /> : "Memória de Valores"}
        </h3>
        <KnowledgeTrainer knowledge={mimi.additionalKnowledge} onChange={(val: any) => updateMimi({ additionalKnowledge: val })} />
      </div>
    </section>
  );
};

const AboutMeView = ({ state, updateChild, handlePhoto }: any) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { themeId } = useTheme();
  const isHackerMode = themeId === "binary-night";
  return (
    <section className="space-y-12 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div><h2 className="font-hand text-7xl text-[var(--text-primary)]">
          {isHackerMode ? <DecryptText text="MEU_DIARIO_MAGICO" /> : "Meu Diário Mágico"}
        </h2><p className="text-[var(--text-muted)] font-medium text-lg">Conte seus segredos para a Mimi conhecer você!</p></div>
        <div onClick={() => fileInputRef.current?.click()} className="w-32 h-32 md:w-40 md:h-40 bg-[var(--surface-elevated)] border-2 border-[var(--border-color)] shadow-2xl cursor-pointer overflow-hidden relative group shrink-0" style={{ borderRadius: 'var(--ui-radius)' }}>
          {state.profileImage?.data ? <img src={state.profileImage.data} className="w-full h-full object-cover" /> : <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text-primary)] gap-2"><MagicIcon icon={Camera} size={48} /><span className="text-[10px] font-black uppercase">Foto</span></div>}
          <input type="file" ref={fileInputRef} onChange={handlePhoto} className="hidden" accept="image/*" />
        </div>
      </header>

      {/* 1. MINHA IDENTIDADE */}
      <MagicSection icon={User} title="Minha Identidade" color="var(--primary)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ModernInput label="Meu Nome Completo" value={state.name} onChange={(val: string) => updateChild({ name: val })} />
          <ModernInput label="Apelido Favorito" value={state.nickname} onChange={(val: string) => updateChild({ nickname: val })} />
          <ModernInput label="Quantos Anos Eu Tenho?" type="number" value={state.age.toString()} onChange={(val: string) => updateChild({ age: parseInt(val) || 0 })} />
          <ModernInput label="Meu Aniversário" value={state.birthday} onChange={(val: string) => updateChild({ birthday: val })} mask="99/99/9999" />
          <ModernInput label="O Que Significa Meu Nome?" value={state.nameMeaning || ""} onChange={(val: string) => updateChild({ nameMeaning: val })} />
          <ModernInput label="Como Quero Ser Chamada Hoje?" value={state.calledHow || ""} onChange={(val: string) => updateChild({ calledHow: val })} />
        </div>
      </MagicSection>

      {/* 2. COMO EU SOU */}
      <MagicSection icon={Scissors} title="Como Eu Sou" color="var(--secondary)">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <ModernInput label="Tipo de Cabelo" value={state.hairType} onChange={(val: string) => updateChild({ hairType: val })} />
          <ModernInput label="Cor do Cabelo" value={state.hairColor} onChange={(val: string) => updateChild({ hairColor: val })} />
          <ModernInput label="Cor dos Olhos" value={state.eyeColor || ""} onChange={(val: string) => updateChild({ eyeColor: val })} />
          <ModernInput label="Tom de Pele" value={state.skinTone || ""} onChange={(val: string) => updateChild({ skinTone: val })} />
          <div className="flex items-center gap-3 bg-[var(--surface-elevated)] p-4 rounded-2xl"><span className="text-[10px] font-black uppercase opacity-40">Uso Óculos?</span><Switch active={state.hasGlasses} onToggle={() => updateChild({ hasGlasses: !state.hasGlasses })} /></div>
          <div className="flex items-center gap-3 bg-[var(--surface-elevated)] p-4 rounded-2xl"><span className="text-[10px] font-black uppercase opacity-40">Uso Aparelho?</span><Switch active={state.hasBraces} onToggle={() => updateChild({ hasBraces: !state.hasBraces })} /></div>
        </div>
      </MagicSection>

      {/* 3. MEUS GOSTOS FAVORITOS */}
      <MagicSection icon={Heart} title="Meus Gostos Favoritos" color="var(--accent)">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <ModernInput label="Cor do Coração" value={state.favoriteColor} onChange={(val: string) => updateChild({ favoriteColor: val })} />
          <ModernInput label="Animal Amigo" value={state.favoriteAnimal} onChange={(val: string) => updateChild({ favoriteAnimal: val })} />
          <ModernInput label="Emoji do Dia" value={state.favoriteEmoji} onChange={(val: string) => updateChild({ favoriteEmoji: val })} />
          <ModernInput label="Desenho ou Filme" value={state.favoriteDrawing || ""} onChange={(val: string) => updateChild({ favoriteDrawing: val })} />
          <ModernInput label="Personagem Favorito" value={state.favoriteCharacter || ""} onChange={(val: string) => updateChild({ favoriteCharacter: val })} />
          <ModernInput label="Minha Brincadeira" value={state.favoritePlay || ""} onChange={(val: string) => updateChild({ favoritePlay: val })} />
          <ModernInput label="Música que Eu Amo" value={state.favoriteMusic || ""} onChange={(val: string) => updateChild({ favoriteMusic: val })} />
          <ModernInput label="Lugar mais Legal" value={state.favoritePlace || ""} onChange={(val: string) => updateChild({ favoritePlace: val })} />
          <ModernInput label="Estação do Ano" value={state.favoriteSeason || ""} onChange={(val: string) => updateChild({ favoriteSeason: val })} />
        </div>
      </MagicSection>

      {/* 4. MINHA ROTINA */}
      <MagicSection icon={Coffee} title="Minha Rotina" color="var(--accent)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ModernInput label="Comida Favorita" value={state.favoriteFood} onChange={(val: string) => updateChild({ favoriteFood: val })} />
          <ModernInput label="Comida que não gosto" value={state.dislikedFood} onChange={(val: string) => updateChild({ dislikedFood: val })} />
          <ModernInput label="Melhor momento do dia" value={state.bestMomentOfDay} onChange={(val: string) => updateChild({ bestMomentOfDay: val })} />
          <ModernInput label="Matéria da Escola" value={state.favoriteSubject} onChange={(val: string) => updateChild({ favoriteSubject: val })} />
          <ModernInput label="O que faço depois da aula?" value={state.afterSchoolActivity} onChange={(val: string) => updateChild({ afterSchoolActivity: val })} />
          <div className="grid grid-cols-2 gap-4">
            <ModernInput label="Hora de Acordar" type="time" value={state.wakeUpTime} onChange={(val: string) => updateChild({ wakeUpTime: val })} />
            <ModernInput label="Hora de Dormir" type="time" value={state.sleepTime} onChange={(val: string) => updateChild({ sleepTime: val })} />
          </div>
        </div>
      </MagicSection>

      {/* 5. SONHOS & IMAGINAÇÃO */}
      <MagicSection icon={Sparkles} title="Sonhos & Imaginação" color="var(--primary)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ModernInput label="O que eu amo desenhar?" value={state.dreamDrawing} onChange={(val: string) => updateChild({ dreamDrawing: val })} />
          <ModernInput label="Personagem que eu criaria" value={state.dreamCharacter} onChange={(val: string) => updateChild({ dreamCharacter: val })} />
          <ModernInput label="O que quero ser quando crescer?" value={state.dreamJob} onChange={(val: string) => updateChild({ dreamJob: val })} />
          <ModernInput label="Meu Superpoder Imaginário" value={state.dreamPower} onChange={(val: string) => updateChild({ dreamPower: val })} />
          <ModernInput label="Um lugar para viajar" value={state.dreamPlace} onChange={(val: string) => updateChild({ dreamPlace: val })} />
          <ModernInput label="Meu Maior Sonho" value={state.biggestDream || ""} onChange={(val: string) => updateChild({ biggestDream: val })} />
        </div>
      </MagicSection>

      {/* 6. O MEU JEITINHO (AFETIVIDADE) */}
      <MagicSection icon={Smile} title="O Meu Jeitinho" color="var(--primary)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ModernInput label="O que me deixa radiante?" value={state.happyWhen} onChange={(val: string) => updateChild({ happyWhen: val })} multiline rows={3} />
          <ModernInput label="O que me deixa triste?" value={state.sadWhen} onChange={(val: string) => updateChild({ sadWhen: val })} multiline rows={3} />
          <ModernInput label="Sou corajosa quando..." value={state.courageousWhen} onChange={(val: string) => updateChild({ courageousWhen: val })} multiline rows={2} />
          <ModernInput label="Tenho medo de..." value={state.scaredWhen} onChange={(val: string) => updateChild({ scaredWhen: val })} multiline rows={2} />
          <ModernInput label="O que me dá orgulho?" value={state.proudOf || ""} onChange={(val: string) => updateChild({ proudOf: val })} />
          <ModernInput label="Eu sou muito boa em..." value={state.goodAt || ""} onChange={(val: string) => updateChild({ goodAt: val })} />
          <ModernInput label="Estou aprendendo agora..." value={state.learningNow || ""} onChange={(val: string) => updateChild({ learningNow: val })} />
          <ModernInput label="Com meus amigos eu sou..." value={state.howIAmWithFriends || ""} onChange={(val: string) => updateChild({ howIAmWithFriends: val })} />
          <ModernInput label="O que me acalma?" value={state.calmsMe || ""} onChange={(val: string) => updateChild({ calmsMe: val })} />
          <ModernInput label="O que me anima?" value={state.cheersMeUp || ""} onChange={(val: string) => updateChild({ cheersMeUp: val })} />
          <ModernInput label="Gosto quando falam comigo assim..." value={state.likesBeingSpokenToHow || ""} onChange={(val: string) => updateChild({ likesBeingSpokenToHow: val })} />
          <ModernInput label="Eu não gosto quando..." value={state.dislikesWhen || ""} onChange={(val: string) => updateChild({ dislikesWhen: val })} />
          <div className="md:col-span-2">
            <ModernInput label="Quando estou triste, eu gosto de..." value={state.whenSadILike} onChange={(val: string) => updateChild({ whenSadILike: val })} multiline rows={3} />
          </div>
        </div>
      </MagicSection>
    </section>
  );
};

const FamilyContextSettings = ({ family, updateFamily }: any) => (
  <section className="space-y-8 animate-fade-in">
    <header><h2 className="font-hand text-5xl text-[var(--text-primary)]">Família</h2></header>
    <div className="mimi-card p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
      <ModernInput label="Mãe" value={family.motherName || ""} onChange={(val: string) => updateFamily({ motherName: val })} />
      <ModernInput label="Pai" value={family.fatherName || ""} onChange={(val: string) => updateFamily({ fatherName: val })} />
    </div>
  </section>
);

const SecuritySettings = ({ activeProfile }: any) => {
  const [pinInput, setPinInput] = useState("");
  const handleSetPin = () => { IdentityManager.setPin(pinInput); alert("PIN Salvo!"); };
  return (
    <section className="space-y-8 animate-fade-in text-center">
      <div className="mimi-card p-16 inline-block w-full max-w-lg">
        <div className="space-y-4 mb-8">
          <ModernInput label="Novo PIN (4 dígitos)" type="password" value={pinInput} onChange={setPinInput} maxLength={4} />
        </div>
        <button onClick={handleSetPin} className="px-12 py-5 btn-dynamic text-white font-black w-full shadow-2xl">Salvar PIN</button>
      </div>
    </section>
  );
};

const MagicSection = ({ icon: Icon, title, color, children }: any) => {
  const { themeId, theme } = useTheme();
  const isHackerMode = themeId === "binary-night";
  const cardStyle = theme?.tokens.layout.cardStyle;

  // OMNI-SKILL: Inteligência de Contraste e Tema
  const getSectionColor = () => {
    if (isHackerMode) return '#00FF41'; 
    return color;
  };

  const getIconContrastColor = (bgColor: string) => {
    if (isHackerMode) return '#000000'; // Ícone preto no fundo verde neon do hacker
    if (bgColor === 'var(--primary)') return 'var(--text-on-primary)';
    if (bgColor === 'var(--accent)') return 'var(--text-on-accent)';
    
    // Fallback inteligente para secondary ou cores customizadas.
    // Usar um branco ou preto inteligente baseado no brilho percebido do tema global
    return (theme?.id === 'siamese' || theme?.id === 'glass-elite' || theme?.id === 'luminous-interface') ? '#FFFFFF' : '#000000';
  };

  const activeColor = getSectionColor();
  const iconContrast = getIconContrastColor(activeColor);

  return (
    <div className={`mimi-card p-10 space-y-8 relative overflow-hidden group transition-all duration-500
      ${isHackerMode ? 'border-green-500/30 bg-black/40' : ''}
      ${cardStyle === 'neubrutalist' || cardStyle === 'outlined' ? 'border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]' : ''}
    `}>
      {/* Ícone de Fundo Gigante com gradiente responsivo */}
      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
        <MagicIcon 
          icon={Icon}
          size={120} 
          color={activeColor}
          glow={isHackerMode || cardStyle === 'glass'}
          strokeWidth={1}
          variant="gradient" // Forçar gradiente aqui para profundidade
        />
      </div>

      <div className="flex items-center gap-4 relative z-10">
        <div 
          className="p-4 rounded-3xl shadow-lg transition-transform group-hover:scale-110 magic-section-icon flex items-center justify-center" 
          style={{ 
            backgroundColor: activeColor,
            boxShadow: isHackerMode ? '0 0 20px rgba(0, 255, 65, 0.4)' : (cardStyle === 'neubrutalist' || cardStyle === 'outlined' ? '4px 4px 0px black' : 'var(--ui-shadow)'),
            border: cardStyle === 'neubrutalist' || cardStyle === 'outlined' ? '3px solid black' : 'none',
            borderRadius: cardStyle === 'neubrutalist' || cardStyle === 'outlined' ? '0px' : (theme?.tokens.layout.componentShape === 'pill' ? '9999px' : 'var(--ui-component-radius)')
          }}
        >
          <MagicIcon 
            icon={Icon} 
            size={24} 
            strokeWidth={3} 
            color={iconContrast} 
            variant={isHackerMode ? 'default' : 'duotone'} 
          />
        </div>
        <h3 className="font-hand text-4xl text-[var(--text-primary)]">
          {isHackerMode ? <DecryptText text={title.toUpperCase().replace(/\s/g, '_')} /> : title}
        </h3>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const SidebarTab = ({ active, onClick, icon: Icon, label, isAdmin }: any) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center justify-center gap-2 w-16 h-16 md:w-20 md:h-20 transition-all relative group magic-section-icon
      ${active 
        ? (isAdmin ? 'bg-slate-900 text-white shadow-xl scale-105' : 'btn-dynamic text-[var(--text-on-primary)] scale-110 shadow-lg') 
        : (isAdmin ? 'text-slate-400 hover:bg-slate-100 hover:text-slate-600' : 'bg-[var(--surface-elevated)]/30 text-[var(--text-primary)] hover:opacity-100 hover:bg-[var(--surface-elevated)] border-[var(--ui-border-width)] border-transparent')
      }`}
    style={{ 
      borderRadius: 'var(--ui-component-radius)',
      borderWidth: 'var(--ui-border-width)',
      borderColor: active ? 'var(--border-color)' : 'transparent',
      color: active ? 'var(--text-on-primary)' : 'var(--text-primary)'
    }}
  >
    <MagicIcon 
      icon={Icon} 
      size={24} 
      className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-6'}`} 
      variant={active ? 'gradient' : 'duotone'}
      glow={active}
    />
    <span className={`text-[8px] md:text-[9px] font-black uppercase text-center tracking-tight ${active ? 'opacity-100' : 'opacity-80'}`}>{label}</span>
    
    {active && !isAdmin && (
      <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--primary)] rounded-full hidden md:block" />
    )}
  </button>
);

const Switch = ({ active, onToggle }: any) => (
  <button 
    onClick={onToggle} 
    className={`w-12 h-7 md:w-14 md:h-8 relative transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] border-2
      ${active ? 'bg-[var(--primary)] border-[var(--border-color)]' : 'bg-[var(--surface-elevated)] border-[var(--border-color)]'}`}
    style={{ 
      borderRadius: 'var(--ui-component-radius)',
      boxShadow: 'var(--ui-shadow)',
      isolation: 'isolate' 
    }}
  >
    <div 
      className={`absolute top-1 w-5 h-5 md:w-6 md:h-6 transition-all duration-500 border-[var(--ui-border-width)] border-[var(--border-color)] z-10
        ${active ? 'left-6 md:left-7 bg-[var(--text-on-primary)]' : 'left-1 bg-[var(--text-muted)]'}`} 
      style={{ 
        borderRadius: 'var(--ui-component-radius)', 
        filter: 'brightness(1.1)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
      }}
    />
  </button>
);