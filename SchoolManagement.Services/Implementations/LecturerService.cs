using SchoolManagement.Models.DTOs;
using SchoolManagement.Models.Entities;
using SchoolManagement.Repositories.Interfaces;
using SchoolManagement.Services.Interfaces;

namespace SchoolManagement.Services.Implementations
{
    public class LecturerService : ILecturerService
    {
        private readonly ILecturerRepository _lecturerRepository;

        public LecturerService(ILecturerRepository lecturerRepository)
        {
            _lecturerRepository = lecturerRepository;
        }

        public async Task<IEnumerable<LecturerDto>> GetAllLecturersAsync()
        {
            var lecturers = await _lecturerRepository.GetAllAsync();
            return lecturers.Select(MapToDto);
        }

        public async Task<LecturerDto?> GetLecturerByIdAsync(int id)
        {
            var lecturer = await _lecturerRepository.GetByIdAsync(id);
            return lecturer == null ? null : MapToDto(lecturer);
        }

        public async Task<LecturerDto> CreateLecturerAsync(CreateLecturerDto createLecturerDto)
        {
            var lecturer = MapToEntity(createLecturerDto);
            var createdLecturer = await _lecturerRepository.AddAsync(lecturer);
            return MapToDto(createdLecturer);
        }

        public async Task<LecturerDto> UpdateLecturerAsync(LecturerDto lecturerDto)
        {
            var lecturer = MapToEntity(lecturerDto);
            await _lecturerRepository.UpdateAsync(lecturer);
            return lecturerDto;
        }

        public async Task<bool> DeleteLecturerAsync(int id)
        {
            var lecturer = await _lecturerRepository.GetByIdAsync(id);
            if (lecturer == null)
                return false;

            await _lecturerRepository.DeleteAsync(lecturer);
            return true;
        }

        public async Task<bool> LecturerExistsAsync(int id)
        {
            return await _lecturerRepository.ExistsAsync(id);
        }

        private static LecturerDto MapToDto(Lecturer lecturer)
        {
            return new LecturerDto
            {
                Id = lecturer.Id,
                FirstName = lecturer.User?.FirstName ?? "",
                LastName = lecturer.User?.LastName ?? "",
                Salary = lecturer.Salary,
                Designation = lecturer.Designation,
                Qualification = lecturer.Qualification,
                YearsOfExperience = lecturer.YearsOfExperience,
                WorkPhoneNumber = lecturer.WorkPhoneNumber,
                TeachingHoursPerWeek = lecturer.TeachingHoursPerWeek,
                Status = lecturer.Status
            };
        }

        private static Lecturer MapToEntity(LecturerDto lecturerDto)
        {
            return new Lecturer
            {
                Id = lecturerDto.Id,
                Salary = lecturerDto.Salary,
                Designation = lecturerDto.Designation,
                Qualification = lecturerDto.Qualification,
                YearsOfExperience = lecturerDto.YearsOfExperience,
                WorkPhoneNumber = lecturerDto.WorkPhoneNumber,
                TeachingHoursPerWeek = lecturerDto.TeachingHoursPerWeek,
                Status = lecturerDto.Status
            };
        }

        private static Lecturer MapToEntity(CreateLecturerDto createLecturerDto)
        {
            return new Lecturer
            {
                UserId = createLecturerDto.UserId,
                Salary = createLecturerDto.Salary,
                Designation = createLecturerDto.Designation,
                Qualification = createLecturerDto.Qualification,
                YearsOfExperience = createLecturerDto.YearsOfExperience,
                WorkPhoneNumber = createLecturerDto.WorkPhoneNumber,
                TeachingHoursPerWeek = createLecturerDto.TeachingHoursPerWeek,
                Status = createLecturerDto.Status
            };
        }
    }
}