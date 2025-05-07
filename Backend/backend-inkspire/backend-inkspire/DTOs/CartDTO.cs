using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend_inkspire.DTOs
{
    public class CartItemDTO
    {
        public int Id { get; set; }

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
        public string ISBN { get; set; }
        public decimal Price { get; set; }
        public decimal? DiscountedPrice { get; set; }
        public string CoverImagePath { get; set; }
        public int Quantity { get; set; }
        public decimal SubTotal { get; set; }
    }

    public class CartResponseDTO
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public List<CartItemResponseDTO> Items { get; set; } = new List<CartItemResponseDTO>();
        public decimal TotalAmount { get; set; }
        public int TotalItems => Items?.Sum(i => i.Quantity) ?? 0;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class AddToCartDTO
    {
        [Required]
        public int BookId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
        public int Quantity { get; set; }
    }

    public class UpdateCartItemDTO
    {
        [Required]
        public int CartItemId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
        public int Quantity { get; set; }
    }
}