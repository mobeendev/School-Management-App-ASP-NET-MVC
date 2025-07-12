using SchoolManagement.Models.Entities;

namespace SchoolManagement.Repositories.Interfaces
{
    public interface ISemesterRepository
    {
        Task<IEnumerable<Semester>> GetAllAsync();
        Task<Semester?> GetByIdAsync(int id);
        Task<Semester> AddAsync(Semester semester);
        Task UpdateAsync(Semester semester);
        Task DeleteAsync(Semester semester);
        Task<bool> ExistsAsync(int id);
    }
}