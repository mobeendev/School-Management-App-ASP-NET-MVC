using SchoolManagement.Models.Entities;

namespace SchoolManagement.Repositories.Interfaces
{
    public interface IScheduleRepository
    {
        Task<IEnumerable<ClassSchedule>> GetAllAsync();
        Task<ClassSchedule?> GetByIdAsync(int id);
        Task<IEnumerable<ClassSchedule>> GetByClassIdAsync(int classId);
        Task<IEnumerable<ClassSchedule>> GetByLecturerIdAsync(int lecturerId);
        Task<ClassSchedule> AddAsync(ClassSchedule schedule);
        Task UpdateAsync(ClassSchedule schedule);
        Task DeleteAsync(ClassSchedule schedule);
        Task<bool> ExistsAsync(int id);
    }
}