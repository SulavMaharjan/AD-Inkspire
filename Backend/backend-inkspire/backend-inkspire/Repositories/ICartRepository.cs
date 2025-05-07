using backend_inkspire.Entities;
using System.Threading.Tasks;

namespace backend_inkspire.Repositories
{
    public interface ICartRepository
    {
        Task<Cart> GetCartByUserIdAsync(string userId, bool includeItems = true);
        Task<CartItem> GetCartItemByIdAsync(int cartItemId);
        Task<CartItem> GetCartItemAsync(int cartId, int bookId);
        Task<Cart> CreateCartAsync(string userId);
        Task<CartItem> AddItemToCartAsync(int cartId, int bookId, int quantity);
        Task<CartItem> UpdateCartItemAsync(int cartItemId, int quantity);
        Task<bool> RemoveCartItemAsync(int cartItemId);
        Task<bool> ClearCartAsync(int cartId);
        Task SaveChangesAsync();
    }
}