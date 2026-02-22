import React, { useMemo } from "react";
import { MessageCircle, Volume2, Zap, BarChart3, Database, ShieldAlert } from "lucide-react";
import { MagicIcon } from "../../core/components/ui/MagicIcon";
import { UsageLog } from "../../core/types";
import { DAILY_LIMITS } from "../../core/config";
import { QuotaCard } from "./components/QuotaCard";
import { useTheme } from "../../core/theme/useTheme";
import { HackerSimulator, StrategicHackGif } from "../../core/components/HackerSimulator";
import { DecryptText } from "../../core/components/effects/DecryptText";

interface QuotaModuleProps {
  usageLogs: UsageLog[];
}

/**
 * Módulo de Quota isolado (Monitor Parental).
 * APEX v2.0 - Integração com Temas de Elite.
 */
export const QuotaModule: React.FC<QuotaModuleProps> = ({ usageLogs }) => {
  const { themeId } = useTheme();
  const isHackerMode = themeId === "binary-night";

  // Memoização dos cálculos para evitar processamento desnecessário em cada render
  const quotaMetrics = useMemo(() => {
    const todayStart = new Date().setHours(0, 0, 0, 0);
    
    // Filtra logs do dia atual
    const dailyLogs = (usageLogs || []).filter(log => 
      log && log.timestamp >= todayStart
    );

    // Agrupamento por categoria de modelo (Chat vs TTS)
    const chatLogs = dailyLogs.filter(l => l.type === 'chat' || l.model?.includes('flash'));
    const ttsLogs = dailyLogs.filter(l => l.type === 'tts' || l.model?.includes('TTS'));

    // Cálculo de volume usado
    const chatUsedTokens = chatLogs.reduce((acc, l) => acc + (l.inputTokens || 0) + (l.outputTokens || 0), 0);
    const ttsUsedChars = ttsLogs.reduce((acc, l) => acc + (l.characters || 0), 0);

    // Cálculo de custos acumulados
    const chatTotalCost = chatLogs.reduce((acc, l) => acc + (l.cost || 0), 0);
    const ttsTotalCost = ttsLogs.reduce((acc, l) => acc + (l.cost || 0), 0);
    const totalDayCost = dailyLogs.reduce((acc, l) => acc + (l.cost || 0), 0);

    return [
      {
        id: 'gemini-chat',
        name: isHackerMode ? 'NEURAL_LINK_USAGE' : 'Gemini Chat (Flash)',
        icon: isHackerMode ? Database : MessageCircle,
        used: chatUsedTokens,
        limit: DAILY_LIMITS.CHAT_TOKENS,
        cost: chatTotalCost,
        status: chatUsedTokens >= DAILY_LIMITS.CHAT_TOKENS ? (isHackerMode ? 'OVERLOAD' : 'Limite Atingido') : (isHackerMode ? 'NOMINAL' : 'Normal'),
        unit: 'tokens'
      },
      {
        id: 'gemini-tts',
        name: isHackerMode ? 'SYNTH_VOICE_STREAM' : 'Gemini TTS (Audio)',
        icon: isHackerMode ? Database : Volume2,
        used: ttsUsedChars,
        limit: DAILY_LIMITS.TTS_CHARS,
        cost: ttsTotalCost,
        status: ttsUsedChars >= DAILY_LIMITS.TTS_CHARS ? (isHackerMode ? 'OVERLOAD' : 'Limite Atingido') : (isHackerMode ? 'NOMINAL' : 'Normal'),
        unit: 'caracteres'
      },
      {
        id: 'daily-budget',
        name: isHackerMode ? 'CREDIT_EXPOSURE ($)' : 'Orçamento Diário ($)',
        icon: isHackerMode ? ShieldAlert : Zap,
        used: totalDayCost,
        limit: DAILY_LIMITS.TOTAL_COST,
        cost: totalDayCost,
        status: totalDayCost >= DAILY_LIMITS.TOTAL_COST ? (isHackerMode ? 'CRITICAL' : 'Crítico') : (isHackerMode ? 'SECURE' : 'Saudável'),
        unit: 'USD'
      }
    ];
  }, [usageLogs, isHackerMode]);

  return (
    <div className={`space-y-8 animate-fade-in relative overflow-hidden ${isHackerMode ? 'bg-black p-8 border border-green-500/30' : ''}`}>
      {isHackerMode && (
        <>
          <HackerSimulator />
          <StrategicHackGif url="/assets/loading/siames_gif/fundo_preto(exclusivo tema hacker).gif" />
          <div className="absolute top-0 left-0 w-full h-1 bg-green-500/20 animate-pulse"></div>
        </>
      )}

      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className={`text-xs font-black uppercase tracking-[0.4em] flex items-center gap-3 ${isHackerMode ? 'text-green-500' : 'text-slate-400'}`}>
          <MagicIcon icon={BarChart3} size={16} color="currentColor" variant="duotone" /> {isHackerMode ? <DecryptText text="RESOURCE_MONITOR_V2.0" /> : 'Monitoramento de Recursos'}
        </h3>
        <span className={`text-[9px] font-black uppercase px-3 py-1 rounded tracking-tighter ${isHackerMode ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-slate-100 text-slate-400'}`}>
          {isHackerMode ? <DecryptText text="SYS_UPTIME: STABLE" /> : 'Atualizado agora'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {quotaMetrics.map(metric => (
          <QuotaCard 
            key={metric.id}
            name={metric.name}
            icon={metric.icon}
            used={metric.used}
            limit={metric.limit}
            cost={metric.cost}
            status={metric.status}
          />
        ))}
      </div>

      {quotaMetrics.some(m => m.used >= m.limit) && (
        <div className={`p-6 border rounded-2xl flex items-start gap-4 animate-jelly relative z-10 ${isHackerMode ? 'bg-black border-green-500/50' : 'bg-red-50 border-red-100'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg ${isHackerMode ? 'bg-green-600' : 'bg-red-500'}`}>
            <MagicIcon icon={Zap} size={20} color="white" glow />
          </div>
          <div>
            <h4 className={`text-sm font-black uppercase tracking-widest ${isHackerMode ? 'text-green-400' : 'text-red-700'}`}>
              {isHackerMode ? <DecryptText text="QUOTA_EXCEEDED_ALERT" /> : 'Atenção ao Limite'}
            </h4>
            <p className={`text-xs leading-relaxed mt-1 font-medium ${isHackerMode ? 'text-green-500/70' : 'text-red-600/80'}`}>
              {isHackerMode 
                ? <DecryptText text="SYSTEM PROTOCOL: INITIATING POWER SAVING. SYNTH_VOICE AND DEEP_ANALYSIS MODULES SUSPENDED." />
                : 'Alguns serviços atingiram o limite diário configurado. A Mimi pode responder de forma mais lenta ou sem áudio.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
