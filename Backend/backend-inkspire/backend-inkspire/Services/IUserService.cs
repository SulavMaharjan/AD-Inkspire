using backend_inkspire.DTOs;
using backend_inkspire.Entities;

namespace backend_inkspire.Services
{
    public interface IUserService
    {
        bool AddUser(UserDTO userDTO);
        Task<User> GetUserByEmailOrUsernameAsync(string emailOrUsername);
    }
}
