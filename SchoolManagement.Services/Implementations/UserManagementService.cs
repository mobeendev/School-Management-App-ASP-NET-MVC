using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SchoolManagement.Models.DTOs;
using SchoolManagement.Models.Entities;
using SchoolManagement.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SchoolManagement.Services.Implementations
{
    public class UserManagementService : IUserManagementService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public UserManagementService(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task<IEnumerable<UserManagementDto>> GetAllUsersAsync(string? role = null)
        {
            var users = await _userManager.Users.ToListAsync();
            var userDtos = new List<UserManagementDto>();

            foreach (var user in users)
            {
                var userRoles = await _userManager.GetRolesAsync(user);
                
                // Filter by role if specified
                if (!string.IsNullOrEmpty(role) && !userRoles.Contains(role))
                    continue;

                userDtos.Add(new UserManagementDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email ?? string.Empty,
                    PhoneNumber = user.PhoneNumber ?? string.Empty,
                    DateOfBirth = user.DateOfBirth,
                    Gender = user.Gender,
                    Address = user.Address,
                    IsActive = !user.LockoutEnd.HasValue || user.LockoutEnd <= DateTimeOffset.UtcNow,
                    CreatedAt = DateTime.UtcNow, // Using current time as placeholder
                    Roles = userRoles.ToList()
                });
            }

            return userDtos.OrderBy(u => u.LastName).ThenBy(u => u.FirstName);
        }

        public async Task<UserDetailsDto?> GetUserByIdAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return null;

            var userRoles = await _userManager.GetRolesAsync(user);

            return new UserDetailsDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email ?? string.Empty,
                PhoneNumber = user.PhoneNumber ?? string.Empty,
                DateOfBirth = user.DateOfBirth,
                Gender = user.Gender,
                Address = user.Address,
                IsActive = !user.LockoutEnd.HasValue || user.LockoutEnd <= DateTimeOffset.UtcNow,
                CreatedAt = DateTime.UtcNow, // Using current time as placeholder
                LastLoginAt = null, // TODO: Implement login tracking later
                Roles = userRoles.ToList(),
                HasLecturerProfile = false, // TODO: Check if lecturer profile exists
                HasStudentProfile = false   // TODO: Check if student profile exists
            };
        }

        public async Task<UserManagementDto> CreateUserAsync(CreateUserDto createUserDto)
        {
            // Validate role exists
            var roleExists = await _roleManager.RoleExistsAsync(createUserDto.Role);
            if (!roleExists)
            {
                throw new ArgumentException($"Role '{createUserDto.Role}' does not exist");
            }

            var user = new ApplicationUser
            {
                UserName = createUserDto.Email,
                Email = createUserDto.Email,
                FirstName = createUserDto.FirstName,
                LastName = createUserDto.LastName,
                PhoneNumber = createUserDto.PhoneNumber,
                DateOfBirth = createUserDto.DateOfBirth,
                Gender = createUserDto.Gender,
                Address = createUserDto.Address,
                EmailConfirmed = true // Auto-confirm emails for admin-created users
            };

            var result = await _userManager.CreateAsync(user, createUserDto.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"Failed to create user: {errors}");
            }

            // Assign role
            await _userManager.AddToRoleAsync(user, createUserDto.Role);

            return new UserManagementDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email ?? string.Empty,
                PhoneNumber = user.PhoneNumber ?? string.Empty,
                DateOfBirth = user.DateOfBirth,
                Gender = user.Gender,
                Address = user.Address,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                Roles = new List<string> { createUserDto.Role }
            };
        }

        public async Task<UserManagementDto> UpdateUserAsync(UpdateUserDto updateUserDto)
        {
            var user = await _userManager.FindByIdAsync(updateUserDto.Id);
            if (user == null)
            {
                throw new ArgumentException("User not found");
            }

            // Update user properties
            user.FirstName = updateUserDto.FirstName;
            user.LastName = updateUserDto.LastName;
            user.Email = updateUserDto.Email;
            user.UserName = updateUserDto.Email;
            user.PhoneNumber = updateUserDto.PhoneNumber;
            user.DateOfBirth = updateUserDto.DateOfBirth;
            user.Gender = updateUserDto.Gender;
            user.Address = updateUserDto.Address;

            // Update active status
            if (!updateUserDto.IsActive)
            {
                await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.MaxValue);
            }
            else
            {
                await _userManager.SetLockoutEndDateAsync(user, null);
            }

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                var errors = string.Join(", ", updateResult.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"Failed to update user: {errors}");
            }

            // Update role if changed
            var currentRoles = await _userManager.GetRolesAsync(user);
            if (!currentRoles.Contains(updateUserDto.Role))
            {
                await _userManager.RemoveFromRolesAsync(user, currentRoles);
                await _userManager.AddToRoleAsync(user, updateUserDto.Role);
            }

            var newRoles = await _userManager.GetRolesAsync(user);

            return new UserManagementDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email ?? string.Empty,
                PhoneNumber = user.PhoneNumber ?? string.Empty,
                DateOfBirth = user.DateOfBirth,
                Gender = user.Gender,
                Address = user.Address,
                IsActive = updateUserDto.IsActive,
                CreatedAt = DateTime.UtcNow,
                Roles = newRoles.ToList()
            };
        }

        public async Task<bool> SetUserActiveStatusAsync(string userId, bool isActive)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            if (!isActive)
            {
                await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.MaxValue);
            }
            else
            {
                await _userManager.SetLockoutEndDateAsync(user, null);
            }

            return true;
        }

        public async Task<bool> DeleteUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded;
        }

        public async Task<IEnumerable<UserByRoleDto>> GetUsersByRoleAsync(string role)
        {
            var usersInRole = await _userManager.GetUsersInRoleAsync(role);
            
            return usersInRole.Select(user => new UserByRoleDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email ?? string.Empty,
                HasProfile = false // TODO: Check if they have corresponding profile
            }).OrderBy(u => u.FirstName).ThenBy(u => u.LastName);
        }

        public async Task<bool> UpdateUserRoleAsync(string userId, string newRole)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            var roleExists = await _roleManager.RoleExistsAsync(newRole);
            if (!roleExists) return false;

            var currentRoles = await _userManager.GetRolesAsync(user);
            
            // Remove from all current roles
            if (currentRoles.Any())
            {
                await _userManager.RemoveFromRolesAsync(user, currentRoles);
            }

            // Add to new role
            var result = await _userManager.AddToRoleAsync(user, newRole);
            return result.Succeeded;
        }

        public async Task<bool> UserExistsAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            return user != null;
        }

        public async Task<bool> ResetUserPasswordAsync(string userId, string newPassword)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            // Generate password reset token
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            
            // Reset password
            var result = await _userManager.ResetPasswordAsync(user, token, newPassword);
            return result.Succeeded;
        }
    }
}