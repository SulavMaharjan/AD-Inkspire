using backend_inkspire.DTOs;
using backend_inkspire.Entities;
using backend_inkspire.Repositories;
using Microsoft.AspNetCore.Identity;

namespace backend_inkspire.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtService _jwtService;
        private readonly RoleManager<Roles> _roleManager;
        private readonly UserManager<User> _userManager;

        public AuthService(
            IUserRepository userRepository,
            IJwtService jwtService,
            RoleManager<Roles> roleManager,
            UserManager<User> userManager)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
            _roleManager = roleManager;
            _userManager = userManager;
        }

        public async Task<AuthResponseDTO> RegisterUserAsync(RegisterDTO registerDto)
        {
            var response = new AuthResponseDTO();

            //checking if email or username already exists
            var existingUser = await _userRepository.GetUserByEmailOrUsernameAsync(registerDto.Email);
            if (existingUser != null)
            {
                response.IsSuccess = false;
                response.Message = "Email already exists";
                return response;
            }

            existingUser = await _userRepository.GetUserByEmailOrUsernameAsync(registerDto.UserName);
            if (existingUser != null)
            {
                response.IsSuccess = false;
                response.Message = "Username already exists";
                return response;
            }

            //create new user
            var user = new User
            {
                UserName = registerDto.UserName,
                Email = registerDto.Email,
                Name = registerDto.Name
            };

            var result = await _userRepository.RegisterUserAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                response.IsSuccess = false;
                response.Message = string.Join(", ", result.Errors.Select(e => e.Description));
                return response;
            }

            //"Member" role to user
            if (!await _roleManager.RoleExistsAsync("Member"))
            {
                await _roleManager.CreateAsync(new Roles { Name = "Member" });
            }

            await _userManager.AddToRoleAsync(user, "Member");

            var roles = await _userRepository.GetUserRolesAsync(user);

            //generate token
            var token = _jwtService.GenerateJwtToken(user, roles);

            response.IsSuccess = true;
            response.Message = "Registration successful";
            response.Token = token;
            response.Role = roles.FirstOrDefault();
            response.User = new UserDTO
            {
                Id = (int)user.Id,
                Name = user.Name,
                Email = user.Email,
                UserName = user.UserName
            };

            return response;
        }

        public async Task<AuthResponseDTO> LoginAsync(LoginDTO loginDto)
        {
            var response = new AuthResponseDTO();

            var isValid = await _userRepository.ValidateUserAsync(loginDto.EmailOrUsername, loginDto.Password);

            if (!isValid)
            {
                response.IsSuccess = false;
                response.Message = "Invalid email/username or password";
                return response;
            }

            var user = await _userRepository.GetUserByEmailOrUsernameAsync(loginDto.EmailOrUsername);
            var roles = await _userRepository.GetUserRolesAsync(user);
            var token = _jwtService.GenerateJwtToken(user, roles);

            response.IsSuccess = true;
            response.Message = "Login successful";
            response.Token = token;
            response.Role = roles.FirstOrDefault();
            response.User = new UserDTO
            {
                Id = (int)user.Id,
                Name = user.Name,
                Email = user.Email,
                UserName = user.UserName
            };

            return response;
        }
    }
}
