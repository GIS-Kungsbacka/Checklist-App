using System.ComponentModel.DataAnnotations;
using FormApp.Api.Data;
using FormApp.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FormApp.Api.Controllers;

[ApiController]
[Route("admin/checklist")]
[Authorize(Policy = "AdminOnly")]
public class BestallaUppdragFrageformularController : ControllerBase
{
    private readonly IBestallaUppdragFrageformularRepository _repository;
    private readonly ILogger<BestallaUppdragFrageformularController> _logger;

    public BestallaUppdragFrageformularController(
        IBestallaUppdragFrageformularRepository repository, 
        ILogger<BestallaUppdragFrageformularController> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    /// <summary>
    /// Get all records
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BestallaUppdragFrageformular>>> GetAll()
    {
        try
        {
            var items = await _repository.GetAllAsync();
            return Ok(items);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving bestalla uppdrag frageformular records");
            return StatusCode(500, new { error = "An error occurred while retrieving records", details = ex.Message });
        }
    }

    /// <summary>
    /// Get a specific record by GID
    /// </summary>
    [HttpGet("{gid}")]
    public async Task<ActionResult<BestallaUppdragFrageformular>> GetById(int gid)
    {
        try
        {
            var item = await _repository.GetByIdAsync(gid);
            if (item == null)
            {
                return NotFound();
            }
            return Ok(item);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving bestalla uppdrag frageformular record with GID {Gid}", gid);
            return StatusCode(500, new { error = "An error occurred while retrieving the record", details = ex.Message });
        }
    }

    /// <summary>
    /// Create a new record
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<BestallaUppdragFrageformular>> Create([FromBody] CreateBestallaUppdragFrageformularDto dto)
    {
        try
        {
            var item = new BestallaUppdragFrageformular
            {
                Arendernummer = dto.Arendernummer,
                Dataunderlag = dto.Dataunderlag,
                Dataadministrator = dto.Dataadministrator,
                Malgrupper = dto.Malgrupper,
                NyttjandeInterntExternt = dto.NyttjandeInterntExternt,
                Leverans = dto.Leverans,
                LeveransArbetstimmar = dto.LeveransArbetstimmar,
                Kategori = dto.Kategori,
                KategoriTyp = dto.KategoriTyp,
                Parioritet = dto.Parioritet,
                AntagenJaNej = dto.AntagenJaNej,
                AntagenJaNejMotivering = dto.AntagenJaNejMotivering
            };

            var createdItem = await _repository.CreateAsync(item);

            var username = User.Identity?.Name ?? "Unknown";
            _logger.LogInformation("Bestalla uppdrag frageformular record {Gid} created by {User}", createdItem.Gid, username);
            return CreatedAtAction(nameof(GetById), new { gid = createdItem.Gid }, createdItem);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating bestalla uppdrag frageformular record");
            return StatusCode(500, new { error = "An error occurred while creating the record", details = ex.Message });
        }
    }

    /// <summary>
    /// Update an existing record
    /// </summary>
    [HttpPut("{gid}")]
    public async Task<IActionResult> Update(int gid, [FromBody] UpdateBestallaUppdragFrageformularDto dto)
    {
        try
        {
            var existingItem = await _repository.GetByIdAsync(gid);
            if (existingItem == null)
            {
                return NotFound();
            }

            var item = new BestallaUppdragFrageformular
            {
                Gid = gid,
                Arendernummer = dto.Arendernummer,
                Dataunderlag = dto.Dataunderlag,
                Dataadministrator = dto.Dataadministrator,
                Malgrupper = dto.Malgrupper,
                NyttjandeInterntExternt = dto.NyttjandeInterntExternt,
                Leverans = dto.Leverans,
                LeveransArbetstimmar = dto.LeveransArbetstimmar,
                Kategori = dto.Kategori,
                KategoriTyp = dto.KategoriTyp,
                Parioritet = dto.Parioritet,
                AntagenJaNej = dto.AntagenJaNej,
                AntagenJaNejMotivering = dto.AntagenJaNejMotivering
            };

            var updatedItem = await _repository.UpdateAsync(gid, item);
            if (updatedItem == null)
            {
                return NotFound();
            }

            var username = User.Identity?.Name ?? "Unknown";
            _logger.LogInformation("Bestalla uppdrag frageformular record {Gid} updated by {User}", gid, username);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating bestalla uppdrag frageformular record {Gid}", gid);
            return StatusCode(500, new { error = "An error occurred while updating the record", details = ex.Message });
        }
    }

    /// <summary>
    /// Delete a record
    /// </summary>
    [HttpDelete("{gid}")]
    public async Task<IActionResult> Delete(int gid)
    {
        try
        {
            var deleted = await _repository.DeleteAsync(gid);
            if (!deleted)
            {
                return NotFound();
            }

            var username = User.Identity?.Name ?? "Unknown";
            _logger.LogInformation("Bestalla uppdrag frageformular record {Gid} deleted by {User}", gid, username);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting bestalla uppdrag frageformular record {Gid}", gid);
            return StatusCode(500, new { error = "An error occurred while deleting the record", details = ex.Message });
        }
    }
}

public class CreateBestallaUppdragFrageformularDto
{
    [MaxLength(255)]
    public string? Arendernummer { get; set; }

    [MaxLength(255)]
    public string? Dataunderlag { get; set; }

    [MaxLength(255)]
    public string? Dataadministrator { get; set; }

    [MaxLength(255)]
    public string? Malgrupper { get; set; }

    [MaxLength(255)]
    public string? NyttjandeInterntExternt { get; set; }

    [MaxLength(255)]
    public string? Leverans { get; set; }

    [MaxLength(255)]
    public string? LeveransArbetstimmar { get; set; }

    [MaxLength(255)]
    public string? Kategori { get; set; }

    [MaxLength(255)]
    public string? KategoriTyp { get; set; }

    [MaxLength(255)]
    public string? Parioritet { get; set; }

    [MaxLength(255)]
    public string? AntagenJaNej { get; set; }

    [MaxLength(255)]
    public string? AntagenJaNejMotivering { get; set; }
}

public class UpdateBestallaUppdragFrageformularDto
{
    [MaxLength(255)]
    public string? Arendernummer { get; set; }

    [MaxLength(255)]
    public string? Dataunderlag { get; set; }

    [MaxLength(255)]
    public string? Dataadministrator { get; set; }

    [MaxLength(255)]
    public string? Malgrupper { get; set; }

    [MaxLength(255)]
    public string? NyttjandeInterntExternt { get; set; }

    [MaxLength(255)]
    public string? Leverans { get; set; }

    [MaxLength(255)]
    public string? LeveransArbetstimmar { get; set; }

    [MaxLength(255)]
    public string? Kategori { get; set; }

    [MaxLength(255)]
    public string? KategoriTyp { get; set; }

    [MaxLength(255)]
    public string? Parioritet { get; set; }

    [MaxLength(255)]
    public string? AntagenJaNej { get; set; }

    [MaxLength(255)]
    public string? AntagenJaNejMotivering { get; set; }
}
