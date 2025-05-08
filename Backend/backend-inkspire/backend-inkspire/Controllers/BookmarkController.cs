using backend_inkspire.DTOs;
using backend_inkspire.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace backend_inkspire.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BookmarksController : ControllerBase
    {
        private readonly IBookmarkService _bookmarkService;

        public BookmarksController(IBookmarkService bookmarkService)
        {
            _bookmarkService = bookmarkService;
        }

        // GET: api/bookmarks
        [HttpGet]
        public async Task<ActionResult<PaginatedResponseDTO<BookmarkResponseDTO>>> GetBookmarks(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                var bookmarks = await _bookmarkService.GetUserBookmarksAsync(userId, pageNumber, pageSize);
                return Ok(bookmarks);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: api/bookmarks
        [HttpPost]
        public async Task<ActionResult<BookmarkResponseDTO>> AddBookmark(BookmarkDTO bookmarkDTO)
        {
            try
            {
                var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                var bookmark = await _bookmarkService.AddBookmarkAsync(userId, bookmarkDTO);
                return Ok(bookmark);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/bookmarks/{bookId}
        [HttpDelete("{bookId}")]
        public async Task<ActionResult> RemoveBookmark(int bookId)
        {
            try
            {
                var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                var result = await _bookmarkService.RemoveBookmarkAsync(userId, bookId);

                if (!result)
                {
                    return NotFound("Bookmark not found.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/bookmarks/check/{bookId}
        [HttpGet("check/{bookId}")]
        public async Task<ActionResult<bool>> CheckBookmark(int bookId)
        {
            try
            {
                var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                var isBookmarked = await _bookmarkService.IsBookmarkedAsync(userId, bookId);
                return Ok(isBookmarked);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}