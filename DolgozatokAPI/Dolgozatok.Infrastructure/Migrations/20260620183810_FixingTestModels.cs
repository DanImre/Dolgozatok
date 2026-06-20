using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Dolgozatok.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixingTestModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsRandomized",
                table: "Tasks",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsRandomized",
                table: "TaskElements",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "Points",
                table: "TaskElements",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "RequiresManualGrading",
                table: "TaskElements",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsRandomized",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "IsRandomized",
                table: "TaskElements");

            migrationBuilder.DropColumn(
                name: "Points",
                table: "TaskElements");

            migrationBuilder.DropColumn(
                name: "RequiresManualGrading",
                table: "TaskElements");
        }
    }
}
