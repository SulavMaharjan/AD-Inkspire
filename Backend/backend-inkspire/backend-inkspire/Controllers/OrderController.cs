using backend_inkspire.DTOs;
using backend_inkspire.Entities;
using backend_inkspire.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_inkspire.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        // POST: api/orders
        [HttpPost]
        [Authorize(Roles = "Member")]
        public async Task<ActionResult<OrderResponseDTO>> CreateOrder([FromBody] CreateOrderDTO createOrderDto)
        {
            try
            {
                string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var order = await _orderService.CreateOrderAsync(userId, createOrderDto);
                return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the order." });
            }
        }

        // GET: api/orders/id
        [HttpGet("{id}")]
        [Authorize(Roles = "Member,SuperAdmin,Staff")]
        public async Task<ActionResult<OrderResponseDTO>> GetOrder(int id)
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!long.TryParse(userId, out long userIdLong))
            {
                return BadRequest(new { message = "Invalid user ID format" });
            }

            var order = await _orderService.GetOrderByIdAsync(id, userIdLong);
            if (order == null)
            {
                return NotFound();
            }

            return Ok(order);
        }

        // GET: api/orders/claim/{claimCode}
        [HttpGet("claim/{claimCode}")]
        [Authorize(Roles = "Member,Staff,SuperAdmin")]
        public async Task<ActionResult<OrderResponseDTO>> GetOrderByClaimCode(string claimCode)
        {
            var order = await _orderService.GetOrderByClaimCodeAsync(claimCode);
            if (order == null)
            {
                return NotFound();
            }

            return Ok(order);
        }

        // GET: api/orders/user
        [HttpGet("user")]
        [Authorize(Roles = "Member")]
        public async Task<ActionResult<PaginatedOrdersResponseDTO>> GetUserOrders([FromQuery] OrderFilterDTO filter)
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!long.TryParse(userId, out long userIdLong))
            {
                return BadRequest(new { message = "Invalid user ID format" });
            }

            var orders = await _orderService.GetUserOrdersAsync(userIdLong, filter);
            return Ok(orders);
        }

        // GET: api/orders
        [HttpGet]
        [Authorize(Roles = "Staff,SuperAdmin")]
        public async Task<ActionResult<PaginatedOrdersResponseDTO>> GetAllOrders([FromQuery] OrderFilterDTO filter)
        {
            var orders = await _orderService.GetAllOrdersAsync(filter);
            return Ok(orders);
        }

        // POST: api/orders/id/cancel
        [HttpPost("{id}/cancel")]
        [Authorize(Roles = "Member")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!long.TryParse(userId, out long userIdLong))
            {
                return BadRequest(new { message = "Invalid user ID format" });
            }

            var result = await _orderService.CancelOrderAsync(id, userIdLong);
            if (!result)
            {
                return BadRequest(new { message = "Unable to cancel the order. It may be already completed or cancelled." });
            }

            return NoContent();
        }

        // POST: api/orders/id/status
        [HttpPost("{id}/status")]
        [Authorize(Roles = "Staff,SuperAdmin")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDTO updateOrderStatusDTO)
        {
            if (!Enum.IsDefined(typeof(OrderStatus), updateOrderStatusDTO.Status))
            {
                return BadRequest(new { message = "Invalid order status" });
            }

            var result = await _orderService.UpdateOrderStatusAsync(id, updateOrderStatusDTO.Status);
            if (!result)
            {
                return BadRequest(new { message = "Unable to update the order status. It may be already completed or cancelled." });
            }

            return NoContent();
        }

        // POST: api/orders/verify
        [HttpPost("verify")]
        [Authorize(Roles = "Staff,SuperAdmin")]
        public async Task<IActionResult> VerifyOrder([FromBody] VerifyOrderDTO verifyOrderDTO)
        {
            string staffUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!long.TryParse(staffUserId, out long staffUserIdLong))
            {
                return BadRequest(new { message = "Invalid staff user ID format" });
            }

            var result = await _orderService.VerifyOrderAsync(verifyOrderDTO.ClaimCode, staffUserIdLong);
            if (!result)
            {
                return BadRequest(new { message = "Unable to verify the order. It may be already completed, cancelled, or the claim code is invalid." });
            }

            return NoContent();
        }

        // GET: api/orders/check-discount
        [HttpGet("check-discount")]
        [Authorize(Roles = "Member")]
        public async Task<ActionResult<bool>> CheckDiscountEligibility()
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _orderService.CheckDiscountEligibilityAsync(userId);
            return Ok(result);
        }

    }
}