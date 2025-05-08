using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_inkspire.Entities
{
    public class Bookmark
    {
        [Key]
        public int Id { get; set; }

        public long UserId { get; set; }

        public int BookId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }

        [ForeignKey("BookId")]
        public Book Book { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}