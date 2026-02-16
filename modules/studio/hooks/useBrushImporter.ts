
import { useState } from 'react';
import JSZip from 'jszip';
import { BrushConfig } from '../engine/BrushEngine';

export const useBrushImporter = () => {
  const [isImporting, setIsImporting] = useState(false);

  const importBrushFile = async (file: File): Promise<BrushConfig[] | null> => {
    setIsImporting(true);
    const name = file.name.toLowerCase();
    let results: BrushConfig[] = [];

    try {
      if (name.endsWith('.brushset')) {
        results = await parseProcreateBrushSet(file);
      } else if (name.endsWith('.brush')) {
        const single = await parseProcreateBrush(file);
        if (single) results.push(single);
      } else if (name.endsWith('.abr')) {
        const abrResults = await parsePhotoshopBrush(file);
        if (abrResults) results = abrResults;
      }
    } catch (err) {
      console.error('Falha na Importação HyperPaint Pro:', err);
    } finally {
      setIsImporting(false);
    }
    
    return results.length > 0 ? results : null;
  };

  const parseProcreateBrushSet = async (file: File): Promise<BrushConfig[]> => {
    const zip = await JSZip.loadAsync(file);
    const brushFiles = Object.keys(zip.files).filter(name => name.endsWith('.brush'));
    const configs: BrushConfig[] = [];
    
    for (const path of brushFiles) {
      const data = await zip.file(path)!.async('blob');
      const config = await parseProcreateBrush(new File([data], path));
      if (config) configs.push(config);
    }
    return configs;
  };

  const parseProcreateBrush = async (file: File): Promise<BrushConfig | null> => {
    try {
      const zip = await JSZip.loadAsync(file);
      // Busca arquivos de textura no pacote .brush
      const shapeFile = zip.file(/shape|tip|brush_tip|Tip/i)[0];
      
      if (!shapeFile) return null;

      const shapeBlob = await shapeFile.async('blob');
      const shapeTexture = await loadAndProcessTexture(shapeBlob);

      // Fix: Adicionando propriedades 'flow' e 'hardness' obrigatórias pela interface BrushConfig
      return {
        id: `br_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name.replace('.brush', '').slice(0, 20),
        shapeTexture,
        spacing: 0.1,
        size: 64,
        opacity: 0.8,
        flow: 1.0,
        hardness: 1.0,
        rotation: 0,
        pressureSize: true,
        pressureOpacity: true,
        blendMode: 'source-over'
      };
    } catch (e) {
      return null;
    }
  };

  const parsePhotoshopBrush = async (file: File): Promise<BrushConfig[] | null> => {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const results: BrushConfig[] = [];
    
    // Scanner simplificado de assinaturas PNG/JPG em arquivos ABR
    let offset = 0;
    while (offset < bytes.length - 8) {
      // Assinatura PNG
      if (bytes[offset] === 0x89 && bytes[offset + 1] === 0x50 && bytes[offset + 2] === 0x4E) {
        const blob = new Blob([bytes.slice(offset)], { type: 'image/png' });
        const texture = await loadAndProcessTexture(blob).catch(() => null);
        if (texture) {
          // Fix: Adicionando propriedades 'flow' e 'hardness' obrigatórias pela interface BrushConfig
          results.push({
            id: `abr_${offset}`,
            name: `ABR Pincel ${results.length + 1}`,
            shapeTexture: texture,
            spacing: 0.15,
            size: 80,
            opacity: 0.9,
            flow: 1.0,
            hardness: 1.0,
            rotation: 0,
            pressureSize: true,
            pressureOpacity: true,
            blendMode: 'source-over'
          });
        }
        offset += 1000; 
      }
      offset++;
    }
    return results.length > 0 ? results : null;
  };

  /**
   * Converte luminância para Alpha para suportar texturas de pincel.
   * Branco = Opaco, Preto = Transparente.
   */
  const loadAndProcessTexture = async (blob: Blob): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          // Calcula brilho médio (luminância)
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          // Inverte se necessário (assumindo que pincéis profissionais usam branco como ponta)
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
          data[i + 3] = brightness; 
        }

        ctx.putImageData(imageData, 0, 0);
        const processed = new Image();
        processed.onload = () => resolve(processed);
        processed.src = canvas.toDataURL();
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  };

  return { importBrushFile, isImporting };
};
