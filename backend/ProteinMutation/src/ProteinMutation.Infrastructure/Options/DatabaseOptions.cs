namespace ProteinMutation.Infrastructure.Options
{
    public sealed class DatabaseOptions
    {
        public const string SectionName = "Database";

        public string ConnectionString { get; init; } = string.Empty;
        public string TsvFilePath { get; init; } = string.Empty;
    }
}
