using backend_inkspire.DTOs;
using backend_inkspire.Entities;
using backend_inkspire.Repositories;

namespace backend_inkspire.Services
{
    public class CartService : ICartService
    {
        private readonly ICartRepository _cartRepository;
        private readonly IBookRepository _bookRepository;

        public CartService(ICartRepository cartRepository, IBookRepository bookRepository)
        {
            _cartRepository = cartRepository;
            _bookRepository = bookRepository;
        }

        public async Task<CartResponseDTO> GetCartByUserIdAsync(string userId)
        {
            var cart = await _cartRepository.GetCartByUserIdAsync(userId);
            if (cart == null)
            {
                // Create a new cart if user doesn't have one
                cart = await _cartRepository.CreateCartAsync(userId);
                return MapToCartResponseDTO(cart);
            }

            return MapToCartResponseDTO(cart);
        }

        public async Task<CartItemResponseDTO> AddToCartAsync(string userId, AddToCartDTO addToCartDto)
        {
            if (addToCartDto == null)
            {
                throw new ArgumentNullException(nameof(addToCartDto));
            }

            // Validate book exists
            var book = await _bookRepository.GetBookByIdAsync(addToCartDto.BookId);
            if (book == null)
            {
                throw new InvalidOperationException($"Book with ID {addToCartDto.BookId} not found.");
            }

            // Check stock availability
            if (book.StockQuantity < addToCartDto.Quantity)
            {
                throw new InvalidOperationException($"Not enough stock available. Only {book.StockQuantity} items left.");
            }

            // Get or create user's cart
            var cart = await _cartRepository.GetCartByUserIdAsync(userId);
            if (cart == null)
            {
                cart = await _cartRepository.CreateCartAsync(userId);
            }

            // Add item to cart
            var cartItem = await _cartRepository.AddItemToCartAsync(cart.Id, addToCartDto.BookId, addToCartDto.Quantity);

            // Reload the cart item with book details
            cartItem = await _cartRepository.GetCartItemByIdAsync(cartItem.Id);

            return MapToCartItemResponseDTO(cartItem);
        }

        public async Task<CartItemResponseDTO> UpdateCartItemAsync(string userId, UpdateCartItemDTO updateCartItemDto)
        {
            if (updateCartItemDto == null)
            {
                throw new ArgumentNullException(nameof(updateCartItemDto));
            }

            // Get user's cart
            var cart = await _cartRepository.GetCartByUserIdAsync(userId);
            if (cart == null)
            {
                throw new InvalidOperationException("Cart not found.");
            }

            // Check if the item exists and belongs to the user's cart
            var cartItem = await _cartRepository.GetCartItemByIdAsync(updateCartItemDto.CartItemId);
            if (cartItem == null || cartItem.CartId != cart.Id)
            {
                throw new InvalidOperationException("Cart item not found or doesn't belong to the user's cart.");
            }

            // Check stock availability
            var book = await _bookRepository.GetBookByIdAsync(cartItem.BookId);
            if (book == null || book.StockQuantity < updateCartItemDto.Quantity)
            {
                throw new InvalidOperationException($"Not enough stock available. Only {book?.StockQuantity ?? 0} items left.");
            }

            // Update cart item
            cartItem = await _cartRepository.UpdateCartItemAsync(updateCartItemDto.CartItemId, updateCartItemDto.Quantity);

            // Reload the cart item with book details
            cartItem = await _cartRepository.GetCartItemByIdAsync(cartItem.Id);

            return MapToCartItemResponseDTO(cartItem);
        }

        public async Task<bool> RemoveFromCartAsync(string userId, int cartItemId)
        {
            // Get user's cart
            var cart = await _cartRepository.GetCartByUserIdAsync(userId);
            if (cart == null)
            {
                throw new InvalidOperationException("Cart not found.");
            }

            // Check if the item exists and belongs to the user's cart
            var cartItem = await _cartRepository.GetCartItemByIdAsync(cartItemId);
            if (cartItem == null || cartItem.CartId != cart.Id)
            {
                throw new InvalidOperationException("Cart item not found or doesn't belong to the user's cart.");
            }

            // Remove the item
            return await _cartRepository.RemoveCartItemAsync(cartItemId);
        }

        public async Task<bool> ClearCartAsync(string userId)
        {
            // Get user's cart
            var cart = await _cartRepository.GetCartByUserIdAsync(userId);
            if (cart == null)
            {
                // Cart doesn't exist, consider it already cleared
                return true;
            }

            // Clear the cart
            return await _cartRepository.ClearCartAsync(cart.Id);
        }

        #region Helper Methods

        private CartResponseDTO MapToCartResponseDTO(Cart cart)
        {
            if (cart == null) return null;

            var cartResponseDto = new CartResponseDTO
            {
                Id = cart.Id,
                UserId = cart.UserId,
                CreatedAt = cart.CreatedAt,
                UpdatedAt = cart.UpdatedAt,
                Items = cart.Items?.Select(MapToCartItemResponseDTO).ToList() ?? new List<CartItemResponseDTO>(),
                TotalAmount = cart.Items?.Sum(i => i.Quantity * (
                    i.Book.IsOnSale &&
                    i.Book.DiscountPercentage.HasValue &&
                    i.Book.DiscountStartDate.HasValue &&
                    i.Book.DiscountEndDate.HasValue &&
                    DateTime.Now >= i.Book.DiscountStartDate &&
                    DateTime.Now <= i.Book.DiscountEndDate
                        ? (i.Book.Price - (i.Book.Price * i.Book.DiscountPercentage.Value / 100))
                        : i.Book.Price)) ?? 0
            };

            return cartResponseDto;
        }
        private CartItemResponseDTO MapToCartItemResponseDTO(CartItem cartItem)
        {
            if (cartItem == null || cartItem.Book == null) return null;

            bool isDiscounted = cartItem.Book.IsOnSale &&
                cartItem.Book.DiscountPercentage.HasValue &&
                cartItem.Book.DiscountStartDate.HasValue &&
                cartItem.Book.DiscountEndDate.HasValue &&
                DateTime.Now >= cartItem.Book.DiscountStartDate &&
                DateTime.Now <= cartItem.Book.DiscountEndDate;

            decimal currentPrice = cartItem.Book.Price;
            decimal? discountedPrice = null;

            if (isDiscounted && cartItem.Book.DiscountPercentage.HasValue)
            {
                discountedPrice = cartItem.Book.Price - (cartItem.Book.Price * cartItem.Book.DiscountPercentage.Value / 100);
                currentPrice = discountedPrice.Value;
            }

            return new CartItemResponseDTO
            {
                Id = cartItem.Id,
                BookId = cartItem.BookId,
                BookTitle = cartItem.Book.Title,
                Author = cartItem.Book.Author,
                ISBN = cartItem.Book.ISBN,
                Price = cartItem.Book.Price,
                DiscountedPrice = discountedPrice,
                CoverImagePath = cartItem.Book.CoverImagePath,
                Quantity = cartItem.Quantity,
                SubTotal = currentPrice * cartItem.Quantity
            };
        }

        #endregion
    }
}