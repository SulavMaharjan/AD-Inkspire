using backend_inkspire.Entities;
using backend_inkspire.Services;
using Microsoft.EntityFrameworkCore;
namespace backend_inkspire.Repositories
{
    public class UserDiscountRepository : IUserDiscountRepository
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;
        public UserDiscountRepository(AppDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }
        public async Task<List<UserDiscount>> GetUserDiscountsAsync(long userId)
        {
            return await _context.UserDiscounts
                .Where(ud => ud.UserId == userId && !ud.IsUsed)
                .OrderByDescending(ud => ud.CreatedAt)
                .ToListAsync();
        }
        public async Task<UserDiscount> GetUserDiscountByIdAsync(int discountId)
        {
            return await _context.UserDiscounts.FindAsync(discountId);
        }
        public async Task<UserDiscount> CreateUserDiscountAsync(UserDiscount discount)
        {
            _context.UserDiscounts.Add(discount);
            await _context.SaveChangesAsync();
            return discount;
        }
        public async Task<bool> UseDiscountAsync(int discountId, int orderId)
        {
            var discount = await _context.UserDiscounts.FindAsync(discountId);
            if (discount == null || discount.IsUsed)
            {
                return false;
            }
            discount.IsUsed = true;
            discount.UsedAt = DateTime.UtcNow;
            discount.AppliedToOrderId = orderId;
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> RestoreDiscountAsync(int discountId)
        {
            var discount = await _context.UserDiscounts.FindAsync(discountId);
            if (discount == null)
            {
                return false;
            }
            discount.IsUsed = false;
            discount.UsedAt = null;
            discount.AppliedToOrderId = null;
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<User> GetUserByIdAsync(string userId)
        {
            return await _context.Users.FindAsync(userId);
        }
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}