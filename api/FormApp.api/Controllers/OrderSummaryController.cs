using FormApp.Api.Data;
using FormApp.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace FormApp.Api.Controllers;

[ApiController]
[Route("ordersummary")]
public class OrderSummaryController : ControllerBase
{
    private readonly IOrderSummaryRepository _repository;
    private readonly ILogger<OrderSummaryController> _logger;

    public OrderSummaryController(
        IOrderSummaryRepository repository,
        ILogger<OrderSummaryController> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    /// <summary>
    /// Get all records from the order summary view (read-only).
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderSummary>>> GetAll()
    {
        try
        {
            var items = await _repository.GetAllAsync();
            return Ok(items);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving order summary");
            return StatusCode(500, new { error = "An error occurred while retrieving records", details = ex.Message });
        }
    }

    /// <summary>
    /// Get a single record by arendenummerArtvise (read-only).
    /// </summary>
    [HttpGet("{arendenummerArtvise}")]
    public async Task<ActionResult<OrderSummary>> GetById(string arendenummerArtvise)
    {
        try
        {
            var item = await _repository.GetByIdAsync(arendenummerArtvise);
            if (item == null)
                return NotFound();
            return Ok(item);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving order summary with arendenummerArtvise {ArendenummerArtvise}", arendenummerArtvise);
            return StatusCode(500, new { error = "An error occurred while retrieving the record", details = ex.Message });
        }
    }
}
