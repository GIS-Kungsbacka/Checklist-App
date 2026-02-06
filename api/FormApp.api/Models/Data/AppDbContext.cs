using FormApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FormApp.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Form> Forms => Set<Form>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<Form>().HasIndex(x => x.Name);
        modelBuilder.Entity<Form>().HasIndex(x => x.CreatedAt);
        modelBuilder.Entity<Form>().HasIndex(x => x.IsActive);
        
        // Seed initial form data
        modelBuilder.Entity<Form>().HasData(
            new Form
            {
                Id = 1,
                Name = "Sample Form",
                Description = "This is a sample form for testing purposes",
                SchemaJson = @"{
  ""type"": ""object"",
  ""properties"": {
    ""firstName"": {
      ""type"": ""string"",
      ""title"": ""First Name"",
      ""required"": true
    },
    ""lastName"": {
      ""type"": ""string"",
      ""title"": ""Last Name"",
      ""required"": true
    },
    ""email"": {
      ""type"": ""string"",
      ""title"": ""Email"",
      ""format"": ""email"",
      ""required"": true
    },
    ""comments"": {
      ""type"": ""string"",
      ""title"": ""Comments"",
      ""format"": ""textarea""
    }
  }
}",
                IsActive = true,
                CreatedBy = "System",
                CreatedAt = new DateTimeOffset(2024, 1, 1, 0, 0, 0, TimeSpan.Zero)
            });
    }
}
