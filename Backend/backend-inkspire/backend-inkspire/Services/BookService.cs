// BookService.cs
using backend_inkspire.DTOs;
using backend_inkspire.Entities;
using backend_inkspire.Repositories;
using Microsoft.EntityFrameworkCore;

namespace backend_inkspire.Services
{
    public class BookService : IBookService
    {
        private readonly IBookRepository _bookRepository;

        public BookService(IBookRepository bookRepository)
        {
            _bookRepository = bookRepository;
        }

        public async Task<BookResponseDTO> GetBookByIdAsync(int id)
        {
            var book = await _bookRepository.GetBookByIdAsync(id);
            if (book == null)
            {
                return null;
            }

            return MapToResponseDTO(book);
        }

        public async Task<PaginatedResponseDTO<BookResponseDTO>> GetBooksAsync(BookFilterDTO filter)
        {
            var paginatedBooks = await _bookRepository.GetBooksAsync(filter);

            var response = new PaginatedResponseDTO<BookResponseDTO>
            {
                Items = paginatedBooks.Items.Select(MapToResponseDTO).ToList(),
                PageNumber = paginatedBooks.PageNumber,
                PageSize = paginatedBooks.PageSize,
                TotalCount = paginatedBooks.TotalCount,
                TotalPages = paginatedBooks.TotalPages
            };

            return response;
        }

        public async Task<BookResponseDTO> AddBookAsync(BookDTO bookDto)
        {
            // Check if ISBN already exists
            if (await _bookRepository.BookExistsAsync(b => b.ISBN == bookDto.ISBN))
            {
                throw new InvalidOperationException("A book with this ISBN already exists.");
            }

            var book = await _bookRepository.AddBookAsync(bookDto);
            return MapToResponseDTO(book);
        }

        public async Task<BookResponseDTO> UpdateBookAsync(int id, BookDTO bookDto)
        {
            // Check if ISBN is being changed to one that already exists
            var existingBook = await _bookRepository.GetBookByIdAsync(id);
            if (existingBook == null)
            {
                return null;
            }

            if (existingBook.ISBN != bookDto.ISBN &&
                await _bookRepository.BookExistsAsync(b => b.ISBN == bookDto.ISBN))
            {
                throw new InvalidOperationException("A book with this ISBN already exists.");
            }

            var updatedBook = await _bookRepository.UpdateBookAsync(id, bookDto);
            return MapToResponseDTO(updatedBook);
        }

        public async Task<bool> DeleteBookAsync(int id)
        {
            return await _bookRepository.DeleteBookAsync(id);
        }

        public async Task<bool> AddBookDiscountAsync(int bookId, BookDiscountDTO discountDto)
        {
            if (discountDto.StartDate >= discountDto.EndDate)
            {
                throw new ArgumentException("Discount end date must be after start date.");
            }

            return await _bookRepository.AddBookDiscountAsync(bookId, discountDto);
        }

        public async Task<bool> RemoveBookDiscountAsync(int bookId)
        {
            return await _bookRepository.RemoveBookDiscountAsync(bookId);
        }

        private BookResponseDTO MapToResponseDTO(Book book)
        {
            return new BookResponseDTO
            {
                Id = book.Id,
                Title = book.Title,
                ISBN = book.ISBN,
                Author = book.Author,
                Publisher = book.Publisher,
                PublicationDate = book.PublicationDate,
                Price = book.Price,
                DiscountedPrice = book.IsCurrentlyDiscounted ? book.CurrentPrice : null,
                StockQuantity = book.StockQuantity,
                Genre = book.Genre,
                Language = book.Language,
                Format = book.Format,
                Description = book.Description,
                AvailableInLibrary = book.AvailableInLibrary,
                IsBestseller = book.IsBestseller,
                IsAwardWinner = book.IsAwardWinner,
                IsNewRelease = book.IsNewRelease,
                IsNewArrival = book.IsNewArrival,
                IsComingSoon = book.IsComingSoon,
                IsOnSale = book.IsOnSale,
                DiscountPercentage = book.DiscountPercentage,
                DiscountStartDate = book.DiscountStartDate,
                DiscountEndDate = book.DiscountEndDate,
                SoldCount = book.SoldCount,
                CoverImageUrl = book.CoverImageUrl,
                AverageRating = book.AverageRating,
                ReviewCount = book.Reviews?.Count ?? 0
            };
        }
    }
}