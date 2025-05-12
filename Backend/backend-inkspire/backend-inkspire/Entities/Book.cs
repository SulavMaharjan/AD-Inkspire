using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_inkspire.Entities
{
    public class Book
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Title { get; set; }

        [Required]
        [MaxLength(17)]
        public string ISBN { get; set; }

        [Required]
        [MaxLength(255)]
        public string Author { get; set; }

        [Required]
        [MaxLength(100)]
        public string Publisher { get; set; }

        [Required]
        public DateTime PublicationDate { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Required]
        public int StockQuantity { get; set; }

        [Required]
        [MaxLength(50)]
        public string Genre { get; set; }

        [Required]
        [MaxLength(50)]
        public string Language { get; set; }

        [Required]
        [MaxLength(50)]
        public string Format { get; set; }
        public string Description { get; set; }

        public bool AvailableInLibrary { get; set; }

        public bool IsBestseller { get; set; }

        public bool IsAwardWinner { get; set; }

        //published in the past three months
        public bool IsNewRelease => PublicationDate >= DateTime.Now.AddMonths(-3);

        //listed in the past month
        public DateTime ListedDate { get; set; }
        public bool IsNewArrival => ListedDate >= DateTime.Now.AddMonths(-1);

        public bool IsComingSoon { get; set; }

        public bool IsOnSale { get; set; }
        public decimal? DiscountPercentage { get; set; }
        public DateTime? DiscountStartDate { get; set; }
        public DateTime? DiscountEndDate { get; set; }
        //public bool IsCurrentlyDiscounted =>
        //    IsOnSale &&
        //    DiscountPercentage.HasValue &&
        //    DiscountStartDate.HasValue &&
        //    DiscountEndDate.HasValue &&
        //    DateTime.Now >= DiscountStartDate &&
        //    DateTime.Now <= DiscountEndDate;

        public bool IsCurrentlyDiscounted
        {
            get
            {
                if (!IsOnSale || !DiscountPercentage.HasValue ||
                    !DiscountStartDate.HasValue || !DiscountEndDate.HasValue)
                    return false;

                var now = DateTime.UtcNow;
                return now >= DiscountStartDate.Value && now <= DiscountEndDate.Value;
            }
        }

        [NotMapped]
        public decimal CurrentPrice => IsCurrentlyDiscounted ?
            Price - (Price * DiscountPercentage.Value / 100) :
            Price;

        public int SoldCount { get; set; }

        public string CoverImagePath { get; set; }

        public virtual ICollection<Review> Reviews { get; set; }

        //average rating calculation
        [NotMapped]
        public decimal AverageRating =>
            Reviews != null && Reviews.Any() ?
            (decimal)Reviews.Average(r => r.Rating) :
            0;

        public Book()
        {
            Reviews = new List<Review>();
            ListedDate = DateTime.Now;
        }
    }
}