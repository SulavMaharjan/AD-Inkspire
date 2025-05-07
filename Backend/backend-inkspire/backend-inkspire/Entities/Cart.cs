using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_inkspire.Entities
{
    public class Cart
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public virtual ICollection<CartItem> Items { get; set; } = new List<CartItem>();

        [NotMapped]
        public decimal TotalAmount => Items?.Sum(i => i.Quantity * (i.Book.IsCurrentlyDiscounted
            ? (i.Book.Price - (i.Book.Price * i.Book.DiscountPercentage.Value / 100))
            : i.Book.Price)) ?? 0;
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
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
        public int Quantity { get; set; }

        public DateTime AddedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("CartId")]
        public virtual Cart Cart { get; set; }

        [ForeignKey("BookId")]
        public virtual Book Book { get; set; }
    }
}