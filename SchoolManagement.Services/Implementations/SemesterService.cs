using SchoolManagement.Models.DTOs;
using SchoolManagement.Models.Entities;
using SchoolManagement.Repositories.Interfaces;
using SchoolManagement.Services.Interfaces;

namespace SchoolManagement.Services.Implementations
{
    public class SemesterService : ISemesterService
    {
        private readonly ISemesterRepository _semesterRepository;

        public SemesterService(ISemesterRepository semesterRepository)
        {
            _semesterRepository = semesterRepository;
        }

        public async Task<IEnumerable<SemesterDto>> GetAllSemestersAsync()
        {
            var semesters = await _semesterRepository.GetAllAsync();
            return semesters.Select(MapToDto);
        }

        public async Task<SemesterDto?> GetSemesterByIdAsync(int id)
        {
            var semester = await _semesterRepository.GetByIdAsync(id);
            return semester == null ? null : MapToDto(semester);
        }

        public async Task<SemesterDto> CreateSemesterAsync(CreateSemesterDto createSemesterDto)
        {
            ValidateSemesterDates(createSemesterDto.StartDate, createSemesterDto.EndDate);
            
            var semester = MapToEntity(createSemesterDto);
            var createdSemester = await _semesterRepository.AddAsync(semester);
            return MapToDto(createdSemester);
        }

        public async Task<SemesterDto> UpdateSemesterAsync(UpdateSemesterDto updateSemesterDto)
        {
            ValidateSemesterDates(updateSemesterDto.StartDate, updateSemesterDto.EndDate);
            
            var semester = MapToEntity(updateSemesterDto);
            await _semesterRepository.UpdateAsync(semester);
            return MapToDto(semester);
        }

        public async Task<bool> DeleteSemesterAsync(int id)
        {
            var semester = await _semesterRepository.GetByIdAsync(id);
            if (semester == null)
                return false;

            await _semesterRepository.DeleteAsync(semester);
            return true;
        }

        public async Task<bool> SemesterExistsAsync(int id)
        {
            return await _semesterRepository.ExistsAsync(id);
        }

        private static void ValidateSemesterDates(DateTime startDate, DateTime endDate)
        {
            if (startDate >= endDate)
            {
                throw new ArgumentException("Start date must be before the end date.");
            }
        }

        private static SemesterDto MapToDto(Semester semester)
        {
            return new SemesterDto
            {
                Id = semester.Id,
                Type = semester.Type,
                StartDate = semester.StartDate,
                EndDate = semester.EndDate
            };
        }

        private static Semester MapToEntity(CreateSemesterDto createSemesterDto)
        {
            return new Semester
            {
                Type = createSemesterDto.Type,
                StartDate = createSemesterDto.StartDate,
                EndDate = createSemesterDto.EndDate
            };
        }

        private static Semester MapToEntity(UpdateSemesterDto updateSemesterDto)
        {
            return new Semester
            {
                Id = updateSemesterDto.Id,
                Type = updateSemesterDto.Type,
                StartDate = updateSemesterDto.StartDate,
                EndDate = updateSemesterDto.EndDate
            };
        }
    }
}