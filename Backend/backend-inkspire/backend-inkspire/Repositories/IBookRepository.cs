using backend_inkspire.DTOs;
using backend_inkspire.Entities;
using System.Linq.Expressions;

namespace backend_inkspire.Repositories
{
    public interface IBookRepository
    {
        Task<Book> GetBookByIdAsync(int id);
        Task<PaginatedResponseDTO<Book>> GetBooksAsync(BookFilterDTO filter);
        Task<Book> AddBookAsync(BookDTO bookDto);
        Task<Book> UpdateBookAsync(int id, BookDTO bookDto);
        Task<bool> DeleteBookAsync(int id);
        Task<bool> AddBookDiscountAsync(int bookId, BookDiscountDTO discountDto);
        Task<bool> RemoveBookDiscountAsync(int bookId);
        Task<bool> BookExistsAsync(Expression<Func<Book, bool>> predicate);

        Task<bool> UpdateBookStockAsync(int bookId, int quantityChange);
        Task SaveChangesAsync();
    }
}