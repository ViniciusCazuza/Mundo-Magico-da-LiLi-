using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LiliMagic.Api.Core;

public class Drawing
{
    [Key]
    public string Id { get; set; } = string.Empty;
    public string AuthorId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    
    public int CanvasWidth { get; set; }
    public int CanvasHeight { get; set; }
    
    public List<Layer> Layers { get; set; } = new();
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public abstract class Layer
{
    [Key]
    public string Id { get; set; } = string.Empty;
    public string DrawingId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int ZIndex { get; set; }
    public double Opacity { get; set; }
    public bool IsVisible { get; set; }
    public string BlendMode { get; set; } = "normal";
    public string? BackgroundColor { get; set; }
}

public class RasterLayer : Layer
{
    public string DataUrl { get; set; } = string.Empty;
}

public class VectorLayer : Layer
{
    // Armazenado como JSON no banco para flexibilidade de geometria
    public string PathsJson { get; set; } = "[]";
    public string StrokeColor { get; set; } = "#000000";
    public double StrokeWidth { get; set; }
    public string FillColor { get; set; } = "transparent";
    public bool IsClosed { get; set; }
}

public class SkeletalLayer : Layer
{
    // Armazenado como JSON
    public string BonesJson { get; set; } = "[]";
    public string IkChainsJson { get; set; } = "[]";
    public string SmartActionsJson { get; set; } = "[]";
}

public class MimiMemory
{
    [Key]
    public string Id { get; set; } = string.Empty;
    public string AuthorId { get; set; } = string.Empty;
    public string Fact { get; set; } = string.Empty;
    public string Category { get; set; } = "geral";
    public DateTime CreatedAt { get; set; }
}
