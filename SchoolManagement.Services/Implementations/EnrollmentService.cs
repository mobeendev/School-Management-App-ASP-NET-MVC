using SchoolManagement.Models.DTOs;
using SchoolManagement.Models.Entities;
using SchoolManagement.Repositories.Interfaces;
using SchoolManagement.Services.Interfaces;

namespace SchoolManagement.Services.Implementations
{
    public class EnrollmentService : IEnrollmentService
    {
        private readonly IEnrollmentRepository _enrollmentRepository;

        public EnrollmentService(IEnrollmentRepository enrollmentRepository)
        {
            _enrollmentRepository = enrollmentRepository;
        }

        public async Task<IEnumerable<EnrollmentDto>> GetAllAsync()
        {
            var enrollments = await _enrollmentRepository.GetAllAsync();
            return enrollments.Select(MapToDto);
        }

        public async Task<EnrollmentDto?> GetByIdAsync(int id)
        {
            var enrollment = await _enrollmentRepository.GetByIdAsync(id);
            return enrollment != null ? MapToDto(enrollment) : null;
        }

        public async Task<IEnumerable<EnrollmentDto>> GetByStudentIdAsync(int studentId)
        {
            var enrollments = await _enrollmentRepository.GetByStudentIdAsync(studentId);
            return enrollments.Select(MapToDto);
        }

        public async Task<IEnumerable<EnrollmentDto>> GetByClassIdAsync(int classId)
        {
            var enrollments = await _enrollmentRepository.GetByClassIdAsync(classId);
            return enrollments.Select(MapToDto);
        }

        public async Task<EnrollmentDto> CreateAsync(CreateEnrollmentDto createEnrollmentDto)
        {
            var enrollment = new Enrollment
            {
                StudentId = createEnrollmentDto.StudentId,
                ClassId = createEnrollmentDto.ClassId,
                SemesterId = createEnrollmentDto.SemesterId
            };

            var createdEnrollment = await _enrollmentRepository.AddAsync(enrollment);
            
            // Fetch the created enrollment with all navigation properties
            var enrollmentWithNavigation = await _enrollmentRepository.GetByIdAsync(createdEnrollment.Id);
            return MapToDto(enrollmentWithNavigation!);
        }

        public async Task<EnrollmentDto> UpdateAsync(UpdateEnrollmentDto updateEnrollmentDto)
        {
            var enrollment = await _enrollmentRepository.GetByIdAsync(updateEnrollmentDto.Id);
            if (enrollment == null)
                throw new KeyNotFoundException($"Enrollment with ID {updateEnrollmentDto.Id} not found");

            enrollment.StudentId = updateEnrollmentDto.StudentId;
            enrollment.ClassId = updateEnrollmentDto.ClassId;
            enrollment.SemesterId = updateEnrollmentDto.SemesterId;
            enrollment.Grade = updateEnrollmentDto.Grade;

            await _enrollmentRepository.UpdateAsync(enrollment);

            // Fetch the updated enrollment with all navigation properties
            var updatedEnrollment = await _enrollmentRepository.GetByIdAsync(enrollment.Id);
            return MapToDto(updatedEnrollment!);
        }

        public async Task DeleteAsync(int id)
        {
            var enrollment = await _enrollmentRepository.GetByIdAsync(id);
            if (enrollment == null)
                throw new KeyNotFoundException($"Enrollment with ID {id} not found");

            await _enrollmentRepository.DeleteAsync(enrollment);
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _enrollmentRepository.ExistsAsync(id);
        }

        private static EnrollmentDto MapToDto(Enrollment enrollment)
        {
            return new EnrollmentDto
            {
                Id = enrollment.Id,
                StudentId = enrollment.StudentId ?? 0,
                StudentName = enrollment.Student != null 
                    ? $"{enrollment.Student.User?.FirstName} {enrollment.Student.User?.LastName}".Trim()
                    : "Unknown Student",
                StudentEmail = enrollment.Student?.User?.Email ?? "Unknown Email",
                ClassId = enrollment.ClassId ?? 0,
                ClassName = enrollment.Class?.Name ?? "Unknown Class",
                CourseCode = enrollment.Class?.Course?.Code ?? "Unknown Code",
                CourseName = enrollment.Class?.Course?.Name ?? "Unknown Course",
                SemesterId = enrollment.SemesterId,
                SemesterType = enrollment.Semester?.Type.ToString() ?? "Unknown Semester",
                SemesterStartDate = enrollment.Semester?.StartDate ?? DateTime.MinValue,
                SemesterEndDate = enrollment.Semester?.EndDate ?? DateTime.MinValue,
                Grade = enrollment.Grade
            };
        }
    }
}