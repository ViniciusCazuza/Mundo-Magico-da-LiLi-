using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LiliMagic.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Drawings",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    AuthorId = table.Column<string>(type: "TEXT", nullable: false),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    CanvasWidth = table.Column<int>(type: "INTEGER", nullable: false),
                    CanvasHeight = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Drawings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Layers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    DrawingId = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Type = table.Column<string>(type: "TEXT", maxLength: 8, nullable: false),
                    ZIndex = table.Column<int>(type: "INTEGER", nullable: false),
                    Opacity = table.Column<double>(type: "REAL", nullable: false),
                    IsVisible = table.Column<bool>(type: "INTEGER", nullable: false),
                    BlendMode = table.Column<string>(type: "TEXT", nullable: false),
                    DataUrl = table.Column<string>(type: "TEXT", nullable: true),
                    BonesJson = table.Column<string>(type: "TEXT", nullable: true),
                    IkChainsJson = table.Column<string>(type: "TEXT", nullable: true),
                    SmartActionsJson = table.Column<string>(type: "TEXT", nullable: true),
                    PathsJson = table.Column<string>(type: "TEXT", nullable: true),
                    StrokeColor = table.Column<string>(type: "TEXT", nullable: true),
                    StrokeWidth = table.Column<double>(type: "REAL", nullable: true),
                    FillColor = table.Column<string>(type: "TEXT", nullable: true),
                    IsClosed = table.Column<bool>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Layers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Layers_Drawings_DrawingId",
                        column: x => x.DrawingId,
                        principalTable: "Drawings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Layers_DrawingId",
                table: "Layers",
                column: "DrawingId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Layers");

            migrationBuilder.DropTable(
                name: "Drawings");
        }
    }
}
