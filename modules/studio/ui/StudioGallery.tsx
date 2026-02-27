/**
 * StudioGallery - Componente de Galeria de Desenhos
 * 
 * Visualização de todos os desenhos salvos em formato masonry/grid
 * com preview de layers e metadados.
 * 
 * @integration
 * - Integrado com useStudio hook via getAllDrawings, deleteDrawing
 * - Acessa propriedades corretas do tipo Drawing: id, title, layers
 * - Layers do tipo RasterLayer têm dataUrl, não content
 */

import React, { useState, useMemo } from 'react';
import { useStudio } from '../hooks/useStudio';
import { Drawing, RasterLayer } from '../types';

interface GalleryFilters {
  search: string;
  sortBy: 'date' | 'name';
  viewMode: 'grid' | 'list';
}

export const StudioGallery: React.FC<{ onToolSwitch?: (id: string) => void }> = ({ onToolSwitch }) => {
  const studio = useStudio();
  const [filters, setFilters] = useState<GalleryFilters>({
    search: '',
    sortBy: 'date',
    viewMode: 'grid',
  });

  const { isSaving, lastSavedAt } = studio;

  // Carregar desenhos no mount
  React.useEffect(() => {
    studio.loadDrawings();
  }, []);

  // Computed: desenhos filtrados e ordenados
  const drawings = useMemo(() => {
    let items = studio.drawings || [];
    
    // Aplicar busca
    if (filters.search) {
      items = items.filter(d => 
        d.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    // Ordenar
    items = [...items].sort((a, b) => {
      if (filters.sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return a.title.localeCompare(b.title);
    });
    
    return items;
  }, [studio.drawings, filters]);

  // Handlers
  const handleLoadDrawing = async (drawing: Drawing) => {
    // Carregar desenho no studio atual
    const result = await studio.loadDrawing(drawing.id);
    if (result.success && onToolSwitch) {
      onToolSwitch('canvas');
    }
  };

  const handleDeleteDrawing = async (id: string) => {
    if (confirm('Deseja realmente excluir este desenho?')) {
      await studio.deleteDrawing(id);
    }
  };

  // Render helpers
  const renderLayerPreview = (layer: RasterLayer) => {
    if (!layer.isVisible || !layer.dataUrl) return null;
    
    return (
      <div 
        key={layer.id}
        className="absolute inset-0"
        style={{ 
          opacity: layer.opacity / 100,
          zIndex: layer.zIndex,
        }}
      >
        <img 
          src={layer.dataUrl}
          alt={layer.name}
          className="w-full h-full object-contain"
        />
      </div>
    );
  };

  const renderDrawingCard = (drawing: Drawing) => {
    const rasterLayers = drawing.layers.filter(
      (l): l is RasterLayer => l.type === 'raster'
    );
    
    const visibleLayers = rasterLayers.filter(l => l.isVisible);

    return (
      <div 
        key={drawing.id}
        className={`
          group relative rounded-2xl overflow-hidden
          bg-white/80 backdrop-blur-xl
          border border-neutral-200/50
          hover:shadow-xl transition-all duration-300
          ${filters.viewMode === 'list' ? 'flex gap-4 p-4' : ''}
        `}
      >
        {/* Thumbnail */}
        <div 
          className={`
            relative overflow-hidden bg-neutral-100
            ${filters.viewMode === 'list' 
              ? 'w-32 h-32 flex-shrink-0 rounded-xl' 
              : 'aspect-[4/3]'
            }
          `}
        >
          {visibleLayers.length > 0 ? (
            <div className="absolute inset-0">
              {visibleLayers.slice(0, 5).map(renderLayerPreview)}
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
            </div>
          )}
          
          {/* Layer count badge */}
          <div className="absolute top-2 right-2 px-2 py-1 text-xs font-medium 
            bg-black/50 text-white rounded-full backdrop-blur-sm">
            {drawing.layers.length} camada{drawing.layers.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Info */}
        <div className={filters.viewMode === 'list' ? 'flex-1' : 'p-4'}>
          <h3 className="font-semibold text-neutral-800 truncate">
            {drawing.title}
          </h3>
          
          <p className="text-sm text-neutral-500 mt-1">
            {new Date(drawing.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </p>

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => handleLoadDrawing(drawing)}
              className="flex-1 px-3 py-1.5 text-sm font-medium text-white 
                bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg
                hover:from-indigo-600 hover:to-purple-600 transition-colors"
            >
              Abrir
            </button>
            <button
              onClick={() => handleDeleteDrawing(drawing.id)}
              className="px-3 py-1.5 text-sm font-medium text-red-600 
                bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200/50">
        <div>
          <h2 className="text-lg font-semibold text-neutral-800">Galeria</h2>
          <p className="text-sm text-neutral-500">
            {drawings.length} desenho{drawings.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
              placeholder="Buscar..."
              className="w-48 pl-9 pr-4 py-2 text-sm rounded-xl
                bg-white/80 border border-neutral-200/50
                focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" 
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>

          {/* Sort */}
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(f => ({ ...f, sortBy: e.target.value as any }))}
            className="px-3 py-2 text-sm rounded-xl bg-white/80 border border-neutral-200/50"
          >
            <option value="date">Mais recente</option>
            <option value="name">Nome</option>
          </select>

          {/* View mode */}
          <div className="flex rounded-xl bg-neutral-100 p-1">
            <button
              onClick={() => setFilters(f => ({ ...f, viewMode: 'grid' }))}
              className={`p-2 rounded-lg transition-colors ${
                filters.viewMode === 'grid' ? 'bg-white shadow-sm' : ''
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" 
                />
              </svg>
            </button>
            <button
              onClick={() => setFilters(f => ({ ...f, viewMode: 'list' }))}
              className={`p-2 rounded-lg transition-colors ${
                filters.viewMode === 'list' ? 'bg-white shadow-sm' : ''
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
          </div>

          <div className="w-px h-6 bg-neutral-200 mx-1" />

          {/* Sync Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-50 border border-neutral-200/50 text-[10px] font-bold text-neutral-500 whitespace-nowrap">
            {isSaving ? (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                GUARDANDO...
              </>
            ) : lastSavedAt ? (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                SALVO {lastSavedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </>
            ) : (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                OFFLINE
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {drawings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-400">
            <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            <p className="text-lg font-medium">Nenhum desenho encontrado</p>
            <p className="text-sm mt-1">Crie seu primeiro desenho no estúdio!</p>
          </div>
        ) : (
          <div className={`
            gap-4
            ${filters.viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'flex flex-col'
            }
          `}>
            {drawings.map(renderDrawingCard)}
          </div>
        )}
      </div>
    </div>
  );
};