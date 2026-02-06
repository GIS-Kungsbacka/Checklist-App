using FormApp.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Server.IISIntegration;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.FileProviders;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ---- EF Core + Postgres ----
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Postgres"))
);

// ---- Windows Integrated Auth (IIS) ----
builder.Services.AddAuthentication(IISDefaults.AuthenticationScheme);

// AD group allowed for admin endpoints:
const string AdminGroup = "fooGroup";

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

// CORS configuration
// In production (IIS), all apps are served from the same origin, so CORS is not needed
// But we configure it to ensure no CORS errors occur
builder.Services.AddCors(options =>
{
    // Development policy for separate dev servers
    options.AddPolicy("AllowLocalhost", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
    
    // Production policy - allow requests from same origin
    // Since all apps are served from the same domain in IIS, same-origin requests don't trigger CORS
    // But we configure this to be safe and allow any origin (for flexibility)
    options.AddPolicy("AllowProduction", policy =>
    {
        policy.SetIsOriginAllowed(origin => true)  // Allow any origin (same-origin in IIS)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();  // Important for Windows Authentication cookies
    });
});

var app = builder.Build();

// CORS must be configured before UseAuthentication and UseAuthorization
// In production (IIS), all apps are same-origin so CORS isn't triggered, but we enable it for safety
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("AllowLocalhost");
}
else
{
    // Enable CORS in production to prevent any potential CORS errors
    // Since all apps are served from the same domain, same-origin requests don't need CORS
    // But having this configured ensures no CORS errors occur
    app.UseCors("AllowProduction");
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

// Configure content type provider for SPA files
var contentTypeProvider = new FileExtensionContentTypeProvider();
contentTypeProvider.Mappings[".js"] = "application/javascript";
contentTypeProvider.Mappings[".mjs"] = "application/javascript";
contentTypeProvider.Mappings[".json"] = "application/json";

// Serve static files from wwwroot/admin for /admin path
var adminPath = Path.Combine(builder.Environment.ContentRootPath, "..", "admin");
if (Directory.Exists(adminPath))
{
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(adminPath),
        RequestPath = "/admin",
        ContentTypeProvider = contentTypeProvider
    });
}

// Serve static files from wwwroot/client for root path
var clientPath = Path.Combine(builder.Environment.ContentRootPath, "..", "client");
if (Directory.Exists(clientPath))
{
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(clientPath),
        RequestPath = "",
        ContentTypeProvider = contentTypeProvider
    });
}

// API routes - must come before SPA fallback
app.MapControllers();

// SPA fallback routing
// Admin app at /admin - must come before root fallback
if (Directory.Exists(adminPath))
{
    app.MapFallbackToFile("/admin/{*path}", "index.html", new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(adminPath)
    });
}

// Client app at root - catch all other routes
if (Directory.Exists(clientPath))
{
    app.MapFallbackToFile("index.html", new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(clientPath)
    });
}

app.Run();
