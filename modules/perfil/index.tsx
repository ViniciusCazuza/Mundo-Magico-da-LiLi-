
import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  User, Sparkles, ShieldCheck, Heart, Settings, Lock, 
  BrainCircuit, Activity, Volume2, ChevronRight, Star, 
  Palette, Pizza, Camera, Upload, Smile, Glasses, Scissors, 
  Users, Plus, Trash2, CheckCircle2, Home, Key, LogOut, Info, BookOpen, Brain,
  Music, MapPin, Sun, Moon, Zap, Briefcase, Award, GraduationCap, CloudRain,
  Eye, Droplet, Ghost, MessageSquare, VolumeX, ShieldAlert, Sliders, Ear,
  Target, Bell, Shield
} from "lucide-react"; 
import { PerfilState, MimiTemperament, LanguageComplexity } from "./types";
import { perfilStorage } from "./services/perfilStorage";
import { mimiEvents } from "../../core/events";
import { resizeImage } from "../../core/utils";
import { IdentityManager } from "../../core/ecosystem/IdentityManager";
import { AliceProfile, ECOSYSTEM_EVENTS, FamilyContext } from "../../core/ecosystem/types";

// Internal Components
import { ThemeCustomizer } from "./components/ThemeCustomizer";
import { KnowledgeTrainer } from "./components/KnowledgeTrainer";

type AppTab = 'profiles' | 'child' | 'mimi' | 'app' | 'family' | 'security';

export const PerfilModule: React.FC<{ onOpenParentZone: () => void }> = ({ onOpenParentZone }) => {
  const activeProfile = IdentityManager.getActiveProfile();
  const isAdmin = activeProfile?.role === "parent_admin";
  
  const [state, setState] = useState<PerfilState>(() => perfilStorage.getInitialState());
  const [activeTab, setActiveTab] = useState<AppTab>(isAdmin ? 'profiles' : 'child');
  const [ecosystemProfiles, setEcosystemProfiles] = useState<AliceProfile[]>(() => IdentityManager.getProfiles());
  const [familyContext, setFamilyContext] = useState<FamilyContext>(() => IdentityManager.getFamilyContext());
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!activeProfile) return null;

  useEffect(() => {
    perfilStorage.saveState(state);
    mimiEvents.dispatch("PROFILE_UPDATED", state);
  }, [state]);

  const updateChildState = useCallback((child: Partial<PerfilState['child']>) => {
    setState(prev => ({ ...prev, child: { ...prev.child, ...child } }));
    IdentityManager.updateProfile(activeProfile.id, { ...child, age: child.age?.toString() });
  }, [activeProfile.id]);

  const updateMimiState = useCallback((mimi: Partial<PerfilState['mimi']>) => {
    setState(prev => ({ ...prev, mimi: { ...prev.mimi, ...mimi } }));
  }, []);

  const updateAppState = useCallback((app: Partial<PerfilState['app']>) => {
    setState(prev => ({ ...prev, app: { ...prev.app, ...app } }));
    if (app.autoVoiceEnabled !== undefined) {
      IdentityManager.updateProfile(activeProfile.id, { autoAudio: app.autoVoiceEnabled });
    }
  }, [activeProfile.id]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const smallBase64 = await resizeImage(base64, 400, 400);
        updateChildState({ profileImage: { data: smallBase64, mimeType: 'image/jpeg', version: "1.1", updatedAt: Date.now() } });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden animate-fade-in ${isAdmin ? 'bg-slate-50' : 'bg-transparent'}`}>
      <nav className={`w-full md:w-28 py-6 px-4 flex md:flex-col items-center gap-6 shrink-0 md:border-r overflow-x-auto no-scrollbar ${isAdmin ? 'bg-white border-slate-200' : 'border-[var(--border-color)]'}`}>
        <SidebarTab active={activeTab === 'profiles'} onClick={() => setActiveTab('profiles')} icon={Users} label="Gestão" isAdmin={isAdmin} />
        {activeProfile.role === 'child' && <SidebarTab active={activeTab === 'child'} onClick={() => setActiveTab('child')} icon={User} label="Sobre Mim" isAdmin={isAdmin} />}
        <SidebarTab active={activeTab === 'mimi'} onClick={() => setActiveTab('mimi')} icon={BrainCircuit} label="Mimi" isAdmin={isAdmin} />
        {!isAdmin && <SidebarTab active={activeTab === 'app'} onClick={() => setActiveTab('app')} icon={Palette} label="Tema" isAdmin={isAdmin} />}
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
            <AboutMeView state={state.child} updateChild={updateChildState} fileRef={fileInputRef} handlePhoto={handlePhotoUpload} />
          )}
          {activeTab === 'mimi' && (
            isAdmin 
              ? <ParentMimiTraining mimi={state.mimi} updateMimi={updateMimiState} />
              : <ChildMimiSettings app={state.app} updateApp={updateAppState} child={state.child} updateChild={updateChildState} />
          )}
          {activeTab === 'app' && !isAdmin && (
            <section className="space-y-12 animate-fade-in">
              <header><h2 className="font-hand text-6xl text-[var(--primary)]">Mudar meu Mundo</h2></header>
              <ThemeCustomizer currentTheme={state.app.theme} onUpdateTheme={theme => updateAppState({ theme })} />
            </section>
          )}
          {activeTab === 'family' && isAdmin && (
            <FamilyContextSettings family={familyContext} updateFamily={ctx => { setFamilyContext(prev => ({...prev, ...ctx})); IdentityManager.updateFamilyContext(ctx); }} />
          )}
          {activeTab === 'security' && isAdmin && <SecuritySettings />}
        </div>
      </main>
    </div>
  );
};

const ProfilesManagement = ({ activeProfile, isAdmin, profiles }: { activeProfile: AliceProfile, isAdmin: boolean, profiles: AliceProfile[] }) => (
  <section className="space-y-12 animate-fade-in">
    <header>
      <h2 className="font-hand text-6xl text-slate-800">Gestão de Perfis</h2>
      <p className="text-sm text-slate-500 font-medium">Visualize e gerencie quem acessa o ecossistema.</p>
    </header>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {profiles.map(p => (
        <div key={p.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200 flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center text-indigo-500 font-black text-xl">
              {p.profileImage?.data ? <img src={p.profileImage.data} className="w-full h-full object-cover" /> : p.nickname[0]}
            </div>
            <div><h4 className="font-bold text-slate-800">{p.nickname}</h4><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{p.role === 'child' ? 'Criança' : 'Administrador'}</p></div>
          </div>
          {isAdmin && p.id !== activeProfile.id && (
            <button onClick={() => { if(confirm(`Excluir perfil ${p.nickname}?`)) IdentityManager.deleteProfile(p.id); }} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={20} /></button>
          )}
        </div>
      ))}
      {isAdmin && (
         <button onClick={() => { const name = prompt("Nome do novo perfil?"); if(name) IdentityManager.addProfile(name); }} className="border-4 border-dashed border-slate-200 rounded-[2.5rem] p-6 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-indigo-500 hover:border-indigo-200 transition-all"><Plus size={32} /><span className="text-[10px] font-black uppercase tracking-widest">Novo Perfil</span></button>
      )}
    </div>
  </section>
);

const ChildMimiSettings = ({ app, updateApp }: any) => (
  <section className="space-y-12 animate-fade-in">
    <header><h2 className="font-hand text-6xl text-[var(--primary)]">Minha Gatinha Mimi</h2><p className="text-[var(--text-muted)] font-medium">Como você quer que a Mimi se comporte hoje?</p></header>
    <div className="mimi-card p-10 space-y-10">
      <div className="space-y-6">
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="p-4 bg-[var(--primary)] text-[var(--text-on-primary)] rounded-3xl shadow-lg">{app.autoVoiceEnabled ? <Volume2 /> : <VolumeX />}</div>
             <div><h4 className="font-bold">Mimi pode falar?</h4><p className="text-xs opacity-60">Ativar voz automática da Mimi.</p></div>
           </div>
           <Switch active={app.autoVoiceEnabled} onToggle={() => updateApp({ autoVoiceEnabled: !app.autoVoiceEnabled })} />
         </div>
         {app.autoVoiceEnabled && (
           <div className="space-y-4 animate-fade-in">
             <div className="flex justify-between items-center text-[10px] font-black uppercase text-[var(--text-muted)] ml-2"><span>Volume do Miado</span><span>{Math.round(app.voiceVolume * 100)}%</span></div>
             <input type="range" min="0" max="1" step="0.1" value={app.voiceVolume} onChange={e => updateApp({ voiceVolume: parseFloat(e.target.value) })} className="w-full accent-[var(--primary)] h-2 rounded-full" />
           </div>
         )}
      </div>
    </div>
  </section>
);

const ParentMimiTraining = ({ mimi, updateMimi }: any) => (
  <section className="space-y-12 animate-fade-in">
    <header><h2 className="font-hand text-6xl text-slate-800">Treinamento da Mimi</h2></header>
    <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-200 space-y-8">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <TrainingRange label="Intensidade de Empatia" value={mimi.empathyIntensity} onChange={(val: number) => updateMimi({ empathyIntensity: val })} />
          <TrainingRange label="Sensibilidade Emocional" value={mimi.emotionalSensitivity} onChange={(val: number) => updateMimi({ emotionalSensitivity: val })} />
       </div>
    </div>
    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200 space-y-6"><h3 className="text-lg font-black text-slate-800 flex items-center gap-3"><Brain className="text-indigo-500" /> Memória de Valores e Segredos</h3><KnowledgeTrainer knowledge={mimi.additionalKnowledge} onChange={(val: any) => updateMimi({ additionalKnowledge: val })} /></div>
  </section>
);

const TrainingRange = ({ label, value, onChange }: any) => (
  <div className="space-y-3">
     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400"><span>{label}</span><span>{value}/5</span></div>
     <input type="range" min="1" max="5" value={value} onChange={e => onChange(parseInt(e.target.value))} className="w-full h-1.5 rounded-full accent-indigo-500" />
  </div>
);

const AboutMeView = ({ state, updateChild, fileRef, handlePhoto }: any) => (
  <section className="space-y-12 animate-fade-in">
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div><h2 className="font-hand text-7xl text-[var(--primary)]">Meu Diário Mágico</h2></div>
      <div onClick={() => fileRef.current?.click()} className="w-40 h-40 rounded-[3rem] bg-[var(--surface-elevated)] border-8 border-white shadow-2xl cursor-pointer hover:scale-105 transition-all overflow-hidden relative group shrink-0">
        {state.profileImage?.data ? <img src={state.profileImage.data} className="w-full h-full object-cover" /> : <div className="w-full h-full flex flex-col items-center justify-center text-[var(--primary)] gap-2"><Camera size={32}/><span className="text-[10px] font-black uppercase">Foto</span></div>}
        <input type="file" ref={fileRef} onChange={handlePhoto} className="hidden" accept="image/*" />
      </div>
    </header>
    <MagicSection icon={User} title="Minha Identidade" color="var(--primary)"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><InputGroup label="Meu Nome Completo" value={state.name} onChange={(val: string) => updateChild({ name: val })} /><InputGroup label="Apelido Favorito" value={state.nickname} onChange={(val: string) => updateChild({ nickname: val })} /></div></MagicSection>
  </section>
);

const SecuritySettings = () => (
  <section className="space-y-8 animate-fade-in text-center">
    <header><h2 className="font-hand text-5xl text-slate-800">Segurança do Painel</h2></header>
    <div className="bg-white p-16 rounded-[4rem] shadow-sm border border-slate-200 inline-block w-full">
       <div className="p-8 bg-slate-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8"><Key size={48} className="text-slate-400"/></div>
       <button onClick={() => { const p = prompt("Novo PIN?"); if(p && p.length === 4) IdentityManager.setPin(p); }} className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase shadow-2xl hover:bg-black transition-all">Alterar PIN de Acesso</button>
    </div>
  </section>
);

const FamilyContextSettings = ({ family, updateFamily }: any) => (
  <section className="space-y-8 animate-fade-in"><header><h2 className="font-hand text-5xl text-slate-800">Coração da Família</h2></header><div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8"><InputGroup label="Mãe" value={family.motherName || ""} onChange={(val: string) => updateFamily({ motherName: val })} /><InputGroup label="Pai" value={family.fatherName || ""} onChange={(val: string) => updateFamily({ fatherName: val })} /></div></section>
);

const MagicSection = ({ icon: Icon, title, color, children }: any) => (
  <div className="mimi-card p-10 space-y-8 relative overflow-hidden group"><div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Icon size={120} style={{ color }} /></div><div className="flex items-center gap-4 relative z-10"><div className="p-4 rounded-3xl shadow-lg text-white" style={{ backgroundColor: color }}><Icon size={24} /></div><h3 className="font-hand text-4xl" style={{ color }}>{title}</h3></div><div className="relative z-10">{children}</div></div>
);

const SidebarTab = ({ active, onClick, icon: Icon, label, isAdmin }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center gap-2 w-20 h-20 rounded-3xl transition-all relative ${active ? (isAdmin ? 'bg-slate-900 text-white scale-110 shadow-xl' : 'text-[var(--primary)] bg-[var(--surface-elevated)] scale-110 shadow-lg') : (isAdmin ? 'text-slate-400 hover:text-slate-600' : 'text-[var(--text-muted)] opacity-40 hover:opacity-100')}`}><Icon size={24} /><span className="text-[9px] font-black uppercase tracking-tight text-center">{label}</span></button>
);

const InputGroup = ({ label, value, onChange }: any) => (
  <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">{label}</label><input value={value} onChange={e => onChange(e.target.value)} className="mimi-input w-full h-14" /></div>
);

const Switch = ({ active, onToggle }: { active: boolean, onToggle: () => void }) => (
  <button onClick={onToggle} className={`w-14 h-8 rounded-full relative transition-colors ${active ? 'bg-[var(--primary)] shadow-md' : 'bg-slate-200'}`}><div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${active ? 'left-7' : 'left-1'}`} /></button>
);
