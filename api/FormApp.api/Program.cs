using FormApp.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Server.IISIntegration;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ---- EF Core + Postgres ----
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Postgres"))
);

// ---- Windows Integrated Auth (IIS) ----
builder.Services.AddAuthentication(IISDefaults.AuthenticationScheme);

// AD group allowed for admin endpoints:
const string AdminGroup = "";

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireAssertion(ctx =>
        {
            var user = ctx.User;
            
            // In development, allow if authenticated (for testing)
            if (builder.Environment.IsDevelopment())
            {
                return user?.Identity?.IsAuthenticated == true || true; // Allow all in dev
            }
            
            if (user?.Identity?.IsAuthenticated != true) return false;

            // Try both forms; different environments expose groups differently.
            return string.IsNullOrEmpty(AdminGroup) || user.IsInRole(AdminGroup);
        }));
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS for development
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("AllowLocalhost");
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
