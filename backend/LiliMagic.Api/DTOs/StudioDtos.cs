using System.Text.Json.Serialization;

namespace LiliMagic.Api.DTOs;

/// <summary>
/// Requisição para gerar inspiração criativa.
/// </summary>
public class InspirationRequestDto
{
    [JsonPropertyName("profile")]
    public UserProfileDto Profile { get; set; } = new();

    [JsonPropertyName("options")]
    public StudioOptionsDto Options { get; set; } = new();
}

/// <summary>
/// Resposta com a inspiração criativa.
/// </summary>
public class InspirationResponseDto
{
    [JsonPropertyName("inspiration")]
    public string Inspiration { get; set; } = string.Empty;
}

/// <summary>
/// Requisição para gerar imagem.
/// </summary>
public class ImageRequestDto
{
    [JsonPropertyName("prompt")]
    public string Prompt { get; set; } = string.Empty;

    [JsonPropertyName("profile")]
    public UserProfileDto Profile { get; set; } = new();

    [JsonPropertyName("options")]
    public StudioOptionsDto Options { get; set; } = new();
}

/// <summary>
/// Resposta com a imagem gerada.
/// </summary>
public class ImageResponseDto
{
    [JsonPropertyName("imageUrl")]
    public string ImageUrl { get; set; } = string.Empty;

    [JsonPropertyName("revisedPrompt")]
    public string? RevisedPrompt { get; set; }

    [JsonPropertyName("generationHash")]
    public string GenerationHash { get; set; } = string.Empty;
}

/// <summary>
/// Opções do Studio de arte.
/// </summary>
public class StudioOptionsDto
{
    [JsonPropertyName("artStyle")]
    public string ArtStyle { get; set; } = "watercolor";

    [JsonPropertyName("fantasyLevel")]
    public int FantasyLevel { get; set; } = 3;

    [JsonPropertyName("detailLevel")]
    public string DetailLevel { get; set; } = "balanced";

    [JsonPropertyName("illustrationType")]
    public string IllustrationType { get; set; } = "scene";

    [JsonPropertyName("framing")]
    public string? Framing { get; set; }

    [JsonPropertyName("orientation")]
    public string Orientation { get; set; } = "square";

    [JsonPropertyName("textConfig")]
    public TextConfigDto TextConfig { get; set; } = new();
}

/// <summary>
/// Configuração de texto na imagem.
/// </summary>
public class TextConfigDto
{
    [JsonPropertyName("enabled")]
    public bool Enabled { get; set; } = false;

    [JsonPropertyName("content")]
    public string Content { get; set; } = string.Empty;
}
