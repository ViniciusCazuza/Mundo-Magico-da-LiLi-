
import React from "react";
import { Download, Upload, CheckCircle } from "lucide-react";
import { PerfilState } from "../types";

interface ExportImportPanelProps {
  state: PerfilState;
  onImport: (state: PerfilState) => void;
}

export const ExportImportPanel: React.FC<ExportImportPanelProps> = ({ state, onImport }) => {
  const exportData = () => {
    const data = JSON.stringify({ version: 1, data: state }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-mimi-${state.child.name.toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.version === 1 && json.data) {
          onImport(json.data);
          alert("Backup restaurado com sucesso! ✨");
        } else {
          throw new Error("Versão incompatível.");
        }
      } catch (err) {
        alert("Ops! Arquivo de backup inválido.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <button 
        onClick={exportData}
        className="flex flex-col items-center gap-2 p-6 bg-[var(--surface-elevated)] text-[var(--primary)] border-[var(--ui-border-width)] border-[var(--border-color)] transition-all active:scale-95 shadow-sm"
        style={{ borderRadius: 'var(--ui-radius)' }}
      >
        <Download size={24} />
        <span className="text-[10px] font-black uppercase tracking-widest">Backup</span>
      </button>

      <label 
        className="flex flex-col items-center gap-2 p-6 bg-[var(--surface-elevated)] text-[var(--text-secondary)] border-[var(--ui-border-width)] border-[var(--border-color)] transition-all active:scale-95 shadow-sm cursor-pointer"
        style={{ borderRadius: 'var(--ui-radius)' }}
      >
        <Upload size={24} />
        <span className="text-[10px] font-black uppercase tracking-widest">Restaurar</span>
        <input type="file" accept=".json" onChange={importData} className="hidden" />
      </label>
    </div>
  );
};
