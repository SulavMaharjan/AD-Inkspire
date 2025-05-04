using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_inkspire.Entities
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public long UserId { get; set; }

        [Required]
        public DateTime OrderDate { get; set; }

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } 

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal DiscountAmount { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal FinalAmount { get; set; }

        [Required]
        [MaxLength(20)]
        public string ClaimCode { get; set; }

        public bool IsDiscountApplied { get; set; }

        public decimal AppliedDiscountPercentage { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        public virtual ICollection<OrderItem> OrderItems { get; set; }

        public Order()
        {
            OrderDate = DateTime.Now;
            Status = "Pending";
            OrderItems = new List<OrderItem>();
            ClaimCode = GenerateClaimCode();
        }

        private string GenerateClaimCode()
        {
            // Generate a random alphanumeric code
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, 8)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
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
        public int Quantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Subtotal { get; set; }

        // Navigation properties
        [ForeignKey("OrderId")]
        public virtual Order Order { get; set; }

        [ForeignKey("BookId")]
        public virtual Book Book { get; set; }
    }

    public class Cart
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public long UserId { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime LastUpdatedDate { get; set; }

 
        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        public virtual ICollection<CartItem> CartItems { get; set; }

        public Cart()
        {
            CreatedDate = DateTime.Now;
            LastUpdatedDate = DateTime.Now;
            CartItems = new List<CartItem>();
        }
    }

    public class CartItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int CartId { get; set; }

        [Required]
        public int BookId { get; set; }

        [Required]
        public int Quantity { get; set; }

        public DateTime AddedDate { get; set; }

      
        [ForeignKey("CartId")]
        public virtual Cart Cart { get; set; }

        [ForeignKey("BookId")]
        public virtual Book Book { get; set; }

        public CartItem()
        {
            AddedDate = DateTime.Now;
        }
    }

    public class UserDiscount
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public long UserId { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal DiscountPercentage { get; set; } // 10% after every 10 successful orders

        public bool IsUsed { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime? UsedDate { get; set; }

      
        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        public UserDiscount()
        {
            CreatedDate = DateTime.Now;
            IsUsed = false;
        }
    }
}