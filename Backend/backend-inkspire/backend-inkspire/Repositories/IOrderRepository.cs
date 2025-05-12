using backend_inkspire.Entities;

namespace backend_inkspire.Repositories
{
    public interface IOrderRepository
    {
        Task<Order> GetOrderByIdAsync(long orderId, bool includeItems = true);
        Task<Order> GetOrderByClaimCodeAsync(string claimCode, long? expectedUserId = null, bool includeItems = true);
        Task<List<Order>> GetOrdersByUserIdAsync(long userId, bool includeItems = true);
        Task<(List<Order> Orders, int TotalCount)> GetFilteredOrdersAsync(
            long userId,
            OrderStatus? status = null,
            DateTime? startDate = null,
            DateTime? endDate = null,
            int pageNumber = 1,
            int pageSize = 10);
        Task<(List<Order> Orders, int TotalCount)> GetAllOrdersAsync(
            OrderStatus? status = null,
            DateTime? startDate = null,
            DateTime? endDate = null,
            int pageNumber = 1,
            int pageSize = 10);
        Task<int> GetUserCompletedOrderCountAsync(long userId);
        Task<Order> CreateOrderAsync(Order order);
        Task<bool> UpdateOrderStatusAsync(int orderId, OrderStatus status);
        Task<bool> CancelOrderAsync(long orderId);
        Task SaveChangesAsync();
    }
}