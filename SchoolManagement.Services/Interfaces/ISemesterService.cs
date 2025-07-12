using SchoolManagement.Models.DTOs;

namespace SchoolManagement.Services.Interfaces
{
    public interface ISemesterService
    {
        Task<IEnumerable<SemesterDto>> GetAllSemestersAsync();
        Task<SemesterDto?> GetSemesterByIdAsync(int id);
        Task<SemesterDto> CreateSemesterAsync(CreateSemesterDto createSemesterDto);
        Task<SemesterDto> UpdateSemesterAsync(UpdateSemesterDto updateSemesterDto);
        Task<bool> DeleteSemesterAsync(int id);
        Task<bool> SemesterExistsAsync(int id);
    }
}