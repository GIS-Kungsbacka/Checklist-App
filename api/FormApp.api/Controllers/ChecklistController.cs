using System.ComponentModel.DataAnnotations;
using FormApp.Api.Data;
using FormApp.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FormApp.Api.Controllers;

[ApiController]
[Route("admin/checklist")]
[Authorize(Policy = "AdminOnly")]
public class ChecklistController : ControllerBase
{
    private readonly IChecklistRepository _repository;
    private readonly ILogger<ChecklistController> _logger;

    public ChecklistController(
        IChecklistRepository repository, 
        ILogger<ChecklistController> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    /// <summary>
    /// Get all records
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Checklist>>> GetAll()
    {
        try
        {
            var items = await _repository.GetAllAsync();
            return Ok(items);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving checklist records");
            return StatusCode(500, new { error = "An error occurred while retrieving records", details = ex.Message });
        }
    }

    /// <summary>
    /// Get a specific record by GID
    /// </summary>
    [HttpGet("{gid}")]
    public async Task<ActionResult<Checklist>> GetById(int gid)
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
            _logger.LogError(ex, "Error retrieving checklist record with GID {Gid}", gid);
            return StatusCode(500, new { error = "An error occurred while retrieving the record", details = ex.Message });
        }
    }

    /// <summary>
    /// Create a new record
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Checklist>> Create([FromBody] CreateChecklistDto dto)
    {
        try
        {
            var item = new Checklist
            {
                ArendenummerArtvise = dto.ArendenummerArtvise,
                Dataunderlag = dto.Dataunderlag,
                Dataadministrator = dto.Dataadministrator,
                Malgrupper = dto.Malgrupper,
                NyttjandeInterntExternt = dto.NyttjandeInterntExternt,
                Leverans = dto.Leverans,
                LeveransArbetstimmar = dto.LeveransArbetstimmar,
                Kategori = dto.Kategori,
                KategoriTyp = dto.KategoriTyp,
                Prioritet = dto.Prioritet,
                AntagenJaNej = dto.AntagenJaNej,
                AntagenJaNejMotivering = dto.AntagenJaNejMotivering,
                Handlaggare = dto.Handlaggare,
                Tabell = dto.Tabell,
                Wms = dto.Wms,
                Fme = dto.Fme,
                Redigering = dto.Redigering,
                Kopiering = dto.Kopiering,
                Information = dto.Information,
                Kommentar = dto.Kommentar,
                Levererad = dto.Levererad,
                VerksamhetsKritiskData = dto.VerksamhetskritiskData,
                SkapelseDatum = dto.SkapelseDatum
            };

            var createdItem = await _repository.CreateAsync(item);

            var username = User.Identity?.Name ?? "Unknown";
            _logger.LogInformation("Checklist record {Gid} created by {User}", createdItem.Gid, username);
            return CreatedAtAction(nameof(GetById), new { gid = createdItem.Gid }, createdItem);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating checklist record");
            return StatusCode(500, new { error = "An error occurred while creating the record", details = ex.Message });
        }
    }

    /// <summary>
    /// Update an existing record
    /// </summary>
    [HttpPut("{gid}")]
    public async Task<IActionResult> Update(int gid, [FromBody] UpdateChecklistDto dto)
    {
        try
        {
            var existingItem = await _repository.GetByIdAsync(gid);
            if (existingItem == null)
            {
                return NotFound();
            }

            var item = new Checklist
            {
                Gid = gid,
                ArendenummerArtvise = dto.ArendenummerArtvise,
                Dataunderlag = dto.Dataunderlag,
                Dataadministrator = dto.Dataadministrator,
                Malgrupper = dto.Malgrupper,
                NyttjandeInterntExternt = dto.NyttjandeInterntExternt,
                Leverans = dto.Leverans,
                LeveransArbetstimmar = dto.LeveransArbetstimmar,
                Kategori = dto.Kategori,
                KategoriTyp = dto.KategoriTyp,
                Prioritet = dto.Prioritet,
                AntagenJaNej = dto.AntagenJaNej,
                AntagenJaNejMotivering = dto.AntagenJaNejMotivering,
                Handlaggare = dto.Handlaggare,
                Tabell = dto.Tabell,
                Wms = dto.Wms,
                Fme = dto.Fme,
                Redigering = dto.Redigering,
                Kopiering = dto.Kopiering,
                Information = dto.Information,
                Kommentar = dto.Kommentar,
                Levererad = dto.Levererad,
                VerksamhetsKritiskData = dto.VerksamhetskritiskData,
                SkapelseDatum = dto.SkapelseDatum
            };

            var updatedItem = await _repository.UpdateAsync(gid, item);
            if (updatedItem == null)
            {
                return NotFound();
            }

            var username = User.Identity?.Name ?? "Unknown";
            _logger.LogInformation("Checklist record {Gid} updated by {User}", gid, username);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating checklist record {Gid}", gid);
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
            _logger.LogInformation("Checklist record {Gid} deleted by {User}", gid, username);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting checklist record {Gid}", gid);
            return StatusCode(500, new { error = "An error occurred while deleting the record", details = ex.Message });
        }
    }
}

public class CreateChecklistDto
{
    public string? ArendenummerArtvise { get; set; }
    public string? Dataunderlag { get; set; }
    public string? Dataadministrator { get; set; }
    public string? Malgrupper { get; set; }
    public string? NyttjandeInterntExternt { get; set; }
    public string? Leverans { get; set; }
    public string? LeveransArbetstimmar { get; set; }
    public string? Kategori { get; set; }
    public string? KategoriTyp { get; set; }
    public string? Prioritet { get; set; }
    public string? AntagenJaNej { get; set; }
    public string? AntagenJaNejMotivering { get; set; }
    public string? Handlaggare { get; set; }
    public string? Tabell { get; set; }
    public string? Wms { get; set; }
    public string? Fme { get; set; }
    public string? Redigering { get; set; }
    public bool? Kopiering { get; set; }
    public string? Information { get; set; }
    public string? Kommentar { get; set; }
    public bool? Levererad { get; set; }
    public string? VerksamhetskritiskData { get; set; }
    public DateOnly? SkapelseDatum { get; set; }
}

public class UpdateChecklistDto
{
    public string? ArendenummerArtvise { get; set; }
    public string? Dataunderlag { get; set; }
    public string? Dataadministrator { get; set; }
    public string? Malgrupper { get; set; }
    public string? NyttjandeInterntExternt { get; set; }
    public string? Leverans { get; set; }
    public string? LeveransArbetstimmar { get; set; }
    public string? Kategori { get; set; }
    public string? KategoriTyp { get; set; }
    public string? Prioritet { get; set; }
    public string? AntagenJaNej { get; set; }
    public string? AntagenJaNejMotivering { get; set; }
    public string? Handlaggare { get; set; }
    public string? Tabell { get; set; }
    public string? Wms { get; set; }
    public string? Fme { get; set; }
    public string? Redigering { get; set; }
    public bool? Kopiering { get; set; }
    public string? Information { get; set; }
    public string? Kommentar { get; set; }
    public bool? Levererad { get; set; }
    public string? VerksamhetskritiskData { get; set; }
    public DateOnly? SkapelseDatum { get; set; }
}
