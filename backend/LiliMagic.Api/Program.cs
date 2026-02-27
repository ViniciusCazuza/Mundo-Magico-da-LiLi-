using LiliMagic.Api.Services;
using LiliMagic.Api.Data;
using LiliMagic.Api.Hubs;
using Microsoft.EntityFrameworkCore;

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

// Adicionar SignalR (Axioma 5 - Real-time Interactivity)
builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;
    options.MaximumReceiveMessageSize = 1024 * 1024 * 5; // 5MB
    options.KeepAliveInterval = TimeSpan.FromSeconds(15);
    options.ClientTimeoutInterval = TimeSpan.FromSeconds(30);
}).AddJsonProtocol(options => {
    options.PayloadSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
});

// Configurar Banco de Dados SQLite (Axioma 3 - Simplicidade em Dev)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=lili_magic.db"));

// Configurar HttpClient para chamadas à API do Gemini
builder.Services.AddHttpClient();

// Registrar o serviço do Gemini
builder.Services.AddScoped<IGeminiService, GeminiService>();

// Registrar o repositório de desenhos (SQLite)
builder.Services.AddScoped<IDrawingRepository, SqliteDrawingRepository>();

// Configurar CORS com Isolamento de Fronteira (Boundary Analysis)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        var allowedOrigins = new List<string>
        {
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:5173",
            "http://127.0.0.1:5173"
        };

        if (builder.Environment.IsDevelopment())
        {
            policy.SetIsOriginAllowed(_ => true)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        }
        else
        {
            var configOrigins = builder.Configuration["ALLOWED_ORIGINS"]?.Split(',') ?? Array.Empty<string>();
            allowedOrigins.AddRange(configOrigins);
            policy.WithOrigins(allowedOrigins.ToArray());
        }

        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .SetPreflightMaxAge(TimeSpan.FromMinutes(10));
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

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();

app.MapControllers();

// Mapear Hubs do SignalR
app.MapHub<DrawingHub>("/hubs/drawing");

app.Run();
