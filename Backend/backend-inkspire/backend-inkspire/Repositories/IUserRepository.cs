using backend_inkspire.Entities;
using Microsoft.AspNetCore.Identity;

namespace backend_inkspire.Repositories
{
    public interface IUserRepository
    {
        void InsertUser(User newUser);
        Task<IdentityResult> RegisterUserAsync(User user, string password);
        Task<bool> ValidateUserAsync(string emailOrUsername, string password);
        Task<User> GetUserByEmailOrUsernameAsync(string emailOrUsername);
        Task<IList<string>> GetUserRolesAsync(User user);
    }
}
