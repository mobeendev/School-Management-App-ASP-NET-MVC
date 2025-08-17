using SchoolManagement.Models.DTOs;

namespace SchoolManagement.Services.Interfaces
{
    public interface IProfileService
    {
        Task<ProfileDto?> GetProfileAsync(string userId);
        Task<bool> UpdateProfileAsync(string userId, UpdateProfileDto updateProfileDto);
    }
}