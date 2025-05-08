using backend_inkspire.DTOs;
using backend_inkspire.Entities;
using backend_inkspire.Repositories;

namespace backend_inkspire.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly ICartRepository _cartRepository;
        private readonly IBookRepository _bookRepository;
        private readonly IUserDiscountRepository _userDiscountRepository;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly Random _random = new Random();

        public OrderService(
            IOrderRepository orderRepository,
            ICartRepository cartRepository,
            IBookRepository bookRepository,
            IUserDiscountRepository userDiscountRepository,
            IEmailService emailService,
            IConfiguration configuration)
        {
            _orderRepository = orderRepository;
            _cartRepository = cartRepository;
            _bookRepository = bookRepository;
            _userDiscountRepository = userDiscountRepository;
            _emailService = emailService;
            _configuration = configuration;
        }

        public async Task<OrderResponseDTO> CreateOrderAsync(string userId, CreateOrderDTO createOrderDto)
        {
            if (!long.TryParse(userId, out long userIdLong))
            {
                throw new InvalidOperationException("Invalid user ID format");
            }

            var cart = await _cartRepository.GetCartByUserIdAsync(userId);
            if (cart == null || !cart.Items.Any())
            {
                throw new InvalidOperationException("Your cart is empty");
            }

            //checking items are in stock
            foreach (var item in cart.Items)
            {
                var book = await _bookRepository.GetBookByIdAsync(item.BookId);
                if (book == null)
                {
                    throw new InvalidOperationException($"Book with ID {item.BookId} not found");
                }

                if (book.StockQuantity < item.Quantity)
                {
                    throw new InvalidOperationException($"Not enough stock for '{book.Title}'. Available: {book.StockQuantity}");
                }
            }

            //generate claim code
            string claimCode = GenerateClaimCode();

            //calculate discounts
            decimal subtotal = cart.TotalAmount;
            decimal discountAmount = 0;

            bool isQualifiedForBulkDiscount = false;
            bool hasUsedStackableDiscount = false;
            UserDiscount appliedDiscount = null;

            //checking for bulk discount (5% for 5+ books)
            int totalItems = cart.Items.Sum(i => i.Quantity);
            if (totalItems >= 5)
            {
                isQualifiedForBulkDiscount = true;
                discountAmount += subtotal * 0.05m;
            }

            //checking stackable 10% discount after every 10 orders
            if (createOrderDto.UseAvailableDiscount)
            {
                //get user discounts
                var availableDiscounts = await _userDiscountRepository.GetUserDiscountsAsync(userIdLong);
                if (availableDiscounts.Any())
                {
                    appliedDiscount = availableDiscounts.OrderBy(d => d.CreatedAt).First();
                    hasUsedStackableDiscount = true;
                    discountAmount += subtotal * (appliedDiscount.DiscountPercentage / 100);
                }
            }

            //final total
            decimal totalAmount = subtotal - discountAmount;

            //create order
            var order = new Order
            {
                UserId = userIdLong,
                ClaimCode = claimCode,
                SubTotal = subtotal,
                DiscountAmount = discountAmount,
                TotalAmount = totalAmount,
                Status = OrderStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsQualifiedForBulkDiscount = isQualifiedForBulkDiscount,
                HasUsedStackableDiscount = hasUsedStackableDiscount,
                AppliedUserDiscountId = appliedDiscount?.Id
            };

            //add order items
            foreach (var cartItem in cart.Items)
            {
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

                var orderItem = new OrderItem
                {
                    BookId = cartItem.BookId,
                    BookTitle = cartItem.Book.Title,
                    Author = cartItem.Book.Author,
                    ISBN = cartItem.Book.ISBN,
                    Quantity = cartItem.Quantity,
                    UnitPrice = cartItem.Book.Price,
                    DiscountedPrice = discountedPrice,
                    SubTotal = currentPrice * cartItem.Quantity
                };

                order.Items.Add(orderItem);
            }

            await _orderRepository.CreateOrderAsync(order);

            //update book stock
            foreach (var item in order.Items)
            {
                await _bookRepository.UpdateBookStockAsync(item.BookId, -item.Quantity);
            }

            // If stackable discount was used, mark it as used
            if (appliedDiscount != null)
            {
                await _userDiscountRepository.UseDiscountAsync(appliedDiscount.Id, order.Id);
            }

            //check if user qualifies for a new discount (every 10th order)
            await CheckAndCreateDiscountAsync(userId);

            //clear cart
            await _cartRepository.ClearCartAsync(cart.Id);

            //confirmation email
            await SendOrderConfirmationEmailAsync(order);

            return MapToOrderResponseDTO(order);
        }

        public async Task<OrderResponseDTO> GetOrderByIdAsync(int orderId, long userId)
        {
            var order = await _orderRepository.GetOrderByIdAsync(orderId);
            if (order == null || order.UserId != userId)
            {
                return null;
            }

            return MapToOrderResponseDTO(order);
        }

        public async Task<OrderResponseDTO> GetOrderByClaimCodeAsync(string claimCode)
        {
            var order = await _orderRepository.GetOrderByClaimCodeAsync(claimCode);
            if (order == null)
            {
                return null;
            }

            return MapToOrderResponseDTO(order);
        }

        public async Task<PaginatedOrdersResponseDTO> GetUserOrdersAsync(long userId, OrderFilterDTO filter)
        {
            var (orders, totalCount) = await _orderRepository.GetFilteredOrdersAsync(
                userId,
                filter.Status,
                filter.StartDate,
                filter.EndDate,
                filter.PageNumber,
                filter.PageSize);

            var orderDtos = orders.Select(MapToOrderResponseDTO).ToList();

            return new PaginatedOrdersResponseDTO
            {
                Items = orderDtos,
                CurrentPage = filter.PageNumber,
                PageSize = filter.PageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)filter.PageSize)
            };
        }

        public async Task<PaginatedOrdersResponseDTO> GetAllOrdersAsync(OrderFilterDTO filter)
        {
            var (orders, totalCount) = await _orderRepository.GetAllOrdersAsync(
                filter.Status,
                filter.StartDate,
                filter.EndDate,
                filter.PageNumber,
                filter.PageSize);

            var orderDtos = orders.Select(MapToOrderResponseDTO).ToList();

            return new PaginatedOrdersResponseDTO
            {
                Items = orderDtos,
                CurrentPage = filter.PageNumber,
                PageSize = filter.PageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)filter.PageSize)
            };
        }

        public async Task<bool> CancelOrderAsync(int orderId, long userId)
        {
            var order = await _orderRepository.GetOrderByIdAsync(orderId);
            if (order == null || order.UserId != userId)
            {
                return false;
            }

            //only cancel if not completed or already cancelled
            if (order.Status == OrderStatus.Completed || order.Status == OrderStatus.Cancelled)
            {
                return false;
            }

            //update order status
            var result = await _orderRepository.CancelOrderAsync(orderId);
            if (!result)
            {
                return false;
            }

            //restore stock
            foreach (var item in order.Items)
            {
                await _bookRepository.UpdateBookStockAsync(item.BookId, item.Quantity);
            }

            await SendOrderCancellationEmailAsync(order);

            return true;
        }

        public async Task<bool> UpdateOrderStatusAsync(int orderId, OrderStatus status)
        {
            var order = await _orderRepository.GetOrderByIdAsync(orderId);
            if (order == null)
            {
                return false;
            }

            if (order.Status == OrderStatus.Cancelled ||
                order.Status == OrderStatus.Completed ||
                (int)status < (int)order.Status)
            {
                return false;
            }

            //update order status
            var result = await _orderRepository.UpdateOrderStatusAsync(orderId, status);
            if (!result)
            {
                return false;
            }

            // If completed, check and create discount if eligible
            if (status == OrderStatus.Completed)
            {
                await CheckAndCreateDiscountAsync(order.UserId.ToString());
            }

            return true;
        }

        public async Task<bool> VerifyOrderAsync(string claimCode, long staffUserId)
        {
            var order = await _orderRepository.GetOrderByClaimCodeAsync(claimCode);
            if (order == null)
            {
                return false;
            }

            if (order.Status == OrderStatus.Completed || order.Status == OrderStatus.Cancelled)
            {
                return false;
            }

            //update order status to completed
            var result = await _orderRepository.UpdateOrderStatusAsync(order.Id, OrderStatus.Completed);
            if (!result)
            {
                return false;
            }

            await SendOrderPickupConfirmationEmailAsync(order);

            return true;
        }

        public async Task<bool> CheckDiscountEligibilityAsync(string userId)
        {
            if (!long.TryParse(userId, out long userIdLong))
            {
                throw new InvalidOperationException("Invalid user ID format");
            }

            return await CheckAndCreateDiscountAsync(userId);
        }

        private string GenerateClaimCode()
        {
            const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
            return new string(Enumerable.Repeat(chars, 8)
                .Select(s => s[_random.Next(s.Length)]).ToArray());
        }

        private async Task<bool> CheckAndCreateDiscountAsync(string userId)
        {
            if (!long.TryParse(userId, out long userIdLong))
            {
                throw new InvalidOperationException("Invalid user ID format");
            }

            //completed order count for the user
            int completedOrderCount = await _orderRepository.GetUserCompletedOrderCountAsync(userIdLong);

            //10th completed order 10% discount
            if (completedOrderCount > 0 && completedOrderCount % 10 == 0)
            {
                //create a new discount for the user
                var discount = new UserDiscount
                {
                    UserId = userIdLong,
                    DiscountPercentage = 10,
                    IsUsed = false,
                    CreatedAt = DateTime.UtcNow
                };

                await _userDiscountRepository.CreateUserDiscountAsync(discount);

                //discount notification email
                await SendDiscountNotificationEmailAsync(userId, discount);
                return true;
            }

            return false;
        }

        private OrderResponseDTO MapToOrderResponseDTO(Order order)
        {
            if (order == null)
                return null;

            return new OrderResponseDTO
            {
                Id = order.Id,
                UserId = order.UserId,
                ClaimCode = order.ClaimCode,
                SubTotal = order.SubTotal,
                DiscountAmount = order.DiscountAmount,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                PickupDate = order.PickupDate,
                CreatedAt = order.CreatedAt,
                UpdatedAt = order.UpdatedAt,
                IsQualifiedForBulkDiscount = order.IsQualifiedForBulkDiscount,
                HasUsedStackableDiscount = order.HasUsedStackableDiscount,
                Items = order.Items?.Select(item => new OrderItemResponseDTO
                {
                    Id = item.Id,
                    BookId = item.BookId,
                    BookTitle = item.BookTitle,
                    Author = item.Author,
                    ISBN = item.ISBN,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    DiscountedPrice = item.DiscountedPrice,
                    SubTotal = item.SubTotal
                }).ToList() ?? new List<OrderItemResponseDTO>()
            };
        }

        private async Task SendOrderConfirmationEmailAsync(Order order)
        {
            try
            {
                //get user email
                string userEmail = order.User?.Email;
                if (string.IsNullOrEmpty(userEmail))
                {
                    return;
                }

                string subject = $"Order Confirmation - Order #{order.Id}";

                string body = $@"
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background-color: #f8f9fa; padding: 10px; text-align: center; }}
                        .content {{ padding: 20px; }}
                        .footer {{ background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; }}
                        table {{ width: 100%; border-collapse: collapse; }}
                        th, td {{ padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }}
                        .total {{ font-weight: bold; }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h1>Order Confirmation</h1>
                        </div>
                        <div class='content'>
                            <p>Thank you for your order!</p>
                            <p>Your order has been received and is being processed. Here are your order details:</p>
                            
                            <h3>Order Information</h3>
                            <p>Order Number: {order.Id}</p>
                            <p>Order Date: {order.CreatedAt:yyyy-MM-dd HH:mm:ss}</p>
                            <p>Claim Code: <strong>{order.ClaimCode}</strong></p>
                            <p>Status: {order.Status}</p>
                            
                            <h3>Order Summary</h3>
                            <table>
                                <tr>
                                    <th>Book</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Subtotal</th>
                                </tr>";

                //order items
                foreach (var item in order.Items)
                {
                    decimal displayPrice = item.DiscountedPrice ?? item.UnitPrice;
                    body += $@"
                                <tr>
                                    <td>{item.BookTitle}</td>
                                    <td>{item.Quantity}</td>
                                    <td>${displayPrice:0.00}</td>
                                    <td>${item.SubTotal:0.00}</td>
                                </tr>";
                }

                //order totals
                body += $@"
                                <tr>
                                    <td colspan='3' class='total'>Subtotal</td>
                                    <td>${order.SubTotal:0.00}</td>
                                </tr>";

                if (order.DiscountAmount > 0)
                {
                    body += $@"
                                <tr>
                                    <td colspan='3' class='total'>Discount</td>
                                    <td>-${order.DiscountAmount:0.00}</td>
                                </tr>";
                }

                body += $@"
                                <tr>
                                    <td colspan='3' class='total'>Total</td>
                                    <td>${order.TotalAmount:0.00}</td>
                                </tr>
                            </table>
                            
                            <h3>Pickup Instructions</h3>
                            <p>Present your membership ID and claim code <strong>{order.ClaimCode}</strong> at our store to pick up your order.</p>
                            
                            <p>If you have any questions about your order, please contact our customer service.</p>
                            
                            <p>Thank you for shopping with us!</p>
                        </div>
                        <div class='footer'>
                            <p>© " + DateTime.Now.Year + @" InkSpire Book Store. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>";

                //send email
                await _emailService.SendEmailAsync(userEmail, subject, body, true);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending order confirmation email: {ex.Message}");
            }
        }

        private async Task SendOrderCancellationEmailAsync(Order order)
        {
            try
            {
                //get user email
                string userEmail = order.User?.Email;
                if (string.IsNullOrEmpty(userEmail))
                {
                    return;
                }

                string subject = $"Order Cancellation - Order #{order.Id}";

                string body = $@"
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background-color: #f8f9fa; padding: 10px; text-align: center; }}
                        .content {{ padding: 20px; }}
                        .footer {{ background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h1>Order Cancellation</h1>
                        </div>
                        <div class='content'>
                            <p>Your order #{order.Id} has been cancelled.</p>
                            <p>Order details:</p>
                            <p>Order Date: {order.CreatedAt:yyyy-MM-dd HH:mm:ss}</p>
                            <p>Cancellation Date: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}</p>
                            
                            <p>If you did not request this cancellation or have any questions, please contact our customer service.</p>
                            
                            <p>Thank you for your understanding.</p>
                        </div>
                        <div class='footer'>
                            <p>© " + DateTime.Now.Year + @" InkSpire Book Store. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>";

                await _emailService.SendEmailAsync(userEmail, subject, body, true);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending order cancellation email: {ex.Message}");
            }
        }

        private async Task SendOrderPickupConfirmationEmailAsync(Order order)
        {
            try
            {
                //get user email
                string userEmail = order.User?.Email;
                if (string.IsNullOrEmpty(userEmail))
                {
                    return;
                }

                string subject = $"Order Pickup Confirmation - Order #{order.Id}";

                string body = $@"
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background-color: #f8f9fa; padding: 10px; text-align: center; }}
                        .content {{ padding: 20px; }}
                        .footer {{ background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h1>Order Pickup Confirmation</h1>
                        </div>
                        <div class='content'>
                            <p>Your order #{order.Id} has been successfully picked up.</p>
                            <p>Order details:</p>
                            <p>Order Date: {order.CreatedAt:yyyy-MM-dd HH:mm:ss}</p>
                            <p>Pickup Date: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}</p>
                            
                            <p>Thank you for shopping with us!</p>
                        </div>
                        <div class='footer'>
                            <p>© " + DateTime.Now.Year + @" InkSpire Book Store. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>";

                await _emailService.SendEmailAsync(userEmail, subject, body, true);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending order pickup confirmation email: {ex.Message}");
            }
        }

        private async Task SendDiscountNotificationEmailAsync(string userId, UserDiscount discount)
        {
            try
            {
                //get user using the repository method
                var user = await _userDiscountRepository.GetUserByIdAsync(userId);
                if (user == null || string.IsNullOrEmpty(user.Email))
                {
                    return;
                }

                string subject = "You've Earned a Discount!";

                string body = $@"
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: #f8f9fa; padding: 10px; text-align: center; }}
                .content {{ padding: 20px; }}
                .footer {{ background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; }}
                .discount {{ font-size: 24px; font-weight: bold; color: #007bff; text-align: center; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>Congratulations!</h1>
                </div>
                <div class='content'>
                    <p>Thank you for your continued support!</p>
                    <p>As a valued customer, you've earned a special discount for your next purchase:</p>
                    
                    <div class='discount'>{discount.DiscountPercentage}% OFF your next order</div>
                    
                    <p>This discount will be automatically applied to your next purchase.</p>
                    
                    <p>Thank you for shopping with us!</p>
                </div>
                <div class='footer'>
                    <p>© " + DateTime.Now.Year + @" InkSpire Book Store. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>";

                await _emailService.SendEmailAsync(user.Email, subject, body, true);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending discount notification email: {ex.Message}");
            }
        }
    }
}