using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FormApp.Api.Controllers;

[ApiController]
[Route("admin")]
public class AdminController : ControllerBase
{
    [HttpGet("ping")]
    [Authorize(Policy = "AdminOnly")]
    public IActionResult Ping()
        => Ok(new { ok = true, message = "Admin access granted ✅" });
}
