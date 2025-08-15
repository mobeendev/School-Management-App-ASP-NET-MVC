using SchoolManagement.Models.DTOs;
using SchoolManagement.Models.Entities;
using SchoolManagement.Models.Enums;
using SchoolManagement.Repositories.Interfaces;
using SchoolManagement.Services.Interfaces;

namespace SchoolManagement.Services.Implementations
{
    public class ClassService : IClassService
    {
        private readonly IClassRepository _classRepository;

        public ClassService(IClassRepository classRepository)
        {
            _classRepository = classRepository;
        }

        public async Task<IEnumerable<ClassDto>> GetAllClassesAsync()
        {
            var classes = await _classRepository.GetAllAsync();
            return classes.Select(MapToDto);
        }

        public async Task<ClassDto?> GetClassByIdAsync(int id)
        {
            var classEntity = await _classRepository.GetByIdWithIncludesAsync(id);
            return classEntity == null ? null : MapToDto(classEntity);
        }

        public async Task<ClassDto> CreateClassAsync(CreateClassDto createClassDto)
        {
            var classEntity = MapToEntity(createClassDto);
            var createdClass = await _classRepository.CreateAsync(classEntity);
            
            // Get the created class with includes to return proper DTO
            var classWithIncludes = await _classRepository.GetByIdWithIncludesAsync(createdClass.Id);
            return MapToDto(classWithIncludes!);
        }

        public async Task<ClassDto> UpdateClassAsync(UpdateClassDto updateClassDto)
        {
            var classEntity = MapToEntity(updateClassDto);
            var updatedClass = await _classRepository.UpdateAsync(classEntity);
            
            // Get the updated class with includes to return proper DTO
            var classWithIncludes = await _classRepository.GetByIdWithIncludesAsync(updatedClass.Id);
            return MapToDto(classWithIncludes!);
        }

        public async Task<bool> DeleteClassAsync(int id)
        {
            return await _classRepository.DeleteAsync(id);
        }

        private static ClassDto MapToDto(Class classEntity)
        {
            return new ClassDto
            {
                Id = classEntity.Id,
                Name = classEntity.Name,
                CourseId = classEntity.CourseId,
                CourseName = classEntity.Course?.Name ?? string.Empty,
                SemesterId = classEntity.SemesterId,
                SemesterName = GetSemesterDisplayName(classEntity.Semester),
                MaxStudents = classEntity.MaxStudents
            };
        }

        private static Class MapToEntity(CreateClassDto createClassDto)
        {
            return new Class
            {
                Name = createClassDto.Name,
                CourseId = createClassDto.CourseId,
                SemesterId = createClassDto.SemesterId,
                MaxStudents = createClassDto.MaxStudents
            };
        }

        private static Class MapToEntity(UpdateClassDto updateClassDto)
        {
            return new Class
            {
                Id = updateClassDto.Id,
                Name = updateClassDto.Name,
                CourseId = updateClassDto.CourseId,
                SemesterId = updateClassDto.SemesterId,
                MaxStudents = updateClassDto.MaxStudents
            };
        }

        private static string GetSemesterDisplayName(Semester? semester)
        {
            if (semester == null) return string.Empty;
            
            var typeName = Enum.GetName(typeof(SemesterType), semester.Type) ?? "Unknown";
            var year = semester.StartDate.Year;
            return $"{typeName} {year}";
        }
    }
}