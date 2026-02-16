import React, { useMemo } from "react";
import { MessageCircle, Volume2, Zap, BarChart3 } from "lucide-react";
import { UsageLog } from "../../core/types";
import { DAILY_LIMITS } from "../../core/config";
import { QuotaCard } from "./components/QuotaCard";

interface QuotaModuleProps {
  usageLogs: UsageLog[];
}

/**
 * Módulo de Quota isolado.
 * Responsável por processar logs de uso e exibir o consumo de recursos da API.
 * Recebe dados via props para manter o desacoplamento.
 */
export const QuotaModule: React.FC<QuotaModuleProps> = ({ usageLogs }) => {
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
        name: 'Gemini Chat (Flash)',
        icon: MessageCircle,
        used: chatUsedTokens,
        limit: DAILY_LIMITS.CHAT_TOKENS,
        cost: chatTotalCost,
        status: chatUsedTokens >= DAILY_LIMITS.CHAT_TOKENS ? 'Limite Atingido' : 'Normal',
        unit: 'tokens'
      },
      {
        id: 'gemini-tts',
        name: 'Gemini TTS (Audio)',
        icon: Volume2,
        used: ttsUsedChars,
        limit: DAILY_LIMITS.TTS_CHARS,
        cost: ttsTotalCost,
        status: ttsUsedChars >= DAILY_LIMITS.TTS_CHARS ? 'Limite Atingido' : 'Normal',
        unit: 'caracteres'
      },
      {
        id: 'daily-budget',
        name: 'Orçamento Diário ($)',
        icon: Zap,
        used: totalDayCost,
        limit: DAILY_LIMITS.TOTAL_COST,
        cost: totalDayCost,
        status: totalDayCost >= DAILY_LIMITS.TOTAL_COST ? 'Crítico' : 'Saudável',
        unit: 'USD'
      }
    ];
  }, [usageLogs]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <BarChart3 size={14} /> Monitoramento de Recursos
        </h3>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
          Atualizado agora
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white shrink-0">
            <Zap size={16} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-red-700">Atenção ao Limite</h4>
            <p className="text-xs text-red-600/80 leading-relaxed">
              Alguns serviços atingiram o limite diário configurado. A Mimi pode responder de forma mais lenta ou sem áudio até a renovação da cota.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
