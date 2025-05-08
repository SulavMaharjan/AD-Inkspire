using backend_inkspire.DTOs;
using backend_inkspire.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend_inkspire.Repositories
{
    public interface IBookmarkRepository
    {
        Task<Bookmark> GetBookmarkAsync(long userId, int bookId);
        Task<PaginatedResponseDTO<Bookmark>> GetUserBookmarksAsync(long userId, int pageNumber = 1, int pageSize = 10);
        Task<Bookmark> AddBookmarkAsync(long userId, int bookId);
        Task<bool> RemoveBookmarkAsync(long userId, int bookId);
        Task<bool> BookmarkExistsAsync(long userId, int bookId);
    }
}