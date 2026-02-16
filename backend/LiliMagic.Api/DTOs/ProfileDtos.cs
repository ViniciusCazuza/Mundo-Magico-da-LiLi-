using System.Text.Json.Serialization;

namespace LiliMagic.Api.DTOs;

/// <summary>
/// Perfil do usuário (criança).
/// </summary>
public class UserProfileDto
{
    [JsonPropertyName("id")]
    public string? Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("nickname")]
    public string Nickname { get; set; } = string.Empty;

    [JsonPropertyName("age")]
    public string Age { get; set; } = "8";

    [JsonPropertyName("preferences")]
    public string Preferences { get; set; } = string.Empty;

    [JsonPropertyName("emotionalSensitivity")]
    public int EmotionalSensitivity { get; set; } = 5;

    [JsonPropertyName("autoAudio")]
    public bool AutoAudio { get; set; } = true;

    // Imagem de perfil
    [JsonPropertyName("profileImage")]
    public ProfileImageDto? ProfileImage { get; set; }

    // Identidade & Características Físicas
    [JsonPropertyName("nameMeaning")]
    public string? NameMeaning { get; set; }

    [JsonPropertyName("calledHow")]
    public string? CalledHow { get; set; }

    [JsonPropertyName("hairType")]
    public string? HairType { get; set; }

    [JsonPropertyName("hairColor")]
    public string? HairColor { get; set; }

    [JsonPropertyName("eyeColor")]
    public string? EyeColor { get; set; }

    [JsonPropertyName("skinTone")]
    public string? SkinTone { get; set; }

    [JsonPropertyName("hasGlasses")]
    public bool HasGlasses { get; set; }

    [JsonPropertyName("hasBraces")]
    public bool HasBraces { get; set; }

    [JsonPropertyName("visualNotes")]
    public string? VisualNotes { get; set; }

    // Gostos & Preferências
    [JsonPropertyName("birthday")]
    public string? Birthday { get; set; }

    [JsonPropertyName("favoriteColor")]
    public string? FavoriteColor { get; set; }

    [JsonPropertyName("favoriteAnimal")]
    public string? FavoriteAnimal { get; set; }

    [JsonPropertyName("favoriteEmoji")]
    public string? FavoriteEmoji { get; set; }

    [JsonPropertyName("favoriteDrawing")]
    public string? FavoriteDrawing { get; set; }

    [JsonPropertyName("favoriteCharacter")]
    public string? FavoriteCharacter { get; set; }

    [JsonPropertyName("favoritePlay")]
    public string? FavoritePlay { get; set; }

    [JsonPropertyName("favoriteMusic")]
    public string? FavoriteMusic { get; set; }

    [JsonPropertyName("favoritePlace")]
    public string? FavoritePlace { get; set; }

    [JsonPropertyName("favoriteSeason")]
    public string? FavoriteSeason { get; set; }

    // Sonhos & Imaginação
    [JsonPropertyName("dreamDrawing")]
    public string? DreamDrawing { get; set; }

    [JsonPropertyName("dreamCharacter")]
    public string? DreamCharacter { get; set; }

    [JsonPropertyName("dreamJob")]
    public string? DreamJob { get; set; }

    [JsonPropertyName("dreamPower")]
    public string? DreamPower { get; set; }

    [JsonPropertyName("dreamPlace")]
    public string? DreamPlace { get; set; }

    [JsonPropertyName("biggestDream")]
    public string? BiggestDream { get; set; }

    // Rotina & Comportamento
    [JsonPropertyName("favoriteFood")]
    public string? FavoriteFood { get; set; }

    [JsonPropertyName("dislikedFood")]
    public string? DislikedFood { get; set; }

    [JsonPropertyName("bestMomentOfDay")]
    public string? BestMomentOfDay { get; set; }

    [JsonPropertyName("favoriteSubject")]
    public string? FavoriteSubject { get; set; }

    [JsonPropertyName("afterSchoolActivity")]
    public string? AfterSchoolActivity { get; set; }

    // Inteligência Afetiva
    [JsonPropertyName("happyWhen")]
    public string? HappyWhen { get; set; }

    [JsonPropertyName("sadWhen")]
    public string? SadWhen { get; set; }

    [JsonPropertyName("whenSadILike")]
    public string? WhenSadILike { get; set; }

    [JsonPropertyName("courageousWhen")]
    public string? CourageousWhen { get; set; }

    [JsonPropertyName("scaredWhen")]
    public string? ScaredWhen { get; set; }

    [JsonPropertyName("proudOf")]
    public string? ProudOf { get; set; }

    [JsonPropertyName("goodAt")]
    public string? GoodAt { get; set; }

    [JsonPropertyName("learningNow")]
    public string? LearningNow { get; set; }

    [JsonPropertyName("howIAmWithFriends")]
    public string? HowIAmWithFriends { get; set; }

    [JsonPropertyName("calmsMe")]
    public string? CalmsMe { get; set; }

    [JsonPropertyName("cheersMeUp")]
    public string? CheersMeUp { get; set; }

    [JsonPropertyName("likesBeingSpokenToHow")]
    public string? LikesBeingSpokenToHow { get; set; }

    [JsonPropertyName("dislikesWhen")]
    public string? DislikesWhen { get; set; }

    // Conhecimento adicional treinado pelos pais
    [JsonPropertyName("additionalKnowledge")]
    public List<AdditionalKnowledgeDto>? AdditionalKnowledge { get; set; }
}

/// <summary>
/// Imagem de perfil do usuário.
/// </summary>
public class ProfileImageDto
{
    [JsonPropertyName("data")]
    public string? Data { get; set; }

    [JsonPropertyName("mimeType")]
    public string? MimeType { get; set; }

    [JsonPropertyName("version")]
    public string? Version { get; set; }

    [JsonPropertyName("updatedAt")]
    public long UpdatedAt { get; set; }
}

/// <summary>
/// Conhecimento adicional treinado pelos pais.
/// </summary>
public class AdditionalKnowledgeDto
{
    [JsonPropertyName("id")]
    public string? Id { get; set; }

    [JsonPropertyName("content")]
    public string Content { get; set; } = string.Empty;

    [JsonPropertyName("createdAt")]
    public long CreatedAt { get; set; }
}

/// <summary>
/// Contexto familiar.
/// </summary>
public class FamilyContextDto
{
    [JsonPropertyName("motherName")]
    public string? MotherName { get; set; }

    [JsonPropertyName("fatherName")]
    public string? FatherName { get; set; }

    [JsonPropertyName("siblings")]
    public List<string> Siblings { get; set; } = new();

    [JsonPropertyName("pets")]
    public List<string> Pets { get; set; } = new();

    [JsonPropertyName("familyValues")]
    public string? FamilyValues { get; set; }
}
