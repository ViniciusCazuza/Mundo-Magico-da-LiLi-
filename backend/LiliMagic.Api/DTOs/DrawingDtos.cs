using System.Text.Json.Serialization;

namespace LiliMagic.Api.DTOs;

// 1. Enum para Tipos de Camada de Desenho
public enum DrawingLayerType
{
    Raster,
    Vector,
    Skeletal,
    // Adicionar outros tipos de camada conforme necessário (ex: Text, Particle, Effect)
}

// 2. Base Abstrata para Todas as Camadas de Desenho
// Implementa propriedades comuns a todas as camadas
[JsonDerivedType(typeof(RasterLayerDto), "raster")]
[JsonDerivedType(typeof(VectorLayerDto), "vector")]
[JsonDerivedType(typeof(SkeletalLayerDto), "skeletal")]
public abstract record LayerBaseDto(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("type")] DrawingLayerType Type,
    [property: JsonPropertyName("zIndex")] int ZIndex,
    [property: JsonPropertyName("opacity")] double Opacity,
    [property: JsonPropertyName("isVisible")] bool IsVisible,
    [property: JsonPropertyName("blendMode")] string BlendMode, // Ex: "normal", "multiply", "screen"
    [property: JsonPropertyName("backgroundColor")] string? BackgroundColor = null // Para camadas de fundo sólido
);

// 3. DTO para Camadas Raster (Pintura de Pixels)
// Representa uma camada de imagem ou pintura
public record RasterLayerDto(
    string Id,
    string Name,
    int ZIndex,
    double Opacity,
    bool IsVisible,
    string BlendMode,
    string DataUrl, // Imagem em Base64 (para persistência ou referência a blob storage)
    string? BackgroundColor = null
) : LayerBaseDto(Id, Name, DrawingLayerType.Raster, ZIndex, Opacity, IsVisible, BlendMode, BackgroundColor);

// 4. DTO para um Ponto Vetorial Simples (X, Y)
public record VectorPointDto(
    [property: JsonPropertyName("x")] double X,
    [property: JsonPropertyName("y")] double Y
);

// 5. DTO para um Ponto de Controle de Curva de Bézier
// Inclui o ponto âncora e os handles de entrada/saída
public record BezierControlPointDto(
    [property: JsonPropertyName("anchor")] VectorPointDto Anchor,
    [property: JsonPropertyName("controlPoint1")] VectorPointDto ControlPoint1, // Handle de entrada
    [property: JsonPropertyName("controlPoint2")] VectorPointDto ControlPoint2  // Handle de saída
);

// 6. DTO para Camadas Vetoriais (Lineart, Shapes)
// Representa um conjunto de curvas de Bézier para formas e traços
public record VectorLayerDto(
    string Id,
    string Name,
    int ZIndex,
    double Opacity,
    bool IsVisible,
    string BlendMode,
    [property: JsonPropertyName("paths")] IReadOnlyList<IReadOnlyList<BezierControlPointDto>> Paths, // Coleção de traços independentes
    [property: JsonPropertyName("strokeColor")] string StrokeColor,
    [property: JsonPropertyName("strokeWidth")] double StrokeWidth,
    [property: JsonPropertyName("fillColor")] string FillColor, // Opcional, para preenchimento de formas
    [property: JsonPropertyName("isClosed")] bool IsClosed, // Indica se a forma é fechada (para preenchimento)
    string? BackgroundColor = null
) : LayerBaseDto(Id, Name, DrawingLayerType.Vector, ZIndex, Opacity, IsVisible, BlendMode, BackgroundColor);

// 7. DTO para um Segmento de Osso Individual (parte da animação esquelética)
public record BoneSegmentDto(
    [property: JsonPropertyName("startPoint")] VectorPointDto StartPoint,
    [property: JsonPropertyName("endPoint")] VectorPointDto EndPoint,
    [property: JsonPropertyName("length")] double Length // Comprimento calculado do segmento
);

// 8. DTO para um Osso (Componente da Animação Esquelética)
// Define um osso em termos de sua posição, rotação e hierarquia
public record BoneDto(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("parentId")] string? ParentId, // ID do osso pai para hierarquia
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("segment")] BoneSegmentDto Segment,
    [property: JsonPropertyName("rotation")] double Rotation, // Rotação em graus ou radianos
    [property: JsonPropertyName("constraints")] IReadOnlyList<string> Constraints, // Ex: "IK", "FixedRotation", "physics"
    [property: JsonPropertyName("angularVelocity")] double? AngularVelocity = 0,
    [property: JsonPropertyName("stiffness")] double? Stiffness = 0.1,
    [property: JsonPropertyName("damping")] double? Damping = 0.95
);

public record SmartActionDto(
    [property: JsonPropertyName("boneId")] string BoneId,
    [property: JsonPropertyName("targetProperty")] string TargetProperty,
    [property: JsonPropertyName("keyframes")] IReadOnlyList<SmartKeyframeDto> Keyframes
);

public record SmartKeyframeDto(
    [property: JsonPropertyName("angle")] double Angle,
    [property: JsonPropertyName("value")] object Value
);

// 9. DTO para Camadas Esqueléticas (Animação de Personagens)
// Contém a definição completa do esqueleto (rig)
public record SkeletalLayerDto(
    string Id,
    string Name,
    int ZIndex,
    double Opacity,
    bool IsVisible,
    string BlendMode,
    [property: JsonPropertyName("bones")] IReadOnlyList<BoneDto> Bones, // A coleção de ossos que formam o esqueleto
    [property: JsonPropertyName("ikChains")] IReadOnlyList<string> IkChains, // IDs dos ossos que fazem parte de cadeias IK
    [property: JsonPropertyName("smartActions")] IReadOnlyList<SmartActionDto>? SmartActions = null,
    string? BackgroundColor = null
) : LayerBaseDto(Id, Name, DrawingLayerType.Skeletal, ZIndex, Opacity, IsVisible, BlendMode, BackgroundColor);

/// <summary>
/// DTO para tamanho do canvas.
/// </summary>
public record CanvasSizeDto
{
    [JsonPropertyName("width")]
    public int Width { get; set; }

    [JsonPropertyName("height")]
    public int Height { get; set; }
}

/// <summary>
/// DTO Principal para um Desenho Completo
/// Agrega todas as camadas e metadados gerais do desenho
/// </summary>
public record DrawingDto
{
    [JsonPropertyName("id")]
    public string Id { get; init; } = string.Empty;

    [JsonPropertyName("authorId")]
    public string AuthorId { get; init; } = string.Empty;

    [JsonPropertyName("title")]
    public string Title { get; init; } = string.Empty;

    [JsonPropertyName("canvasSize")]
    public CanvasSizeDto CanvasSize { get; init; } = new();

    [JsonPropertyName("layers")]
    public List<LayerBaseDto> Layers { get; init; } = new();

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; init; }

    [JsonPropertyName("updatedAt")]
    public DateTime UpdatedAt { get; init; }
}

/// <summary>
/// DTO para requisição de criação de desenho.
/// </summary>
public record CreateDrawingRequestDto
{
    [JsonPropertyName("authorId")]
    public string AuthorId { get; set; } = string.Empty;

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("canvasSize")]
    public CanvasSizeDto CanvasSize { get; set; } = new();
}

/// <summary>
/// DTO para requisição de atualização de desenho.
/// </summary>
public record UpdateDrawingRequestDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;
}

/// <summary>
/// DTO para requisição de adição de camada.
/// </summary>
public record AddLayerRequestDto
{
    [JsonPropertyName("layerType")]
    public DrawingLayerType LayerType { get; set; } = DrawingLayerType.Raster;

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("content")]
    public string Content { get; set; } = string.Empty;
}

/// <summary>
/// DTO para requisição de atualização de camada.
/// </summary>
public record UpdateLayerRequestDto
{
    [JsonPropertyName("layerId")]
    public string LayerId { get; set; } = string.Empty;

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("content")]
    public string Content { get; set; } = string.Empty;
}

/// <summary>
/// DTO para resposta de paginação.
/// </summary>
public record PagedList<T>
{
    [JsonPropertyName("items")]
    public List<T> Items { get; set; } = new();

    [JsonPropertyName("totalCount")]
    public int TotalCount { get; set; }

    [JsonPropertyName("page")]
    public int Page { get; set; }

    [JsonPropertyName("pageSize")]
    public int PageSize { get; set; }

    [JsonPropertyName("totalPages")]
    public int TotalPages { get; set; }
}