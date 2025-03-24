using SchoolManagementApp.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolManagementApp.Interfaces
{
    public interface IClassScheduleRepository
    {
        Task<IEnumerable<ClassSchedule>> GetAllAsync();
        Task<ClassSchedule> GetByIdAsync(int id);
        Task<ClassSchedule> AddAsync(ClassSchedule classSchedule);
        Task UpdateAsync(ClassSchedule classSchedule);
        Task DeleteAsync(ClassSchedule classSchedule);
        Task<bool> ExistsAsync(int id);
        Task<IEnumerable<ClassSchedule>> GetAllSchedulesWithDetailsAsync();
        Task<ClassSchedule> GetScheduleWithDetailsAsync(int id);
    }
} 