using backend_inkspire.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend_inkspire.Services
{
    public interface IReviewService
    {
        Task<ReviewResponseDTO> CreateReviewAsync(string userId, ReviewDTO reviewDto);
        Task<ReviewResponseDTO> GetReviewByIdAsync(int id);
        Task<IEnumerable<ReviewResponseDTO>> GetReviewsByBookIdAsync(int bookId);
        Task<IEnumerable<ReviewResponseDTO>> GetReviewsByUserIdAsync(string userId);
        Task<bool> UpdateReviewAsync(int id, string userId, ReviewDTO reviewDto);
        Task<bool> DeleteReviewAsync(int id, string userId);
        Task<bool> CheckReviewEligibilityAsync(string userId, int bookId);
    }
}