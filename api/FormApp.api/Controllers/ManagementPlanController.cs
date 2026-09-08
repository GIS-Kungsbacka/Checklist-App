using FormApp.Api.Controllers;
using FormApp.Api.Data;
using FormApp.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace FormApp.api.Controllers;
[ApiController]
[Route("admin/managementplan")]
[Route("client/managementplan")]
[Authorize(Policy = "AdminOnly")]
public class ManagementPlanController : ControllerBase
    {
    private readonly IManagementPlanRepository _repository;
    private readonly ILogger<ManagementPlanController> _logger;

    /// <summary>
    /// Get all records
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<ManagementPlan>>> GetAll()
    {
        try
        {
            var items = await _repository.GetAllAsync();
            return Ok(items);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving management plan records");
            return StatusCode(500, new { error = "An error occurred while retrieving records", details = ex.Message });
        }
    }

    /// <summary>
    /// Get a specific record by GID
    /// </summary>
    [HttpGet("{gid}")]
    [AllowAnonymous]
    public async Task<ActionResult<ManagementPlan>> GetById(int gid)
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
            _logger.LogError(ex, "Error retrieving management plan record {Gid}", gid);
            return StatusCode(500, new { error = "An error occurred while retrieving the record", details = ex.Message });
        }
    }

    public ManagementPlanController(IManagementPlanRepository repository, ILogger<ManagementPlanController> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    /// <summary>
    /// Create a new record
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ManagementPlan>> Create([FromBody] CreateManagementPlanDto dto)
    {
        try
        {
            var item = new ManagementPlan
            {
                ArendeNummberOpenE = dto.ArendeNummberOpenE,
                BestallareNamn = dto.BestallareNamn,
                BestallareEpost = dto.BestallareEpost,
                Sakerhetsklass = dto.Sakerhetsklass,
                DatakallaTyp = dto.DatakallaTyp,
                SchemaNamn = dto.SchemaNamn,
                Namn = dto.Namn,
                Titel = dto.Titel,
                DataAgare = dto.DataAgare,
                DataForvaltare = dto.DataForvaltare,
                DataAdministrator = dto.DataAdministrator,
                DataKonsument = dto.DataKonsument,
                RedigeringsKalla = dto.RedigeringsKalla,
                OppnaData = dto.OppnaData,
                DokumentSkUrl = dto.DokumentSkUrl,
                DokuementInfoUrl = dto.DokuementInfoUrl,
                OvrigInformation = dto.OvrigInformation,
                KritiskDatamangd = dto.KritiskDatamangd,
                Arkivering = dto.Arkivering,
                ArkiveringTidpunkt = dto.ArkiveringTidpunkt,
                Publicerad = dto.Publicerad,
                PubliceradOppnaData = dto.PubliceradOppnaData,
                Atkomst = dto.Atkomst,
                Integration = dto.Integration,
                Status = dto.Status,
                Handlaggare = dto.Handlaggare,
                ForvaltningsplanVersion = dto.ForvaltningsplanVersion,
                SkapadTidPunkt = dto.SkapadTidPunkt,
                SkapadAv = dto.SkapadAv,
                AndradTidPunkt = dto.AndradTidPunkt,
                AndradAv = dto.AndradAv,
                ForvaltningsplanModelversion = dto.ForvaltningsplanModelversion
            };

            var createdItem = await _repository.CreateAsync(item);

            var username = User.Identity?.Name ?? "Unknown";
            _logger.LogInformation("Managementplan record {Gid} created by {User}", createdItem.Gid, username);
            return CreatedAtAction(nameof(GetById), new { gid = createdItem.Gid }, createdItem);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating Managementplan record");
            return StatusCode(500, new { error = "An error occurred while creating the record", details = ex.Message });
        }
    }

    /// <summary>
    /// Update an existing record
    /// </summary>
    [HttpPut("{gid}")]
    public async Task<IActionResult> Update(int gid, [FromBody] UpdateManagementPlanDto dto)
    {
        try
        {
            var item = new ManagementPlan
            {
                Gid = gid,
                ArendeNummberOpenE = dto.ArendeNummberOpenE,
                BestallareNamn = dto.BestallareNamn,
                BestallareEpost = dto.BestallareEpost,
                Sakerhetsklass = dto.Sakerhetsklass,
                DatakallaTyp = dto.DatakallaTyp,
                SchemaNamn = dto.SchemaNamn,
                Namn = dto.Namn,
                Titel = dto.Titel,
                DataAgare = dto.DataAgare,
                DataForvaltare = dto.DataForvaltare,
                DataAdministrator = dto.DataAdministrator,
                DataKonsument = dto.DataKonsument,
                RedigeringsKalla = dto.RedigeringsKalla,
                OppnaData = dto.OppnaData,
                DokumentSkUrl = dto.DokumentSkUrl,
                DokuementInfoUrl = dto.DokuementInfoUrl,
                OvrigInformation = dto.OvrigInformation,
                KritiskDatamangd = dto.KritiskDatamangd,
                Arkivering = dto.Arkivering,
                ArkiveringTidpunkt = dto.ArkiveringTidpunkt,
                Publicerad = dto.Publicerad,
                PubliceradOppnaData = dto.PubliceradOppnaData,
                Atkomst = dto.Atkomst,
                Integration = dto.Integration,
                Status = dto.Status,
                Handlaggare = dto.Handlaggare,
                ForvaltningsplanVersion = dto.ForvaltningsplanVersion,
                SkapadTidPunkt = dto.SkapadTidPunkt,
                SkapadAv = dto.SkapadAv,
                AndradTidPunkt = dto.AndradTidPunkt,
                AndradAv = dto.AndradAv,
                ForvaltningsplanModelversion = dto.ForvaltningsplanModelversion
            };

            var updatedItem = await _repository.UpdateAsync(gid, item);
            if (updatedItem == null)
            {
                return NotFound();
            }

            var username = User.Identity?.Name ?? "Unknown";
            _logger.LogInformation("Managementplan record {Gid} updated by {User}", gid, username);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating Managementplan record {Gid}", gid);
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
            _logger.LogInformation("Managementplan record {Gid} deleted by {User}", gid, username);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting Managementplan record {Gid}", gid);
            return StatusCode(500, new { error = "An error occurred while deleting the record", details = ex.Message });
        }
    }
}

public class CreateManagementPlanDto
{
    public string? ArendeNummberOpenE { get; set; }
    public string? BestallareNamn { get; set; }
    public string? BestallareEpost { get; set; }
    public string? Sakerhetsklass { get; set; }
    public string? DatakallaTyp { get; set; }
    public string? SchemaNamn { get; set; }
    public string? Namn { get; set; }
    public string? Titel { get; set; }
    public string? DataAgare { get; set; }
    public string? DataForvaltare { get; set; }
    public string[]? DataAdministrator { get; set; }
    public string[]? DataKonsument { get; set; }
    public string[]? RedigeringsKalla { get; set; }
    public bool? OppnaData { get; set; }
    public string? DokumentSkUrl { get; set; }
    public string? DokuementInfoUrl { get; set; }
    public string? OvrigInformation { get; set; }
    public bool? KritiskDatamangd { get; set; }
    public string? Arkivering { get; set; }
    public string? ArkiveringTidpunkt { get; set; }
    public string[]? Publicerad { get; set; }
    public bool? PubliceradOppnaData { get; set; }
    public string[]? Atkomst { get; set; }
    public string[]? Integration { get; set; }
    public string? Status { get; set; }
    public string? Handlaggare { get; set; }
    public string? ForvaltningsplanVersion { get; set; }
    public DateTime? SkapadTidPunkt { get; set; }
    public string? SkapadAv { get; set; }
    public DateTime? AndradTidPunkt { get; set; }
    public string? AndradAv { get; set; }
    public string? ForvaltningsplanModelversion { get; set; }
}

public class UpdateManagementPlanDto
{
    public int Gid { get; set; }
    public string? ArendeNummberOpenE { get; set; }
    public string? BestallareNamn { get; set; }
    public string? BestallareEpost { get; set; }
    public string? Sakerhetsklass { get; set; }
    public string? DatakallaTyp { get; set; }
    public string? SchemaNamn { get; set; }
    public string? Namn { get; set; }
    public string? Titel { get; set; }
    public string? DataAgare { get; set; }
    public string? DataForvaltare { get; set; }
    public string[]? DataAdministrator { get; set; }
    public string[]? DataKonsument { get; set; }
    public string[]? RedigeringsKalla { get; set; }
    public bool? OppnaData { get; set; }
    public string? DokumentSkUrl { get; set; }
    public string? DokuementInfoUrl { get; set; }
    public string? OvrigInformation { get; set; }
    public bool? KritiskDatamangd { get; set; }
    public string? Arkivering { get; set; }
    public string? ArkiveringTidpunkt { get; set; }
    public string[]? Publicerad { get; set; }
    public bool? PubliceradOppnaData { get; set; }
    public string[]? Atkomst { get; set; }
    public string[]? Integration { get; set; }
    public string? Status { get; set; }
    public string? Handlaggare { get; set; }
    public string? ForvaltningsplanVersion { get; set; }
    public DateTime? SkapadTidPunkt { get; set; }
    public string? SkapadAv { get; set; }
    public DateTime? AndradTidPunkt { get; set; }
    public string? AndradAv { get; set; }
    public string? ForvaltningsplanModelversion { get; set; }
}
