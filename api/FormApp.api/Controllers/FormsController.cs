using System.ComponentModel.DataAnnotations;
using FormApp.Api.Data;
using FormApp.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FormApp.Api.Controllers;

[ApiController]
[Route("admin/forms")]
[Authorize(Policy = "AdminOnly")]
public class FormsController : ControllerBase
{
    private readonly IFormsRepository _repository;
    private readonly ILogger<FormsController> _logger;

    public FormsController(IFormsRepository repository, ILogger<FormsController> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    /// <summary>
    /// Get all forms
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Form>>> GetForms()
    {
        try
        {
            var forms = await _repository.GetAllAsync();
            return Ok(forms);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving forms");
            return StatusCode(500, new { error = "An error occurred while retrieving forms", details = ex.Message });
        }
    }

    /// <summary>
    /// Get a specific form by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Form>> GetForm(int id)
    {
        var form = await _repository.GetByIdAsync(id);
        if (form == null)
        {
            return NotFound();
        }
        return Ok(form);
    }

    /// <summary>
    /// Create a new form
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Form>> CreateForm([FromBody] CreateFormDto dto)
    {
        var username = User.Identity?.Name ?? "Unknown";

        var form = new Form
        {
            Name = dto.Name,
            Description = dto.Description ?? "",
            SchemaJson = dto.SchemaJson ?? "{}",
            IsActive = dto.IsActive,
            CreatedBy = username,
            CreatedAt = DateTimeOffset.UtcNow
        };

        var createdForm = await _repository.CreateAsync(form);

        _logger.LogInformation("Form {FormId} created by {User}", createdForm.Id, username);
        return CreatedAtAction(nameof(GetForm), new { id = createdForm.Id }, createdForm);
    }

    /// <summary>
    /// Update an existing form
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateForm(int id, [FromBody] UpdateFormDto dto)
    {
        var existingForm = await _repository.GetByIdAsync(id);
        if (existingForm == null)
        {
            return NotFound();
        }

        var username = User.Identity?.Name ?? "Unknown";

        var form = new Form
        {
            Id = id,
            Name = dto.Name,
            Description = dto.Description ?? "",
            SchemaJson = dto.SchemaJson ?? "{}",
            IsActive = dto.IsActive,
            UpdatedBy = username
        };

        var updatedForm = await _repository.UpdateAsync(id, form);
        if (updatedForm == null)
        {
            return NotFound();
        }

        _logger.LogInformation("Form {FormId} updated by {User}", id, username);
        return NoContent();
    }

    /// <summary>
    /// Delete a form
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteForm(int id)
    {
        var deleted = await _repository.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound();
        }

        var username = User.Identity?.Name ?? "Unknown";
        _logger.LogInformation("Form {FormId} deleted by {User}", id, username);
        return NoContent();
    }
}

public class CreateFormDto
{
    [Required]
    public string Name { get; set; } = "";
    public string? Description { get; set; }
    public string? SchemaJson { get; set; }
    public bool IsActive { get; set; } = true;
}

public class UpdateFormDto
{
    [Required]
    public string Name { get; set; } = "";
    public string? Description { get; set; }
    public string? SchemaJson { get; set; }
    public bool IsActive { get; set; }
}
