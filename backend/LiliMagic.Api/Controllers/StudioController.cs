using Microsoft.AspNetCore.Mvc;
using LiliMagic.Api.DTOs;
using LiliMagic.Api.Services;

namespace LiliMagic.Api.Controllers;

/// <summary>
/// Controller responsável por gerenciar as funcionalidades do Studio de Arte.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class StudioController : ControllerBase
{
    private readonly IGeminiService _geminiService;
    private readonly ILogger<StudioController> _logger;

    public StudioController(IGeminiService geminiService, ILogger<StudioController> logger)
    {
        _geminiService = geminiService;
        _logger = logger;
    }

    /// <summary>
    /// Gera uma inspiração criativa para desenho.
    /// </summary>
    [HttpPost("inspiration")]
    [ProducesResponseType(typeof(InspirationResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<InspirationResponseDto>> GenerateInspiration([FromBody] InspirationRequestDto request)
    {
        try
        {
            var inspiration = await _geminiService.GetInspirationAsync(request.Profile, request.Options);
            return Ok(new InspirationResponseDto { Inspiration = inspiration });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao gerar inspiração");
            return StatusCode(500, new ProblemDetails
            {
                Title = "Erro na geração",
                Detail = "Não foi possível gerar a inspiração."
            });
        }
    }

    /// <summary>
    /// Gera uma imagem mágica baseada no prompt e configurações.
    /// </summary>
    [HttpPost("generate-image")]
    [ProducesResponseType(typeof(ImageResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ImageResponseDto>> GenerateImage([FromBody] ImageRequestDto request)
    {
        try
        {
            var result = await _geminiService.GenerateImageAsync(request.Prompt, request.Profile, request.Options);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao gerar imagem");
            return StatusCode(500, new ProblemDetails
            {
                Title = "Erro na geração",
                Detail = "A Mimi tentou pintar, mas a tinta mágica acabou."
            });
        }
    }
}
