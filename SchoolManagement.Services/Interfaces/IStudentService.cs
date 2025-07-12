using SchoolManagement.Models.DTOs;
using SchoolManagement.Models.Entities;

namespace SchoolManagement.Services.Interfaces
{
    public interface IStudentService
    {
        Task<IEnumerable<StudentDto>> GetAllStudentsAsync();
        Task<StudentDto?> GetStudentByIdAsync(int id);
        Task<StudentDto> CreateStudentAsync(StudentDto studentDto);
        Task<StudentDto> UpdateStudentAsync(StudentDto studentDto);
        Task<bool> DeleteStudentAsync(int id);
        Task<bool> StudentExistsAsync(int id);
    }
}