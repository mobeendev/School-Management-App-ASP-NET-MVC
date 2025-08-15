using SchoolManagement.Models.DTOs;

namespace SchoolManagement.Services.Interfaces
{
    public interface IScheduleService
    {
        Task<IEnumerable<ScheduleDto>> GetAllSchedulesAsync();
        Task<ScheduleDto?> GetScheduleByIdAsync(int id);
        Task<IEnumerable<ScheduleDto>> GetSchedulesByClassIdAsync(int classId);
        Task<IEnumerable<ScheduleDto>> GetSchedulesByLecturerIdAsync(int lecturerId);
        Task<ScheduleDto> CreateScheduleAsync(CreateScheduleDto createScheduleDto);
        Task<ScheduleDto> UpdateScheduleAsync(UpdateScheduleDto updateScheduleDto);
        Task<bool> DeleteScheduleAsync(int id);
        Task<bool> ScheduleExistsAsync(int id);
    }
}