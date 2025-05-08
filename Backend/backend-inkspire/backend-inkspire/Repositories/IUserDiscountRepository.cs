using backend_inkspire.Entities;

namespace backend_inkspire.Repositories
{
    public interface IUserDiscountRepository
    {
        Task<List<UserDiscount>> GetUserDiscountsAsync(long userId);
        Task<UserDiscount> GetUserDiscountByIdAsync(int discountId);
        Task<UserDiscount> CreateUserDiscountAsync(UserDiscount discount);
        Task<bool> UseDiscountAsync(int discountId, int orderId);
        Task<bool> RestoreDiscountAsync(int discountId);
        Task SaveChangesAsync();
        Task<User> GetUserByIdAsync(string userId);
    }
}