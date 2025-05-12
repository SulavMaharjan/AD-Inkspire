using backend_inkspire.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend_inkspire.Repositories
{
    public interface IReviewRepository
    {
        Task<Review> CreateReviewAsync(Review review);
        Task<Review> GetReviewByIdAsync(int id);
        Task<IEnumerable<Review>> GetReviewsByBookIdAsync(int bookId);
        Task<IEnumerable<Review>> GetReviewsByUserIdAsync(long userId);
        Task<bool> UpdateReviewAsync(Review review);
        Task<bool> DeleteReviewAsync(int id);
        Task<bool> HasUserOrderedBookAsync(long userId, int bookId);
    }
}