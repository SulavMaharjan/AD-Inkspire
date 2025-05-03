using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_inkspire.Migrations
{
    /// <inheritdoc />
    public partial class testSQL : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1L,
                column: "ConcurrencyStamp",
                value: "a364b85b-e880-43b6-ad78-a521844fe0f6");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2L,
                column: "ConcurrencyStamp",
                value: "9ecc6374-2ae1-4988-bdb0-8d5e45edbe1c");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3L,
                column: "ConcurrencyStamp",
                value: "dea425f1-a4bc-4138-8440-4f9515e4c181");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1L,
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "a672aa94-63fd-4c6b-8559-cb643ec1464a", "AQAAAAIAAYagAAAAEHCQsNgU7SaR2u4iWjcHLStlEwzTlQ4H4lf8WeyRkSoBJVVJOorsaS6BsYY48weLUA==", "b97f73eb-f305-4fbe-8113-27ae946e15be" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
    }
}
