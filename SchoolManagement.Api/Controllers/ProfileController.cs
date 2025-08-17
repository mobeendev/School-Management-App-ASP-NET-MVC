using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Models.DTOs;
using SchoolManagement.Services.Interfaces;
using System.Security.Claims;

namespace SchoolManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [Produces("application/json")]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;
        private readonly ILogger<ProfileController> _logger;

        public ProfileController(IProfileService profileService, ILogger<ProfileController> logger)
        {
            _profileService = profileService;
            _logger = logger;
        }

        /// <summary>
        /// Get current user's profile information
        /// </summary>
        /// <returns>User profile data</returns>
        [HttpGet]
        [ProducesResponseType(typeof(ProfileDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                // Debug: Log all claims
                _logger.LogInformation("Available claims:");
                foreach (var claim in User.Claims)
                {
                    _logger.LogInformation($"Claim: {claim.Type} = {claim.Value}");
                }

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    // Try alternative claim names
                    userId = User.FindFirst("nameid")?.Value;
                    if (string.IsNullOrEmpty(userId))
                    {
                        userId = User.FindFirst("sub")?.Value;
                    }
                }

                _logger.LogInformation($"Extracted userId: {userId}");

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not found");
                }

                var profile = await _profileService.GetProfileAsync(userId);
                if (profile == null)
                {
                    return NotFound("Profile not found");
                }

                return Ok(profile);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user profile");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Update current user's profile information
        /// </summary>
        /// <param name="updateProfileDto">Updated profile data</param>
        /// <returns>Success status</returns>
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto updateProfileDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    // Try alternative claim names
                    userId = User.FindFirst("nameid")?.Value;
                    if (string.IsNullOrEmpty(userId))
                    {
                        userId = User.FindFirst("sub")?.Value;
                    }
                }

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not found");
                }

                var result = await _profileService.UpdateProfileAsync(userId, updateProfileDto);
                if (!result)
                {
                    return NotFound("Profile not found or update failed");
                }

                return Ok(new { message = "Profile updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user profile");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}