using System.Text;
using System.Text.Json;
using LiliMagic.Api.DTOs;
using LiliMagic.Api.Data;
using LiliMagic.Api.Core;
using Microsoft.EntityFrameworkCore;

namespace LiliMagic.Api.Services;

/// <summary>
/// Serviço para integração com a API do Google Gemini.
/// Implementa a comunicação segura com a API, mantendo a chave no servidor.
/// </summary>
public class GeminiService : IGeminiService
{
    private readonly IConfiguration _configuration;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<GeminiService> _logger;
    private readonly AppDbContext _context;

    private const string GeminiApiBaseUrl = "https://generativelanguage.googleapis.com/v1beta";
    private const string ChatModel = "gemini-2.0-flash";
    private const string TtsModel = "gemini-2.5-flash-preview-tts";
    private const string ImageModel = "gemini-2.0-flash-exp-image-generation";

    public GeminiService(
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory,
        ILogger<GeminiService> logger,
        AppDbContext context)
    {
        _configuration = configuration;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
        _context = context;
    }

    /// <summary>
    /// Obtém a chave da API de forma segura.
    /// </summary>
    private string? GetApiKey()
    {
        var apiKey = _configuration["GEMINI_API_KEY"] 
                     ?? Environment.GetEnvironmentVariable("GEMINI_API_KEY");
        
        if (string.IsNullOrEmpty(apiKey))
        {
            _logger.LogWarning("GEMINI_API_KEY não configurada");
        }
        
        return apiKey;
    }

    /// <summary>
    /// Constrói a instrução do sistema baseada no perfil, contexto familiar e contexto do Ateliê.
    /// </summary>
    private async Task<string> BuildSystemInstructionAsync(UserProfileDto profile, FamilyContextDto? family, StudioContextDto? studio)
    {
        var age = int.TryParse(profile.Age, out var parsedAge) ? parsedAge : 8;
        
        var pets = family?.Pets?.Any() == true 
            ? string.Join(", ", family.Pets) 
            : "Nenhum cadastrado";
        
        var values = family?.FamilyValues ?? "Nenhum valor específico configurado";
        
        var siblings = family?.Siblings?.Any() == true 
            ? string.Join(", ", family.Siblings) 
            : "Nenhum mencionado";

        var customTraining = profile.AdditionalKnowledge?.Any() == true
            ? string.Join("\n- ", profile.AdditionalKnowledge.Select(k => k.Content))
            : "Nenhuma instrução adicional.";

        var studioInfo = studio != null 
            ? $"\nCONTEXTO DO ATELIÊ (O que a {profile.Nickname} está criando agora):\n- Obra em progresso: \"{studio.DrawingTitle ?? "Uma nova obra prima"}\"\n- Humor das Cores: {studio.ColorMood ?? "Colorido e Mágico"}\n- Técnica: {studio.ActiveLayerType ?? "Pincelada livre"}"
            : "";

        // Recuperar memórias narrativas (Passo 17)
        var memories = await _context.MimiMemories
            .Where(m => m.AuthorId == (profile.Id ?? "anonymous"))
            .OrderByDescending(m => m.CreatedAt)
            .Take(10)
            .Select(m => m.Fact)
            .ToListAsync();

        var mimiMemoriesText = memories.Any() 
            ? "\nMINHAS MEMÓRIAS COM A ALICE (Fatos que você já aprendeu):\n- " + string.Join("\n- ", memories)
            : "";

        return $@"Você é a Mimi, a gatinha mágica de estimação da {profile.Nickname}. 
Sua voz é doce, calma e você é 100% FIEL à verdade registrada no perfil da Alice.

DIRETRIZ DE VERDADE ABSOLUTA (FONTE DE VERDADE):
1. NUNCA INVENTE FATOS: Se uma informação NÃO estiver no JSON abaixo, ela NÃO existe.
2. SE NÃO SABE, PERGUNTE: NUNCA chute um nome ou fato biográfico.
3. PRIORIDADE DOS PAIS (TREINAMENTO CUSTOM): Abaixo há instruções diretas dos pais. Elas são a LEI suprema sobre como você deve agir ou o que deve saber.
4. ALUCINAÇÃO ZERO: Inventar dados pessoais resultará em falha crítica de segurança.

BASE DE DADOS OFICIAL DA ALICE:
- Nome/Apelido: {profile.Nickname}
- Idade: {age} anos
- Cabelo: {profile.HairType ?? "Não informado"} {profile.HairColor ?? ""}
- Óculos/Aparelho: {(profile.HasGlasses ? "Sim" : "Não")} / {(profile.HasBraces ? "Sim" : "Não")}
- Cor Favorita: {profile.FavoriteColor ?? "Pergunte para ela"}
- Superpoder: {profile.DreamPower ?? "Ela ainda está descobrindo"}
{studioInfo}
{mimiMemoriesText}

CONTEXTO FAMILIAR:
- Pais: {family?.MotherName ?? "Mãe"} e {family?.FatherName ?? "Pai"}
- Irmãos: {siblings}
- Pets: {pets}
- Valores da Família: {values}

TREINAMENTO PERSONALIZADO (SOBERANIA PARENTAL):
- {customTraining}

INSTRUÇÕES DE COMPORTAMENTO:
- Comece de forma doce: ""Miau! {{fala carinhosa}}""
- INTERATIVIDADE: Se a {profile.Nickname} estiver desenhando (veja CONTEXTO DO ATELIÊ), faça elogios específicos ao humor das cores ou ao título da obra.
- MEMÓRIA ATIVA: Use os fatos em ""MINHAS MEMÓRIAS"" para mostrar que você se lembra do que conversaram antes.
- Monitore riscos: Se detectar tristeza, mencione o carinho da família.

RESPOSTA OBRIGATÓRIA (JSON):
{{
  ""mimiReply"": ""Sua fala de gatinha mágica"",
  ""monitoring"": {{
    ""riskLevel"": 0-5,
    ""category"": ""emoção/segurança"",
    ""analysis"": ""Análise técnica""
  }},
  ""newMemory"": ""Opcional: Um novo fato importante que você aprendeu sobre a Alice nesta conversa para eu guardar no meu bauzinho.""
}}";
    }

    /// <summary>
    /// Obtém resposta de chat da Mimi.
    /// </summary>
    public async Task<ChatResponseDto> GetChatResponseAsync(ChatRequestDto request)
    {
        var apiKey = GetApiKey();
        if (string.IsNullOrEmpty(apiKey))
        {
            return new ChatResponseDto
            {
                MimiReply = "Miau! Estou com problemas técnicos para acessar minha magia. Chame um adulto!",
                Monitoring = new MonitoringDto { RiskLevel = 0, Category = "sistema", Analysis = "API Key não configurada" }
            };
        }

        try
        {
            var client = _httpClientFactory.CreateClient();
            var url = $"{GeminiApiBaseUrl}/models/{ChatModel}:generateContent?key={apiKey}";

            var systemInstruction = await BuildSystemInstructionAsync(
                request.Profile ?? new UserProfileDto { Nickname = "criança", Age = "8", Id = "anonymous" },
                request.FamilyContext,
                request.StudioContext
            );

            var contents = request.History.Select(msg => 
            {
                var sanitizedText = msg.Role == "user" 
                    ? (msg.Text ?? "").Replace("\"", "'").Replace("[", "(").Replace("]", ")")
                    : msg.Text;
                
                return new
                {
                    role = msg.Role == "user" ? "user" : "model",
                    parts = new[] { new { text = sanitizedText } }
                };
            }).ToList();

            var requestBody = new
            {
                contents,
                systemInstruction = new
                {
                    parts = new[] { new { text = systemInstruction } }
                },
                generationConfig = new
                {
                    responseMimeType = "application/json"
                }
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await client.PostAsync(url, content);
            response.EnsureSuccessStatusCode();

            var responseJson = await response.Content.ReadAsStringAsync();
            var geminiResponse = JsonSerializer.Deserialize<GeminiResponseDto>(responseJson, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            var responseText = geminiResponse?.Candidates?.FirstOrDefault()?.Content?.Parts?.FirstOrDefault()?.Text;
            
            if (string.IsNullOrEmpty(responseText))
            {
                throw new Exception("Resposta vazia do Gemini");
            }

            var mimiResult = JsonSerializer.Deserialize<MimiResultDto>(responseText, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            // Persistir nova memória se detectada
            if (!string.IsNullOrEmpty(mimiResult?.NewMemory) && !string.IsNullOrEmpty(request.Profile?.Id))
            {
                await SaveMemoryInternalAsync(request.Profile.Id, mimiResult.NewMemory);
            }

            return new ChatResponseDto
            {
                MimiReply = mimiResult?.MimiReply ?? "Miau! Não entendi. Pode repetir?",
                Monitoring = mimiResult?.Monitoring ?? new MonitoringDto { RiskLevel = 0 },
                SpeechEnabled = request.Profile?.AutoAudio ?? false
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao chamar API do Gemini para chat");
            return new ChatResponseDto
            {
                MimiReply = "Miau! Tive um soluço mágico. Pode repetir o que disse?",
                Monitoring = new MonitoringDto { RiskLevel = 0, Category = "erro", Analysis = ex.Message }
            };
        }
    }

    private async Task SaveMemoryInternalAsync(string authorId, string fact)
    {
        try
        {
            var memory = new MimiMemory
            {
                Id = Guid.NewGuid().ToString(),
                AuthorId = authorId,
                Fact = fact,
                CreatedAt = DateTime.UtcNow
            };
            _context.MimiMemories.Add(memory);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Nova memória guardada para {AuthorId}: {Fact}", authorId, fact);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Falha ao persistir memória narrativa");
        }
    }

    public async Task<string?> GetTtsAudioAsync(string text, string? voiceName = null)
    {
        var apiKey = GetApiKey();
        if (string.IsNullOrEmpty(apiKey) || string.IsNullOrWhiteSpace(text)) return null;

        try
        {
            var client = _httpClientFactory.CreateClient();
            var url = $"{GeminiApiBaseUrl}/models/{TtsModel}:generateContent?key={apiKey}";

            var requestBody = new
            {
                contents = new[] { new { parts = new[] { new { text = $"Diga carinhosamente: {text}" } } } },
                generationConfig = new { responseModalities = new[] { "AUDIO" }, speechConfig = new { voiceConfig = new { prebuiltVoiceConfig = new { voiceName = voiceName ?? "Kore" } } } }
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await client.PostAsync(url, content);
            response.EnsureSuccessStatusCode();
            var responseJson = await response.Content.ReadAsStringAsync();
            var geminiResponse = JsonSerializer.Deserialize<GeminiResponseDto>(responseJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            return geminiResponse?.Candidates?.FirstOrDefault()?.Content?.Parts?.FirstOrDefault()?.InlineData?.Data;
        }
        catch { return null; }
    }

    public async Task<string> GetInspirationAsync(UserProfileDto profile, StudioOptionsDto options)
    {
        var apiKey = GetApiKey();
        if (string.IsNullOrEmpty(apiKey)) return "Miau! Que tal a gente voando em um balão de sabão?";

        try
        {
            var client = _httpClientFactory.CreateClient();
            var url = $"{GeminiApiBaseUrl}/models/{ChatModel}:generateContent?key={apiKey}";
            var context = $@"Você é a Mimi, gatinha mágica da {profile.Nickname}. Sugira uma ideia curta para um desenho. Estilo: {options.ArtStyle}, Nível: {options.FantasyLevel}/5. Máximo 15 palavras.";
            var requestBody = new { contents = new[] { new { parts = new[] { new { text = context } } } } };
            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await client.PostAsync(url, content);
            var responseJson = await response.Content.ReadAsStringAsync();
            var geminiResponse = JsonSerializer.Deserialize<GeminiResponseDto>(responseJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            return geminiResponse?.Candidates?.FirstOrDefault()?.Content?.Parts?.FirstOrDefault()?.Text?.Trim() ?? "Um jardim mágico!";
        }
        catch { return "Miau! Vamos desenhar algo lindo?"; }
    }

    public async Task<ImageResponseDto> GenerateImageAsync(string prompt, UserProfileDto profile, StudioOptionsDto options)
    {
        var apiKey = GetApiKey();
        if (string.IsNullOrEmpty(apiKey)) throw new Exception("API Key não configurada");

        var optionsKey = JsonSerializer.Serialize(new { s = options.ArtStyle, f = options.FantasyLevel, d = options.DetailLevel, i = options.IllustrationType, fr = options.Framing ?? "none", o = options.Orientation });
        var profileKey = $"{profile.Id}_{profile.SkinTone}_{profile.HairColor}_{profile.HairType}";
        var currentHash = Convert.ToBase64String(Encoding.UTF8.GetBytes(Uri.EscapeDataString(prompt.Trim().ToLower() + profileKey + optionsKey)));

        try
        {
            var client = _httpClientFactory.CreateClient();
            var url = $"{GeminiApiBaseUrl}/models/{ImageModel}:generateContent?key={apiKey}";
            var styleMap = new Dictionary<string, string> { ["watercolor"] = "estilo aquarela", ["3d"] = "estilo 3D fofo", ["crayon"] = "estilo giz de cera", ["papercut"] = "estilo papel", ["storybook"] = "estilo livro" };
            var identityContext = $"[SYSTEM] Estilo: {styleMap.GetValueOrDefault(options.ArtStyle, "aquarela")}. Personagem: {profile.Nickname}, {profile.Age} anos. Pele: {profile.SkinTone}. Cabelo: {profile.HairType} {profile.HairColor}. Prompt: {prompt}";
            var requestBody = new { contents = new[] { new { parts = new[] { new { text = identityContext } } } }, generationConfig = new { responseModalities = new[] { "image", "text" }, imageConfig = new { aspectRatio = options.Orientation == "horizontal" ? "4:3" : options.Orientation == "vertical" ? "3:4" : "1:1" } } };
            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var httpResponse = await client.PostAsync(url, content);
            var responseJson = await httpResponse.Content.ReadAsStringAsync();
            var geminiResponse = JsonSerializer.Deserialize<GeminiResponseDto>(responseJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            string imageUrl = "";
            string revisedPrompt = "";
            if (geminiResponse?.Candidates?.FirstOrDefault()?.Content?.Parts != null) { foreach (var part in geminiResponse.Candidates.First().Content.Parts) { if (part.InlineData != null) imageUrl = $"data:{part.InlineData.MimeType ?? "image/png"};base64,{part.InlineData.Data}"; else if (!string.IsNullOrEmpty(part.Text)) revisedPrompt = part.Text; } }
            return new ImageResponseDto { ImageUrl = imageUrl, RevisedPrompt = revisedPrompt, GenerationHash = currentHash };
        }
        catch { throw; }
    }

    public async Task<AutoRigResponseDto> AutoRigCharacterAsync(string imageUrl, string characterType)
    {
        var apiKey = GetApiKey();
        var client = _httpClientFactory.CreateClient();
        var url = $"{GeminiApiBaseUrl}/models/{ChatModel}:generateContent?key={apiKey}";
        var base64Data = imageUrl.Contains(",") ? imageUrl.Split(',')[1] : imageUrl;
        var mimeType = imageUrl.Contains(";") ? imageUrl.Split(';')[0].Replace("data:", "") : "image/png";
        var prompt = "Analise o rig 2D desta imagem. Retorne JSON com bones.";
        var requestBody = new { contents = new[] { new { parts = new object[] { new { text = prompt }, new { inline_data = new { mime_type = mimeType, data = base64Data } } } } }, generationConfig = new { responseMimeType = "application/json" } };
        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        var response = await client.PostAsync(url, content);
        var responseJson = await response.Content.ReadAsStringAsync();
        var geminiResponse = JsonSerializer.Deserialize<GeminiResponseDto>(responseJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        return JsonSerializer.Deserialize<AutoRigResponseDto>(geminiResponse?.Candidates?.FirstOrDefault()?.Content?.Parts?.FirstOrDefault()?.Text ?? "{}", new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new AutoRigResponseDto();
    }
}

#region DTOs internos para deserialização

internal class GeminiResponseDto
{
    public List<GeminiCandidateDto>? Candidates { get; set; }
}

internal class GeminiCandidateDto
{
    public GeminiContentDto? Content { get; set; }
}

internal class GeminiContentDto
{
    public List<GeminiPartDto>? Parts { get; set; }
}

internal class GeminiPartDto
{
    public string? Text { get; set; }
    public GeminiInlineDataDto? InlineData { get; set; }
}

internal class GeminiInlineDataDto
{
    public string? Data { get; set; }
    public string? MimeType { get; set; }
}

internal class MimiResultDto
{
    public string? MimiReply { get; set; }
    public MonitoringDto? Monitoring { get; set; }
    public string? NewMemory { get; set; }
}

#endregion
