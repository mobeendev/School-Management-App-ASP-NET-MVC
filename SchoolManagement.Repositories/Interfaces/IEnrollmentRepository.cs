using SchoolManagement.Models.Entities;

namespace SchoolManagement.Repositories.Interfaces
{
    public interface IEnrollmentRepository
    {
        Task<IEnumerable<Enrollment>> GetAllAsync();
        Task<Enrollment?> GetByIdAsync(int id);
        Task<Enrollment> AddAsync(Enrollment enrollment);
        Task UpdateAsync(Enrollment enrollment);
        Task DeleteAsync(Enrollment enrollment);
        Task<bool> ExistsAsync(int id);
        Task<IEnumerable<Enrollment>> GetByStudentIdAsync(int studentId);
        Task<IEnumerable<Enrollment>> GetByClassIdAsync(int classId);
    }
}