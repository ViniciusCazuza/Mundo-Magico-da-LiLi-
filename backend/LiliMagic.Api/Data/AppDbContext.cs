using Microsoft.EntityFrameworkCore;
using LiliMagic.Api.Core;

namespace LiliMagic.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Drawing> Drawings => Set<Drawing>();
    public DbSet<Layer> Layers => Set<Layer>();
    public DbSet<MimiMemory> MimiMemories => Set<MimiMemory>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configurar TPH (Table-Per-Hierarchy) para as Camadas
        modelBuilder.Entity<Layer>()
            .HasDiscriminator<string>("Discriminator")
            .HasValue<RasterLayer>("raster")
            .HasValue<VectorLayer>("vector")
            .HasValue<SkeletalLayer>("skeletal");

        modelBuilder.Entity<Drawing>()
            .HasMany(d => d.Layers)
            .WithOne()
            .HasForeignKey(l => l.DrawingId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
