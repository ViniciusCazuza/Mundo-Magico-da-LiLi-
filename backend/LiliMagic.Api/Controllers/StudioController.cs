using Microsoft.AspNetCore.Mvc;
using LiliMagic.Api.DTOs;
using LiliMagic.Api.Services;
using LiliMagic.Api.Core;

namespace LiliMagic.Api.Controllers;

/// <summary>
/// Controller responsável pelas operações do Studio Mágico (Ateliê).
/// Gerencia desenhos, camadas e integração com IA para geração de arte.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class StudioController : ControllerBase
{
    private readonly IDrawingRepository _repository;
    private readonly IGeminiService _geminiService;
    private readonly ILogger<StudioController> _logger;

    public StudioController(
        IDrawingRepository repository,
        IGeminiService geminiService,
        ILogger<StudioController> logger)
    {
        _repository = repository;
        _geminiService = geminiService;
        _logger = logger;
    }

    // ============================================================================
    // Operações de Desenho (CRUD)
    // ============================================================================

    /// <summary>
    /// Lista desenhos de um autor com paginação.
    /// </summary>
    [HttpGet("drawings")]
    [ProducesResponseType(typeof(PagedList<DrawingDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedList<DrawingDto>>> GetDrawings(
        [FromQuery] string authorId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var result = await _repository.GetByAuthorAsync(authorId, page, pageSize);
        if (!result.Success)
        {
            return StatusCode(500, new ProblemDetails { Title = "Erro ao listar desenhos", Detail = result.Error });
        }
        return Ok(result.Data);
    }

    /// <summary>
    /// Obtém um desenho específico pelo ID.
    /// </summary>
    [HttpGet("drawings/{id}")]
    [ProducesResponseType(typeof(DrawingDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<DrawingDto>> GetDrawing(string id)
    {
        var result = await _repository.GetByIdAsync(id);
        if (!result.Success)
        {
            return NotFound(new ProblemDetails { Title = "Desenho não encontrado", Detail = result.Error });
        }
        return Ok(result.Data);
    }

    /// <summary>
    /// Cria um novo desenho.
    /// </summary>
    [HttpPost("drawings")]
    [ProducesResponseType(typeof(DrawingDto), StatusCodes.Status201Created)]
    public async Task<ActionResult<DrawingDto>> CreateDrawing([FromBody] CreateDrawingRequestDto request)
    {
        var drawing = new DrawingDto
        {
            Id = Guid.NewGuid().ToString(),
            AuthorId = request.AuthorId,
            Title = request.Title,
            CanvasSize = request.CanvasSize,
            Layers = new List<LayerBaseDto>(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var result = await _repository.CreateAsync(drawing);
        if (!result.Success)
        {
            return StatusCode(500, new ProblemDetails { Title = "Erro ao criar desenho", Detail = result.Error });
        }

        return CreatedAtAction(nameof(GetDrawing), new { id = result.Data.Id }, result.Data);
    }

    /// <summary>
    /// Atualiza os metadados de um desenho.
    /// </summary>
    [HttpPut("drawings/{id}")]
    [ProducesResponseType(typeof(DrawingDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<DrawingDto>> UpdateDrawing(string id, [FromBody] UpdateDrawingRequestDto request)
    {
        var existingResult = await _repository.GetByIdAsync(id);
        if (!existingResult.Success)
        {
            return NotFound(new ProblemDetails { Title = "Desenho não encontrado" });
        }

        var updatedDrawing = existingResult.Data with
        {
            Title = request.Title,
            UpdatedAt = DateTime.UtcNow
        };

        var result = await _repository.UpdateAsync(updatedDrawing);
        return result.Success ? Ok(result.Data) : StatusCode(500, result.Error);
    }

    /// <summary>
    /// Exclui um desenho.
    /// </summary>
    [HttpDelete("drawings/{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteDrawing(string id)
    {
        var result = await _repository.DeleteAsync(id);
        return result.Success ? NoContent() : NotFound();
    }

    // ============================================================================
    // Operações de Camadas
    // ============================================================================

    /// <summary>
    /// Adiciona uma camada a um desenho.
    /// </summary>
    [HttpPost("drawings/{id}/layers")]
    [ProducesResponseType(typeof(DrawingDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<DrawingDto>> AddLayer(string id, [FromBody] AddLayerRequestDto request)
    {
        LayerBaseDto layer;
        var layerId = Guid.NewGuid().ToString();

        // Determina o tipo de camada e cria o DTO correspondente
        if (request.LayerType == DrawingLayerType.Raster)
        {
            layer = new RasterLayerDto(
                layerId,
                request.Name,
                0, // ZIndex será calculado pelo repositório
                1.0,
                true,
                "normal",
                request.Content,
                null
            );
        }
        else if (request.LayerType == DrawingLayerType.Vector)
        {
            var paths = new List<List<BezierControlPointDto>>();
            if (!string.IsNullOrEmpty(request.Content))
            {
                try { paths = System.Text.Json.JsonSerializer.Deserialize<List<List<BezierControlPointDto>>>(request.Content, new System.Text.Json.JsonSerializerOptions { PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase }) ?? paths; } catch { /* ignore */ }
            }

            layer = new VectorLayerDto(
                layerId,
                request.Name,
                0,
                1.0,
                true,
                "normal",
                paths,
                "#000000",
                2.0,
                "transparent",
                false,
                null
            );
        }
        else if (request.LayerType == DrawingLayerType.Skeletal)
        {
            var bones = new List<BoneDto>();
            if (!string.IsNullOrEmpty(request.Content))
            {
                try { bones = System.Text.Json.JsonSerializer.Deserialize<List<BoneDto>>(request.Content, new System.Text.Json.JsonSerializerOptions { PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase }) ?? bones; } catch { /* ignore */ }
            }

            layer = new SkeletalLayerDto(
                layerId,
                request.Name,
                0,
                1.0,
                true,
                "normal",
                bones,
                new List<string>(),
                new List<SmartActionDto>(),
                null
            );
        }
        else
        {
            return BadRequest(new ProblemDetails { Title = "Tipo de camada inválido" });
        }

        var result = await _repository.AddLayerAsync(id, layer);
        return result.Success ? Ok(result.Data) : StatusCode(500, result.Error);
    }

    /// <summary>
    /// Atualiza uma camada existente.
    /// </summary>
    [HttpPut("drawings/{id}/layers/{layerId}")]
    [ProducesResponseType(typeof(DrawingDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<DrawingDto>> UpdateLayer(string id, string layerId, [FromBody] UpdateLayerRequestDto request)
    {
        var drawingResult = await _repository.GetByIdAsync(id);
        if (!drawingResult.Success) return NotFound();

        var layers = drawingResult.Data.Layers;
        var layerIndex = layers.FindIndex(l => l.Id == layerId);
        if (layerIndex == -1) return NotFound("Camada não encontrada");

        var oldLayer = layers[layerIndex];
        LayerBaseDto newLayer;

        if (oldLayer is RasterLayerDto raster)
        {
            newLayer = raster with { Name = request.Name, DataUrl = request.Content };
        }
        else if (oldLayer is VectorLayerDto vector)
        {
            var paths = vector.Paths;
            if (!string.IsNullOrEmpty(request.Content))
            {
                try
                {
                    paths = System.Text.Json.JsonSerializer.Deserialize<List<List<BezierControlPointDto>>>(
                        request.Content, 
                        new System.Text.Json.JsonSerializerOptions { PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase }
                    ) ?? paths;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Falha ao desserializar conteúdo vetorial para a camada {LayerId}", layerId);
                }
            }
            newLayer = vector with { Name = request.Name, Paths = paths };
        }
        else if (oldLayer is SkeletalLayerDto skeletal)
        {
            var bones = skeletal.Bones;
            var smartActions = skeletal.SmartActions;
            
            if (!string.IsNullOrEmpty(request.Content))
            {
                try
                {
                    var data = System.Text.Json.JsonDocument.Parse(request.Content);
                    if (data.RootElement.TryGetProperty("bones", out var bonesEl))
                    {
                        bones = System.Text.Json.JsonSerializer.Deserialize<List<BoneDto>>(
                            bonesEl.GetRawText(),
                            new System.Text.Json.JsonSerializerOptions { PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase }
                        ) ?? bones;
                    }
                    
                    if (data.RootElement.TryGetProperty("smartActions", out var actionsEl))
                    {
                        smartActions = System.Text.Json.JsonSerializer.Deserialize<List<SmartActionDto>>(
                            actionsEl.GetRawText(),
                            new System.Text.Json.JsonSerializerOptions { PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase }
                        ) ?? smartActions;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Falha ao desserializar conteúdo esquelético para a camada {LayerId}", layerId);
                }
            }
            newLayer = skeletal with { Name = request.Name, Bones = bones, SmartActions = smartActions };
        }
        else
        {
            newLayer = oldLayer with { Name = request.Name };
        }

        layers[layerIndex] = newLayer;
        var result = await _repository.UpdateAsync(drawingResult.Data with { Layers = layers });
        
        return result.Success ? Ok(result.Data) : StatusCode(500, result.Error);
    }

    /// <summary>
    /// Remove uma camada de um desenho.
    /// </summary>
    [HttpDelete("drawings/{id}/layers/{layerId}")]
    [ProducesResponseType(typeof(DrawingDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<DrawingDto>> RemoveLayer(string id, string layerId)
    {
        var drawingResult = await _repository.GetByIdAsync(id);
        if (!drawingResult.Success) return NotFound();

        var layers = drawingResult.Data.Layers;
        layers.RemoveAll(l => l.Id == layerId);

        var result = await _repository.UpdateAsync(drawingResult.Data with { Layers = layers });
        return result.Success ? Ok(result.Data) : StatusCode(500, result.Error);
    }

    // ============================================================================
    // Operações de IA
    // ============================================================================

    /// <summary>
    /// Gera inspiração criativa para o desenho.
    /// </summary>
    [HttpPost("inspiration")]
    [ProducesResponseType(typeof(InspirationResponseDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<InspirationResponseDto>> GetInspiration([FromBody] InspirationRequestDto request)
    {
        try
        {
            var inspiration = await _geminiService.GetInspirationAsync(request.Profile, request.Options);
            return Ok(new InspirationResponseDto { Inspiration = inspiration });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao gerar inspiração");
            return StatusCode(500, "A Mimi se distraiu com uma borboleta. Tente novamente!");
        }
    }

    /// <summary>
    /// Gera uma imagem mágica baseada em IA.
    /// </summary>
    [HttpPost("generate-image")]
    [ProducesResponseType(typeof(ImageResponseDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<ImageResponseDto>> GenerateImage([FromBody] ImageRequestDto request)
    {
        try
        {
            _logger.LogInformation("Gerando imagem mágica para o prompt: {Prompt}", request.Prompt);
            var result = await _geminiService.GenerateImageAsync(request.Prompt, request.Profile, request.Options);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao gerar imagem");
            return StatusCode(500, "A Mimi tentou pintar, mas a tinta mágica acabou. Tente novamente!");
        }
    }

    /// <summary>
    /// Detecta automaticamente o esqueleto de um personagem em uma imagem.
    /// </summary>
    [HttpPost("auto-rig")]
    [ProducesResponseType(typeof(AutoRigResponseDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<AutoRigResponseDto>> AutoRig([FromBody] AutoRigRequestDto request)
    {
        try
        {
            _logger.LogInformation("Iniciando Auto-Rigging para o tipo: {CharacterType}", request.CharacterType);
            var result = await _geminiService.AutoRigCharacterAsync(request.ImageUrl, request.CharacterType);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro no Auto-Rigging");
            return StatusCode(500, "A Mimi tentou sentir os ossinhos do desenho, mas se atrapalhou. Tente novamente!");
        }
    }
}
