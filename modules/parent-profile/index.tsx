import React, { useState } from 'react';
import { Palette, Home, ShieldCheck, BrainCircuit, Users, LogOut, Info, Activity } from 'lucide-react';
import { IdentityManager } from '../../core/ecosystem/IdentityManager';
import { EliteThemeSelector } from './themes/EliteThemeSelector';
import { MagicCard } from '../../core/components/ui/MagicCard';
import { QuotaModule } from '../quota/index';
import { safeJsonParse } from '../../core/utils';
import { STORAGE_KEYS } from '../../core/config';
import { UsageLog } from '../../core/types';
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
    <div className="flex flex-col md:flex-row h-full bg-slate-50 overflow-hidden">
      {/* Sidebar de Navegação Parental */}
      <nav className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-2 shrink-0">
        <div className="mb-8 px-2">
          <h1 className="font-hand text-3xl text-slate-800">Guardião</h1>
          <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">Painel de Controle</p>
        </div>

        <NavButton 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
          icon={Users} 
          label="Visão Geral" 
        />
        <NavButton 
          active={activeTab === 'monitor'} 
          onClick={() => setActiveTab('monitor')} 
          icon={Activity} 
          label="Monitor" 
        />
        <NavButton 
          active={activeTab === 'themes'} 
          onClick={() => setActiveTab('themes')} 
          icon={Palette} 
          label="Elite UI" 
        />
        <NavButton 
          active={activeTab === 'security'} 
          onClick={() => setActiveTab('security')} 
          icon={ShieldCheck} 
          label="Segurança" 
        />
        
        <div className="mt-auto">
          <button 
            onClick={() => IdentityManager.logout()}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold text-sm"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto p-8 md:p-12">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'themes' && <EliteThemeSelector />}
          {activeTab === 'monitor' && <QuotaModule usageLogs={usageLogs} />}
          
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              <header>
                <h2 className="text-4xl font-black text-slate-800">Bem-vindo, {profile.nickname}</h2>
                <p className="text-slate-500">O sistema está operando nominalmente.</p>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MagicCard className="p-6 bg-white border border-slate-100">
                  <div className="text-4xl font-black text-indigo-500 mb-2">3</div>
                  <div className="text-sm font-bold text-slate-400 uppercase">Perfis Ativos</div>
                </MagicCard>
                <MagicCard className="p-6 bg-white border border-slate-100">
                  <div className="text-4xl font-black text-emerald-500 mb-2">100%</div>
                  <div className="text-sm font-bold text-slate-400 uppercase">Segurança</div>
                </MagicCard>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const NavButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
      ${active 
        ? 'bg-slate-900 text-white shadow-lg' 
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }
    `}
  >
    <Icon size={18} />
    {label}
  </button>
);
