using Microsoft.AspNetCore.Mvc;
using LiliMagic.Api.DTOs;
using LiliMagic.Api.Services;

namespace LiliMagic.Api.Controllers;

/// <summary>
/// Controller responsável por gerenciar as interações com a IA (Mimi).
/// Atua como gateway seguro entre o frontend e a API do Google Gemini.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AiController : ControllerBase
{
    private readonly IGeminiService _geminiService;
    private readonly ILogger<AiController> _logger;

    public AiController(IGeminiService geminiService, ILogger<AiController> logger)
    {
        _geminiService = geminiService;
        _logger = logger;
    }

    /// <summary>
    /// Endpoint principal para chat com a Mimi.
    /// Recebe o histórico de conversa e perfil do usuário, retorna a resposta da IA.
    /// </summary>
    /// <param name="request">Dados da requisição com histórico e perfil</param>
    /// <returns>Resposta da Mimi com texto e monitoramento</returns>
    [HttpPost("chat")]
    [ProducesResponseType(typeof(ChatResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ChatResponseDto>> Chat([FromBody] ChatRequestDto request)
    {
        try
        {
            _logger.LogInformation("Recebida requisição de chat para o perfil: {ProfileName}", 
                request.Profile?.Nickname ?? "Desconhecido");

            if (request.History == null || request.History.Count == 0)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Histórico vazio",
                    Detail = "O histórico de mensagens é obrigatório para processar a conversa."
                });
            }

            var response = await _geminiService.GetChatResponseAsync(request);

            _logger.LogInformation("Resposta gerada com sucesso. Nível de risco: {RiskLevel}", 
                response.Monitoring?.RiskLevel ?? 0);

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao processar requisição de chat");
            return StatusCode(500, new ProblemDetails
            {
                Title = "Erro interno",
                Detail = "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente."
            });
        }
    }

    /// <summary>
    /// Endpoint para geração de áudio TTS (Text-to-Speech).
    /// </summary>
    /// <param name="request">Texto para converter em áudio</param>
    /// <returns>Áudio em formato base64</returns>
    [HttpPost("tts")]
    [ProducesResponseType(typeof(TtsResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<TtsResponseDto>> TextToSpeech([FromBody] TtsRequestDto request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Text))
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Texto vazio",
                    Detail = "O texto é obrigatório para gerar áudio."
                });
            }

            var audioBase64 = await _geminiService.GetTtsAudioAsync(request.Text);

            return Ok(new TtsResponseDto
            {
                AudioBase64 = audioBase64
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao gerar áudio TTS");
            return StatusCode(500, new ProblemDetails
            {
                Title = "Erro na geração de áudio",
                Detail = "Não foi possível gerar o áudio. Por favor, tente novamente."
            });
        }
    }
}
