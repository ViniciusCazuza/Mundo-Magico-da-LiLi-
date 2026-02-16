import { ParentReport, ReportEvent } from "../../../core/types";
import { STORAGE_KEYS } from "../../../core/config";
import { mimiEvents, MIMI_EVENT_TYPES } from "../../../core/events";

export const getConsolidatedReport = (
  analysis: any, 
  convId: string
): ParentReport | null => {
  const existingReports: ParentReport[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS) || "[]");
  
  const today = new Date().toLocaleDateString('pt-BR');
  
  const existingIndex = existingReports.findIndex(r => 
    r.conversationId === convId && 
    r.date === today &&
    r.category === analysis.category
  );

  const newEvent: ReportEvent = {
    timestamp: Date.now(),
    text: analysis.analysis,
    severity: analysis.riskLevel
  };

  let finalReport: ParentReport;

  if (existingIndex > -1) {
    const report = existingReports[existingIndex];
    
    report.riskScore = Math.max(report.riskScore, analysis.riskLevel);
    report.riskLevel = mapRiskToType(report.riskScore);
    report.involvedParties = Array.from(new Set([...report.involvedParties, ...(analysis.detectedParties || [])]));
    report.locations = Array.from(new Set([...report.locations, ...(analysis.detectedLocations || [])]));
    report.keywords = Array.from(new Set([...report.keywords, ...(analysis.detectedKeywords || [])]));
    report.timeline = [...report.timeline, newEvent];
    report.lastUpdated = Date.now();
    report.mimiAnalysis = analysis.analysis;

    existingReports[existingIndex] = report;
    finalReport = report;
  } else {
    if (analysis.riskLevel > 0) {
      finalReport = {
        id: `rep_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        conversationId: convId,
        date: today,
        timestamp: Date.now(),
        riskScore: analysis.riskLevel,
        riskLevel: mapRiskToType(analysis.riskLevel),
        category: analysis.category,
        mimiAnalysis: analysis.analysis,
        suggestedParentAction: generateRecommendation(analysis.riskLevel),
        involvedParties: analysis.detectedParties || [],
        locations: analysis.detectedLocations || [],
        keywords: analysis.detectedKeywords || [],
        timeline: [newEvent],
        lastUpdated: Date.now()
      };
      existingReports.unshift(finalReport);
    } else {
      return null;
    }
  }

  // Persistência e Notificação via Evento
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(existingReports));
  mimiEvents.dispatch(MIMI_EVENT_TYPES.REPORT_CREATED, existingReports);
  
  return finalReport;
};

const mapRiskToType = (level: number): any => {
  if (level <= 1) return 'info';
  if (level === 2) return 'low';
  if (level === 3) return 'medium';
  if (level === 4) return 'high';
  return 'critical';
};

const generateRecommendation = (level: number): string => {
  if (level >= 5) return "Intervenção imediata recomendada. Verifique a segurança física e emocional.";
  if (level >= 3) return "Diálogo próximo necessário. A criança demonstrou sinais persistentes de desconforto.";
  return "Monitoramento contínuo. Incentive a expressão emocional natural.";
};