using SchoolManagement.Models.DTOs;
using SchoolManagement.Models.Entities;
using SchoolManagement.Repositories.Interfaces;
using SchoolManagement.Services.Interfaces;

namespace SchoolManagement.Services.Implementations
{
    public class StudentService : IStudentService
    {
        private readonly IStudentRepository _studentRepository;

        public StudentService(IStudentRepository studentRepository)
        {
            _studentRepository = studentRepository;
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

        public async Task<StudentDto> CreateStudentAsync(StudentDto studentDto)
        {
            var student = MapToEntity(studentDto);
            var createdStudent = await _studentRepository.AddAsync(student);
            return MapToDto(createdStudent);
        }

        public async Task<StudentDto> UpdateStudentAsync(StudentDto studentDto)
        {
            var student = MapToEntity(studentDto);
            await _studentRepository.UpdateAsync(student);
            return studentDto;
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

        private static StudentDto MapToDto(Student student)
        {
            return new StudentDto
            {
                Id = student.Id,
                FirstName = student.FirstName,
                LastName = student.LastName,
                DateOfBirth = student.DateOfBirth
            };
        }

        private static Student MapToEntity(StudentDto studentDto)
        {
            return new Student
            {
                Id = studentDto.Id,
                FirstName = studentDto.FirstName,
                LastName = studentDto.LastName,
                DateOfBirth = studentDto.DateOfBirth
            };
        }
    }
}