using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using SchoolManagement.Models.DTOs;
using SchoolManagement.Models.Entities;
using SchoolManagement.Services.Interfaces;

namespace SchoolManagement.Services.Implementations
{
    public class ProfileService : IProfileService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<ProfileService> _logger;

        public ProfileService(UserManager<ApplicationUser> userManager, ILogger<ProfileService> logger)
        {
            _userManager = userManager;
            _logger = logger;
        }

        public async Task<ProfileDto?> GetProfileAsync(string userId)
        {
            _logger.LogInformation($"ProfileService.GetProfileAsync called with userId: {userId}");
            
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                _logger.LogWarning($"User not found with ID: {userId}");
                
                // Try to find by email as fallback
                var userByEmail = await _userManager.FindByEmailAsync(userId);
                if (userByEmail != null)
                {
                    _logger.LogInformation($"Found user by email instead: {userByEmail.Id}");
                    user = userByEmail;
                }
                else
                {
                    _logger.LogError($"User not found by ID or email: {userId}");
                    return null;
                }
            }
            else
            {
                _logger.LogInformation($"User found: {user.Email} (ID: {user.Id})");
            }

            var roles = await _userManager.GetRolesAsync(user);

            return new ProfileDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email ?? string.Empty,
                PhoneNumber = user.PhoneNumber ?? string.Empty,
                Gender = user.Gender,
                Address = user.Address,
                DateOfBirth = user.DateOfBirth,
                UserName = user.UserName ?? string.Empty,
                Roles = roles,
                CreatedDate = user.LockoutEnd?.DateTime ?? DateTime.Now
            };
        }

        public async Task<bool> UpdateProfileAsync(string userId, UpdateProfileDto updateProfileDto)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return false;
            }

            user.FirstName = updateProfileDto.FirstName;
            user.LastName = updateProfileDto.LastName;
            user.Email = updateProfileDto.Email;
            user.PhoneNumber = updateProfileDto.PhoneNumber;
            user.Gender = updateProfileDto.Gender;
            user.Address = updateProfileDto.Address;
            user.DateOfBirth = updateProfileDto.DateOfBirth;

            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded;
        }
    }
}