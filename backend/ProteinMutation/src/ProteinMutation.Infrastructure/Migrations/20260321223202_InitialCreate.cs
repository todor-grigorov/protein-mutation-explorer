using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProteinMutation.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProteinVariants",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    VariantId = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    AmPathogenicity = table.Column<double>(type: "REAL", nullable: false),
                    AmClass = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    AmLabel = table.Column<bool>(type: "INTEGER", nullable: false),
                    Esm1bLlr = table.Column<double>(type: "REAL", nullable: false),
                    Esm1bIsPathogenic = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    PredDdg = table.Column<double>(type: "REAL", nullable: true),
                    PredDdgLabel = table.Column<bool>(type: "INTEGER", nullable: false),
                    InterfacePdockq = table.Column<double>(type: "REAL", nullable: true),
                    InterfaceLabel = table.Column<bool>(type: "INTEGER", nullable: false),
                    PocketLabel = table.Column<bool>(type: "INTEGER", nullable: false),
                    MechanisticLabel = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    ProteinId = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProteinVariants", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProteinVariants_ProteinId",
                table: "ProteinVariants",
                column: "ProteinId");

            migrationBuilder.CreateIndex(
                name: "IX_ProteinVariants_VariantId",
                table: "ProteinVariants",
                column: "VariantId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProteinVariants");
        }
    }
}
