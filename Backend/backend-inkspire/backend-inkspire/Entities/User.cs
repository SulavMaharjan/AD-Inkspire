using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace backend_inkspire.Entities
{
    public class User : IdentityUser<long>
    {
        //[Key]
        //public int Id { get; set; }
        [Required]
        public string Name { get; set; }

        //public required string Email { get; set; }

        //public string UserName { get; set; }
    }
}
