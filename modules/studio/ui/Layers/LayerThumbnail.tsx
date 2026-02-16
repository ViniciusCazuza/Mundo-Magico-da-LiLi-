
import React, { useEffect, useRef } from 'react';

interface LayerThumbnailProps {
  sourceCanvas?: HTMLCanvasElement;
  isBackground?: boolean;
  backgroundColor?: string;
  isTransparent?: boolean;
  version?: number;
}

export const LayerThumbnail: React.FC<LayerThumbnailProps> = ({ 
  sourceCanvas, isBackground, backgroundColor, isTransparent 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const updateThumbnail = () => {
    const dest = canvasRef.current;
    if (!dest) return;
    const ctx = dest.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, dest.width, dest.height);
    
    // Pattern de transparência para thumbnails
    if (isTransparent || !isBackground) {
        ctx.fillStyle = "#eee";
        ctx.fillRect(0, 0, dest.width, dest.height);
        ctx.fillStyle = "#fff";
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if ((i + j) % 2 === 0) {
                    ctx.fillRect(i * (dest.width/4), j * (dest.height/4), dest.width/4, dest.height/4);
                }
            }
        }
    }

    if (isBackground) {
        if (!isTransparent) {
            ctx.fillStyle = backgroundColor || '#fff';
            ctx.fillRect(0, 0, dest.width, dest.height);
        }
    } else if (sourceCanvas) {
        ctx.drawImage(sourceCanvas, 0, 0, dest.width, dest.height);
    }
  };

  useEffect(() => {
    updateThumbnail();
    if (!isBackground) {
        const interval = setInterval(updateThumbnail, 1000); 
        return () => clearInterval(interval);
    }
  }, [sourceCanvas, isBackground, backgroundColor, isTransparent]);

  return (
    <div className="w-10 h-8 bg-black/10 rounded-md overflow-hidden border border-white/5 shadow-inner shrink-0 relative">
        {isBackground && isTransparent && (
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className="w-full h-full" style={{
                    backgroundImage: 'linear-gradient(45deg, #888 25%, transparent 25%), linear-gradient(-45deg, #888 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #888 75%), linear-gradient(-45deg, transparent 75%, #888 75%)',
                    backgroundSize: '10px 10px',
                    backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px'
                }}></div>
            </div>
        )}
      <canvas 
        ref={canvasRef} 
        width={80} 
        height={50} 
        className="w-full h-full object-cover"
      />
    </div>
  );
};
