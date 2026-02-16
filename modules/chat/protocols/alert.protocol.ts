import { getConsolidatedReport } from "../reports/alert.report";

export const executeAlertProtocol = (monitoringData: any, convId: string) => {
  // O protocolo agora é ativado para qualquer riskLevel > 0 para garantir 
  // que a linha do tempo capture a progressão emocional.
  if (monitoringData && monitoringData.riskLevel > 0) {
    getConsolidatedReport(monitoringData, convId);
    console.debug("[Mimi Monitor] Evento capturado e processado.");
  }
};
