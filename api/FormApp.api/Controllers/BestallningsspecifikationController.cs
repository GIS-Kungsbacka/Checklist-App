using FormApp.Api.Data;
using FormApp.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FormApp.Api.Controllers;

[ApiController]
[Route("ordersummary")]
public class BestallningsspecifikationController : ControllerBase
{
    private readonly IBestallningsspecifikationRepository _repository;
    private readonly ILogger<BestallningsspecifikationController> _logger;

    public BestallningsspecifikationController(
        IBestallningsspecifikationRepository repository,
        ILogger<BestallningsspecifikationController> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    /// <summary>
    /// Get all records from the bestallningsspecifikation view (read-only).
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Bestallningsspecifikation>>> GetAll()
    {
        try
        {
            var items = await _repository.GetAllAsync();
            return Ok(items);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving bestallningsspecifikation");
            return StatusCode(500, new { error = "An error occurred while retrieving records", details = ex.Message });
        }
    }

    /// <summary>
    /// Get a single record by bestallning_gid (read-only).
    /// </summary>
    [HttpGet("{bestallningGid}")]
    public async Task<ActionResult<Bestallningsspecifikation>> GetById(int bestallningGid)
    {
        try
        {
            var item = await _repository.GetByIdAsync(bestallningGid);
            if (item == null)
                return NotFound();
            return Ok(item);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving bestallningsspecifikation with bestallningGid {BestallningGid}", bestallningGid);
            return StatusCode(500, new { error = "An error occurred while retrieving the record", details = ex.Message });
        }
    }
}
