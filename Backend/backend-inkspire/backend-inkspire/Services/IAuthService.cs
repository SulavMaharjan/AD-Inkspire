using backend_inkspire.DTOs;

namespace backend_inkspire.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDTO> RegisterUserAsync(RegisterDTO registerDto);
        Task<AuthResponseDTO> LoginAsync(LoginDTO loginDto);
    }
}
