using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FormApp.Api.Controllers;

[ApiController]
[Route("me")]
[Authorize]
public class ActiveDirectoryAdmin : ControllerBase
{
    private readonly string _adminGroup;

    public ActiveDirectoryAdmin(IConfiguration config)
    {
        _adminGroup = config["Auth:AdminGroup"] ?? "";
    }

    [HttpGet]
    public IActionResult Get()
    {
        var username = User.Identity?.Name ?? "";
        var isAdmin = User.IsInRole(_adminGroup);

        return Ok(new { username, isAdmin });
    }
}
