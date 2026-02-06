using System.ComponentModel.DataAnnotations;

namespace FormApp.Api.Models;

public class FormSubmission
{
    public int Id { get; set; }

    [Required, MaxLength(200)]
    public string Title { get; set; } = "";

    [Required]
    public string PayloadJson { get; set; } = "{}";

    [Required, MaxLength(200)]
    public string CreatedBy { get; set; } = "";

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
