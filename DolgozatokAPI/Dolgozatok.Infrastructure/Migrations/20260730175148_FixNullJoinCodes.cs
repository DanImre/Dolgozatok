using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Dolgozatok.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixNullJoinCodes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE \"Classes\" SET \"JoinCode\" = '123456' WHERE \"JoinCode\" IS NULL;");

            migrationBuilder.AlterColumn<string>(
                name: "JoinCode",
                table: "Classes",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "JoinCode",
                table: "Classes",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");
        }
    }
}
