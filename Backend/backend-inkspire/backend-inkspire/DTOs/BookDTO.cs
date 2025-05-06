using System.ComponentModel.DataAnnotations;

namespace backend_inkspire.DTOs
{
    public class BookDTO
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; }

        [Required(ErrorMessage = "ISBN is required")]
        //[RegularExpression(@"^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$", ErrorMessage = "Invalid ISBN format")]
        public string ISBN { get; set; }

        [Required(ErrorMessage = "Author is required")]
        public string Author { get; set; }

        [Required(ErrorMessage = "Publisher is required")]
        public string Publisher { get; set; }

        [Required(ErrorMessage = "Publication date is required")]
        public DateTime PublicationDate { get; set; }

        [Required(ErrorMessage = "Price is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Stock quantity is required")]
        [Range(0, int.MaxValue, ErrorMessage = "Stock quantity must be a non-negative number")]
        public int StockQuantity { get; set; }

        [Required(ErrorMessage = "Genre is required")]
        public string Genre { get; set; }

        [Required(ErrorMessage = "Language is required")]
        public string Language { get; set; }

        [Required(ErrorMessage = "Format is required")]
        public string Format { get; set; }

        public string Description { get; set; }

        public bool AvailableInLibrary { get; set; }

        public bool IsBestseller { get; set; }

        public bool IsNewRelease { get; set; }

        public bool IsNewArrival { get; set; }

        public bool IsAwardWinner { get; set; }

        public bool IsComingSoon { get; set; }

        public IFormFile CoverImagePath { get; set; }


    }

    public class BookResponseDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string ISBN { get; set; }
        public string Author { get; set; }
        public string Publisher { get; set; }
        public DateTime PublicationDate { get; set; }
        public decimal Price { get; set; }
        public decimal? DiscountedPrice { get; set; }
        public int StockQuantity { get; set; }
        public string Genre { get; set; }
        public string Language { get; set; }
        public string Format { get; set; }
        public string Description { get; set; }
        public bool AvailableInLibrary { get; set; }
        public bool IsBestseller { get; set; }
        public bool IsAwardWinner { get; set; }
        public bool IsNewRelease { get; set; }
        public bool IsNewArrival { get; set; }
        public bool IsComingSoon { get; set; }
        public bool IsOnSale { get; set; }
        public decimal? DiscountPercentage { get; set; }
        public DateTime? DiscountStartDate { get; set; }
        public DateTime? DiscountEndDate { get; set; }
        public int SoldCount { get; set; }
        public string CoverImagePath { get; set; }
        public decimal AverageRating { get; set; }
        public int ReviewCount { get; set; }
        public bool IsBookmarked { get; set; }


    }

    public class BookFilterDTO
    {
        public string? SearchTerm { get; set; }
        public string? Author { get; set; }
        public string? Genre { get; set; }
        public bool? InStock { get; set; }
        public bool? AvailableInLibrary { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public decimal? MinRating { get; set; }
        public string? Language { get; set; }
        public string? Format { get; set; }
        public string? Publisher { get; set; }
        public bool? Bestseller { get; set; }
        public bool? AwardWinner { get; set; }
        public bool? NewRelease { get; set; }
        public bool? NewArrival { get; set; }
        public bool? ComingSoon { get; set; }
        public bool? OnSale { get; set; }
        public string SortBy { get; set; } = "Title"; // Title, PublicationDate, Price, Popularity
        public bool SortAscending { get; set; } = true;
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class BookDiscountDTO
    {
        [Required]
        public int BookId { get; set; }

        [Required]
        [Range(1, 100, ErrorMessage = "Discount percentage must be between 1 and 100")]
        public decimal DiscountPercentage { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }
    }

    public class PaginatedResponseDTO<T>
    {
        public List<T> Items { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public int TotalCount { get; set; }
        public bool HasPreviousPage => PageNumber > 1;
        public bool HasNextPage => PageNumber < TotalPages;
    }
}