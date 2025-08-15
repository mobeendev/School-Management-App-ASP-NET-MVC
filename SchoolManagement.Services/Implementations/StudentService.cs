using Microsoft.AspNetCore.Identity;
using SchoolManagement.Models.DTOs;
using SchoolManagement.Models.Entities;
using SchoolManagement.Repositories.Interfaces;
using SchoolManagement.Services.Interfaces;

namespace SchoolManagement.Services.Implementations
{
    public class StudentService : IStudentService
    {
        private readonly IStudentRepository _studentRepository;
        private readonly UserManager<ApplicationUser> _userManager;

        public StudentService(IStudentRepository studentRepository, UserManager<ApplicationUser> userManager)
        {
            _studentRepository = studentRepository;
            _userManager = userManager;
        }

        public async Task<IEnumerable<StudentDto>> GetAllStudentsAsync()
        {
            var students = await _studentRepository.GetAllAsync();
            return students.Select(MapToDto);
        }

        public async Task<StudentDto?> GetStudentByIdAsync(int id)
        {
            var student = await _studentRepository.GetByIdAsync(id);
            return student == null ? null : MapToDto(student);
        }

        public async Task<StudentDto> CreateStudentAsync(CreateStudentDto createStudentDto)
        {
            // Check if the user exists
            var user = await _userManager.FindByIdAsync(createStudentDto.UserId);
            if (user == null)
            {
                throw new InvalidOperationException($"User with ID '{createStudentDto.UserId}' not found.");
            }

            // Check if a student already exists for this user
            if (await _studentRepository.ExistsByUserIdAsync(createStudentDto.UserId))
            {
                throw new InvalidOperationException($"A student already exists for user ID: {createStudentDto.UserId}");
            }

            var student = MapToEntity(createStudentDto);
            var createdStudent = await _studentRepository.AddAsync(student);
            
            // Reload with navigation properties
            var studentWithUser = await _studentRepository.GetByIdAsync(createdStudent.Id);
            return MapToDto(studentWithUser!);
        }

        public async Task<StudentDto> CreateStudentWithUserAsync(CreateStudentWithUserDto createStudentWithUserDto)
        {
            // Create ApplicationUser first
            var user = new ApplicationUser
            {
                UserName = createStudentWithUserDto.Email,
                Email = createStudentWithUserDto.Email,
                FirstName = createStudentWithUserDto.FirstName,
                LastName = createStudentWithUserDto.LastName,
                PhoneNumber = createStudentWithUserDto.PhoneNumber,
                DateOfBirth = createStudentWithUserDto.DateOfBirth,
                Address = createStudentWithUserDto.Address,
                EmailConfirmed = true
            };

            var userResult = await _userManager.CreateAsync(user, createStudentWithUserDto.Password);
            if (!userResult.Succeeded)
            {
                var errors = string.Join(", ", userResult.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"Failed to create user: {errors}");
            }

            // Assign Student role
            await _userManager.AddToRoleAsync(user, "Student");

            // Create Student record
            var createStudentDto = new CreateStudentDto
            {
                UserId = user.Id,
                EnrollmentDate = createStudentWithUserDto.EnrollmentDate
            };

            return await CreateStudentAsync(createStudentDto);
        }

        public async Task<StudentDto> UpdateStudentAsync(UpdateStudentDto updateStudentDto)
        {
            var existingStudent = await _studentRepository.GetByIdAsync(updateStudentDto.Id);
            if (existingStudent == null)
            {
                throw new InvalidOperationException($"Student with ID {updateStudentDto.Id} not found");
            }

            // Update only student-specific fields
            existingStudent.EnrollmentDate = updateStudentDto.EnrollmentDate;

            await _studentRepository.UpdateAsync(existingStudent);
            
            // Reload with navigation properties
            var updatedStudent = await _studentRepository.GetByIdAsync(updateStudentDto.Id);
            return MapToDto(updatedStudent!);
        }

        public async Task<bool> DeleteStudentAsync(int id)
        {
            var student = await _studentRepository.GetByIdAsync(id);
            if (student == null)
                return false;

            await _studentRepository.DeleteAsync(student);
            return true;
        }

        public async Task<bool> StudentExistsAsync(int id)
        {
            return await _studentRepository.ExistsAsync(id);
        }

        public async Task<bool> StudentExistsByUserIdAsync(string userId)
        {
            return await _studentRepository.ExistsByUserIdAsync(userId);
        }

        private static StudentDto MapToDto(Student student)
        {
            return new StudentDto
            {
                Id = student.Id,
                UserId = student.UserId,
                EnrollmentDate = student.EnrollmentDate,
                
                // Map from User navigation
                FirstName = student.User?.FirstName ?? "",
                LastName = student.User?.LastName ?? "",
                Email = student.User?.Email ?? "",
                PhoneNumber = student.User?.PhoneNumber,
                DateOfBirth = student.User?.DateOfBirth,
                Address = student.User?.Address
            };
        }

        private static Student MapToEntity(CreateStudentDto createStudentDto)
        {
            return new Student
            {
                UserId = createStudentDto.UserId,
                EnrollmentDate = createStudentDto.EnrollmentDate ?? DateTime.Now
            };
        }
    }
}