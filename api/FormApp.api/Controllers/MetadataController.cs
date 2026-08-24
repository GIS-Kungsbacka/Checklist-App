using FormApp.Api.Data;
using FormApp.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FormApp.api.Controllers;

[ApiController]
[Route("admin/metadata")]
[Route("client/metadata")]
[Authorize(Policy = "AdminOnly")]
public class MetadataController : ControllerBase
{
    private readonly IMetadataRepository _repository;
    private readonly ILogger<MetadataController> _logger;

    /// <summary>
    /// Get all metadata records
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<Metadata>>> GetAll()
    {
        try
        {
            var items = await _repository.GetAllAsync();
            return Ok(items);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving metadata records");
            return StatusCode(500, new { error = "An error occurred while retrieving records", details = ex.Message });
        }
    }

    /// <summary>
    /// Get a metadata record by GID
    /// </summary>
    [HttpGet("{gid}")]
    [AllowAnonymous]
    public async Task<ActionResult<Metadata>> GetById(int gid)
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
            _logger.LogError(ex, "Error retrieving metadata record {Gid}", gid);
            return StatusCode(500, new { error = "An error occurred while retrieving the record", details = ex.Message });
        }
    }

    public MetadataController(IMetadataRepository repository, ILogger<MetadataController> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    /// <summary>
    /// Create a new metadata record
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Metadata>> Create([FromBody] CreateMetadataDto dto)
    {
        try
        {
            var item = new Metadata
            {
                ArendeNummerOpenE = dto.ArendeNummerOpenE,
                BestallareNamn = dto.BestallareNamn,
                BestallareEpost = dto.BestallareEpost,
                SakerhetsKlass = dto.SakerhetsKlass,
                DataKallaTyp = dto.DataKallaTyp,
                SchemaNamn = dto.SchemaNamn,
                Namn = dto.Namn,
                Beskrivning = dto.Beskrivning,
                Ursprung = dto.Ursprung,
                Syfte = dto.Syfte,
                Metod = dto.Metod,
                MetodUrl = dto.MetodUrl,
                Projekt = dto.Projekt,
                GeografiskBegransning = dto.GeografiskBegransning,
                UppdateringsFrekvens = dto.UppdateringsFrekvens,
                Fullstandighet = dto.Fullstandighet,
                Skalniva = dto.Skalniva,
                NyckelOrd = dto.NyckelOrd,
                Kategori = dto.Kategori,
                Tidsperiod = dto.Tidsperiod,
                TidsperiodStartdatum = dto.TidsperiodStartdatum,
                TidsperiodSlutdatum = dto.TidsperiodSlutdatum,
                TidsUpplosning = dto.TidsUpplosning,
                SkapelseDatum = dto.SkapelseDatum,
                AnvandarBegransningLicens = dto.AnvandarBegransningLicens,
                AnvandarBegransningLicensText = dto.AnvandarBegransningLicensText,
                RelateradeResurser = dto.RelateradeResurser,
                KolumnBeskrivningUrl = dto.KolumnBeskrivningUrl,
                Status = dto.Status,
                Handlaggare = dto.Handlaggare,
                MetaDataVersion = dto.MetaDataVersion,
            };

            var createdItem = await _repository.CreateAsync(item);

            var username = User.Identity?.Name ?? "Unknown";
            _logger.LogInformation("Metadata record {Gid} created by {User}", createdItem.Gid, username);
            return CreatedAtAction(nameof(GetById), new { gid = createdItem.Gid }, createdItem);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating metadata record");
            return StatusCode(500, new { error = "An error occurred while creating the record", details = ex.Message });
        }
    }

    /// <summary>
    /// Update an existing metadata record
    /// </summary>
    [HttpPut("{gid}")]
    public async Task<IActionResult> Update(int gid, [FromBody] UpdateMetadataDto dto)
    {
        try
        {
            var item = new Metadata
            {
                Gid = gid,
                ArendeNummerOpenE = dto.ArendeNummerOpenE,
                BestallareNamn = dto.BestallareNamn,
                BestallareEpost = dto.BestallareEpost,
                SakerhetsKlass = dto.SakerhetsKlass,
                DataKallaTyp = dto.DataKallaTyp,
                SchemaNamn = dto.SchemaNamn,
                Namn = dto.Namn,
                Beskrivning = dto.Beskrivning,
                Ursprung = dto.Ursprung,
                Syfte = dto.Syfte,
                Metod = dto.Metod,
                MetodUrl = dto.MetodUrl,
                Projekt = dto.Projekt,
                GeografiskBegransning = dto.GeografiskBegransning,
                UppdateringsFrekvens = dto.UppdateringsFrekvens,
                Fullstandighet = dto.Fullstandighet,
                Skalniva = dto.Skalniva,
                NyckelOrd = dto.NyckelOrd,
                Kategori = dto.Kategori,
                Tidsperiod = dto.Tidsperiod,
                TidsperiodStartdatum = dto.TidsperiodStartdatum,
                TidsperiodSlutdatum = dto.TidsperiodSlutdatum,
                TidsUpplosning = dto.TidsUpplosning,
                SkapelseDatum = dto.SkapelseDatum,
                AnvandarBegransningLicens = dto.AnvandarBegransningLicens,
                AnvandarBegransningLicensText = dto.AnvandarBegransningLicensText,
                RelateradeResurser = dto.RelateradeResurser,
                KolumnBeskrivningUrl = dto.KolumnBeskrivningUrl,
                Status = dto.Status,
                Handlaggare = dto.Handlaggare,
                MetaDataVersion = dto.MetaDataVersion,
            };

            var updatedItem = await _repository.UpdateAsync(gid, item);
            if (updatedItem == null)
            {
                return NotFound();
            }

            var username = User.Identity?.Name ?? "Unknown";
            _logger.LogInformation("Metadata record {Gid} updated by {User}", gid, username);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating metadata record {Gid}", gid);
            return StatusCode(500, new { error = "An error occurred while updating the record", details = ex.Message });
        }
    }

    /// <summary>
    /// Delete a metadata record
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
            _logger.LogInformation("Metadata record {Gid} deleted by {User}", gid, username);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting metadata record {Gid}", gid);
            return StatusCode(500, new { error = "An error occurred while deleting the record", details = ex.Message });
        }
    }
}

public class CreateMetadataDto
{
    public string? ArendeNummerOpenE { get; set; }
    public string? BestallareNamn { get; set; }
    public string? BestallareEpost { get; set; }
    public string? SakerhetsKlass { get; set; }
    public string? DataKallaTyp { get; set; }
    public string? SchemaNamn { get; set; }
    public string? Namn { get; set; }
    public string? Beskrivning { get; set; }
    public string[]? Ursprung { get; set; }
    public string? Syfte { get; set; }
    public string? Metod { get; set; }
    public string? MetodUrl { get; set; }
    public string? Projekt { get; set; }
    public string[]? GeografiskBegransning { get; set; }
    public string? UppdateringsFrekvens { get; set; }
    public string? Fullstandighet { get; set; }
    public string? Skalniva { get; set; }
    public string[]? NyckelOrd { get; set; }
    public string? Kategori { get; set; }
    public bool? Tidsperiod { get; set; }
    public DateOnly? TidsperiodStartdatum { get; set; }
    public DateOnly? TidsperiodSlutdatum { get; set; }
    public string? TidsUpplosning { get; set; }
    public DateOnly? SkapelseDatum { get; set; }
    public bool? AnvandarBegransningLicens { get; set; }
    public string? AnvandarBegransningLicensText { get; set; }
    public string[]? RelateradeResurser { get; set; }
    public string? KolumnBeskrivningUrl { get; set; }
    public string? Status { get; set; }
    public string? Handlaggare { get; set; }
    public string? MetaDataVersion { get; set; }
}

public class UpdateMetadataDto
{
    public int Gid { get; set; }
    public string? ArendeNummerOpenE { get; set; }
    public string? BestallareNamn { get; set; }
    public string? BestallareEpost { get; set; }
    public string? SakerhetsKlass { get; set; }
    public string? DataKallaTyp { get; set; }
    public string? SchemaNamn { get; set; }
    public string? Namn { get; set; }
    public string? Beskrivning { get; set; }
    public string[]? Ursprung { get; set; }
    public string? Syfte { get; set; }
    public string? Metod { get; set; }
    public string? MetodUrl { get; set; }
    public string? Projekt { get; set; }
    public string[]? GeografiskBegransning { get; set; }
    public string? UppdateringsFrekvens { get; set; }
    public string? Fullstandighet { get; set; }
    public string? Skalniva { get; set; }
    public string[]? NyckelOrd { get; set; }
    public string? Kategori { get; set; }
    public bool? Tidsperiod { get; set; }
    public DateOnly? TidsperiodStartdatum { get; set; }
    public DateOnly? TidsperiodSlutdatum { get; set; }
    public string? TidsUpplosning { get; set; }
    public DateOnly? SkapelseDatum { get; set; }
    public bool AnvandarBegransningLicens { get; set; }
    public string? AnvandarBegransningLicensText { get; set; }
    public string[]? RelateradeResurser { get; set; }
    public string? KolumnBeskrivningUrl { get; set; }
    public string? Status { get; set; }
    public string? Handlaggare { get; set; }
    public string? MetaDataVersion { get; set; }
}
