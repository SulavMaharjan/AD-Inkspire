using backend_inkspire.DTOs;
using System.Threading.Tasks;

namespace backend_inkspire.Services
{
    public interface ICartService
    {
        Task<CartResponseDTO> GetCartByUserIdAsync(string userId);
        Task<CartItemResponseDTO> AddToCartAsync(string userId, AddToCartDTO addToCartDto);
        Task<CartItemResponseDTO> UpdateCartItemAsync(string userId, UpdateCartItemDTO updateCartItemDto);
        Task<bool> RemoveFromCartAsync(string userId, int cartItemId);
        Task<bool> ClearCartAsync(string userId);
    }
}