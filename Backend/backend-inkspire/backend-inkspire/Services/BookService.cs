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
            // Ensure filter is not null
            filter ??= new BookFilterDTO();

            // Default page size and number if not provided
            if (filter.PageSize <= 0) filter.PageSize = 10;
            if (filter.PageNumber <= 0) filter.PageNumber = 1;

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
            // Validate input
            if (bookDto == null)
            {
                throw new ArgumentNullException(nameof(bookDto));
            }

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
            // Validate input
            if (bookDto == null)
            {
                throw new ArgumentNullException(nameof(bookDto));
            }

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
            // Validate input
            if (discountDto == null)
            {
                throw new ArgumentNullException(nameof(discountDto));
            }

            if (discountDto.StartDate >= discountDto.EndDate)
            {
                throw new ArgumentException("Discount end date must be after start date.");
            }

            if (discountDto.DiscountPercentage <= 0 || discountDto.DiscountPercentage > 100)
            {
                throw new ArgumentException("Discount percentage must be between 1 and 100.");
            }

            return await _bookRepository.AddBookDiscountAsync(bookId, discountDto);
        }

        public async Task<bool> RemoveBookDiscountAsync(int bookId)
        {
            return await _bookRepository.RemoveBookDiscountAsync(bookId);
        }

        private BookResponseDTO MapToResponseDTO(Book book)
        {
            if (book == null) return null;

            // Calculate if the book is currently discounted
            bool isCurrentlyDiscounted = book.IsOnSale &&
                book.DiscountPercentage.HasValue &&
                book.DiscountStartDate.HasValue &&
                book.DiscountEndDate.HasValue &&
                DateTime.Now >= book.DiscountStartDate &&
                DateTime.Now <= book.DiscountEndDate;

            // Calculate the discounted price if applicable
            decimal? discountedPrice = null;
            if (isCurrentlyDiscounted && book.DiscountPercentage.HasValue)
            {
                discountedPrice = book.Price - (book.Price * book.DiscountPercentage.Value / 100);
            }

            // Calculate average rating
            decimal averageRating = 0;
            int reviewCount = 0;

            if (book.Reviews != null && book.Reviews.Any())
            {
                averageRating = (decimal)book.Reviews.Average(r => r.Rating);
                reviewCount = book.Reviews.Count;
            }

            return new BookResponseDTO
            {
                Id = book.Id,
                Title = book.Title,
                ISBN = book.ISBN,
                Author = book.Author,
                Publisher = book.Publisher,
                PublicationDate = book.PublicationDate,
                Price = book.Price,
                DiscountedPrice = discountedPrice,
                StockQuantity = book.StockQuantity,
                Genre = book.Genre,
                Language = book.Language,
                Format = book.Format,
                Description = book.Description,
                AvailableInLibrary = book.AvailableInLibrary,
                IsBestseller = book.IsBestseller,
                IsAwardWinner = book.IsAwardWinner,
                IsNewRelease = book.PublicationDate >= DateTime.Now.AddMonths(-3), // Books published in the last 3 months
                IsNewArrival = book.ListedDate >= DateTime.Now.AddMonths(-1), // Books added to inventory in the last month
                IsComingSoon = book.IsComingSoon,
                IsOnSale = isCurrentlyDiscounted,
                DiscountPercentage = book.DiscountPercentage,
                DiscountStartDate = book.DiscountStartDate,
                DiscountEndDate = book.DiscountEndDate,
                SoldCount = book.SoldCount,
                CoverImageUrl = book.CoverImageUrl,
                AverageRating = averageRating,
                ReviewCount = reviewCount,
                IsBookmarked = false // This should be set based on user context if implemented
            };
        }
    }
}