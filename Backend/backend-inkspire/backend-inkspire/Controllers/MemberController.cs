using backend_inkspire.DTOs;
using backend_inkspire.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend_inkspire.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "SuperAdmin")]
    public class SuperAdminController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public SuperAdminController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        // Get all members (users with Member role only)
        [HttpGet("members")]
        public async Task<IActionResult> GetAllMembers()
        {
            // Get all users with Member role
            var members = await _userManager.GetUsersInRoleAsync("Member");

            var memberDtos = members.Select(user => new UserDTO
            {
                Id = (int)user.Id,
                Name = user.Name,
                Email = user.Email,
                UserName = user.UserName
            }).ToList();

            return Ok(memberDtos);
        }

        // Get member details by ID
        [HttpGet("members/{id}")]
        public async Task<IActionResult> GetMemberDetails(long id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound(new { Message = "User not found" });
            }

            var roles = await _userManager.GetRolesAsync(user);
            if (!roles.Contains("Member"))
            {
                return BadRequest(new { Message = "The requested user is not a member" });
            }

            var userDto = new UserDTO
            {
                Id = (int)user.Id,
                Name = user.Name,
                Email = user.Email,
                UserName = user.UserName
            };

            return Ok(userDto);
        }

        // Delete a member
        [HttpDelete("members/{id}")]
        public async Task<IActionResult> DeleteMember(long id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound(new { Message = "User not found" });
            }

            var roles = await _userManager.GetRolesAsync(user);
            if (!roles.Contains("Member"))
            {
                return BadRequest(new { Message = "Only members can be deleted through this endpoint" });
            }

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(new { Message = "Failed to delete user", Errors = result.Errors });
            }

            return Ok(new { Message = "Member deleted successfully" });
        }

        // Update member details
        [HttpPut("members/{id}")]
        public async Task<IActionResult> UpdateMember(long id, [FromBody] UpdateMemberDTO updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound(new { Message = "User not found" });
            }

            var roles = await _userManager.GetRolesAsync(user);
            if (!roles.Contains("Member"))
            {
                return BadRequest(new { Message = "Only members can be updated through this endpoint" });
            }

            // Update user properties
            if (!string.IsNullOrEmpty(updateDto.Name))
            {
                user.Name = updateDto.Name;
            }

            if (!string.IsNullOrEmpty(updateDto.Email))
            {
                user.Email = updateDto.Email;
                user.NormalizedEmail = updateDto.Email.ToUpper();
            }

            if (!string.IsNullOrEmpty(updateDto.UserName))
            {
                user.UserName = updateDto.UserName;
                user.NormalizedUserName = updateDto.UserName.ToUpper();
            }

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(new { Message = "Failed to update user", Errors = result.Errors });
            }

            return Ok(new { Message = "Member updated successfully" });
        }
    }
}