using backend_inkspire.DTOs;
using backend_inkspire.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace backend_inkspire.Repositories
{
    public class BookmarkRepository : IBookmarkRepository
    {
        private readonly AppDbContext _context;

        public BookmarkRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Bookmark> GetBookmarkAsync(long userId, int bookId)
        {
            return await _context.Bookmarks
                .Include(b => b.Book)
                .ThenInclude(b => b.Reviews)
                .FirstOrDefaultAsync(b => b.UserId == userId && b.BookId == bookId);
        }

        public async Task<PaginatedResponseDTO<Bookmark>> GetUserBookmarksAsync(long userId, int pageNumber = 1, int pageSize = 10)
        {
            var query = _context.Bookmarks
                .Where(b => b.UserId == userId)
                .Include(b => b.Book)
                .ThenInclude(b => b.Reviews)
                .OrderByDescending(b => b.CreatedAt);

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PaginatedResponseDTO<Bookmark>
            {
                Items = items,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            };
        }

        public async Task<Bookmark> AddBookmarkAsync(long userId, int bookId)
        {
            var bookmark = new Bookmark
            {
                UserId = userId,
                BookId = bookId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Bookmarks.Add(bookmark);
            await _context.SaveChangesAsync();
            return bookmark;
        }

        public async Task<bool> RemoveBookmarkAsync(long userId, int bookId)
        {
            var bookmark = await _context.Bookmarks
                .FirstOrDefaultAsync(b => b.UserId == userId && b.BookId == bookId);

            if (bookmark == null)
            {
                return false;
            }

            _context.Bookmarks.Remove(bookmark);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> BookmarkExistsAsync(long userId, int bookId)
        {
            return await _context.Bookmarks
                .AnyAsync(b => b.UserId == userId && b.BookId == bookId);
        }
    }
}