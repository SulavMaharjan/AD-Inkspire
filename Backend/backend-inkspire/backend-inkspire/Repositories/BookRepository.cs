// BookRepository.cs
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

        public async Task<Book> GetBookByIdAsync(int id)
        {
            return await _context.Books
                .Include(b => b.Reviews)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<PaginatedResponseDTO<Book>> GetBooksAsync(BookFilterDTO filter)
        {
            var query = _context.Books.AsQueryable();


            if (!string.IsNullOrEmpty(filter.SearchTerm))
            {
                query = query.Where(b =>
                    b.Title.Contains(filter.SearchTerm) ||
                    b.ISBN.Contains(filter.SearchTerm) ||
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

            if (filter.MinPrice.HasValue)
            {
                query = query.Where(b => b.CurrentPrice >= filter.MinPrice.Value);
            }

            if (filter.MaxPrice.HasValue)
            {
                query = query.Where(b => b.CurrentPrice <= filter.MaxPrice.Value);
            }
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

            if (filter.Bestseller.HasValue)
            {
                query = query.Where(b => b.IsBestseller == filter.Bestseller.Value);
            }

            if (filter.AwardWinner.HasValue)
            {
                query = query.Where(b => b.IsAwardWinner == filter.AwardWinner.Value);
            }

            if (filter.NewRelease.HasValue)
            {
                query = query.Where(b => b.IsNewRelease == filter.NewRelease.Value);
            }

            if (filter.NewArrival.HasValue)
            {
                query = query.Where(b => b.IsNewArrival == filter.NewArrival.Value);
            }

            if (filter.ComingSoon.HasValue)
            {
                query = query.Where(b => b.IsComingSoon == filter.ComingSoon.Value);
            }

            if (filter.OnSale.HasValue)
            {
                query = query.Where(b => b.IsOnSale == filter.OnSale.Value);
            }

            // Apply sorting
            query = filter.SortBy.ToLower() switch
            {
                "publicationdate" => filter.SortAscending
                    ? query.OrderBy(b => b.PublicationDate)
                    : query.OrderByDescending(b => b.PublicationDate),
                "price" => filter.SortAscending
                    ? query.OrderBy(b => b.CurrentPrice)
                    : query.OrderByDescending(b => b.CurrentPrice),
                "popularity" => filter.SortAscending
                    ? query.OrderBy(b => b.SoldCount)
                    : query.OrderByDescending(b => b.SoldCount),
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
                CoverImageUrl = bookDto.CoverImageUrl
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
            book.CoverImageUrl = bookDto.CoverImageUrl;

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
            book.DiscountStartDate = discountDto.StartDate;
            book.DiscountEndDate = discountDto.EndDate;

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
    }
}