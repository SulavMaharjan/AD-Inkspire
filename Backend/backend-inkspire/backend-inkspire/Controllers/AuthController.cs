using backend_inkspire.DTOs;
using backend_inkspire.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_inkspire.Controllers
{

        [Route("api/[controller]")]
        [ApiController]
        public class AuthController : ControllerBase
        {
            private readonly IAuthService _authService;

            public AuthController(IAuthService authService)
            {
                _authService = authService;
            }

            [HttpPost("register")]
            public async Task<IActionResult> Register([FromBody] RegisterDTO registerDto)
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _authService.RegisterUserAsync(registerDto);

                if (!result.IsSuccess)
                    return BadRequest(result);

                return Ok(result);
            }

            [HttpPost("login")]
            public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _authService.LoginAsync(loginDto);

                if (!result.IsSuccess)
                    return Unauthorized(result);

                return Ok(result);
            }

        [HttpPost("logout")]
        [Authorize(Roles = "Member")]
        public IActionResult Logout()
        {
            return Ok(new { IsSuccess = true, Message = "Logout successful." });
        }
    }
}
