using Microsoft.EntityFrameworkCore;
using ProteinMutation.Application.Abstractions.Services;
using ProteinMutation.Application.Services;
using ProteinMutation.Domain.Repositories;
using ProteinMutation.Infrastructure.Options;
using ProteinMutation.Infrastructure.Persistence;
using ProteinMutation.Infrastructure.Persistence.Repositories;
using ProteinMutation.Infrastructure.Persistence.Seed;

namespace ProteinMutation.Api.Extensions
{
    public static class ServiceExtensions
    {
        public static void ConfigureCors(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .WithExposedHeaders("X-Pagination"));
            });
        }

        public static void ConfigureIISIntegration(this IServiceCollection services)
        {
            services.Configure<IISServerOptions>(options =>
            {
                //options.AllowSynchronousIO = true;
            });
        }

        public static void ConfigureSqlContext(this IServiceCollection services, IConfiguration configuration) =>
            services.AddDbContext<AppDbContext>(options =>
                    options.UseSqlite(configuration.GetSection(DatabaseOptions.SectionName).Get<DatabaseOptions>()!.ConnectionString));

        public static void ConfigureRepository(this IServiceCollection services) => services.AddScoped<IProteinVariantRepository, ProteinVariantRepository>();

        public static void ConfigureDatabaseSeeding(this IServiceCollection services)
        {
            services.AddScoped<TsvVariantImporter>();
            services.AddScoped<DatabaseInitializer>();
        }

        public static void ConfigureServiceManager(this IServiceCollection services) =>
            services.AddScoped<IServiceManager, ServiceManager>();
    }
}
