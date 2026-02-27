using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LiliMagic.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddBackgroundColor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BackgroundColor",
                table: "Layers",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BackgroundColor",
                table: "Layers");
        }
    }
}
