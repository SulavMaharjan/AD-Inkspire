using backend_inkspire.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace backend_inkspire.Repositories
{
    public class CartRepository : ICartRepository
    {
        private readonly AppDbContext _context;

        public CartRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Cart> GetCartByUserIdAsync(string userId, bool includeItems = true)
        {
            IQueryable<Cart> query = _context.Carts;

            if (includeItems)
            {
                query = query
                    .Include(c => c.Items)
                    .ThenInclude(i => i.Book);
            }

            return await query.FirstOrDefaultAsync(c => c.UserId == userId);
        }

        public async Task<CartItem> GetCartItemByIdAsync(int cartItemId)
        {
            return await _context.CartItems
                .Include(ci => ci.Book)
                .FirstOrDefaultAsync(ci => ci.Id == cartItemId);
        }

        public async Task<CartItem> GetCartItemAsync(int cartId, int bookId)
        {
            return await _context.CartItems
                .Include(ci => ci.Book)
                .FirstOrDefaultAsync(ci => ci.CartId == cartId && ci.BookId == bookId);
        }

        public async Task<Cart> CreateCartAsync(string userId)
        {
            var cart = new Cart
            {
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
            return cart;
        }

        public async Task<CartItem> AddItemToCartAsync(int cartId, int bookId, int quantity)
        {
            // Check if the item already exists in the cart
            var existingItem = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.CartId == cartId && ci.BookId == bookId);

            if (existingItem != null)
            {
                // Update quantity of existing item
                existingItem.Quantity += quantity;
                await _context.SaveChangesAsync();
                return existingItem;
            }

            // Add new item to cart
            var cartItem = new CartItem
            {
                CartId = cartId,
                BookId = bookId,
                Quantity = quantity,
                AddedAt = DateTime.UtcNow
            };

            _context.CartItems.Add(cartItem);

            // Update the cart's UpdatedAt timestamp
            var cart = await _context.Carts.FindAsync(cartId);
            if (cart != null)
            {
                cart.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return cartItem;
        }

        public async Task<CartItem> UpdateCartItemAsync(int cartItemId, int quantity)
        {
            var cartItem = await _context.CartItems.FindAsync(cartItemId);
            if (cartItem == null)
            {
                return null;
            }

            cartItem.Quantity = quantity;

            // Update the cart's UpdatedAt timestamp
            var cart = await _context.Carts.FindAsync(cartItem.CartId);
            if (cart != null)
            {
                cart.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return cartItem;
        }

        public async Task<bool> RemoveCartItemAsync(int cartItemId)
        {
            var cartItem = await _context.CartItems.FindAsync(cartItemId);
            if (cartItem == null)
            {
                return false;
            }

            _context.CartItems.Remove(cartItem);

            // Update the cart's UpdatedAt timestamp
            var cart = await _context.Carts.FindAsync(cartItem.CartId);
            if (cart != null)
            {
                cart.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ClearCartAsync(int cartId)
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.Id == cartId);

            if (cart == null)
            {
                return false;
            }

            _context.CartItems.RemoveRange(cart.Items);
            cart.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}