using backend_inkspire.DTOs;
using backend_inkspire.Entities;
using backend_inkspire.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend_inkspire.Services
{
    public class BookmarkService : IBookmarkService
    {
        private readonly IBookmarkRepository _bookmarkRepository;
        private readonly IBookRepository _bookRepository;

        public BookmarkService(IBookmarkRepository bookmarkRepository, IBookRepository bookRepository)
        {
            _bookmarkRepository = bookmarkRepository;
            _bookRepository = bookRepository;
        }

        public async Task<PaginatedResponseDTO<BookmarkResponseDTO>> GetUserBookmarksAsync(long userId, int pageNumber = 1, int pageSize = 10)
        {
            var paginatedBookmarks = await _bookmarkRepository.GetUserBookmarksAsync(userId, pageNumber, pageSize);

            var response = new PaginatedResponseDTO<BookmarkResponseDTO>
            {
                Items = paginatedBookmarks.Items.Select(MapToResponseDTO).ToList(),
                PageNumber = paginatedBookmarks.PageNumber,
                PageSize = paginatedBookmarks.PageSize,
                TotalCount = paginatedBookmarks.TotalCount,
                TotalPages = paginatedBookmarks.TotalPages
            };

            return response;
        }

        public async Task<BookmarkResponseDTO> AddBookmarkAsync(long userId, BookmarkDTO bookmarkDTO)
        {
            if (bookmarkDTO == null)
            {
                throw new ArgumentNullException(nameof(bookmarkDTO));
            }

            // Check if the book exists
            var book = await _bookRepository.GetBookByIdAsync(bookmarkDTO.BookId);
            if (book == null)
            {
                throw new InvalidOperationException("Book not found.");
            }

            // Check if bookmark already exists
            if (await _bookmarkRepository.BookmarkExistsAsync(userId, bookmarkDTO.BookId))
            {
                throw new InvalidOperationException("Book is already bookmarked.");
            }

            var bookmark = await _bookmarkRepository.AddBookmarkAsync(userId, bookmarkDTO.BookId);
            return MapToResponseDTO(bookmark);
        }

        public async Task<bool> RemoveBookmarkAsync(long userId, int bookId)
        {
            return await _bookmarkRepository.RemoveBookmarkAsync(userId, bookId);
        }

        public async Task<bool> IsBookmarkedAsync(long userId, int bookId)
        {
            return await _bookmarkRepository.BookmarkExistsAsync(userId, bookId);
        }

        private BookmarkResponseDTO MapToResponseDTO(Bookmark bookmark)
        {
            if (bookmark == null || bookmark.Book == null) return null;

            var book = bookmark.Book;

            bool isCurrentlyDiscounted = book.IsOnSale &&
                book.DiscountPercentage.HasValue &&
                book.DiscountStartDate.HasValue &&
                book.DiscountEndDate.HasValue &&
                DateTime.Now >= book.DiscountStartDate &&
                DateTime.Now <= book.DiscountEndDate;

            // Discounted price if applicable
            decimal? discountedPrice = null;
            if (isCurrentlyDiscounted && book.DiscountPercentage.HasValue)
            {
                discountedPrice = book.Price - (book.Price * book.DiscountPercentage.Value / 100);
            }

            // Average rating
            decimal averageRating = 0;
            int reviewCount = 0;

            if (book.Reviews != null && book.Reviews.Any())
            {
                averageRating = (decimal)book.Reviews.Average(r => r.Rating);
                reviewCount = book.Reviews.Count;
            }

            return new BookmarkResponseDTO
            {
                Id = bookmark.Id,
                BookId = book.Id,
                BookTitle = book.Title,
                Author = book.Author,
                Price = book.Price,
                DiscountedPrice = discountedPrice,
                CoverImagePath = book.CoverImagePath,
                IsOnSale = isCurrentlyDiscounted,
                DiscountPercentage = book.DiscountPercentage,
                AverageRating = averageRating,
                ReviewCount = reviewCount,
                CreatedAt = bookmark.CreatedAt
            };
        }
    }
}