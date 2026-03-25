using ProteinMutation.Api;
using ProteinMutation.Api.Extensions;
using ProteinMutation.Infrastructure.Options;
using ProteinMutation.Infrastructure.Persistence.Seed;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var dbOptions = builder.Configuration
    .GetSection(DatabaseOptions.SectionName)
    .Get<DatabaseOptions>()!;

var structuralModelsOptions = builder.Configuration
    .GetSection(StructuralModelsOptions.SectionName)
    .Get<StructuralModelsOptions>()!;

builder.Services.AddSingleton(structuralModelsOptions);
builder.Services.AddSingleton(dbOptions);
builder.Services.ConfigureCors();
builder.Services.ConfigureIISIntegration();
builder.Services.ConfigureSqlContext(builder.Configuration);
builder.Services.ConfigureRepository();
builder.Services.ConfigureDatabaseSeeding();
builder.Services.AddAutoMapper(cfg => { }, typeof(Program));
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.ConfigureServiceManager();
builder.Services.AddHealthChecks();

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Run migrations + seeding on startup
using (var scope = app.Services.CreateScope())
{
    var initializer = scope.ServiceProvider.GetRequiredService<DatabaseInitializer>();
    await initializer.InitializeAsync();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "v1");
    });
}

app.UseHttpsRedirection();
app.UseCors("CorsPolicy");
app.MapHealthChecks("/health");

app.UseAuthorization();

app.MapControllers();

app.Run();
