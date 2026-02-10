using FormApp.Api.Data;
using FormApp.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace FormApp.Api.Controllers;

/// <summary>
/// Public endpoint for clients to view active forms (no authentication required)
/// </summary>
[ApiController]
[Route("forms")]  // Route is "forms" since API app is already at /FormApp/api/
public class PublicFormsController : ControllerBase
{
    private readonly IFormsRepository _repository;
    private readonly ILogger<PublicFormsController> _logger;

    public PublicFormsController(IFormsRepository repository, ILogger<PublicFormsController> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    /// <summary>
    /// Get all active forms (public endpoint)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Form>>> GetActiveForms()
    {
        try
        {
            var forms = await _repository.GetActiveAsync();
            return Ok(forms);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving active forms");
            return StatusCode(500, new { error = "An error occurred while retrieving forms", details = ex.Message });
        }
    }

    /// <summary>
    /// Get a specific active form by ID (public endpoint)
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Form>> GetActiveForm(int id)
    {
        try
        {
            var form = await _repository.GetActiveByIdAsync(id);
            
            if (form == null)
            {
                return NotFound();
            }
            return Ok(form);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving form {FormId}", id);
            return StatusCode(500, new { error = "An error occurred while retrieving the form", details = ex.Message });
        }
    }
}
