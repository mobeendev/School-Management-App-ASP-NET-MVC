using SchoolManagement.Models.DTOs;

namespace SchoolManagement.Services.Interfaces
{
    public interface IEnrollmentService
    {
        Task<IEnumerable<EnrollmentDto>> GetAllAsync();
        Task<EnrollmentDto?> GetByIdAsync(int id);
        Task<IEnumerable<EnrollmentDto>> GetByStudentIdAsync(int studentId);
        Task<IEnumerable<EnrollmentDto>> GetByClassIdAsync(int classId);
        Task<EnrollmentDto> CreateAsync(CreateEnrollmentDto createEnrollmentDto);
        Task<EnrollmentDto> UpdateAsync(UpdateEnrollmentDto updateEnrollmentDto);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}