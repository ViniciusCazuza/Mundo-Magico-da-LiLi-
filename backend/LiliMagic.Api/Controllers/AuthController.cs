using Microsoft.AspNetCore.Mvc;
using LiliMagic.Api.Core;
using LiliMagic.Api.DTOs;

namespace LiliMagic.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    [HttpPost("login")]
    public ActionResult<Result<LoginResponseDto>> Login([FromBody] LoginRequestDto request)
    {
        // Mock de lógica de autenticação (Axioma 1)
        if (request.ProfileId == "p_admin" && request.Pin == "0000")
        {
            var response = new LoginResponseDto
            {
                Token = "fake-jwt-token-parent",
                Role = "parent_admin",
                ProfileName = "Guardião"
            };
            return Ok(Result<LoginResponseDto>.Ok(response));
        }

        if (request.ProfileId.StartsWith("p_child"))
        {
            var response = new LoginResponseDto
            {
                Token = "fake-jwt-token-child",
                Role = "child",
                ProfileName = "Alice"
            };
            return Ok(Result<LoginResponseDto>.Ok(response));
        }

        return BadRequest(Result<LoginResponseDto>.Fail("Credenciais inválidas ou perfil não encontrado.", "AUTH_FAILED"));
    }
}

public class LoginRequestDto
{
    public string ProfileId { get; set; } = string.Empty;
    public string? Pin { get; set; }
}

public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string ProfileName { get; set; } = string.Empty;
}
