using System.Text.Json.Serialization;

namespace LiliMagic.Api.DTOs;

/// <summary>
/// Requisição de Text-to-Speech.
/// </summary>
public class TtsRequestDto
{
    /// <summary>
    /// Texto para converter em áudio.
    /// </summary>
    [JsonPropertyName("text")]
    public string Text { get; set; } = string.Empty;

    /// <summary>
    /// Nome da voz a ser utilizada (opcional).
    /// </summary>
    [JsonPropertyName("voiceName")]
    public string? VoiceName { get; set; } = "Kore";
}

/// <summary>
/// Resposta do Text-to-Speech.
/// </summary>
public class TtsResponseDto
{
    /// <summary>
    /// Áudio codificado em base64.
    /// </summary>
    [JsonPropertyName("audioBase64")]
    public string? AudioBase64 { get; set; }
}
