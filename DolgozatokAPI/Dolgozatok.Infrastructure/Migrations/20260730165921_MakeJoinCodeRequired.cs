using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Dolgozatok.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MakeJoinCodeRequired : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE \"Classes\" SET \"JoinCode\" = '123456' WHERE \"JoinCode\" IS NULL;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
