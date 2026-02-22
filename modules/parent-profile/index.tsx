import React, { useState } from 'react';
import { Palette, Home, ShieldCheck, BrainCircuit, Users, LogOut, Info, Activity, Terminal } from 'lucide-react';
import { IdentityManager } from '../../core/ecosystem/IdentityManager';
import { EliteThemeSelector } from './themes/EliteThemeSelector';
import { MagicCard } from '../../core/components/ui/MagicCard';
import { QuotaModule } from '../quota/index';
import { safeJsonParse } from '../../core/utils';
import { STORAGE_KEYS } from '../../core/config';
import { UsageLog } from '../../core/types';
import { useTheme } from '../../core/theme/useTheme';
import { HackerSimulator, StrategicHackGif } from '../../core/components/HackerSimulator';
import { MatrixRain, HackerOverlay } from '../../core/components/MatrixRain';
import { DecryptText } from '../../core/components/effects/DecryptText';
import { MagicIcon } from '../../core/components/ui/MagicIcon';
import { z } from 'zod';

// Esquema de Validação Parent Profile (APEX v2.0)
const ParentProfileSchema = z.object({
  id: z.string(),
  role: z.literal('parent_admin'),
  nickname: z.string().min(2).max(20),
});

type ParentProfile = z.infer<typeof ParentProfileSchema>;

// Abas exclusivas dos Pais
type ParentTab = 'dashboard' | 'themes' | 'monitor' | 'security';

export const ParentProfileModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ParentTab>('dashboard');
  const rawProfile = IdentityManager.getActiveProfile();
  const { themeId } = useTheme();
  const isHackerMode = themeId === "binary-night";
  
  // Carrega logs para o Monitor
  const usageLogs: UsageLog[] = safeJsonParse(STORAGE_KEYS.USAGE, []);
  
  // Validação em Tempo de Execução (Axioma 2)
  const profileValidation = ParentProfileSchema.safeParse(rawProfile);
  
  if (!profileValidation.success) {
    return (
      <div className="p-8 bg-red-50 text-red-600 rounded-3xl border border-red-100">
        <h3 className="font-bold flex items-center gap-2"><Info size={18} /> Erro de Integridade de Domínio</h3>
        <p className="text-sm opacity-80">O perfil atual não atende aos requisitos de segurança do Guardião.</p>
      </div>
    );
  }

  const profile = profileValidation.data;

  return (
    <div className={`flex flex-col md:flex-row h-full overflow-hidden transition-all duration-500 ${isHackerMode ? 'bg-black text-green-500' : 'bg-[var(--bg-app)]'}`}>
      {/* Background Effects for Parent Zone */}
      {isHackerMode && (
        <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
           <HackerSimulator />
           <StrategicHackGif url="/assets/loading/siames_gif/fundo_preto(exclusivo tema hacker).gif" />
        </div>
      )}

      {/* Sidebar de Navegação Parental */}
      <nav className={`w-full md:w-64 border-r p-6 flex flex-col gap-2 shrink-0 z-50 transition-all ${isHackerMode ? 'bg-black/90 border-green-500/30' : 'bg-[var(--surface)]/95 backdrop-blur-3xl border-[var(--border-color)]'}`}>
        <div className="mb-8 px-2">
          <h1 className={`font-hand text-4xl leading-none transition-colors ${isHackerMode ? 'text-green-500' : 'text-[var(--text-primary)]'}`}>
            {isHackerMode ? <DecryptText text="GUARDIAN_OS" /> : 'Guardião'}
          </h1>
          <p className={`text-[9px] font-black tracking-[0.3em] uppercase opacity-50 ${isHackerMode ? 'text-green-400' : 'text-[var(--text-muted)]'}`}>
            {isHackerMode ? <DecryptText text="SECURE_DASHBOARD_V2.0" /> : 'Painel de Controle'}
          </p>
        </div>

        <NavButton 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
          icon={isHackerMode ? Terminal : Users} 
          label={isHackerMode ? 'OVERVIEW' : 'Visão Geral'} 
          isHackerMode={isHackerMode}
        />
        <NavButton 
          active={activeTab === 'monitor'} 
          onClick={() => setActiveTab('monitor')} 
          icon={Activity} 
          label={isHackerMode ? 'PACKET_MONITOR' : 'Monitor'} 
          isHackerMode={isHackerMode}
        />
        <NavButton 
          active={activeTab === 'themes'} 
          onClick={() => setActiveTab('themes')} 
          icon={Palette} 
          label={isHackerMode ? 'UI_ADAPT' : 'Elite UI'} 
          isHackerMode={isHackerMode}
        />
        <NavButton 
          active={activeTab === 'security'} 
          onClick={() => setActiveTab('security')} 
          icon={ShieldCheck} 
          label={isHackerMode ? 'ENCRYPT_KEY' : 'Segurança'} 
          isHackerMode={isHackerMode}
        />
        
        <div className="mt-auto">
          <button 
            onClick={() => IdentityManager.logout()}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-bold text-sm ${isHackerMode ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'}`}
          >
            <MagicIcon icon={LogOut} size={18} color="currentColor" />
            Sair
          </button>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto p-8 md:p-12 relative z-10 no-scrollbar">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'themes' && <EliteThemeSelector />}
          {activeTab === 'monitor' && <QuotaModule usageLogs={usageLogs} />}
          
          {activeTab === 'dashboard' && (
            <div className="space-y-10 animate-fade-in">
              <header>
                <h2 className={`text-5xl font-black transition-colors ${isHackerMode ? 'text-green-500' : 'text-[var(--text-primary)]'}`}>
                  {isHackerMode ? <DecryptText text={`ACCESS_GRANTED: ${profile.nickname.toUpperCase()}`} /> : `Bem-vindo, ${profile.nickname}`}
                </h2>
                <p className={`font-medium ${isHackerMode ? 'text-green-600' : 'text-[var(--text-secondary)]'}`}>
                  {isHackerMode ? <DecryptText text="SYSTEM_STATUS: NOMINAL | ALL_LAYERS_PROTECTED" /> : 'O sistema está operando nominalmente.'}
                </p>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatusCard 
                  value="3" 
                  label={isHackerMode ? 'ACTIVE_PROFILES' : 'Perfis Ativos'} 
                  color={isHackerMode ? 'text-green-500' : 'text-indigo-500'}
                  isHackerMode={isHackerMode}
                />
                <StatusCard 
                  value="100%" 
                  label={isHackerMode ? 'FIREWALL_EFFICIENCY' : 'Segurança'} 
                  color={isHackerMode ? 'text-green-400' : 'text-emerald-500'}
                  isHackerMode={isHackerMode}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const NavButton = ({ active, onClick, icon: Icon, label, isHackerMode }: any) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-3 px-5 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300
      ${active 
        ? (isHackerMode ? 'bg-green-600 text-black shadow-[0_0_20px_rgba(0,255,65,0.4)]' : 'bg-slate-900 text-white shadow-lg') 
        : (isHackerMode ? 'text-green-500/50 hover:bg-green-500/10 hover:text-green-500' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900')
      }
    `}
  >
    <MagicIcon 
      icon={Icon} 
      size={18} 
      className={`${active && isHackerMode ? 'animate-pulse' : ''}`} 
      variant={active ? 'gradient' : 'duotone'}
      glow={active}
    />
    {isHackerMode ? <DecryptText text={label} /> : label}
  </button>
);

const StatusCard = ({ value, label, color, isHackerMode }: any) => (
  <MagicCard className={`p-8 transition-all ${isHackerMode ? 'bg-black border border-green-500/30' : 'bg-white border border-slate-100'}`}>
    <div className={`text-5xl font-black mb-3 ${color}`}>{value}</div>
    <div className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ${isHackerMode ? 'text-green-500' : 'text-slate-400'}`}>{label}</div>
  </MagicCard>
);
