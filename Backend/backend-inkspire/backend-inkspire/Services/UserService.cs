using backend_inkspire.DTOs;
using backend_inkspire.Entities;
using backend_inkspire.Repositories;

namespace backend_inkspire.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public bool AddUser(UserDTO userDTO)
        {
            var newUser = new User
            {
                Name = userDTO.Name,
                Email = userDTO.Email,
                UserName = userDTO.UserName,
            };

            _userRepository.InsertUser(newUser);
            return true;
        }

        public async Task<User> GetUserByEmailOrUsernameAsync(string emailOrUsername)
        {
            return await _userRepository.GetUserByEmailOrUsernameAsync(emailOrUsername);
        }
    }
}
