using SchoolManagement.Models.DTOs;
using SchoolManagement.Models.Entities;
using SchoolManagement.Repositories.Interfaces;
using SchoolManagement.Services.Interfaces;

namespace SchoolManagement.Services.Implementations
{
    public class CourseService : ICourseService
    {
        private readonly ICourseRepository _courseRepository;

        public CourseService(ICourseRepository courseRepository)
        {
            _courseRepository = courseRepository;
        }

        public async Task<IEnumerable<CourseDto>> GetAllCoursesAsync()
        {
            var courses = await _courseRepository.GetAllAsync();
            return courses.Select(MapToDto);
        }

        public async Task<CourseDto?> GetCourseByIdAsync(int id)
        {
            var course = await _courseRepository.GetByIdAsync(id);
            return course == null ? null : MapToDto(course);
        }

        public async Task<CourseDto> CreateCourseAsync(CourseDto courseDto)
        {
            var course = MapToEntity(courseDto);
            var createdCourse = await _courseRepository.AddAsync(course);
            return MapToDto(createdCourse);
        }

        public async Task<CourseDto> UpdateCourseAsync(CourseDto courseDto)
        {
            var course = MapToEntity(courseDto);
            await _courseRepository.UpdateAsync(course);
            return courseDto;
        }

        public async Task<bool> DeleteCourseAsync(int id)
        {
            var course = await _courseRepository.GetByIdAsync(id);
            if (course == null)
                return false;

            await _courseRepository.DeleteAsync(course);
            return true;
        }

        public async Task<bool> CourseExistsAsync(int id)
        {
            return await _courseRepository.ExistsAsync(id);
        }

        private static CourseDto MapToDto(Course course)
        {
            return new CourseDto
            {
                Id = course.Id,
                Name = course.Name,
                Code = course.Code,
                Credits = course.Credits
            };
        }

        private static Course MapToEntity(CourseDto courseDto)
        {
            return new Course
            {
                Id = courseDto.Id,
                Name = courseDto.Name,
                Code = courseDto.Code,
                Credits = courseDto.Credits
            };
        }
    }
}