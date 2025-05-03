using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_inkspire.Migrations
{
    /// <inheritdoc />
    public partial class staffregister : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1L,
                column: "ConcurrencyStamp",
                value: "0ae9a877-b521-450b-8647-6c58456ea14e");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2L,
                column: "ConcurrencyStamp",
                value: "65ba41fe-167f-49a3-b00e-daa781b01c7c");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3L,
                column: "ConcurrencyStamp",
                value: "c30d327a-0bac-4cd4-875f-eb2c32193e02");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1L,
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "9cd7af3c-29e7-4e2b-8076-2180d46839e2", "AQAAAAIAAYagAAAAEAokuIIy1gcw2aE4y7gzD6rA+iFBGDF7/rtwUem9tztv9IVv/63NDLiMvnTt+MuTUQ==", "b7aafe60-85d9-4782-a170-4139f7735f90" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1L,
                column: "ConcurrencyStamp",
                value: "3af12c3d-72fd-4ddb-8ec6-742b8598eb08");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2L,
                column: "ConcurrencyStamp",
                value: "5dbb1328-e512-4d5e-9b72-fb84604ad549");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3L,
                column: "ConcurrencyStamp",
                value: "e94271b6-8ca5-4444-bf3d-98d778735a69");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1L,
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "711ec923-b109-45ee-b800-04bdde53b777", "AQAAAAIAAYagAAAAELhl74N3mB8LWJp+ieIs8F3C/hksaovgCvcekG8zSxPzk23Q5AXZ/CoUlT4WIKIx1w==", "f994ae5f-0231-49a9-8898-cc244be1be48" });
        }
    }
}
