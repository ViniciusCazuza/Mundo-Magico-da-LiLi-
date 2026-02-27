using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LiliMagic.Api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveTypeProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "Layers");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Layers",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
