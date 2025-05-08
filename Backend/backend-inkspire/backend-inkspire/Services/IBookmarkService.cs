using backend_inkspire.DTOs;
using System.Threading.Tasks;

namespace backend_inkspire.Services
{
    public interface IBookmarkService
    {
        Task<PaginatedResponseDTO<BookmarkResponseDTO>> GetUserBookmarksAsync(long userId, int pageNumber = 1, int pageSize = 10);
        Task<BookmarkResponseDTO> AddBookmarkAsync(long userId, BookmarkDTO bookmarkDTO);
        Task<bool> RemoveBookmarkAsync(long userId, int bookId);
        Task<bool> IsBookmarkedAsync(long userId, int bookId);
    }
}