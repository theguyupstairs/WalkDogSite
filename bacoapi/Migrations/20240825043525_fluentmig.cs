using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace bacoapi.Migrations
{
    /// <inheritdoc />
    public partial class fluentmig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserWalks_Families_FamilyId",
                table: "UserWalks");

            migrationBuilder.DropIndex(
                name: "IX_UserWalks_FamilyId",
                table: "UserWalks");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "68589788-239a-451e-b699-95bae94f4b9e");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7f52388a-0749-4b23-8ad8-49270729c4c2");

            migrationBuilder.DropColumn(
                name: "FamilyId",
                table: "UserWalks");

            migrationBuilder.AlterColumn<string>(
                name: "FamilyName",
                table: "UserWalks",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FamilyName",
                table: "Families",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddUniqueConstraint(
                name: "AK_Families_FamilyName",
                table: "Families",
                column: "FamilyName");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "d47b849c-93d6-4a8d-bb74-f7b6034ddc70", null, "User", "USER" },
                    { "e2aafb3d-5d14-4bbe-9109-d55ef6d4b43b", null, "admin", "ADMIN" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserWalks_FamilyName",
                table: "UserWalks",
                column: "FamilyName");

            migrationBuilder.CreateIndex(
                name: "IX_Families_FamilyName",
                table: "Families",
                column: "FamilyName",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_UserWalks_Families_FamilyName",
                table: "UserWalks",
                column: "FamilyName",
                principalTable: "Families",
                principalColumn: "FamilyName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserWalks_Families_FamilyName",
                table: "UserWalks");

            migrationBuilder.DropIndex(
                name: "IX_UserWalks_FamilyName",
                table: "UserWalks");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_Families_FamilyName",
                table: "Families");

            migrationBuilder.DropIndex(
                name: "IX_Families_FamilyName",
                table: "Families");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d47b849c-93d6-4a8d-bb74-f7b6034ddc70");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e2aafb3d-5d14-4bbe-9109-d55ef6d4b43b");

            migrationBuilder.AlterColumn<string>(
                name: "FamilyName",
                table: "UserWalks",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FamilyId",
                table: "UserWalks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "FamilyName",
                table: "Families",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "68589788-239a-451e-b699-95bae94f4b9e", null, "admin", "ADMIN" },
                    { "7f52388a-0749-4b23-8ad8-49270729c4c2", null, "User", "USER" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserWalks_FamilyId",
                table: "UserWalks",
                column: "FamilyId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserWalks_Families_FamilyId",
                table: "UserWalks",
                column: "FamilyId",
                principalTable: "Families",
                principalColumn: "FamilyId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
