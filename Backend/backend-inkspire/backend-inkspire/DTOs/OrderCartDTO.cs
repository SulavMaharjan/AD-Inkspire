using System.ComponentModel.DataAnnotations;

namespace backend_inkspire.DTOs
{
 

   
  

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