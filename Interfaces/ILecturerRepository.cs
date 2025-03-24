using SchoolManagementApp.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolManagementApp.Interfaces
{
    public interface ILecturerRepository
    {
        Task<IEnumerable<Lecturer>> GetAllAsync();
        Task<Lecturer> GetByIdAsync(int id);
        Task<Lecturer> AddAsync(Lecturer lecturer);
        Task UpdateAsync(Lecturer lecturer);
        Task DeleteAsync(Lecturer lecturer);
        Task<bool> ExistsAsync(int id);
        Task<IEnumerable<Lecturer>> GetAllLecturersWithDetailsAsync();
        Task<Lecturer> GetLecturerWithDetailsAsync(int id);
    }
} 