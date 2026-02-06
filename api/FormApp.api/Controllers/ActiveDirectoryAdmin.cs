using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FormApp.Api.Controllers;

[ApiController]
[Route("me")]
[Authorize]
public class ActiveDirectoryAdmin : ControllerBase
{
    private const string AdminGroup = "";
    [HttpGet]
    public IActionResult Get()
    {
        // Typically "DOMAIN\\username"
        var username = User.Identity?.Name ?? "";

        // Same check as in policy
        var isAdmin = User.IsInRole(AdminGroup);

        return Ok(new { username, isAdmin });
    }
}
