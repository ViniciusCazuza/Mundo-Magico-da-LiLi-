
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
import { PerfilState, MimiTemperament, LanguageComplexity, ProtocolGovernance } from "./types";
import { perfilStorage } from "./services/perfilStorage";
import { mimiEvents } from "../../core/events";
import { resizeImage } from "../../core/utils";
import { IdentityManager } from "../../core/ecosystem/IdentityManager";
import { AliceProfile, ECOSYSTEM_EVENTS, FamilyContext } from "../../core/ecosystem/types";

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
  const customBackgroundInputRef = useRef<HTMLInputElement>(null); // Generic ref for custom background

  // Removed early return here to fix Hook Rule violation
  // if (!activeProfile) return null;

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
    if (file && state.app.theme.id) { // Ensure theme ID is available
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

  if (!activeProfile) return null;

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

              <div className="mimi-card p-10 space-y-6">
                <h3 className="text-lg font-black text-[var(--text-primary)]">Fundo Personalizado do Tema Atual ({state.app.theme.name})</h3>
                <p className="text-sm text-[var(--text-muted)]">Envie uma imagem para usar como fundo exclusivo para o tema <span className="font-bold">{state.app.theme.name}</span>.</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => customBackgroundInputRef.current?.click()}
                    className="px-6 py-3 bg-[var(--primary)] text-[var(--text-on-primary)] rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <Upload size={20} /> Escolher Imagem
                  </button>
                  {state.app.customBackgroundByThemeId?.[state.app.theme.id] && (
                    <button
                      onClick={() => updateAppState({ customBackgroundByThemeId: { ...state.app.customBackgroundByThemeId, [state.app.theme.id]: undefined } })}
                      className="px-6 py-3 bg-red-500/10 text-red-500 rounded-full flex items-center gap-2 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <Trash2 size={20} /> Remover
                    </button>
                  )}
                </div>
                <input type="file" ref={customBackgroundInputRef} onChange={handleCustomBackgroundUpload} className="hidden" accept="image/*" />
                {state.app.customBackgroundByThemeId?.[state.app.theme.id] && (
                  <div className="mt-6">
                    <h4 className="text-sm font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Pré-visualização:</h4>
                    <img src={state.app.customBackgroundByThemeId[state.app.theme.id]} alt="Fundo Personalizado" className="w-full h-48 object-cover rounded-xl shadow-lg border border-[var(--border-color)]" />
                  </div>
                )}
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

const ProfilesManagement = ({ activeProfile, isAdmin, profiles }: { activeProfile: AliceProfile, isAdmin: boolean, profiles: AliceProfile[] }) => (
  <section className="space-y-12 animate-fade-in">
    <header>
      <h2 className="font-hand text-6xl text-[var(--text-primary)]">Gestão de Perfis</h2>
      <p className="text-sm text-[var(--text-secondary)] font-medium">Visualize e gerencie quem acessa o ecossistema.</p>
    </header>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {profiles.map(p => (
        <div key={p.id} className="bg-[var(--surface)] p-6 rounded-[2.5rem] shadow-sm border border-[var(--border-color)] flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-[var(--surface-elevated)] overflow-hidden flex items-center justify-center text-[var(--primary)] font-black text-xl">
                        {p.profileImage?.data ? <img src={p.profileImage.data} className="w-full h-full object-cover" /> : p.nickname[0]}
                      </div>            <div>
              <h4 className="font-bold text-[var(--text-primary)]">{p.nickname}</h4>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{p.role === 'child' ? 'Criança' : 'Administrador'}</p>
            </div>
          </div>
          {isAdmin && p.id !== activeProfile.id && (
            <button
              onClick={() => { if (confirm(`Excluir perfil ${p.nickname}?`)) IdentityManager.deleteProfile(p.id); }}
              className="p-3 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
      ))}
      {isAdmin && (
        <button
          onClick={() => {
            const name = prompt("Nome do novo perfil?");
            if (name) IdentityManager.addProfile(name);
          }}
          className="border-4 border-dashed border-[var(--border-color)] rounded-[2.5rem] p-6 flex flex-col items-center justify-center gap-2 text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/20 transition-all"
        >
          <Plus size={32} />
          <span className="text-[10px] font-black uppercase tracking-widest">Novo Perfil</span>
        </button>
      )}
    </div>
  </section>
);

const ChildMimiSettings = ({ app, updateApp, child, updateChild }: any) => (
  <section className="space-y-12 animate-fade-in">
    <header>
      <h2 className="font-hand text-6xl text-[var(--primary)]">Minha Gatinha Mimi</h2>
      <p className="text-[var(--text-muted)] font-medium">Como você quer que a Mimi se comporte hoje?</p>
    </header>

    <div className="mimi-card p-10 space-y-10">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-[var(--primary)] text-[var(--text-on-primary)] rounded-3xl shadow-lg">
              {app.autoVoiceEnabled ? <Volume2 /> : <VolumeX />}
            </div>
            <div><h4 className="font-bold">Mimi pode falar?</h4><p className="text-xs opacity-60">Ativar voz automática da Mimi.</p></div>
          </div>
          <Switch active={app.autoVoiceEnabled} onToggle={() => updateApp({ autoVoiceEnabled: !app.autoVoiceEnabled })} />
        </div>

        {app.autoVoiceEnabled && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center text-[10px] font-black uppercase text-[var(--text-muted)] ml-2">
              <span>Volume do Miado</span>
              <span>{Math.round(app.voiceVolume * 100)}%</span>
            </div>
            <input type="range" min="0" max="1" step="0.1" value={app.voiceVolume} onChange={e => updateApp({ voiceVolume: parseFloat(e.target.value) })} className="w-full accent-[var(--primary)] h-2 rounded-full" />
          </div>
        )}
      </div>
      <div className="h-px bg-[var(--border-color)] opacity-50" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-2 flex items-center gap-2"><Ear size={14} /> Como ela me chama?</label>
          <div className="flex bg-[var(--bg-app)]/50 p-1.5 rounded-2xl border border-[var(--border-color)]">
            <button onClick={() => updateApp({ callAliceBy: 'name' })} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${app.callAliceBy === 'name' ? 'bg-[var(--primary)] text-white shadow-md' : 'text-[var(--text-muted)] hover:bg-black/5'}`}>Nome</button>
            <button onClick={() => updateApp({ callAliceBy: 'nickname' })} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${app.callAliceBy === 'nickname' ? 'bg-[var(--primary)] text-white shadow-md' : 'text-[var(--text-muted)] hover:bg-black/5'}`}>Apelido</button>
          </div>
        </div>
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-2 flex items-center gap-2"><Sparkles size={14} /> Intensidade Mágica</label>
          <div className="flex bg-[var(--bg-app)]/50 p-1.5 rounded-2xl border border-[var(--border-color)]">
            <button onClick={() => updateApp({ animationIntensity: 'low' })} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${app.animationIntensity === 'low' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-muted)] opacity-40'}`}>Leve</button>
            <button onClick={() => updateApp({ animationIntensity: 'medium' })} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${app.animationIntensity === 'medium' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-muted)] opacity-40'}`}>Média</button>
            <button onClick={() => updateApp({ animationIntensity: 'magical' })} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${app.animationIntensity === 'magical' ? 'bg-[var(--primary)] text-white shadow-lg' : 'text-[var(--text-muted)] opacity-40'}`}>Mágica!</button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ParentMimiTraining = ({ mimi, updateMimi }: any) => (
  <section className="space-y-12 animate-fade-in">
    <header>
      <h2 className="font-hand text-6xl text-slate-800">Treinamento da Mimi</h2>
      <p className="text-sm text-slate-500 font-medium">Ajuste o temperamento e a inteligência da gatinha digital.</p>
    </header>
    <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-200 space-y-8">
      <h3 className="text-lg font-black text-slate-800 flex items-center gap-3"><Sliders className="text-indigo-500" /> Temperamento Afetivo</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {(['affectionate', 'playful', 'calm', 'protective', 'balanced'] as MimiTemperament[]).map(t => (
          <button key={t} onClick={() => updateMimi({ preferredTone: t })} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${mimi.preferredTone === t ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-transparent bg-slate-50 opacity-60 hover:opacity-100'}`}>
            <span className="text-[9px] font-black uppercase tracking-tight">{t === 'affectionate' ? 'Carinhosa' : t === 'playful' ? 'Brincalhona' : t === 'calm' ? 'Calma' : t === 'protective' ? 'Protetora' : 'Equilibrada'}</span>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        <TrainingRange label="Intensidade de Empatia" value={mimi.empathyIntensity} onChange={(val: number) => updateMimi({ empathyIntensity: val })} />
        <TrainingRange label="Frequência de Elogios" value={mimi.praiseFrequency} onChange={(val: number) => updateMimi({ praiseFrequency: val })} />
        <TrainingRange label="Sensibilidade Emocional" value={mimi.emotionalSensitivity} onChange={(val: number) => updateMimi({ emotionalSensitivity: val })} />
        <TrainingRange label="Monitoramento de Risco" value={mimi.riskMonitoringSensitivity} onChange={(val: number) => updateMimi({ riskMonitoringSensitivity: val })} color="#EF4444" />
      </div>
    </div>

    <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-200 space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-slate-800 flex items-center gap-3"><Shield className="text-emerald-500" /> Governança de Protocolos</h3>
        <Switch
          active={mimi.protocolGovernance.enabled}
          onToggle={() => updateMimi({
            protocolGovernance: { ...mimi.protocolGovernance, enabled: !mimi.protocolGovernance.enabled }
          })}
        />
      </div>
      <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
        Configure como a Mimi monitora a segurança emocional da criança e gera relatórios de protocolo.
        Esta camada é persistente e independente das conversas voláteis.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 flex items-center gap-2"><Target size={14} /> Sensibilidade de Detecção</label>
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            {[1, 2, 3, 4, 5].map(lv => (
              <button
                key={lv}
                onClick={() => updateMimi({ protocolGovernance: { ...mimi.protocolGovernance, sensitivityLevel: lv } })}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${mimi.protocolGovernance.sensitivityLevel === lv ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 opacity-60'}`}
              >
                {lv}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 flex items-center gap-2"><Bell size={14} /> Estratégia de Notificação</label>
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            {(['immediate', 'daily_summary', 'critical_only'] as const).map(st => (
              <button
                key={st}
                onClick={() => updateMimi({ protocolGovernance: { ...mimi.protocolGovernance, notificationStrategy: st } })}
                className={`flex-1 py-3 rounded-xl text-[8px] font-black uppercase transition-all ${mimi.protocolGovernance.notificationStrategy === st ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 opacity-60'}`}
              >
                {st === 'immediate' ? 'Imediato' : st === 'daily_summary' ? 'Diário' : 'Crítico'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Categorias Monitoradas</label>
        <div className="flex flex-wrap gap-2">
          {['emoção', 'segurança', 'linguagem', 'saúde', 'amigos', 'família'].map(cat => {
            const isActive = mimi.protocolGovernance.monitoredCategories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => {
                  const next = isActive
                    ? mimi.protocolGovernance.monitoredCategories.filter((c: string) => c !== cat)
                    : [...mimi.protocolGovernance.monitoredCategories, cat];
                  updateMimi({ protocolGovernance: { ...mimi.protocolGovernance, monitoredCategories: next } });
                }}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all border-2 ${isActive ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-transparent text-slate-400 opacity-60'}`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200 space-y-6">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><BookOpen size={16} /> Nível de Linguagem</h3>
        <div className="flex bg-slate-50 p-1.5 rounded-2xl">
          {(['simple', 'intermediate', 'rich'] as LanguageComplexity[]).map(l => (
            <button key={l} onClick={() => updateMimi({ languageComplexity: l })} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${mimi.languageComplexity === l ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 opacity-60'}`}>{l === 'simple' ? 'Simples' : l === 'intermediate' ? 'Média' : 'Rica'}</button>
          ))}
        </div>
      </div>
      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200 space-y-4">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><Smile size={16} /> Frases Incentivadas</h3>
        <KnowledgeTrainer knowledge={mimi.encouragedPhrases} onChange={(val: any) => updateMimi({ encouragedPhrases: val })} />
      </div>
    </div>
    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200 space-y-6">
      <h3 className="text-lg font-black text-slate-800 flex items-center gap-3"><Brain className="text-indigo-500" /> Memória de Valores e Segredos</h3>
      <p className="text-xs text-slate-500">Adicione fatos que a Mimi deve usar para criar conexões reais com a criança.</p>
      <KnowledgeTrainer knowledge={mimi.additionalKnowledge} onChange={(val: any) => updateMimi({ additionalKnowledge: val })} />
    </div>
  </section>
);

const AboutMeView = ({ state, updateChild, fileRef, handlePhoto }: any) => (
  <section className="space-y-12 animate-fade-in">
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div><h2 className="font-hand text-7xl text-[var(--primary)]">Meu Diário Mágico</h2><p className="text-[var(--text-muted)] font-medium text-lg">Conte seu segredos para a Mimi conhecer você!</p></div>
      <div onClick={() => fileRef.current?.click()} className="w-32 h-32 md:w-40 md:h-40 rounded-[3rem] bg-[var(--surface-elevated)] border-8 border-white shadow-2xl cursor-pointer hover:scale-105 transition-all overflow-hidden relative group shrink-0">
        {state.profileImage?.data ? <img src={state.profileImage.data} className="w-full h-full object-cover" /> : <div className="w-full h-full flex flex-col items-center justify-center text-[var(--primary)] gap-2"><Camera size={32} /><span className="text-[10px] font-black uppercase">Foto</span></div>}
        <input type="file" ref={fileRef} onChange={handlePhoto} className="hidden" accept="image/*" />
      </div>
    </header>
    <MagicSection icon={User} title="Minha Identidade" color="var(--primary)">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ModernInput label="Meu Nome Completo" value={state.name} onChange={(val: string) => updateChild({ name: val })} />
        <ModernInput label="Apelido Favorito" value={state.nickname} onChange={(val: string) => updateChild({ nickname: val })} />
        <ModernInput label="Quantos Anos Eu Tenho?" type="number" value={state.age.toString()} onChange={(val: string) => updateChild({ age: parseInt(val) || 0 })} />
        <ModernInput label="O Que Significa Meu Nome?" value={state.nameMeaning || ""} onChange={(val: string) => updateChild({ nameMeaning: val })} />
        <ModernInput label="Como Quero Ser Chamada Hoje?" value={state.calledHow || ""} onChange={(val: string) => updateChild({ calledHow: val })} />
                  <ModernInput
                    label="Meu Aniversário"
                    value={state.birthday}
                    onChange={(val: string) => updateChild({ birthday: val })}
                    mask="99/99/9999"
                  />      </div>
    </MagicSection>
    <MagicSection icon={Heart} title="Meus Gostos Favoritos" color="#F472B6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <ModernInput label="Personagem Favorito" value={state.favoriteCharacter || ""} onChange={(val: string) => updateChild({ favoriteCharacter: val })} />
        <ModernInput label="Desenho ou Filme" value={state.favoriteDrawing || ""} onChange={(val: string) => updateChild({ favoriteDrawing: val })} />
        <ModernInput label="Música que eu Amo" value={state.favoriteMusic || ""} onChange={(val: string) => updateChild({ favoriteMusic: val })} />
        <ModernInput label="Lugar mais Legal" value={state.favoritePlace || ""} onChange={(val: string) => updateChild({ favoritePlace: val })} />
        <ModernInput label="Minha Brincadeira" value={state.favoritePlay || ""} onChange={(val: string) => updateChild({ favoritePlay: val })} />
        <ModernInput label="Estação do Ano" value={state.favoriteSeason || ""} onChange={(val: string) => updateChild({ favoriteSeason: val })} />
        <ModernInput label="Cor do Coração" value={state.favoriteColor} onChange={(val: string) => updateChild({ favoriteColor: val })} />
        <ModernInput label="Animal Amigo" value={state.favoriteAnimal} onChange={(val: string) => updateChild({ favoriteAnimal: val })} />
        <ModernInput label="Emoji do Dia" value={state.favoriteEmoji} onChange={(val: string) => updateChild({ favoriteEmoji: val })} />
      </div>
    </MagicSection>
    <MagicSection icon={Sparkles} title="Sonhos & Imaginação" color="#C084FC">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ModernInput label="Meu Maior Sonho" value={state.biggestDream || ""} onChange={(val: string) => updateChild({ biggestDream: val })} />
        <ModernInput label="Meu Superpoder" value={state.dreamPower} onChange={(val: string) => updateChild({ dreamPower: val })} />
        <ModernInput label="O que quero ser?" value={state.dreamJob} onChange={(val: string) => updateChild({ dreamJob: val })} />
        <ModernInput label="Um lugar imaginário" value={state.dreamPlace} onChange={(val: string) => updateChild({ dreamPlace: val })} />
        <div className="md:col-span-2">
          <ModernInput
            label="O que me deixa radiante?"
            value={state.happyWhen}
            onChange={(val: string) => updateChild({ happyWhen: val })}
            multiline
            rows={4}
            placeholder="Ex: Ganhar um abraço da vovó..."
          />
        </div>
      </div>
    </MagicSection>
    <MagicSection icon={Award} title="Meu Brilho Pessoal" color="#FB923C">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ModernInput label="Eu sou muito boa em..." value={state.goodAt || ""} onChange={(val: string) => updateChild({ goodAt: val })} />
        <ModernInput label="Estou aprendendo agora..." value={state.learningNow || ""} onChange={(val: string) => updateChild({ learningNow: val })} />
        <ModernInput label="O que me dá orgulho?" value={state.proudOf || ""} onChange={(val: string) => updateChild({ proudOf: val })} />
        <ModernInput label="Com meus amigos eu sou..." value={state.howIAmWithFriends || ""} onChange={(val: string) => updateChild({ howIAmWithFriends: val })} />
      </div>
    </MagicSection>
    <MagicSection icon={Scissors} title="Como Eu Sou" color="#94A3B8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <ModernInput label="Tipo de Cabelo" value={state.hairType} onChange={(val: string) => updateChild({ hairType: val })} />
        <ModernInput label="Cor do Cabelo" value={state.hairColor} onChange={(val: string) => updateChild({ hairColor: val })} />
        <ModernInput label="Cor dos Olhos" value={state.eyeColor || ""} onChange={(val: string) => updateChild({ eyeColor: val })} />
        <ModernInput label="Tom de Pele" value={state.skinTone || ""} onChange={(val: string) => updateChild({ skinTone: val })} />
        <div className="flex items-center gap-3 bg-[var(--surface-elevated)] p-4 rounded-2xl"><span className="text-[10px] font-black uppercase opacity-40">Óculos?</span><Switch active={state.hasGlasses} onToggle={() => updateChild({ hasGlasses: !state.hasGlasses })} /></div>
        <div className="flex items-center gap-3 bg-[var(--surface-elevated)] p-4 rounded-2xl"><span className="text-[10px] font-black uppercase opacity-40">Aparelho?</span><Switch active={state.hasBraces} onToggle={() => updateChild({ hasBraces: !state.hasBraces })} /></div>
      </div>
    </MagicSection>
    <MagicSection icon={Smile} title="Meu Jeitinho Especial" color="#10B981">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ModernInput label="O que me acalma?" value={state.calmsMe || ""} onChange={(val: string) => updateChild({ calmsMe: val })} />
        <ModernInput label="O que me anima?" value={state.cheersMeUp || ""} onChange={(val: string) => updateChild({ cheersMeUp: val })} />
        <ModernInput label="Gosto quando falam assim..." value={state.likesBeingSpokenToHow || ""} onChange={(val: string) => updateChild({ likesBeingSpokenToHow: val })} />
        <ModernInput label="Eu não gosto quando..." value={state.dislikesWhen || ""} onChange={(val: string) => updateChild({ dislikesWhen: val })} />
        <div><ModernInput label="Quando fico triste, eu gosto de..." value={state.whenSadILike} onChange={(val: string) => updateChild({ whenSadILike: val })} multiline rows={4} /></div>
        <div><ModernInput label="Meu momento favorito do dia" value={state.bestMomentOfDay} onChange={(val: string) => updateChild({ bestMomentOfDay: val })} multiline rows={4} /></div>
      </div>
    </MagicSection>
  </section>
);

const FamilyContextSettings = ({ family, updateFamily }: any) => (
  <section className="space-y-8 animate-fade-in">
    <header><h2 className="font-hand text-5xl text-slate-800">Coração da Família</h2></header>
    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8">
      <ModernInput label="Mãe" value={family.motherName || ""} onChange={(val: string) => updateFamily({ motherName: val })} />
      <ModernInput label="Pai" value={family.fatherName || ""} onChange={(val: string) => updateFamily({ fatherName: val })} />
    </div>
  </section>
);

const SecuritySettings: React.FC<{ activeProfile: AliceProfile }> = ({ activeProfile }) => {
  const [pinInput, setPinInput] = useState("");
  const [confirmPinInput, setConfirmPinInput] = useState("");
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' | 'info' } | null>(null);
  const [currentPinStatus, setCurrentPinStatus] = useState<'not_set' | 'set' | 'unknown'>('unknown');

  useEffect(() => {
    // Determine if a PIN is currently set (IdentityManager.ensureInstance().parentPinHash should be used for this, but direct access is private)
    // A simpler way for the UI is to assume if IdentityManager.init() was called, parentPinHash is not null if a PIN is set.
    // Given the IdentityManager.ts structure, we can check for the existence of parentPinHash after init.
    // For now, we will rely on the message.
    // If the user logs in without a PIN, it means it's 'not_set'.
    // If the user logs in with a PIN, it means it's 'set'.
    // However, the UI itself cannot directly query IdentityManager.parentPinHash, as it's private.
    // A pragmatic approach for the UI is to display a "Set PIN" or "Change PIN" based on context.
    // For this implementation, we will assume if the user is here, they want to manage PIN.
    // Use public method to check for PIN existence
    if (IdentityManager.hasStoredPin()) {
      setCurrentPinStatus('set');
    } else {
      setCurrentPinStatus('not_set');
    }

  }, [activeProfile]);


  const handleSetPin = () => {
    setMessage(null);
    if (pinInput.length !== 4 || confirmPinInput.length !== 4) {
      setMessage({ text: "O PIN deve ter 4 dígitos.", type: 'error' });
      return;
    }
    if (pinInput !== confirmPinInput) {
      setMessage({ text: "Os PINs não coincidem.", type: 'error' });
      return;
    }

    try {
      IdentityManager.setPin(pinInput);
      setMessage({ text: "PIN configurado com sucesso!", type: 'success' });
      setCurrentPinStatus('set');
      setPinInput("");
      setConfirmPinInput("");
    } catch (error) {
      setMessage({ text: "Erro ao configurar o PIN. Tente novamente.", type: 'error' });
      console.error("Erro ao configurar PIN:", error);
    }
  };

  return (
    <section className="space-y-8 animate-fade-in text-center">
      <header>
        <h2 className="font-hand text-5xl text-slate-800">Segurança do Painel</h2>
        <p className="text-sm text-slate-500 font-medium mt-2">
          {currentPinStatus === 'not_set' ? "Configure um PIN de 4 dígitos para proteger o acesso parental." : "Altere o PIN de 4 dígitos para o acesso parental."}
        </p>
      </header>
      <div className="bg-white p-16 rounded-[4rem] shadow-sm border border-slate-200 inline-block w-full max-w-lg">
        <div className="p-8 bg-slate-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
          <Key size={48} className="text-slate-400" />
        </div>

        <div className="space-y-4 mb-8">
          <ModernInput
            label="Novo PIN (4 dígitos)"
            type="password"
            value={pinInput}
            onChange={(val: string) => setPinInput(val)}
            maxLength={4}
          />
          <ModernInput
            label="Confirmar PIN (4 dígitos)"
            type="password"
            value={confirmPinInput}
            onChange={(val: string) => setConfirmPinInput(val)}
            maxLength={4}
          />
        </div>

        <button
          onClick={handleSetPin}
          className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase shadow-2xl hover:bg-black transition-all w-full"
        >
          {currentPinStatus === 'not_set' ? "Definir PIN" : "Alterar PIN"}
        </button>

        {message && (
          <div className={`mt-4 p-3 rounded-xl ${message.type === 'error' ? 'bg-red-100 text-red-700' : message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
            {message.text}
          </div>
        )}
      </div>
    </section>
  );
};

const TrainingRange = ({ label, value, onChange, color }: any) => (
  <div className="space-y-3">
    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
      <span>{label}</span>
      <span>{value}/5</span>
    </div>
    <input type="range" min="1" max="5" value={value} onChange={e => onChange(parseInt(e.target.value))} className="w-full h-1.5 rounded-full accent-indigo-500" style={{ accentColor: color }} />
  </div>
);

const MagicSection = ({ icon: Icon, title, color, children }: { icon: any, title: string, color: string, children?: React.ReactNode }) => (
  <div className="mimi-card p-10 space-y-8 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-30 transition-opacity"><Icon size={80} className="md:size-[120px]" style={{ color }} /></div>
    <div className="flex items-center gap-4 relative z-10">
      <div className="p-4 rounded-3xl shadow-lg text-white" style={{ backgroundColor: color }}><Icon size={24} /></div>
      <h3 className="font-hand text-3xl md:text-4xl" style={{ color }}>{title}</h3>
    </div>
    <div className="relative z-10">{children}</div>
  </div>
);

const SidebarTab = ({ active, onClick, icon: Icon, label, isAdmin }: { active: boolean, onClick: () => void, icon: any, label: string, isAdmin: boolean }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center gap-2 w-16 h-16 md:w-20 md:h-20 rounded-3xl transition-all relative ${active ? (isAdmin ? 'bg-slate-900 text-white scale-110 shadow-xl' : 'text-[var(--primary)] bg-[var(--surface-elevated)] scale-110 shadow-lg') : (isAdmin ? 'text-slate-400 hover:text-slate-600' : 'text-[var(--text-muted)] opacity-40 hover:opacity-100')}`}>
    <Icon size={24} />
    <span className="text-[8px] md:text-[9px] font-black uppercase tracking-tight text-center">{label}</span>
  </button>
);



const Switch = ({ active, onToggle }: { active: boolean, onToggle: () => void }) => (
  <button onClick={onToggle} className={`w-12 h-7 md:w-14 md:h-8 rounded-full relative transition-colors ${active ? 'bg-[var(--primary)]' : 'bg-[var(--border-color)]'}`}><div className={`absolute top-1 w-6 h-6 bg-[var(--surface)] rounded-full transition-all ${active ? 'left-7' : 'left-1'}`} /></button>
);
