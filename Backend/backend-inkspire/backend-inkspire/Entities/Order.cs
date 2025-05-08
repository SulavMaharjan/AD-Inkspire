using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_inkspire.Entities
{
    public enum OrderStatus
    {
        Pending,
        Confirmed,
        ReadyForPickup,
        Completed,
        Cancelled
    }

    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public long UserId { get; set; }

        [Required]
        public string ClaimCode { get; set; }

        [Required]
        public decimal SubTotal { get; set; }

        [Required]
        public decimal DiscountAmount { get; set; }

        [Required]
        public decimal TotalAmount { get; set; }

        [Required]
        public OrderStatus Status { get; set; }

        public DateTime? PickupDate { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public bool IsQualifiedForBulkDiscount { get; set; }

        public bool HasUsedStackableDiscount { get; set; }

        public int? AppliedUserDiscountId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        [ForeignKey("AppliedUserDiscountId")]
        public virtual UserDiscount AppliedUserDiscount { get; set; }

        public virtual ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    }

    public class OrderItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int OrderId { get; set; }

        [Required]
        public int BookId { get; set; }

        [Required]
        public string BookTitle { get; set; }

        [Required]
        public string Author { get; set; }

        [Required]
        public string ISBN { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public decimal UnitPrice { get; set; }

        public decimal? DiscountedPrice { get; set; }

        [Required]
        public decimal SubTotal { get; set; }

        [ForeignKey("OrderId")]
        public virtual Order Order { get; set; }

        [ForeignKey("BookId")]
        public virtual Book Book { get; set; }
    }

    public class UserDiscount
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public long UserId { get; set; }

        [Required]
        [Range(1, 100)]
        public decimal DiscountPercentage { get; set; }

        public bool IsUsed { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UsedAt { get; set; }

        public int? AppliedToOrderId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        public virtual Order AppliedOrder { get; set; }
    }
}