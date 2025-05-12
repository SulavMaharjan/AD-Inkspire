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


        public async Task<GetStaffsResponseDTO> GetAllStaffsAsync(string requesterEmail)
        {
            var response = new GetStaffsResponseDTO
            {
                IsSuccess = false,
                Staffs = new List<StaffDTO>()
            };

            // Check if the requester is authorized (Admin or Staff)
            var requester = await _userRepository.GetUserByEmailOrUsernameAsync(requesterEmail);
            if (requester == null)
            {
                response.Message = "Requester not found";
                return response;
            }

            var requesterRoles = await _userRepository.GetUserRolesAsync(requester);
            if (!requesterRoles.Contains("SuperAdmin") && !requesterRoles.Contains("Staff"))
            {
                response.Message = "Not authorized to view staff members";
                return response;
            }

            // Get only staff users (excluding SuperAdmins)
            var staffUsers = await _userRepository.GetUsersByRoleAsync("Staff");

            // Convert to DTOs
            response.Staffs = staffUsers.Select(u => new StaffDTO
            {
                Id = (int)u.Id,
                Name = u.Name,
                Email = u.Email,
                UserName = u.UserName
            }).ToList();

            response.IsSuccess = true;
            response.Message = "Staff members retrieved successfully";
            return response;
        }


        public async Task<DeleteStaffResponseDTO> DeleteStaffAsync(int staffId, string deleterEmail)
        {
            var response = new DeleteStaffResponseDTO();

            // Check if the deleter is a SuperAdmin
            var deleter = await _userRepository.GetUserByEmailOrUsernameAsync(deleterEmail);
            if (deleter == null)
            {
                response.IsSuccess = false;
                response.Message = "Deleter not found";
                return response;
            }

            var deleterRoles = await _userRepository.GetUserRolesAsync(deleter);
            if (!deleterRoles.Contains("SuperAdmin"))
            {
                response.IsSuccess = false;
                response.Message = "Only SuperAdmin can delete staff accounts";
                return response;
            }

            // Find the staff user to delete
            var userToDelete = await _userManager.FindByIdAsync(staffId.ToString());
            if (userToDelete == null)
            {
                response.IsSuccess = false;
                response.Message = "Staff account not found";
                return response;
            }

            // Check if the user is a staff or SuperAdmin
            var userRoles = await _userRepository.GetUserRolesAsync(userToDelete);
            if (!userRoles.Contains("Staff") && !userRoles.Contains("SuperAdmin"))
            {
                response.IsSuccess = false;
                response.Message = "Cannot delete non-staff account";
                return response;
            }

            // Prevent deleting a SuperAdmin
            if (userRoles.Contains("SuperAdmin"))
            {
                response.IsSuccess = false;
                response.Message = "Cannot delete a SuperAdmin account";
                return response;
            }

            // Delete the user
            var deleteResult = await _userRepository.DeleteUserAsync(userToDelete);

            if (!deleteResult.Succeeded)
            {
                response.IsSuccess = false;
                response.Message = string.Join(", ", deleteResult.Errors.Select(e => e.Description));
                return response;
            }

            response.IsSuccess = true;
            response.Message = "Staff account deleted successfully";
            return response;
        }
    }
}