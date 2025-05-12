using backend_inkspire.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend_inkspire.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly AppDbContext _context;

        public OrderRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Order> GetOrderByIdAsync(long orderId, bool includeItems = true)
        {
            IQueryable<Order> query = _context.Orders;

            if (includeItems)
            {
                query = query
                    .Include(o => o.Items)
                    .ThenInclude(i => i.Book)
                    .Include(o => o.User)
                    .Include(o => o.AppliedUserDiscount);
            }

            return await query.FirstOrDefaultAsync(o => o.Id == orderId);
        }

        public async Task<Order> GetOrderByClaimCodeAsync(string claimCode, long? expectedUserId = null, bool includeItems = true)
        {
            IQueryable<Order> query = _context.Orders;

            if (includeItems)
            {
                query = query
                    .Include(o => o.Items)
                    .ThenInclude(i => i.Book)
                    .Include(o => o.User)
                    .Include(o => o.AppliedUserDiscount);
            }

            if (expectedUserId.HasValue)
            {
                query = query.Where(o => o.ClaimCode == claimCode && o.UserId == expectedUserId.Value);
            }
            else
            {
                query = query.Where(o => o.ClaimCode == claimCode);
            }

            return await query.FirstOrDefaultAsync();
        }

        public async Task<List<Order>> GetOrdersByUserIdAsync(long userId, bool includeItems = true)
        {
            IQueryable<Order> query = _context.Orders.Where(o => o.UserId == userId);

            if (includeItems)
            {
                query = query
                    .Include(o => o.Items)
                    .ThenInclude(i => i.Book)
                    .Include(o => o.AppliedUserDiscount);
            }

            return await query.OrderByDescending(o => o.CreatedAt).ToListAsync();
        }

        public async Task<(List<Order> Orders, int TotalCount)> GetFilteredOrdersAsync(
            long userId,
            OrderStatus? status = null,
            DateTime? startDate = null,
            DateTime? endDate = null,
            int pageNumber = 1,
            int pageSize = 10)
        {
            IQueryable<Order> query = _context.Orders.Where(o => o.UserId == userId);

            if (status.HasValue)
            {
                query = query.Where(o => o.Status == status.Value);
            }

            if (startDate.HasValue)
            {
                DateTime utcStartDate = startDate.Value.ToUniversalTime();
                query = query.Where(o => o.CreatedAt >= utcStartDate);
            }

            if (endDate.HasValue)
            {
                DateTime utcEndDate = endDate.Value.ToUniversalTime().AddDays(1).AddSeconds(-1); // End of the day
                query = query.Where(o => o.CreatedAt <= utcEndDate);
            }

            int totalCount = await query.CountAsync();

            var orders = await query
                .Include(o => o.Items)
                .ThenInclude(i => i.Book)
                .Include(o => o.AppliedUserDiscount)
                .OrderByDescending(o => o.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (orders, totalCount);
        }

        public async Task<(List<Order> Orders, int TotalCount)> GetAllOrdersAsync(
            OrderStatus? status = null,
            DateTime? startDate = null,
            DateTime? endDate = null,
            int pageNumber = 1,
            int pageSize = 10)
        {
            IQueryable<Order> query = _context.Orders;

            if (status.HasValue)
            {
                query = query.Where(o => o.Status == status.Value);
            }

            if (startDate.HasValue)
            {
                DateTime utcStartDate = startDate.Value.ToUniversalTime();
                query = query.Where(o => o.CreatedAt >= utcStartDate);
            }

            if (endDate.HasValue)
            {
                DateTime utcEndDate = endDate.Value.ToUniversalTime().AddDays(1).AddSeconds(-1); // End of the day
                query = query.Where(o => o.CreatedAt <= utcEndDate);
            }

            int totalCount = await query.CountAsync();

            var orders = await query
                .Include(o => o.Items)
                .ThenInclude(i => i.Book)
                .Include(o => o.User)
                .Include(o => o.AppliedUserDiscount)
                .OrderByDescending(o => o.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (orders, totalCount);
        }

        public async Task<int> GetUserCompletedOrderCountAsync(long userId)
        {
            return await _context.Orders
                .CountAsync(o => o.UserId == userId && o.Status == OrderStatus.Completed);
        }

        public async Task<Order> CreateOrderAsync(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<bool> UpdateOrderStatusAsync(int orderId, OrderStatus status)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
            {
                return false;
            }

            order.Status = status;
            order.UpdatedAt = DateTime.UtcNow;

            if (status == OrderStatus.Completed)
            {
                order.PickupDate = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CancelOrderAsync(long orderId)
        {
            var order = await _context.Orders
                .Include(o => o.Items)
                .ThenInclude(i => i.Book)
                .Include(o => o.AppliedUserDiscount)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null || order.Status == OrderStatus.Completed || order.Status == OrderStatus.Cancelled)
            {
                return false;
            }

            order.Status = OrderStatus.Cancelled;
            order.UpdatedAt = DateTime.UtcNow;

            // If a stackable discount was used, restore it
            if (order.AppliedUserDiscount != null)
            {
                order.AppliedUserDiscount.IsUsed = false;
                order.AppliedUserDiscount.UsedAt = null;
                order.AppliedUserDiscount.AppliedToOrderId = null;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}