using System.ComponentModel.DataAnnotations;

namespace FormApp.Api.Models;

public class Form
{
    public int Id { get; set; }

    [Required, MaxLength(200)]
    public string Name { get; set; } = "";

    [MaxLength(1000)]
    public string Description { get; set; } = "";

    /// <summary>
    /// JSON schema defining the form fields and structure
    /// </summary>
    [Required]
    public string SchemaJson { get; set; } = "{}";

    /// <summary>
    /// Whether the form is active and can be used
    /// </summary>
    public bool IsActive { get; set; } = true;

    [Required, MaxLength(200)]
    public string CreatedBy { get; set; } = "";

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public DateTimeOffset? UpdatedAt { get; set; }

    [MaxLength(200)]
    public string? UpdatedBy { get; set; }
}
