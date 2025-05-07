using backend_inkspire.DTOs;
using backend_inkspire.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace backend_inkspire.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Require authentication for all cart operations
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        // GET: api/cart
        [HttpGet]
        public async Task<ActionResult<CartResponseDTO>> GetCart()
        {
            try
            {
                string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated or user ID not found in token.");
                }

                var cart = await _cartService.GetCartByUserIdAsync(userId);
                return Ok(cart);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/cart/items
        [HttpPost("items")]
        public async Task<ActionResult<CartItemResponseDTO>> AddToCart(AddToCartDTO addToCartDto)
        {
            try
            {
                string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated or user ID not found in token.");
                }

                var cartItem = await _cartService.AddToCartAsync(userId, addToCartDto);
                return Ok(cartItem);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/cart/items
        [HttpPut("items")]
        public async Task<ActionResult<CartItemResponseDTO>> UpdateCartItem(UpdateCartItemDTO updateCartItemDto)
        {
            try
            {
                string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated or user ID not found in token.");
                }

                var cartItem = await _cartService.UpdateCartItemAsync(userId, updateCartItemDto);
                return Ok(cartItem);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/cart/items/{id}
        [HttpDelete("items/{id}")]
        public async Task<ActionResult> RemoveFromCart(int id)
        {
            try
            {
                string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated or user ID not found in token.");
                }

                var result = await _cartService.RemoveFromCartAsync(userId, id);
                if (!result)
                {
                    return NotFound("Cart item not found.");
                }

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/cart
        [HttpDelete]
        public async Task<ActionResult> ClearCart()
        {
            try
            {
                string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated or user ID not found in token.");
                }

                var result = await _cartService.ClearCartAsync(userId);
                if (!result)
                {
                    return NotFound("Cart not found.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}