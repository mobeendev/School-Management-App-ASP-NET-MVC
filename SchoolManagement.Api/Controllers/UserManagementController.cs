using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Models.DTOs;
using SchoolManagement.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolManagement.Api.Controllers
{
    /// <summary>
    /// User Management API Controller for managing application users and roles
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] // Only admins can manage users
    [Produces("application/json")]
    public class UserManagementController : ControllerBase
    {
        private readonly IUserManagementService _userManagementService;

        public UserManagementController(IUserManagementService userManagementService)
        {
            _userManagementService = userManagementService;
        }

        /// <summary>
        /// Get all users with optional role filtering
        /// </summary>
        /// <param name="role">Optional role filter (Admin, Lecturer, Student, Staff)</param>
        /// <returns>List of users</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<UserManagementDto>), 200)]
        public async Task<IActionResult> GetAllUsers([FromQuery] string? role = null)
        {
            try
            {
                var users = await _userManagementService.GetAllUsersAsync(role);
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving users", error = ex.Message });
            }
        }

        /// <summary>
        /// Get user by ID with detailed information
        /// </summary>
        /// <param name="id">User ID</param>
        /// <returns>User details</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(UserDetailsDto), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetUserById(string id)
        {
            try
            {
                var user = await _userManagementService.GetUserByIdAsync(id);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving user", error = ex.Message });
            }
        }

        /// <summary>
        /// Create a new user with specified role
        /// </summary>
        /// <param name="createUserDto">User creation data</param>
        /// <returns>Created user information</returns>
        [HttpPost]
        [ProducesResponseType(typeof(UserManagementDto), 201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto createUserDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Check if user already exists
                var userExists = await _userManagementService.UserExistsAsync(createUserDto.Email);
                if (userExists)
                {
                    return BadRequest(new { message = "User with this email already exists" });
                }

                var createdUser = await _userManagementService.CreateUserAsync(createUserDto);
                return CreatedAtAction(nameof(GetUserById), new { id = createdUser.Id }, createdUser);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating user", error = ex.Message });
            }
        }

        /// <summary>
        /// Update existing user information
        /// </summary>
        /// <param name="id">User ID</param>
        /// <param name="updateUserDto">User update data</param>
        /// <returns>Updated user information</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(UserManagementDto), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto updateUserDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != updateUserDto.Id)
            {
                return BadRequest(new { message = "User ID mismatch" });
            }

            try
            {
                var updatedUser = await _userManagementService.UpdateUserAsync(updateUserDto);
                return Ok(updatedUser);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating user", error = ex.Message });
            }
        }

        /// <summary>
        /// Deactivate/activate user account
        /// </summary>
        /// <param name="id">User ID</param>
        /// <param name="isActive">Active status</param>
        /// <returns>Success status</returns>
        [HttpPatch("{id}/status")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> SetUserActiveStatus(string id, [FromBody] bool isActive)
        {
            try
            {
                var success = await _userManagementService.SetUserActiveStatusAsync(id, isActive);
                if (!success)
                {
                    return NotFound(new { message = "User not found" });
                }
                return Ok(new { message = $"User {(isActive ? "activated" : "deactivated")} successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating user status", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete user permanently (use with caution)
        /// </summary>
        /// <param name="id">User ID</param>
        /// <returns>Success status</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteUser(string id)
        {
            try
            {
                var success = await _userManagementService.DeleteUserAsync(id);
                if (!success)
                {
                    return NotFound(new { message = "User not found" });
                }
                return Ok(new { message = "User deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting user", error = ex.Message });
            }
        }

        /// <summary>
        /// Get users by specific role for dropdown selection
        /// </summary>
        /// <param name="role">Role name (Lecturer, Student, etc.)</param>
        /// <returns>List of users with that role</returns>
        [HttpGet("by-role/{role}")]
        [ProducesResponseType(typeof(IEnumerable<UserByRoleDto>), 200)]
        public async Task<IActionResult> GetUsersByRole(string role)
        {
            try
            {
                var users = await _userManagementService.GetUsersByRoleAsync(role);
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving users by role", error = ex.Message });
            }
        }

        /// <summary>
        /// Update user role assignment
        /// </summary>
        /// <param name="id">User ID</param>
        /// <param name="newRole">New role to assign</param>
        /// <returns>Success status</returns>
        [HttpPatch("{id}/role")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateUserRole(string id, [FromBody] string newRole)
        {
            try
            {
                var success = await _userManagementService.UpdateUserRoleAsync(id, newRole);
                if (!success)
                {
                    return NotFound(new { message = "User not found or role does not exist" });
                }
                return Ok(new { message = "User role updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating user role", error = ex.Message });
            }
        }

        /// <summary>
        /// Reset user password (admin function)
        /// </summary>
        /// <param name="id">User ID</param>
        /// <param name="newPassword">New password</param>
        /// <returns>Success status</returns>
        [HttpPost("{id}/reset-password")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> ResetUserPassword(string id, [FromBody] string newPassword)
        {
            if (string.IsNullOrWhiteSpace(newPassword) || newPassword.Length < 6)
            {
                return BadRequest(new { message = "Password must be at least 6 characters long" });
            }

            try
            {
                var success = await _userManagementService.ResetUserPasswordAsync(id, newPassword);
                if (!success)
                {
                    return NotFound(new { message = "User not found or password reset failed" });
                }
                return Ok(new { message = "Password reset successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while resetting password", error = ex.Message });
            }
        }

        /// <summary>
        /// Check if user exists by email
        /// </summary>
        /// <param name="email">Email address</param>
        /// <returns>User existence status</returns>
        [HttpGet("check-email/{email}")]
        [ProducesResponseType(typeof(bool), 200)]
        public async Task<IActionResult> CheckUserExists(string email)
        {
            try
            {
                var exists = await _userManagementService.UserExistsAsync(email);
                return Ok(new { exists });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while checking user existence", error = ex.Message });
            }
        }
    }
}