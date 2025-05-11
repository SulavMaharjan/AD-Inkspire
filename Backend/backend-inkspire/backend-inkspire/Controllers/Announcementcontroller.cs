using backend_inkspire.DTOs;
using backend_inkspire.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_inkspire.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnnouncementsController : ControllerBase
    {
        private readonly IAnnouncementService _announcementService;
        private readonly ILogger<AnnouncementsController> _logger;

        public AnnouncementsController(
            IAnnouncementService announcementService,
            ILogger<AnnouncementsController> logger)
        {
            _announcementService = announcementService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AnnouncementResponseDTO>>> GetAllAnnouncements()
        {
            var announcements = await _announcementService.GetAllAnnouncementsAsync();
            return Ok(announcements);
        }

        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<AnnouncementResponseDTO>>> GetActiveAnnouncements()
        {
            var announcements = await _announcementService.GetActiveAnnouncementsAsync();
            return Ok(announcements);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AnnouncementResponseDTO>> GetAnnouncement(int id)
        {
            var announcement = await _announcementService.GetAnnouncementByIdAsync(id);
            if (announcement == null)
                return NotFound();

            return Ok(announcement);
        }

        [HttpPost]
        [Authorize(Roles = "SuperAdmin,Staff")]
        public async Task<ActionResult<AnnouncementResponseDTO>> CreateAnnouncement([FromBody] AnnouncementDTO announcementDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var announcement = await _announcementService.CreateAnnouncementAsync(announcementDto);
                return CreatedAtAction(nameof(GetAnnouncement), new { id = announcement.Id }, announcement);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating announcement");
                return StatusCode(500, "An error occurred while creating the announcement");
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "SuperAdmin,Staff")]
        public async Task<ActionResult<AnnouncementResponseDTO>> UpdateAnnouncement(int id, [FromBody] AnnouncementDTO announcementDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var announcement = await _announcementService.UpdateAnnouncementAsync(id, announcementDto);
                if (announcement == null)
                    return NotFound();

                return Ok(announcement);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating announcement with ID: {id}");
                return StatusCode(500, "An error occurred while updating the announcement");
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "SuperAdmin,Staff")]
        public async Task<ActionResult> DeleteAnnouncement(int id)
        {
            try
            {
                var result = await _announcementService.DeleteAnnouncementAsync(id);
                if (!result)
                    return NotFound();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting announcement with ID: {id}");
                return StatusCode(500, "An error occurred while deleting the announcement");
            }
        }
    }
}