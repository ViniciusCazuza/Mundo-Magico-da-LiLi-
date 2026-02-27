using LiliMagic.Api.Core;
using LiliMagic.Api.DTOs;

namespace LiliMagic.Api.Services;

public class InMemoryDrawingRepository : IDrawingRepository
{
    private readonly Dictionary<string, DrawingDto> _drawings = new();
    private readonly Dictionary<string, List<LayerBaseDto>> _layers = new();
    private readonly object _lock = new();

    public Task<Result<DrawingDto>> CreateAsync(DrawingDto drawing)
    {
        lock (_lock)
        {
            if (_drawings.ContainsKey(drawing.Id))
            {
                return Task.FromResult(Result<DrawingDto>.Fail("Drawing already exists", "DUPLICATE_ID"));
            }
            var now = DateTime.UtcNow;
            var drawingWithTimestamps = drawing with { CreatedAt = now, UpdatedAt = now };
            _drawings[drawing.Id] = drawingWithTimestamps;
            _layers[drawing.Id] = new List<LayerBaseDto>(drawing.Layers);
            return Task.FromResult(Result<DrawingDto>.Ok(drawingWithTimestamps));
        }
    }

    public Task<Result<DrawingDto>> GetByIdAsync(string id)
    {
        lock (_lock)
        {
            if (!_drawings.TryGetValue(id, out var drawing))
            {
                return Task.FromResult(Result<DrawingDto>.Fail("Drawing not found", "NOT_FOUND"));
            }
            var drawingWithLayers = drawing with { Layers = _layers[id].ToList() };
            return Task.FromResult(Result<DrawingDto>.Ok(drawingWithLayers));
        }
    }

    public Task<Result<DrawingDto>> UpdateAsync(DrawingDto drawing)
    {
        lock (_lock)
        {
            if (!_drawings.ContainsKey(drawing.Id))
            {
                return Task.FromResult(Result<DrawingDto>.Fail("Drawing not found", "NOT_FOUND"));
            }
            var updatedDrawing = drawing with { UpdatedAt = DateTime.UtcNow };
            _drawings[drawing.Id] = updatedDrawing;
            _layers[drawing.Id] = new List<LayerBaseDto>(drawing.Layers);
            return Task.FromResult(Result<DrawingDto>.Ok(updatedDrawing));
        }
    }

    public Task<Result<bool>> DeleteAsync(string id)
    {
        lock (_lock)
        {
            if (!_drawings.Remove(id))
            {
                return Task.FromResult(Result<bool>.Fail("Drawing not found", "NOT_FOUND"));
            }
            _layers.Remove(id);
            return Task.FromResult(Result<bool>.Ok(true));
        }
    }

    public Task<Result<PagedList<DrawingDto>>> GetByAuthorAsync(string authorId, int page, int pageSize)
    {
        lock (_lock)
        {
            var authorDrawings = _drawings.Values
                .Where(d => d.AuthorId == authorId)
                .OrderByDescending(d => d.UpdatedAt)
                .ToList();

            var totalCount = authorDrawings.Count;
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
            var pagedItems = authorDrawings
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(d => d with { Layers = _layers.ContainsKey(d.Id) ? _layers[d.Id].ToList() : new() })
                .ToList();

            var pagedList = new PagedList<DrawingDto>
            {
                Items = pagedItems,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = totalPages
            };

            return Task.FromResult(Result<PagedList<DrawingDto>>.Ok(pagedList));
        }
    }

    public Task<Result<DrawingDto>> AddLayerAsync(string drawingId, LayerBaseDto layer)
    {
        lock (_lock)
        {
            if (!_drawings.TryGetValue(drawingId, out var drawing))
            {
                return Task.FromResult(Result<DrawingDto>.Fail("Drawing not found", "NOT_FOUND"));
            }

            if (!_layers.ContainsKey(drawingId))
            {
                _layers[drawingId] = new List<LayerBaseDto>();
            }

            var maxZIndex = _layers[drawingId].Any() ? _layers[drawingId].Max(l => l.ZIndex) : 0;
            var layerWithZIndex = layer with { ZIndex = layer.ZIndex == 0 ? maxZIndex + 1 : layer.ZIndex };
            
            _layers[drawingId].Add(layerWithZIndex);

            var updatedDrawing = drawing with { UpdatedAt = DateTime.UtcNow };
            _drawings[drawingId] = updatedDrawing;
            
            var result = updatedDrawing with { Layers = _layers[drawingId].ToList() };
            return Task.FromResult(Result<DrawingDto>.Ok(result));
        }
    }
}
