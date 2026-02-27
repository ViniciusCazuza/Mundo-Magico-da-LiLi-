using System.Text.Json.Serialization;

namespace LiliMagic.Api.DTOs;

/// <summary>
/// Requisição de chat para a Mimi.
/// </summary>
public class ChatRequestDto
{
    /// <summary>
    /// Histórico de mensagens da conversa.
    /// </summary>
    [JsonPropertyName("history")]
    public List<MessageDto> History { get; set; } = new();

    /// <summary>
    /// Perfil do usuário que está conversando.
    /// </summary>
    [JsonPropertyName("profile")]
    public UserProfileDto? Profile { get; set; }

    /// <summary>
    /// Contexto familiar (opcional).
    /// </summary>
    [JsonPropertyName("familyContext")]
    public FamilyContextDto? FamilyContext { get; set; }

    /// <summary>
    /// Contexto do Studio de Arte (opcional).
    /// </summary>
    [JsonPropertyName("studioContext")]
    public StudioContextDto? StudioContext { get; set; }
}

/// <summary>
/// DTO para contexto do Ateliê de Arte.
/// </summary>
public class StudioContextDto
{
    [JsonPropertyName("colorMood")]
    public string? ColorMood { get; set; }

    [JsonPropertyName("activeLayerType")]
    public string? ActiveLayerType { get; set; }

    [JsonPropertyName("drawingTitle")]
    public string? DrawingTitle { get; set; }
}

/// <summary>
/// Resposta do chat da Mimi.
/// </summary>
public class ChatResponseDto
{
    /// <summary>
    /// Resposta de texto da Mimi.
    /// </summary>
    [JsonPropertyName("mimiReply")]
    public string MimiReply { get; set; } = string.Empty;

    /// <summary>
    /// Dados de monitoramento da interação.
    /// </summary>
    [JsonPropertyName("monitoring")]
    public MonitoringDto? Monitoring { get; set; }

    /// <summary>
    /// Áudio em base64 (opcional, quando TTS habilitado).
    /// </summary>
    [JsonPropertyName("audioBase64")]
    public string? AudioBase64 { get; set; }

    /// <summary>
    /// Indica se a fala está habilitada.
    /// </summary>
    [JsonPropertyName("speechEnabled")]
    public bool SpeechEnabled { get; set; }
}

/// <summary>
/// Mensagem individual no histórico.
/// </summary>
public class MessageDto
{
    /// <summary>
    /// Role da mensagem: "user" ou "model".
    /// </summary>
    [JsonPropertyName("role")]
    public string Role { get; set; } = string.Empty;

    /// <summary>
    /// Texto da mensagem.
    /// </summary>
    [JsonPropertyName("text")]
    public string Text { get; set; } = string.Empty;

    /// <summary>
    /// Timestamp da mensagem.
    /// </summary>
    [JsonPropertyName("timestamp")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public long? Timestamp { get; set; }
}

/// <summary>
/// Dados de monitoramento da interação.
/// </summary>
public class MonitoringDto
{
    /// <summary>
    /// Nível de risco detectado (0-5).
    /// </summary>
    [JsonPropertyName("riskLevel")]
    public int RiskLevel { get; set; }

    /// <summary>
    /// Categoria do monitoramento.
    /// </summary>
    [JsonPropertyName("category")]
    public string? Category { get; set; }

    /// <summary>
    /// Análise técnica da interação.
    /// </summary>
    [JsonPropertyName("analysis")]
    public string? Analysis { get; set; }
}
