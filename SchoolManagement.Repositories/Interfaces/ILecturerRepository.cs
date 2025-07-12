using SchoolManagement.Models.Entities;

namespace SchoolManagement.Repositories.Interfaces
{
    public interface ILecturerRepository
    {
        Task<IEnumerable<Lecturer>> GetAllAsync();
        Task<Lecturer?> GetByIdAsync(int id);
        Task<Lecturer> AddAsync(Lecturer lecturer);
        Task UpdateAsync(Lecturer lecturer);
        Task DeleteAsync(Lecturer lecturer);
        Task<bool> ExistsAsync(int id);
    }
}