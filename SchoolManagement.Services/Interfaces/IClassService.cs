using SchoolManagement.Models.DTOs;

namespace SchoolManagement.Services.Interfaces
{
    public interface IClassService
    {
        Task<IEnumerable<ClassDto>> GetAllClassesAsync();
        Task<ClassDto?> GetClassByIdAsync(int id);
        Task<ClassDto> CreateClassAsync(CreateClassDto createClassDto);
        Task<ClassDto> UpdateClassAsync(UpdateClassDto updateClassDto);
        Task<bool> DeleteClassAsync(int id);
    }
}