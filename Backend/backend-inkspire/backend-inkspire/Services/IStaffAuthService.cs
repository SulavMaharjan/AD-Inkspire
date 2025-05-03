using backend_inkspire.DTOs;

namespace backend_inkspire.Services
{
    public interface IStaffAuthService
    {
        Task<AuthResponseDTO> RegisterStaffAsync(StaffRegisterDTO registerDto, string createdByEmail);
        Task<AuthResponseDTO> StaffLoginAsync(LoginDTO loginDto);
    }
}