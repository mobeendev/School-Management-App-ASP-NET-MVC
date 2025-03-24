using SchoolManagementApp.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolManagementApp.Interfaces
{
    public interface ICourseRepository
    {
        Task<IEnumerable<Course>> GetAllAsync();
        Task<Course> GetByIdAsync(int id);
        Task<Course> AddAsync(Course course);
        Task UpdateAsync(Course course);
        Task DeleteAsync(Course course);
        Task<bool> ExistsAsync(int id);
    }
} 