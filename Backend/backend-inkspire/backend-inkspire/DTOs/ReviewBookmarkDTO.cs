using System.ComponentModel.DataAnnotations;

namespace backend_inkspire.DTOs
{
    public class ReviewDTO
    {
        [Required]
        public int BookId { get; set; }

        [Required]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
        public int Rating { get; set; }

        public string Comment { get; set; }
    }

    public class ReviewResponseDTO
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public string BookTitle { get; set; }
        public long UserId { get; set; }
        public string UserName { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedDate { get; set; }
    }

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
        public string CoverImageUrl { get; set; }
        public bool IsInStock { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}