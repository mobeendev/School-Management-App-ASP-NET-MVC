using SchoolManagement.Models.DTOs;
using SchoolManagement.Models.Entities;

namespace SchoolManagement.Services.Interfaces
{
    public interface ICourseService
    {
        Task<IEnumerable<CourseDto>> GetAllCoursesAsync();
        Task<CourseDto?> GetCourseByIdAsync(int id);
        Task<CourseDto> CreateCourseAsync(CourseDto courseDto);
        Task<CourseDto> UpdateCourseAsync(CourseDto courseDto);
        Task<bool> DeleteCourseAsync(int id);
        Task<bool> CourseExistsAsync(int id);
    }
}