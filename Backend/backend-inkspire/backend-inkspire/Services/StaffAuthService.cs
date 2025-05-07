using backend_inkspire.DTOs;
using backend_inkspire.Entities;
using backend_inkspire.Repositories;
using Microsoft.AspNetCore.Identity;

namespace backend_inkspire.Services
{
    public class StaffAuthService : IStaffAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtService _jwtService;
        private readonly RoleManager<Roles> _roleManager;
        private readonly UserManager<User> _userManager;

        public StaffAuthService(
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

        public async Task<AuthResponseDTO> RegisterStaffAsync(StaffRegisterDTO registerDto, string createdByEmail)
        {
            var response = new AuthResponseDTO();

            //checking if the creator is an admin
            var creator = await _userRepository.GetUserByEmailOrUsernameAsync(createdByEmail);
            if (creator == null)
            {
                response.IsSuccess = false;
                response.Message = "Creator not found";
                return response;
            }

            var creatorRoles = await _userRepository.GetUserRolesAsync(creator);
            if (!creatorRoles.Contains("SuperAdmin"))
            {
                response.IsSuccess = false;
                response.Message = "Only SuperAdmin can create staff accounts";
                return response;
            }

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

            //create new staff
            var user = new User
            {
                UserName = registerDto.UserName,
                Email = registerDto.Email,
                Name = registerDto.Name,
                EmailConfirmed = true
            };

            var result = await _userRepository.RegisterUserAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                response.IsSuccess = false;
                response.Message = string.Join(", ", result.Errors.Select(e => e.Description));
                return response;
            }

            if (!await _roleManager.RoleExistsAsync("Staff"))
            {
                await _roleManager.CreateAsync(new Roles { Name = "Staff" });
            }

            await _userManager.AddToRoleAsync(user, "Staff");

            var roles = await _userRepository.GetUserRolesAsync(user);

            //generate token
            var token = _jwtService.GenerateJwtToken(user, roles);

            response.IsSuccess = true;
            response.Message = "Staff registration successful";
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

        public async Task<AuthResponseDTO> StaffLoginAsync(LoginDTO loginDto)
        {
            var user = await _userRepository.GetUserByEmailOrUsernameAsync(loginDto.EmailOrUsername);
            if (user == null)
            {
                return new AuthResponseDTO
                {
                    IsSuccess = false,
                    Message = "Invalid email/username or password"
                };
            }

            var isValid = await _userRepository.ValidateUserAsync(loginDto.EmailOrUsername, loginDto.Password);
            if (!isValid)
            {
                return new AuthResponseDTO
                {
                    IsSuccess = false,
                    Message = "Invalid email/username or password"
                };
            }

            var roles = await _userRepository.GetUserRolesAsync(user);
            if (!roles.Contains("Staff") && !roles.Contains("SuperAdmin"))
            {
                return new AuthResponseDTO
                {
                    IsSuccess = false,
                    Message = "You don't have permission to access the staff portal"
                };
            }

            //generate token
            var token = _jwtService.GenerateJwtToken(user, roles);

            return new AuthResponseDTO
            {
                IsSuccess = true,
                Message = "Staff login successful",
                Token = token,
                Role = roles.FirstOrDefault(),
                User = new UserDTO
                {
                    Id = (int)user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    UserName = user.UserName
                }
            };
        }
    }
}