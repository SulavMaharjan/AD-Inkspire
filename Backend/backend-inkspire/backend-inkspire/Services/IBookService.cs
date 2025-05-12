using backend_inkspire.DTOs;

namespace backend_inkspire.Services
{
    public interface IBookService
    {
        Task<BookResponseDTO> GetBookByIdAsync(int id);
        Task<PaginatedResponseDTO<BookResponseDTO>> GetBooksAsync(BookFilterDTO filter);
        Task<BookResponseDTO> AddBookAsync(BookDTO bookDto);
        Task<BookResponseDTO> UpdateBookAsync(int id, BookDTO bookDto);
        Task<bool> DeleteBookAsync(int id);
        Task<bool> AddBookDiscountAsync(int bookId, BookDiscountDTO discountDto);
        Task<bool> RemoveBookDiscountAsync(int bookId);
        Task<IEnumerable<string>> GetDistinctGenresAsync();
        Task<IEnumerable<string>> GetDistinctAuthorsAsync();
        Task<IEnumerable<string>> GetDistinctPublishersAsync();
        Task<IEnumerable<string>> GetDistinctLanguagesAsync();
        Task<IEnumerable<string>> GetDistinctFormatsAsync();

    }
}