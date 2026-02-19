
import React from 'react';
import { useTheme } from '../../../core/theme/useTheme';
import { ThemeRegistry } from '../../../core/theme/ThemeRegistry';
import { MagicCard } from '../../../core/components/ui/MagicCard';
import { TactileButton } from '../../../core/components/ui/TactileButton';
import { Lock, Check, Sparkles, Terminal, Layers, Box, Fingerprint } from 'lucide-react';
import { IdentityManager } from '../../../core/ecosystem/IdentityManager';

export const EliteThemeSelector: React.FC = () => {
  const { themeId, changeTheme } = useTheme();
  const profile = IdentityManager.getActiveProfile();
  
  // Filtra apenas temas disponíveis para o administrador que não são os básicos infantis
  const childThemeIds = ['siamese', 'persian', 'bengal', 'british', 'ragdoll'];
  const eliteThemes = ThemeRegistry.getAvailableThemes(profile?.role || 'parent_admin')
    .filter(t => !childThemeIds.includes(t.id));

  const getThemeIcon = (id: string) => {
    switch(id) {
      case 'binary-night': return <Terminal className="text-green-500" />;
      case 'glass-elite': return <Layers className="text-blue-400" />;
      case 'neubrutalist-raw': return <Box className="text-black" />;
      case 'skeuomorph-command': return <Fingerprint className="text-gray-500" />;
      default: return <Sparkles className="text-purple-500" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Temas de Elite</h2>
        <p className="text-slate-500 font-medium">Interfaces avançadas para controle total do ecossistema.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eliteThemes.map(theme => (
          <button
            key={theme.id}
            onClick={() => changeTheme(theme.id)}
            className={`
              relative group flex flex-col items-start p-6 rounded-[2rem] border-2 text-left transition-all duration-300
              ${themeId === theme.id 
                ? 'bg-slate-900 border-slate-900 shadow-2xl scale-105' 
                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg'
              }
            `}
          >
            <div className={`
              mb-4 p-4 rounded-2xl transition-colors
              ${themeId === theme.id ? 'bg-white/10' : 'bg-slate-50'}
            `}>
              {getThemeIcon(theme.id)}
            </div>

            <h3 className={`text-lg font-bold mb-1 ${themeId === theme.id ? 'text-white' : 'text-slate-800'}`}>
              {theme.name}
            </h3>
            <p className={`text-xs font-medium ${themeId === theme.id ? 'text-slate-400' : 'text-slate-500'}`}>
              {theme.description}
            </p>

            {/* Visual Preview (Abstract) */}
            <div className="mt-6 w-full h-24 rounded-xl overflow-hidden relative border border-white/10">
              <div 
                className="absolute inset-0"
                style={{ background: theme.tokens.colors.background }} 
              />
              {theme.id === 'binary-night' && <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/dummy/giphy.gif')] opacity-20" />} 
            </div>

            {themeId === theme.id && (
              <div className="absolute top-4 right-4 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg">
                <Check size={16} strokeWidth={3} />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
