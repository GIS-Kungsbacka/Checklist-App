using FormApp.Api.Data;
using FormApp.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FormApp.Api.Controllers;

/// <summary>
/// Public endpoint for clients to view active forms (no authentication required)
/// </summary>
[ApiController]
[Route("api/forms")]
public class PublicFormsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<PublicFormsController> _logger;

    public PublicFormsController(AppDbContext context, ILogger<PublicFormsController> logger)
    {
        _context = context;
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
            var forms = await _context.Forms
                .Where(f => f.IsActive)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();
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
        var form = await _context.Forms
            .Where(f => f.Id == id && f.IsActive)
            .FirstOrDefaultAsync();
        
        if (form == null)
        {
            return NotFound();
        }
        return Ok(form);
    }
}
