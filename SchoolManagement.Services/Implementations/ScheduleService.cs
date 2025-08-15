using SchoolManagement.Models.DTOs;
using SchoolManagement.Models.Entities;
using SchoolManagement.Repositories.Interfaces;
using SchoolManagement.Services.Interfaces;

namespace SchoolManagement.Services.Implementations
{
    public class ScheduleService : IScheduleService
    {
        private readonly IScheduleRepository _scheduleRepository;

        public ScheduleService(IScheduleRepository scheduleRepository)
        {
            _scheduleRepository = scheduleRepository;
        }

        public async Task<IEnumerable<ScheduleDto>> GetAllSchedulesAsync()
        {
            var schedules = await _scheduleRepository.GetAllAsync();
            return schedules.Select(MapToDto);
        }

        public async Task<ScheduleDto?> GetScheduleByIdAsync(int id)
        {
            var schedule = await _scheduleRepository.GetByIdAsync(id);
            return schedule == null ? null : MapToDto(schedule);
        }

        public async Task<IEnumerable<ScheduleDto>> GetSchedulesByClassIdAsync(int classId)
        {
            var schedules = await _scheduleRepository.GetByClassIdAsync(classId);
            return schedules.Select(MapToDto);
        }

        public async Task<IEnumerable<ScheduleDto>> GetSchedulesByLecturerIdAsync(int lecturerId)
        {
            var schedules = await _scheduleRepository.GetByLecturerIdAsync(lecturerId);
            return schedules.Select(MapToDto);
        }

        public async Task<ScheduleDto> CreateScheduleAsync(CreateScheduleDto createScheduleDto)
        {
            var schedule = MapToEntity(createScheduleDto);
            var createdSchedule = await _scheduleRepository.AddAsync(schedule);
            
            // Reload with navigation properties
            var scheduleWithIncludes = await _scheduleRepository.GetByIdAsync(createdSchedule.Id);
            return MapToDto(scheduleWithIncludes!);
        }

        public async Task<ScheduleDto> UpdateScheduleAsync(UpdateScheduleDto updateScheduleDto)
        {
            var schedule = MapToEntity(updateScheduleDto);
            await _scheduleRepository.UpdateAsync(schedule);
            
            // Reload with navigation properties
            var scheduleWithIncludes = await _scheduleRepository.GetByIdAsync(updateScheduleDto.Id);
            return MapToDto(scheduleWithIncludes!);
        }

        public async Task<bool> DeleteScheduleAsync(int id)
        {
            var schedule = await _scheduleRepository.GetByIdAsync(id);
            if (schedule == null)
                return false;

            await _scheduleRepository.DeleteAsync(schedule);
            return true;
        }

        public async Task<bool> ScheduleExistsAsync(int id)
        {
            return await _scheduleRepository.ExistsAsync(id);
        }

        private static ScheduleDto MapToDto(ClassSchedule schedule)
        {
            return new ScheduleDto
            {
                Id = schedule.Id,
                ClassId = schedule.ClassId,
                LecturerId = schedule.LecturerId,
                Day = schedule.Day,
                StartTime = schedule.StartTime.ToString(@"hh\:mm"),
                EndTime = schedule.EndTime.ToString(@"hh\:mm"),
                ClassName = schedule.Class?.Name ?? "",
                LecturerName = schedule.Lecturer?.User != null 
                    ? $"{schedule.Lecturer.User.FirstName} {schedule.Lecturer.User.LastName}" 
                    : ""
            };
        }

        private static ClassSchedule MapToEntity(CreateScheduleDto createScheduleDto)
        {
            return new ClassSchedule
            {
                ClassId = createScheduleDto.ClassId,
                LecturerId = createScheduleDto.LecturerId,
                Day = createScheduleDto.Day,
                StartTime = TimeSpan.Parse(createScheduleDto.StartTime),
                EndTime = TimeSpan.Parse(createScheduleDto.EndTime)
            };
        }

        private static ClassSchedule MapToEntity(UpdateScheduleDto updateScheduleDto)
        {
            return new ClassSchedule
            {
                Id = updateScheduleDto.Id,
                ClassId = updateScheduleDto.ClassId,
                LecturerId = updateScheduleDto.LecturerId,
                Day = updateScheduleDto.Day,
                StartTime = TimeSpan.Parse(updateScheduleDto.StartTime),
                EndTime = TimeSpan.Parse(updateScheduleDto.EndTime)
            };
        }
    }
}