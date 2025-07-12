using SchoolManagement.Models.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolManagement.Services.Interfaces
{
    public interface IUserManagementService
    {
        /// <summary>
        /// Get all users with optional role filtering
        /// </summary>
        /// <param name="role">Optional role filter (Admin, Lecturer, Student, Staff)</param>
        /// <returns>List of users</returns>
        Task<IEnumerable<UserManagementDto>> GetAllUsersAsync(string? role = null);

        /// <summary>
        /// Get user by ID with detailed information
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <returns>User details</returns>
        Task<UserDetailsDto?> GetUserByIdAsync(string userId);

        /// <summary>
        /// Create a new user with specified role
        /// </summary>
        /// <param name="createUserDto">User creation data</param>
        /// <returns>Created user information</returns>
        Task<UserManagementDto> CreateUserAsync(CreateUserDto createUserDto);

        /// <summary>
        /// Update existing user information
        /// </summary>
        /// <param name="updateUserDto">User update data</param>
        /// <returns>Updated user information</returns>
        Task<UserManagementDto> UpdateUserAsync(UpdateUserDto updateUserDto);

        /// <summary>
        /// Deactivate/activate user account
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <param name="isActive">Active status</param>
        /// <returns>Success status</returns>
        Task<bool> SetUserActiveStatusAsync(string userId, bool isActive);

        /// <summary>
        /// Delete user permanently (use with caution)
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <returns>Success status</returns>
        Task<bool> DeleteUserAsync(string userId);

        /// <summary>
        /// Get users by specific role for dropdown selection
        /// </summary>
        /// <param name="role">Role name (Lecturer, Student)</param>
        /// <returns>List of users with that role</returns>
        Task<IEnumerable<UserByRoleDto>> GetUsersByRoleAsync(string role);

        /// <summary>
        /// Update user role assignment
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <param name="newRole">New role to assign</param>
        /// <returns>Success status</returns>
        Task<bool> UpdateUserRoleAsync(string userId, string newRole);

        /// <summary>
        /// Check if user exists by email
        /// </summary>
        /// <param name="email">Email address</param>
        /// <returns>True if user exists</returns>
        Task<bool> UserExistsAsync(string email);

        /// <summary>
        /// Reset user password (admin function)
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <param name="newPassword">New password</param>
        /// <returns>Success status</returns>
        Task<bool> ResetUserPasswordAsync(string userId, string newPassword);
    }
}