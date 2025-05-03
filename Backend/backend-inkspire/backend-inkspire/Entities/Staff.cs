using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend_inkspire.Entities
{
    public class Staff
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public long UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }

        [Required]
        public string StaffId { get; set; }

        public string Department { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
