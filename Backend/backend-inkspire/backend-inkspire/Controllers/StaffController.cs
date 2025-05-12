using backend_inkspire.DTOs;
using backend_inkspire.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

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

            //get admin creating this staff account
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

        [HttpDelete("delete/{staffId}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> DeleteStaff(int staffId)
        {
            // Get admin deleting the staff account
            var deleterEmail = User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(deleterEmail))
                return Unauthorized(new { IsSuccess = false, Message = "Admin authentication required" });

            var result = await _staffAuthService.DeleteStaffAsync(staffId, deleterEmail);
            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpGet("all")]
        [Authorize(Roles = "Staff,SuperAdmin")]
        public async Task<IActionResult> GetAllStaffs()
        {
            // Get the email of the requester
            var requesterEmail = User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(requesterEmail))
                return Unauthorized(new { IsSuccess = false, Message = "Authentication required" });

            var result = await _staffAuthService.GetAllStaffsAsync(requesterEmail);
            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }
    }
}