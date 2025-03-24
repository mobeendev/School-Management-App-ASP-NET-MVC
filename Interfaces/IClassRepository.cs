using SchoolManagementApp.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolManagementApp.Interfaces
{
    public interface IClassRepository
    {
        Task<IEnumerable<Class>> GetAllAsync();
        Task<Class> GetByIdAsync(int id);
        Task<Class> AddAsync(Class @class);
        Task UpdateAsync(Class @class);
        Task DeleteAsync(Class @class);
        Task<bool> ExistsAsync(int id);
        Task<IEnumerable<Class>> GetAllClassesWithDetailsAsync();
        Task<Class> GetClassWithDetailsAsync(int id);
        Task<bool> HasEnrollmentsAsync(int id);
    }
} 