using System;
using System.ComponentModel.DataAnnotations;

namespace backend_inkspire.DTOs
{
    public class BookmarkDTO
    {
        [Required]
        public int BookId { get; set; }
    }

    public class BookmarkResponseDTO
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public string BookTitle { get; set; }
        public string Author { get; set; }
        public decimal Price { get; set; }
        public decimal? DiscountedPrice { get; set; }
        public string CoverImagePath { get; set; }
        public bool IsOnSale { get; set; }
        public decimal? DiscountPercentage { get; set; }
        public decimal AverageRating { get; set; }
        public int ReviewCount { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}