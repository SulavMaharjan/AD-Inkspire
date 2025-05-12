using backend_inkspire.DTOs;
using backend_inkspire.Entities;
using System.Threading.Tasks;

namespace backend_inkspire.Services
{
    public interface IOrderService
    {
        Task<OrderResponseDTO> CreateOrderAsync(string userId, CreateOrderDTO createOrderDto);
        Task<OrderResponseDTO> GetOrderByIdAsync(int orderId, long userId);
        Task<OrderResponseDTO> GetOrderByClaimCodeAsync(string claimCode, string memberId = null);
        Task<PaginatedOrdersResponseDTO> GetUserOrdersAsync(long userId, OrderFilterDTO filter);
        Task<PaginatedOrdersResponseDTO> GetAllOrdersAsync(OrderFilterDTO filter);
        Task<bool> CancelOrderAsync(int orderId, long userId);
        Task<bool> UpdateOrderStatusAsync(int orderId, OrderStatus status);
        Task<bool> VerifyOrderAsync(string claimCode, long staffUserId);
        Task<bool> CheckDiscountEligibilityAsync(string userId);
    }
}