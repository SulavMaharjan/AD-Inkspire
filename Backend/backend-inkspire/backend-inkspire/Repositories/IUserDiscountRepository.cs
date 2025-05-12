using backend_inkspire.Entities;

namespace backend_inkspire.Repositories
{
    public interface IUserDiscountRepository
    {
        Task<List<UserDiscount>> GetUserDiscountsAsync(long userId);
        Task<List<UserDiscount>> GetAllUserDiscountsAsync(long userId); // New method
        Task<UserDiscount> GetUserDiscountByIdAsync(int discountId);
        Task<UserDiscount> CreateUserDiscountAsync(UserDiscount discount);
        Task<bool> UseDiscountAsync(int discountId, int orderId);
        Task<bool> RestoreDiscountAsync(int discountId);
        Task<User> GetUserByIdAsync(string userId);
        Task SaveChangesAsync();
    }
}