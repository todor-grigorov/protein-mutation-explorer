# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Copy solution and nuget config first
COPY ProteinMutation.slnx ./
COPY NuGet.Config ./

# Copy project files for restore
COPY src/ProteinMutation.Api/ProteinMutation.Api.csproj src/ProteinMutation.Api/
COPY src/ProteinMutation.Application/ProteinMutation.Application.csproj src/ProteinMutation.Application/
COPY src/ProteinMutation.Domain/ProteinMutation.Domain.csproj src/ProteinMutation.Domain/
COPY src/ProteinMutation.Infrastructure/ProteinMutation.Infrastructure.csproj src/ProteinMutation.Infrastructure/

# Restore dependencies
RUN dotnet restore src/ProteinMutation.Api/ProteinMutation.Api.csproj

# Copy everything else
COPY src/ src/
COPY data/ data/

# Build and publish — no --no-restore flag
RUN dotnet publish src/ProteinMutation.Api/ProteinMutation.Api.csproj \
    -c Release \
    -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Copy published output
COPY --from=build /app/publish .

# Copy data files
COPY --from=build /app/data ./data

# Create directory for SQLite database
RUN mkdir -p /app/database

EXPOSE 8080

ENTRYPOINT ["dotnet", "ProteinMutation.Api.dll"]