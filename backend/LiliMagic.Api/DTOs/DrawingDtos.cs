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
public abstract record LayerBaseDto(
    Guid Id,
    string Name,
    DrawingLayerType Type,
    int ZIndex,
    double Opacity,
    bool IsVisible,
    string BlendMode // Ex: "normal", "multiply", "screen"
);

// 3. DTO para Camadas Raster (Pintura de Pixels)
// Representa uma camada de imagem ou pintura
public record RasterLayerDto(
    Guid Id,
    string Name,
    int ZIndex,
    double Opacity,
    bool IsVisible,
    string BlendMode,
    string DataUrl // Imagem em Base64 (para persistência ou referência a blob storage)
) : LayerBaseDto(Id, Name, DrawingLayerType.Raster, ZIndex, Opacity, IsVisible, BlendMode);

// 4. DTO para um Ponto Vetorial Simples (X, Y)
public record VectorPointDto(
    double X,
    double Y
);

// 5. DTO para um Ponto de Controle de Curva de Bézier
// Inclui o ponto âncora e os handles de entrada/saída
public record BezierControlPointDto(
    VectorPointDto Anchor,
    VectorPointDto ControlPoint1, // Handle de entrada
    VectorPointDto ControlPoint2  // Handle de saída
);

// 6. DTO para Camadas Vetoriais (Lineart, Shapes)
// Representa um conjunto de curvas de Bézier para formas e traços
public record VectorLayerDto(
    Guid Id,
    string Name,
    int ZIndex,
    double Opacity,
    bool IsVisible,
    string BlendMode,
    IReadOnlyList<BezierControlPointDto> Path, // Coleção de pontos para formar o caminho
    string StrokeColor,
    double StrokeWidth,
    string FillColor, // Opcional, para preenchimento de formas
    bool IsClosed // Indica se a forma é fechada (para preenchimento)
) : LayerBaseDto(Id, Name, DrawingLayerType.Vector, ZIndex, Opacity, IsVisible, BlendMode);

// 7. DTO para um Segmento de Osso Individual (parte da animação esquelética)
public record BoneSegmentDto(
    VectorPointDto StartPoint,
    VectorPointDto EndPoint,
    double Length // Comprimento calculado do segmento
);

// 8. DTO para um Osso (Componente da Animação Esquelética)
// Define um osso em termos de sua posição, rotação e hierarquia
public record BoneDto(
    Guid Id,
    Guid? ParentId, // ID do osso pai para hierarquia
    string Name,
    BoneSegmentDto Segment,
    double Rotation, // Rotação em graus ou radianos
    IReadOnlyList<string> Constraints // Ex: "IK", "FixedRotation"
);

// 9. DTO para Camadas Esqueléticas (Animação de Personagens)
// Contém a definição completa do esqueleto (rig)
public record SkeletalLayerDto(
    Guid Id,
    string Name,
    int ZIndex,
    double Opacity,
    bool IsVisible,
    string BlendMode,
    IReadOnlyList<BoneDto> Bones, // A coleção de ossos que formam o esqueleto
    IReadOnlyList<Guid> IkChains // IDs dos ossos que fazem parte de cadeias IK
) : LayerBaseDto(Id, Name, DrawingLayerType.Skeletal, ZIndex, Opacity, IsVisible, BlendMode);

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
    public Guid Id { get; init; }

    [JsonPropertyName("authorId")]
    public Guid AuthorId { get; init; }

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
    public Guid AuthorId { get; set; }

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
    public Guid Id { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;
}

/// <summary>
/// DTO para requisição de adição de camada.
/// </summary>
public record AddLayerRequestDto
{
    [JsonPropertyName("layerType")]
    public string LayerType { get; set; } = "raster";

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
    public Guid LayerId { get; set; }

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