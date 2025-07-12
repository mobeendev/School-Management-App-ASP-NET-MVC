using SchoolManagement.Models.Entities;

namespace SchoolManagement.Repositories.Interfaces
{
    public interface IAttendanceRepository
    {
        Task<IEnumerable<Attendance>> GetAllAsync();
        Task<Attendance?> GetByIdAsync(int id);
        Task<Attendance> AddAsync(Attendance attendance);
        Task UpdateAsync(Attendance attendance);
        Task DeleteAsync(Attendance attendance);
        Task<bool> ExistsAsync(int id);
        Task<Attendance?> GetByStudentClassDateAsync(int studentId, int classId, int semesterId, DateTime date);
        Task<IEnumerable<Attendance>> GetByStudentIdAsync(int studentId);
        Task<IEnumerable<Attendance>> GetByClassIdAsync(int classId);
    }
}