using System.ComponentModel.DataAnnotations;

namespace backend_inkspire.DTOs
{
    public class CartItemDTO
    {
        [Required]
        public int BookId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
        public int Quantity { get; set; }
    }

    public class CartItemResponseDTO
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public string BookTitle { get; set; }
        public string Author { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal? DiscountedPrice { get; set; }
        public int Quantity { get; set; }
        public decimal Subtotal { get; set; }
        public string CoverImageUrl { get; set; }
    }

    public class CartResponseDTO
    {
        public int Id { get; set; }
        public List<CartItemResponseDTO> Items { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal EstimatedDiscount { get; set; }
        public decimal EstimatedFinalAmount { get; set; }
        public DateTime LastUpdatedDate { get; set; }
    }

    public class OrderResponseDTO
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal FinalAmount { get; set; }
        public string ClaimCode { get; set; }
        public List<OrderItemResponseDTO> Items { get; set; }
    }

    public class OrderItemResponseDTO
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public string BookTitle { get; set; }
        public string Author { get; set; }
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal Subtotal { get; set; }
    }

    public class PlaceOrderDTO
    {
        public bool UseAvailableDiscount { get; set; }
    }

    public class CancelOrderDTO
    {
        [Required]
        public int OrderId { get; set; }
    }
}