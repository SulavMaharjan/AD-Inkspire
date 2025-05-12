using backend_inkspire.DTOs;
using backend_inkspire.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_inkspire.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewsController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpPost]
        [Authorize(Roles = "Member")]
        public async Task<ActionResult<ReviewResponseDTO>> CreateReview([FromBody] ReviewDTO reviewDto)
        {
            try
            {
                string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var review = await _reviewService.CreateReviewAsync(userId, reviewDto);
                return CreatedAtAction(nameof(GetReviewById), new { id = review.Id }, review);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the review." });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReviewResponseDTO>> GetReviewById(int id)
        {
            var review = await _reviewService.GetReviewByIdAsync(id);
            if (review == null)
            {
                return NotFound();
            }

            return Ok(review);
        }

        [HttpGet("book/{bookId}")]
        public async Task<ActionResult<IEnumerable<ReviewResponseDTO>>> GetReviewsByBookId(int bookId)
        {
            var reviews = await _reviewService.GetReviewsByBookIdAsync(bookId);
            return Ok(reviews);
        }

        [HttpGet("user")]
        [Authorize(Roles = "Member")]
        public async Task<ActionResult<IEnumerable<ReviewResponseDTO>>> GetUserReviews()
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var reviews = await _reviewService.GetReviewsByUserIdAsync(userId);
            return Ok(reviews);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Member")]
        public async Task<IActionResult> UpdateReview(int id, [FromBody] ReviewDTO reviewDto)
        {
            try
            {
                string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var result = await _reviewService.UpdateReviewAsync(id, userId, reviewDto);
                if (!result)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the review." });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Member,SuperAdmin")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            try
            {
                string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                string role = User.FindFirstValue(ClaimTypes.Role);

                bool result;
                if (role == "SuperAdmin")
                {
                    result = await _reviewService.DeleteReviewAsync(id, null);
                }
                else
                {
                    result = await _reviewService.DeleteReviewAsync(id, userId);
                }

                if (!result)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the review." });
            }
        }

        [HttpGet("eligibility/{bookId}")]
        [Authorize(Roles = "Member")]
        public async Task<ActionResult<bool>> CheckReviewEligibility(int bookId)
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isEligible = await _reviewService.CheckReviewEligibilityAsync(userId, bookId);
            return Ok(isEligible);
        }
    }
}