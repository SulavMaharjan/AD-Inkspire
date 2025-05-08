using backend_inkspire.DTOs;
using backend_inkspire.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace backend_inkspire.Repositories
{
    public class BookRepository : IBookRepository
    {
        private readonly AppDbContext _context;

        public BookRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<Book> GetBookByIdAsync(int id)
        {
            return await _context.Books
                .Include(b => b.Reviews)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<PaginatedResponseDTO<Book>> GetBooksAsync(BookFilterDTO filter)
        {
            var query = _context.Books
                .Include(b => b.Reviews)
                .AsQueryable();

            //basic search filters
            if (!string.IsNullOrEmpty(filter.SearchTerm))
            {
                query = query.Where(b =>
                    b.Title.Contains(filter.SearchTerm) ||
                    b.ISBN.Contains(filter.SearchTerm) ||
                    b.Author.Contains(filter.SearchTerm) ||
                    b.Description.Contains(filter.SearchTerm));
            }

            if (!string.IsNullOrEmpty(filter.Author))
            {
                query = query.Where(b => b.Author.Contains(filter.Author));
            }

            if (!string.IsNullOrEmpty(filter.Genre))
            {
                query = query.Where(b => b.Genre == filter.Genre);
            }

            //inventory filters
            if (filter.InStock.HasValue)
            {
                query = filter.InStock.Value
                    ? query.Where(b => b.StockQuantity > 0)
                    : query.Where(b => b.StockQuantity <= 0);
            }

            if (filter.AvailableInLibrary.HasValue)
            {
                query = query.Where(b => b.AvailableInLibrary == filter.AvailableInLibrary.Value);
            }

            //price range filters
            if (filter.MinPrice.HasValue)
            {
                query = query.Where(b => b.IsCurrentlyDiscounted
                    ? (b.Price - (b.Price * b.DiscountPercentage.Value / 100)) >= filter.MinPrice.Value
                    : b.Price >= filter.MinPrice.Value);
            }

            if (filter.MaxPrice.HasValue)
            {
                query = query.Where(b => b.IsCurrentlyDiscounted
                    ? (b.Price - (b.Price * b.DiscountPercentage.Value / 100)) <= filter.MaxPrice.Value
                    : b.Price <= filter.MaxPrice.Value);
            }

            //rating filter
            if (filter.MinRating.HasValue)
            {
                double minRating = (double)filter.MinRating.Value;
                query = query.Where(b => b.Reviews.Any() && b.Reviews.Average(r => r.Rating) >= minRating);
            }

            if (!string.IsNullOrEmpty(filter.Language))
            {
                query = query.Where(b => b.Language == filter.Language);
            }

            if (!string.IsNullOrEmpty(filter.Format))
            {
                query = query.Where(b => b.Format == filter.Format);
            }

            if (!string.IsNullOrEmpty(filter.Publisher))
            {
                query = query.Where(b => b.Publisher == filter.Publisher);
            }

            //categories filters
            if (filter.Bestseller.HasValue)
            {
                if (filter.Bestseller.Value)
                {
                    query = query.OrderByDescending(b => b.SoldCount);
                }
            }

            if (filter.AwardWinner.HasValue)
            {
                query = query.Where(b => b.IsAwardWinner == filter.AwardWinner.Value);
            }

            if (filter.NewRelease.HasValue)
            {
                var threeMonthsAgo = DateTime.UtcNow.AddMonths(-3);
                query = filter.NewRelease.Value
                    ? query.Where(b => b.PublicationDate >= threeMonthsAgo)
                    : query.Where(b => b.PublicationDate < threeMonthsAgo);
            }

            if (filter.NewArrival.HasValue)
            {
                var oneMonthAgo = DateTime.UtcNow.AddMonths(-1);
                query = filter.NewArrival.Value
                    ? query.Where(b => b.ListedDate >= oneMonthAgo)
                    : query.Where(b => b.ListedDate < oneMonthAgo);
            }

            if (filter.ComingSoon.HasValue)
            {
                query = query.Where(b => b.IsComingSoon == filter.ComingSoon.Value);
            }

            if (filter.OnSale.HasValue)
            {
                if (filter.OnSale.Value)
                {
                    var now = DateTime.UtcNow;
                    query = query.Where(b =>
                        b.IsOnSale &&
                        b.DiscountPercentage.HasValue &&
                        b.DiscountStartDate.HasValue &&
                        b.DiscountEndDate.HasValue &&
                        now >= b.DiscountStartDate &&
                        now <= b.DiscountEndDate);
                }
                else
                {
                    query = query.Where(b => !b.IsOnSale);
                }
            }

            //sorting
            query = filter.SortBy.ToLower() switch
            {
                "publicationdate" => filter.SortAscending
                    ? query.OrderBy(b => b.PublicationDate)
                    : query.OrderByDescending(b => b.PublicationDate),
                "price" => filter.SortAscending
                    ? query.OrderBy(b => b.IsCurrentlyDiscounted
                        ? (b.Price - (b.Price * b.DiscountPercentage.Value / 100))
                        : b.Price)
                    : query.OrderByDescending(b => b.IsCurrentlyDiscounted
                        ? (b.Price - (b.Price * b.DiscountPercentage.Value / 100))
                        : b.Price),
                "popularity" => filter.SortAscending
                    ? query.OrderBy(b => b.SoldCount)
                    : query.OrderByDescending(b => b.SoldCount),
                "rating" => filter.SortAscending
                    ? query.OrderBy(b => b.Reviews.Any() ? b.Reviews.Average(r => r.Rating) : 0)
                    : query.OrderByDescending(b => b.Reviews.Any() ? b.Reviews.Average(r => r.Rating) : 0),
                _ => filter.SortAscending
                    ? query.OrderBy(b => b.Title)
                    : query.OrderByDescending(b => b.Title),
            };

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            return new PaginatedResponseDTO<Book>
            {
                Items = items,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)filter.PageSize)
            };
        }

        public async Task<Book> AddBookAsync(BookDTO bookDto)
        {
            if (bookDto.PublicationDate.Kind == DateTimeKind.Unspecified)
            {
                bookDto.PublicationDate = DateTime.SpecifyKind(bookDto.PublicationDate, DateTimeKind.Utc);
            }
            else if (bookDto.PublicationDate.Kind == DateTimeKind.Local)
            {
                bookDto.PublicationDate = bookDto.PublicationDate.ToUniversalTime();
            }

            var book = new Book
            {
                Title = bookDto.Title,
                ISBN = bookDto.ISBN,
                Author = bookDto.Author,
                Publisher = bookDto.Publisher,
                PublicationDate = bookDto.PublicationDate.Kind == DateTimeKind.Local
                    ? bookDto.PublicationDate.ToUniversalTime()
                    : bookDto.PublicationDate,
                Price = bookDto.Price,
                StockQuantity = bookDto.StockQuantity,
                Genre = bookDto.Genre,
                Language = bookDto.Language,
                Format = bookDto.Format,
                Description = bookDto.Description,
                AvailableInLibrary = bookDto.AvailableInLibrary,
                IsBestseller = bookDto.IsBestseller,
                IsAwardWinner = bookDto.IsAwardWinner,
                IsComingSoon = bookDto.IsComingSoon,
                CoverImagePath = "/images/books/default-cover.jpg",
                ListedDate = DateTime.UtcNow
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync();
            return book;
        }

        public async Task<Book> UpdateBookAsync(int id, BookDTO bookDto)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return null;
            }

            book.Title = bookDto.Title;
            book.ISBN = bookDto.ISBN;
            book.Author = bookDto.Author;
            book.Publisher = bookDto.Publisher;
            book.PublicationDate = bookDto.PublicationDate.Kind == DateTimeKind.Local
                ? bookDto.PublicationDate.ToUniversalTime()
                : bookDto.PublicationDate;
            book.Price = bookDto.Price;
            book.StockQuantity = bookDto.StockQuantity;
            book.Genre = bookDto.Genre;
            book.Language = bookDto.Language;
            book.Format = bookDto.Format;
            book.Description = bookDto.Description;
            book.AvailableInLibrary = bookDto.AvailableInLibrary;
            book.IsBestseller = bookDto.IsBestseller;
            book.IsAwardWinner = bookDto.IsAwardWinner;
            book.IsComingSoon = bookDto.IsComingSoon;

            await _context.SaveChangesAsync();
            return book;
        }

        public async Task<bool> DeleteBookAsync(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return false;
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AddBookDiscountAsync(int bookId, BookDiscountDTO discountDto)
        {
            var book = await _context.Books.FindAsync(bookId);
            if (book == null)
            {
                return false;
            }

            book.IsOnSale = true;
            book.DiscountPercentage = discountDto.DiscountPercentage;
            book.DiscountStartDate = discountDto.StartDate.Kind == DateTimeKind.Local
                ? discountDto.StartDate.ToUniversalTime()
                : discountDto.StartDate;
            book.DiscountEndDate = discountDto.EndDate.Kind == DateTimeKind.Local
                ? discountDto.EndDate.ToUniversalTime()
                : discountDto.EndDate;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveBookDiscountAsync(int bookId)
        {
            var book = await _context.Books.FindAsync(bookId);
            if (book == null)
            {
                return false;
            }

            book.IsOnSale = false;
            book.DiscountPercentage = null;
            book.DiscountStartDate = null;
            book.DiscountEndDate = null;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> BookExistsAsync(Expression<Func<Book, bool>> predicate)
        {
            return await _context.Books.AnyAsync(predicate);
        }

        // Add to BookRepository class
        public async Task<bool> UpdateBookStockAsync(int bookId, int quantityChange)
        {
            var book = await _context.Books.FindAsync(bookId);
            if (book == null)
            {
                return false;
            }

            book.StockQuantity += quantityChange;
            if (book.StockQuantity < 0)
            {
                return false; // Prevent negative stock
            }

            await _context.SaveChangesAsync();
            return true;
        }
    }
}