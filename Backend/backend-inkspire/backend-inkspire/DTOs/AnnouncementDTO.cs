using System.ComponentModel.DataAnnotations;

namespace backend_inkspire.DTOs
{
    public class AnnouncementDTO
    {
        [Required(ErrorMessage = "Title is required")]
        [MaxLength(255)]
        public string Title { get; set; }

        [Required(ErrorMessage = "Content is required")]
        public string Content { get; set; }

        [Required(ErrorMessage = "Start date is required")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "End date is required")]
        public DateTime EndDate { get; set; }

        [Required(ErrorMessage = "Announcement type is required")]
        public string AnnouncementType { get; set; } 
    }

    public class AnnouncementResponseDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsActive { get; set; }
        public string AnnouncementType { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}