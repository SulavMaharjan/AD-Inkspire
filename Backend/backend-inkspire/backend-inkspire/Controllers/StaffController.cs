using backend_inkspire.DTOs;
using backend_inkspire.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_inkspire.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffController : ControllerBase
    {
        private readonly IStaffAuthService _staffAuthService;

        public StaffController(IStaffAuthService staffAuthService)
        {
            _staffAuthService = staffAuthService;
        }

        [HttpPost("register")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> RegisterStaff([FromBody] StaffRegisterDTO registerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Get the email of the admin creating this staff account
            var creatorEmail = User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(creatorEmail))
                return Unauthorized(new { IsSuccess = false, Message = "Admin authentication required" });

            var result = await _staffAuthService.RegisterStaffAsync(registerDto, creatorEmail);
            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> StaffLogin([FromBody] LoginDTO loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _staffAuthService.StaffLoginAsync(loginDto);
            if (!result.IsSuccess)
                return Unauthorized(result);

            return Ok(result);
        }

        [HttpPost("logout")]
        [Authorize(Roles = "Staff,SuperAdmin")]
        public IActionResult StaffLogout()
        {
            return Ok(new { IsSuccess = true, Message = "Staff logout successful." });
        }
    }
}