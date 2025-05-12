using backend_inkspire.DTOs;

namespace backend_inkspire.Services
{
    public interface IStaffAuthService
    {
        Task<AuthResponseDTO> RegisterStaffAsync(StaffRegisterDTO registerDto, string createdByEmail);
        Task<AuthResponseDTO> StaffLoginAsync(LoginDTO loginDto);
        Task<DeleteStaffResponseDTO> DeleteStaffAsync(int staffId, string deleterEmail);
        Task<GetStaffsResponseDTO> GetAllStaffsAsync(string requesterEmail);
    }
}