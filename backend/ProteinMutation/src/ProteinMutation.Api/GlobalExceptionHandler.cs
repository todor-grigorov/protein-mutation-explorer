using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProteinMutation.Domain.Exceptions;

namespace ProteinMutation.Api
{
    public sealed class GlobalExceptionHandler : IExceptionHandler
    {
        private readonly ILogger<GlobalExceptionHandler> _logger;
        private readonly IProblemDetailsService _problemDetailsService;

        public GlobalExceptionHandler(
            ILogger<GlobalExceptionHandler> logger,
            IProblemDetailsService problemDetailsService)
        {
            _logger = logger;
            _problemDetailsService = problemDetailsService;
        }

        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext,
            Exception exception,
            CancellationToken cancellationToken)
        {
            httpContext.Response.StatusCode = exception switch
            {
                VariantNotFoundException => StatusCodes.Status404NotFound,
                InvalidVariantFormatException => StatusCodes.Status400BadRequest,
                _ => StatusCodes.Status500InternalServerError
            };

            // Only log 500s as errors — domain exceptions are expected, not errors
            if (httpContext.Response.StatusCode == StatusCodes.Status500InternalServerError)
                _logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);
            else
                _logger.LogWarning("Domain exception {Type}: {Message}",
                    exception.GetType().Name, exception.Message);

            var result = await _problemDetailsService.TryWriteAsync(new ProblemDetailsContext
            {
                HttpContext = httpContext,
                ProblemDetails =
            {
                Title  = GetTitle(exception),
                Status = httpContext.Response.StatusCode,
                Detail = exception.Message,
                Type   = exception.GetType().Name
            },
                Exception = exception
            });

            // Fallback if ProblemDetails writing fails
            if (!result)
                await httpContext.Response.WriteAsJsonAsync(new ProblemDetails
                {
                    Title = GetTitle(exception),
                    Status = httpContext.Response.StatusCode,
                    Detail = exception.Message,
                    Type = exception.GetType().Name
                }, cancellationToken);

            return true;
        }

        private static string GetTitle(Exception exception) => exception switch
        {
            VariantNotFoundException => "Variant Not Found",
            InvalidVariantFormatException => "Invalid Variant Format",
            _ => "An unexpected error occurred"
        };
    }
}
