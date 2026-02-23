using LiliMagic.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter(System.Text.Json.JsonNamingPolicy.CamelCase));
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configurar HttpClient para chamadas à API do Gemini
builder.Services.AddHttpClient();

// Registrar o serviço do Gemini
builder.Services.AddScoped<IGeminiService, GeminiService>();

// Registrar o repositório de desenhos (in-memory)
builder.Services.AddSingleton<IDrawingRepository, InMemoryDrawingRepository>();

// Configurar CORS com Isolamento de Fronteira (Boundary Analysis)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        var allowedOrigins = builder.Environment.IsDevelopment()
            ? new[] { "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000" }
            : new[] { builder.Configuration["ALLOWED_ORIGINS"] ?? "" };

        policy.WithOrigins(allowedOrigins.Where(o => !string.IsNullOrEmpty(o)).ToArray())
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .SetPreflightMaxAge(TimeSpan.FromMinutes(10)); // Otimização de rede
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Usar CORS
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
