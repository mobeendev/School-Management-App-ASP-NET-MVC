using SchoolManagement.Models.DTOs;
using SchoolManagement.Models.Entities;

namespace SchoolManagement.Services.Interfaces
{
    public interface IStudentService
    {
        Task<IEnumerable<StudentDto>> GetAllStudentsAsync();
        Task<StudentDto?> GetStudentByIdAsync(int id);
        Task<StudentDto> CreateStudentAsync(CreateStudentDto createStudentDto);
        Task<StudentDto> CreateStudentWithUserAsync(CreateStudentWithUserDto createStudentWithUserDto);
        Task<StudentDto> UpdateStudentAsync(UpdateStudentDto updateStudentDto);
        Task<bool> DeleteStudentAsync(int id);
        Task<bool> StudentExistsAsync(int id);
        Task<bool> StudentExistsByUserIdAsync(string userId);
    }
}