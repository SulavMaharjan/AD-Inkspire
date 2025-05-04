using System.ComponentModel.DataAnnotations;

namespace backend_inkspire.Entities
{
    public class Announcement
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Title { get; set; }

        [Required]
        public string Content { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public bool IsActive => DateTime.Now >= StartDate && DateTime.Now <= EndDate;

        [Required]
        public string AnnouncementType { get; set; } 

        public DateTime CreatedDate { get; set; }

        public Announcement()
        {
            CreatedDate = DateTime.Now;
        }
    }
}