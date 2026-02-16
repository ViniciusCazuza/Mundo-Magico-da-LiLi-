export enum RiskLevel {
  Normal = 0,
  LowEmotion = 1,
  ModerateAttention = 2,
  RelevantRisk = 3,
  HighRisk = 4,
  Emergency = 5
}

export interface RiskAnalysis {
  level: RiskLevel;
  category: string;
  analysis: string;
  timestamp: number;
}

export const analyzeRisk = (level: number, category: string, analysis: string): RiskAnalysis => {
  return {
    level: level as RiskLevel,
    category,
    analysis,
    timestamp: Date.now()
  };
};
