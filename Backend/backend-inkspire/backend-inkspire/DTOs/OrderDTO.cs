using System.ComponentModel.DataAnnotations;
using backend_inkspire.Entities;

namespace backend_inkspire.DTOs
{
    public class CreateOrderDTO
    {
        [Required]
        public bool UseAvailableDiscount { get; set; } = false;
    }

    public class OrderItemDTO
    {
        [Required]
        public int BookId { get; set; }

        [Required]
        public string BookTitle { get; set; }

        [Required]
        public string Author { get; set; }

        [Required]
        public string ISBN { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
        public int Quantity { get; set; }

        [Required]
        public decimal UnitPrice { get; set; }

        public decimal? DiscountedPrice { get; set; }

        [Required]
        public decimal SubTotal { get; set; }
    }

    public class OrderResponseDTO
    {
        public int Id { get; set; }

        public long UserId { get; set; }

        public string ClaimCode { get; set; }

        public decimal SubTotal { get; set; }

        public decimal DiscountAmount { get; set; }

        public decimal TotalAmount { get; set; }

        public OrderStatus Status { get; set; }

        public string StatusDisplay => Status.ToString();

        public DateTime? PickupDate { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public bool IsQualifiedForBulkDiscount { get; set; }

        public bool HasUsedStackableDiscount { get; set; }

        public List<OrderItemResponseDTO> Items { get; set; } = new List<OrderItemResponseDTO>();
    }

    public class OrderItemResponseDTO
    {
        public int Id { get; set; }

        public int BookId { get; set; }

        public string BookTitle { get; set; }

        public string Author { get; set; }

        public string ISBN { get; set; }

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal? DiscountedPrice { get; set; }

        public decimal SubTotal { get; set; }
    }

    public class PaginatedOrdersResponseDTO
    {
        public List<OrderResponseDTO> Items { get; set; } = new List<OrderResponseDTO>();

        public int CurrentPage { get; set; }

        public int TotalPages { get; set; }

        public int PageSize { get; set; }

        public int TotalCount { get; set; }

        public bool HasPrevious => CurrentPage > 1;

        public bool HasNext => CurrentPage < TotalPages;
    }

    public class OrderFilterDTO
    {
        public OrderStatus? Status { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public int PageNumber { get; set; } = 1;

        public int PageSize { get; set; } = 10;
    }

    public class VerifyOrderDTO
    {
        [Required]
        public string ClaimCode { get; set; }
    }

    public class UpdateOrderStatusDTO
    {
        [Required]
        public OrderStatus Status { get; set; }
    }
}