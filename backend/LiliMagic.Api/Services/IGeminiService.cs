using LiliMagic.Api.DTOs;

namespace LiliMagic.Api.Services;

/// <summary>
/// Interface para o serviço de integração com a API do Google Gemini.
/// </summary>
public interface IGeminiService
{
    /// <summary>
    /// Obtém resposta de chat da Mimi.
    /// </summary>
    /// <param name="request">Dados da requisição com histórico e perfil</param>
    /// <returns>Resposta da Mimi com texto e monitoramento</returns>
    Task<ChatResponseDto> GetChatResponseAsync(ChatRequestDto request);

    /// <summary>
    /// Converte texto em áudio usando TTS do Gemini.
    /// </summary>
    /// <param name="text">Texto para converter</param>
    /// <param name="voiceName">Nome da voz (opcional)</param>
    /// <returns>Áudio em base64 ou null se falhar</returns>
    Task<string?> GetTtsAudioAsync(string text, string? voiceName = null);

    /// <summary>
    /// Gera uma inspiração criativa para desenho.
    /// </summary>
    /// <param name="profile">Perfil do usuário</param>
    /// <param name="options">Opções do studio</param>
    /// <returns>Texto de inspiração</returns>
    Task<string> GetInspirationAsync(UserProfileDto profile, StudioOptionsDto options);

    /// <summary>
    /// Gera uma imagem mágica baseada no prompt.
    /// </summary>
    /// <param name="prompt">Prompt de descrição</param>
    /// <param name="profile">Perfil do usuário</param>
    /// <param name="options">Opções do studio</param>
    /// <returns>Imagem gerada com URL e metadados</returns>
    Task<ImageResponseDto> GenerateImageAsync(string prompt, UserProfileDto profile, StudioOptionsDto options);
    
    /// <summary>
    /// Analisa uma imagem de personagem e gera um esqueleto (rig) sugerido.
    /// </summary>
    Task<AutoRigResponseDto> AutoRigCharacterAsync(string imageUrl, string characterType);
}
