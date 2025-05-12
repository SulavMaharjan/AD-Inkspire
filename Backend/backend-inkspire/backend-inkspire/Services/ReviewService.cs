using backend_inkspire.DTOs;
using backend_inkspire.Entities;
using backend_inkspire.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend_inkspire.Services
{
    public class ReviewService : IReviewService
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly IOrderRepository _orderRepository;

        public ReviewService(IReviewRepository reviewRepository, IOrderRepository orderRepository)
        {
            _reviewRepository = reviewRepository;
            _orderRepository = orderRepository;
        }

        public async Task<ReviewResponseDTO> CreateReviewAsync(string userId, ReviewDTO reviewDto)
        {
            if (!long.TryParse(userId, out long userIdLong))
            {
                throw new InvalidOperationException("Invalid user ID format");
            }

            // Check if user has ordered and completed the book
            var hasOrdered = await _reviewRepository.HasUserOrderedBookAsync(userIdLong, reviewDto.BookId);
            if (!hasOrdered)
            {
                throw new InvalidOperationException("You can only review books you've purchased and received.");
            }

            // Check if user has already reviewed this book
            var existingReview = (await _reviewRepository.GetReviewsByUserIdAsync(userIdLong))
                .FirstOrDefault(r => r.BookId == reviewDto.BookId);
            if (existingReview != null)
            {
                throw new InvalidOperationException("You've already reviewed this book.");
            }

            var review = new Review
            {
                BookId = reviewDto.BookId,
                UserId = userIdLong,
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment,
                CreatedDate = DateTime.UtcNow
            };

            var createdReview = await _reviewRepository.CreateReviewAsync(review);
            return MapToReviewResponseDTO(createdReview);
        }

        public async Task<ReviewResponseDTO> GetReviewByIdAsync(int id)
        {
            var review = await _reviewRepository.GetReviewByIdAsync(id);
            if (review == null)
            {
                return null;
            }

            return MapToReviewResponseDTO(review);
        }

        public async Task<IEnumerable<ReviewResponseDTO>> GetReviewsByBookIdAsync(int bookId)
        {
            var reviews = await _reviewRepository.GetReviewsByBookIdAsync(bookId);
            return reviews.Select(MapToReviewResponseDTO);
        }

        public async Task<IEnumerable<ReviewResponseDTO>> GetReviewsByUserIdAsync(string userId)
        {
            if (!long.TryParse(userId, out long userIdLong))
            {
                throw new InvalidOperationException("Invalid user ID format");
            }

            var reviews = await _reviewRepository.GetReviewsByUserIdAsync(userIdLong);
            return reviews.Select(MapToReviewResponseDTO);
        }

        public async Task<bool> UpdateReviewAsync(int id, string userId, ReviewDTO reviewDto)
        {
            if (!long.TryParse(userId, out long userIdLong))
            {
                throw new InvalidOperationException("Invalid user ID format");
            }

            var review = await _reviewRepository.GetReviewByIdAsync(id);
            if (review == null || review.UserId != userIdLong)
            {
                return false;
            }

            review.Rating = reviewDto.Rating;
            review.Comment = reviewDto.Comment;

            return await _reviewRepository.UpdateReviewAsync(review);
        }

        public async Task<bool> DeleteReviewAsync(int id, string userId)
        {
            if (!long.TryParse(userId, out long userIdLong))
            {
                throw new InvalidOperationException("Invalid user ID format");
            }

            var review = await _reviewRepository.GetReviewByIdAsync(id);
            if (review == null || review.UserId != userIdLong)
            {
                return false;
            }

            return await _reviewRepository.DeleteReviewAsync(id);
        }

        public async Task<bool> CheckReviewEligibilityAsync(string userId, int bookId)
        {
            if (!long.TryParse(userId, out long userIdLong))
            {
                throw new InvalidOperationException("Invalid user ID format");
            }

            // Check if user has ordered and completed the book
            var hasOrdered = await _reviewRepository.HasUserOrderedBookAsync(userIdLong, bookId);
            if (!hasOrdered)
            {
                return false;
            }

            // Check if user has already reviewed this book
            var existingReview = (await _reviewRepository.GetReviewsByUserIdAsync(userIdLong))
                .FirstOrDefault(r => r.BookId == bookId);

            return existingReview == null;
        }

        private ReviewResponseDTO MapToReviewResponseDTO(Review review)
        {
            if (review == null)
            {
                return null;
            }

            return new ReviewResponseDTO
            {
                Id = review.Id,
                BookId = review.BookId,
                BookTitle = review.Book?.Title ?? "Unknown Book",
                UserId = review.UserId,
                UserName = review.User?.UserName ?? "Unknown User",
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedDate = review.CreatedDate
            };
        }
    }
}