using SchoolManagement.Models.DTOs;
using SchoolManagement.Models.Entities;

namespace SchoolManagement.Services.Interfaces
{
    public interface ILecturerService
    {
        Task<IEnumerable<LecturerDto>> GetAllLecturersAsync();
        Task<LecturerDto?> GetLecturerByIdAsync(int id);
        Task<LecturerDto> CreateLecturerAsync(CreateLecturerDto createLecturerDto);
        Task<LecturerDto> UpdateLecturerAsync(LecturerDto lecturerDto);
        Task<bool> DeleteLecturerAsync(int id);
        Task<bool> LecturerExistsAsync(int id);
    }
}