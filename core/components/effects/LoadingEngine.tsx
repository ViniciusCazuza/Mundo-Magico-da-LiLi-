
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mimiEvents, MIMI_EVENT_TYPES } from '../../events';
import { resolveThemeFolder } from '../../utils/themeNormalization';
import { Result } from '../../utils/result';

/**
 * LoadingEngine (Nível 15) - Motor de Carregamento Adaptativo
 * Implementa a convenção estrita de pastas, cor de fundo dinâmica e prefetching.
 */

interface LoadingMetadata {
  gifs: Record<string, { backgroundColor: string }>;
}

export const LoadingEngine: React.FC<{ themeId: string }> = ({ themeId }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentGif, setCurrentGif] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState<string>("#FFFFFF");
  const [metadata, setMetadata] = useState<LoadingMetadata | null>(null);

  const themeFolder = useMemo(() => resolveThemeFolder(themeId), [themeId]);

  // Busca Metadados via Result Pattern (Axioma 2)
  const fetchMetadata = useCallback(async (): Promise<Result<LoadingMetadata>> => {
    try {
      const response = await fetch('/metadata.json');
      if (!response.ok) throw new Error("Falha ao carregar metadata.json");
      const data = await response.json();
      return Result.ok(data);
    } catch (e) {
      console.error("[LoadingEngine] Erro carregando metadados:", e);
      return Result.fail("Erro de metadados");
    }
  }, []);

  // Seleção Randômica Adaptativa
  const pickRandomGif = useCallback((meta: LoadingMetadata, folder: string) => {
    // Procura por GIFs que contenham o folder no caminho
    const gifsInFolder = Object.keys(meta.gifs).filter(path => path.includes(folder));
    
    let pickedPath: string | null = null;
    let pickedBg: string = "#FFFFFF";

    if (gifsInFolder.length > 0) {
      pickedPath = gifsInFolder[Math.floor(Math.random() * gifsInFolder.length)];
      pickedBg = meta.gifs[pickedPath]?.backgroundColor || "#FFFFFF";
    } else {
      // Fallback para qualquer siamese_gif (nossa pasta default mais rica)
      const fallbackGifs = Object.keys(meta.gifs).filter(path => path.includes("siamese_gif"));
      if (fallbackGifs.length > 0) {
        pickedPath = fallbackGifs[Math.floor(Math.random() * fallbackGifs.length)];
        pickedBg = meta.gifs[pickedPath]?.backgroundColor || "#FFFFFF";
      }
    }

    // Normaliza o caminho para o cliente (remove o prefixo 'public' se existir)
    const clientPath = pickedPath ? pickedPath.replace(/^public\//, '/') : null;

    return { path: clientPath, bgColor: pickedBg };
  }, []);

  // Inicialização e Listeners
  useEffect(() => {
    const init = async () => {
      const res = await fetchMetadata();
      if (res.success) setMetadata(res.data);
    };
    init();

    const showHandler = () => setIsVisible(true);
    const hideHandler = () => setIsVisible(false);

    // Eventos personalizados para disparar o loading de qualquer lugar
    window.addEventListener('SHOW_LOADING', showHandler);
    window.addEventListener('HIDE_LOADING', hideHandler);

    return () => {
      window.removeEventListener('SHOW_LOADING', showHandler);
      window.removeEventListener('HIDE_LOADING', hideHandler);
    };
  }, [fetchMetadata]);

  // Prefetching e Atualização de GIF ao abrir
  useEffect(() => {
    if (isVisible && metadata) {
      const { path, bgColor } = pickRandomGif(metadata, themeFolder);
      if (path) {
        setCurrentGif(path);
        setBgColor(bgColor);
        
        // Prefetch da imagem para evitar flicker
        const img = new Image();
        img.src = path;
      }
    }
  }, [isVisible, metadata, themeFolder, pickRandomGif]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: bgColor }}
        >
          <div className="w-full h-full max-w-4xl max-h-[80vh] flex items-center justify-center p-8">
            {currentGif && (
              <motion.img
                key={currentGif}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={currentGif}
                className="w-full h-full object-contain pointer-events-none"
                alt="Carregando..."
              />
            )}
          </div>
          
          {/* Opcional: Texto de Loading Mágico */}
          <div className="absolute bottom-12 left-0 right-0 text-center">
             <span className="font-hand text-3xl opacity-40 animate-pulse" style={{ color: 'rgba(0,0,0,0.5)' }}>
                Preparando a mágica...
             </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hooks Utilitários para disparar o loading
export const useLoading = () => {
  const showLoading = () => window.dispatchEvent(new CustomEvent('SHOW_LOADING'));
  const hideLoading = () => window.dispatchEvent(new CustomEvent('HIDE_LOADING'));
  return { showLoading, hideLoading };
};
