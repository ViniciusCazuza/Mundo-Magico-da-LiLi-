using Microsoft.EntityFrameworkCore;
using LiliMagic.Api.Core;
using LiliMagic.Api.DTOs;
using LiliMagic.Api.Data;
using System.Text.Json;

namespace LiliMagic.Api.Services;

public class SqliteDrawingRepository : IDrawingRepository
{
    private readonly AppDbContext _context;
    private readonly JsonSerializerOptions _jsonOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    public SqliteDrawingRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Result<DrawingDto>> CreateAsync(DrawingDto drawingDto)
    {
        try
        {
            var drawing = new Drawing
            {
                Id = drawingDto.Id,
                AuthorId = drawingDto.AuthorId,
                Title = drawingDto.Title,
                CanvasWidth = drawingDto.CanvasSize.Width,
                CanvasHeight = drawingDto.CanvasSize.Height,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Layers = drawingDto.Layers.Select(MapToEntity).ToList()
            };

            _context.Drawings.Add(drawing);
            await _context.SaveChangesAsync();

            return Result<DrawingDto>.Ok(MapToDto(drawing));
        }
        catch (Exception ex)
        {
            return Result<DrawingDto>.Fail(ex.Message, "DB_ERROR");
        }
    }

    public async Task<Result<DrawingDto>> GetByIdAsync(string id)
    {
        var drawing = await _context.Drawings
            .Include(d => d.Layers)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (drawing == null) return Result<DrawingDto>.Fail("Drawing not found", "NOT_FOUND");

        return Result<DrawingDto>.Ok(MapToDto(drawing));
    }

    public async Task<Result<DrawingDto>> UpdateAsync(DrawingDto drawingDto)
    {
        try
        {
            var drawing = await _context.Drawings
                .Include(d => d.Layers)
                .FirstOrDefaultAsync(d => d.Id == drawingDto.Id);

            if (drawing == null) return Result<DrawingDto>.Fail("Drawing not found", "NOT_FOUND");

            drawing.Title = drawingDto.Title;
            drawing.UpdatedAt = DateTime.UtcNow;

            // --- Sincronização Inteligente de Camadas (Smart Sync) ---
            
            // 1. Remover camadas que não existem mais no DTO
            var dtoLayerIds = drawingDto.Layers.Select(l => l.Id).ToHashSet();
            var layersToRemove = drawing.Layers.Where(l => !dtoLayerIds.Contains(l.Id)).ToList();
            _context.Layers.RemoveRange(layersToRemove);

            // 2. Atualizar existentes ou Adicionar novas
            foreach (var dto in drawingDto.Layers)
            {
                var existingLayer = drawing.Layers.FirstOrDefault(l => l.Id == dto.Id);
                
                if (existingLayer != null)
                {
                    // Atualizar propriedades comuns
                    existingLayer.Name = dto.Name;
                    existingLayer.ZIndex = dto.ZIndex;
                    existingLayer.Opacity = dto.Opacity;
                    existingLayer.IsVisible = dto.IsVisible;
                    existingLayer.BlendMode = dto.BlendMode;

                    // Atualizar propriedades específicas
                    if (existingLayer is Core.RasterLayer r && dto is RasterLayerDto rd)
                    {
                        r.DataUrl = rd.DataUrl;
                    }
                    else if (existingLayer is Core.VectorLayer v && dto is VectorLayerDto vd)
                    {
                        v.PathsJson = JsonSerializer.Serialize(vd.Paths, _jsonOptions);
                        v.StrokeColor = vd.StrokeColor;
                        v.StrokeWidth = vd.StrokeWidth;
                        v.FillColor = vd.FillColor;
                        v.IsClosed = vd.IsClosed;
                    }
                    else if (existingLayer is Core.SkeletalLayer s && dto is SkeletalLayerDto sd)
                    {
                        s.BonesJson = JsonSerializer.Serialize(sd.Bones, _jsonOptions);
                        s.IkChainsJson = JsonSerializer.Serialize(sd.IkChains, _jsonOptions);
                        s.SmartActionsJson = JsonSerializer.Serialize(sd.SmartActions, _jsonOptions);
                    }
                }
                else
                {
                    // Adicionar nova camada
                    var newLayer = MapToEntity(dto);
                    newLayer.DrawingId = drawing.Id;
                    drawing.Layers.Add(newLayer);
                }
            }

            await _context.SaveChangesAsync();
            return Result<DrawingDto>.Ok(MapToDto(drawing));
        }
        catch (Exception ex)
        {
            return Result<DrawingDto>.Fail(ex.Message, "DB_ERROR");
        }
    }

    public async Task<Result<bool>> DeleteAsync(string id)
    {
        var drawing = await _context.Drawings.FindAsync(id);
        if (drawing == null) return Result<bool>.Fail("Not found", "NOT_FOUND");

        _context.Drawings.Remove(drawing);
        await _context.SaveChangesAsync();
        return Result<bool>.Ok(true);
    }

    public async Task<Result<PagedList<DrawingDto>>> GetByAuthorAsync(string authorId, int page, int pageSize)
    {
        var query = _context.Drawings.Where(d => d.AuthorId == authorId);
        
        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(d => d.UpdatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Include(d => d.Layers)
            .ToListAsync();

        var pagedList = new PagedList<DrawingDto>
        {
            Items = items.Select(MapToDto).ToList(),
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        };

        return Result<PagedList<DrawingDto>>.Ok(pagedList);
    }

    public async Task<Result<DrawingDto>> AddLayerAsync(string drawingId, LayerBaseDto layerDto)
    {
        var drawing = await _context.Drawings.Include(d => d.Layers).FirstOrDefaultAsync(d => d.Id == drawingId);
        if (drawing == null) return Result<DrawingDto>.Fail("Not found", "NOT_FOUND");

        var entity = MapToEntity(layerDto);
        entity.DrawingId = drawingId;
        
        if (entity.ZIndex == 0)
        {
            entity.ZIndex = (drawing.Layers.Any() ? drawing.Layers.Max(l => l.ZIndex) : 0) + 1;
        }

        drawing.Layers.Add(entity);
        drawing.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Result<DrawingDto>.Ok(MapToDto(drawing));
    }

    // ============================================================================
    // Mapeamento (Mappers)
    // ============================================================================

    private Core.Layer MapToEntity(LayerBaseDto dto)
    {
        if (dto is RasterLayerDto r) return new Core.RasterLayer { Id = r.Id, Name = r.Name, ZIndex = r.ZIndex, Opacity = r.Opacity, IsVisible = r.IsVisible, BlendMode = r.BlendMode, DataUrl = r.DataUrl, BackgroundColor = r.BackgroundColor };
        if (dto is VectorLayerDto v) return new Core.VectorLayer { Id = v.Id, Name = v.Name, ZIndex = v.ZIndex, Opacity = v.Opacity, IsVisible = v.IsVisible, BlendMode = v.BlendMode, PathsJson = JsonSerializer.Serialize(v.Paths, _jsonOptions), StrokeColor = v.StrokeColor, StrokeWidth = v.StrokeWidth, FillColor = v.FillColor, IsClosed = v.IsClosed, BackgroundColor = v.BackgroundColor };
        if (dto is SkeletalLayerDto s) return new Core.SkeletalLayer { Id = s.Id, Name = s.Name, ZIndex = s.ZIndex, Opacity = s.Opacity, IsVisible = s.IsVisible, BlendMode = s.BlendMode, BonesJson = JsonSerializer.Serialize(s.Bones, _jsonOptions), IkChainsJson = JsonSerializer.Serialize(s.IkChains, _jsonOptions), SmartActionsJson = JsonSerializer.Serialize(s.SmartActions, _jsonOptions), BackgroundColor = s.BackgroundColor };
        
        throw new NotSupportedException($"Unknown layer type: {dto.GetType().Name}");
    }

    private LayerBaseDto MapToDto(Core.Layer entity)
    {
        return entity switch
        {
            Core.RasterLayer r => new RasterLayerDto(r.Id, r.Name, r.ZIndex, r.Opacity, r.IsVisible, r.BlendMode, r.DataUrl, r.BackgroundColor),
            Core.VectorLayer v => new VectorLayerDto(v.Id, v.Name, v.ZIndex, v.Opacity, v.IsVisible, v.BlendMode, JsonSerializer.Deserialize<List<List<BezierControlPointDto>>>(v.PathsJson, _jsonOptions) ?? new(), v.StrokeColor, v.StrokeWidth, v.FillColor, v.IsClosed, v.BackgroundColor),
            Core.SkeletalLayer s => new SkeletalLayerDto(s.Id, s.Name, s.ZIndex, s.Opacity, s.IsVisible, s.BlendMode, JsonSerializer.Deserialize<List<BoneDto>>(s.BonesJson, _jsonOptions) ?? new(), JsonSerializer.Deserialize<List<string>>(s.IkChainsJson, _jsonOptions) ?? new(), JsonSerializer.Deserialize<List<SmartActionDto>>(s.SmartActionsJson, _jsonOptions), s.BackgroundColor),
            _ => throw new NotSupportedException()
        };
    }

    private DrawingDto MapToDto(Drawing entity)
    {
        return new DrawingDto
        {
            Id = entity.Id,
            AuthorId = entity.AuthorId,
            Title = entity.Title,
            CanvasSize = new CanvasSizeDto { Width = entity.CanvasWidth, Height = entity.CanvasHeight },
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
            Layers = entity.Layers.OrderBy(l => l.ZIndex).Select(MapToDto).ToList()
        };
    }
}
