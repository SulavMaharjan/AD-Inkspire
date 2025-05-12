using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace backend_inkspire.DTOs
{
    // Data Transfer Object for User/Staff information
    public class StaffDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
    }

    // Base DTO for all response types
    public class BaseResponseDTO
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }

    public class StaffRegisterDTO
    {
        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Username is required")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Confirm password is required")]
        [Compare("Password", ErrorMessage = "Passwords do not match")]
        public string ConfirmPassword { get; set; }
    }

    public class StaffUpdateDTO
    {
        public string? Name { get; set; }

        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string? Email { get; set; }

        public string? UserName { get; set; }

        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public string? NewPassword { get; set; }
    }


    public class DeleteStaffResponseDTO : BaseResponseDTO
    {
        // Inherits IsSuccess and Message from BaseResponseDTO
    }

    public class GetStaffsResponseDTO : BaseResponseDTO
    {
        public List<StaffDTO> Staffs { get; set; } = new List<StaffDTO>();
    }


}