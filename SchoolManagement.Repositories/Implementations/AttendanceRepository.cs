using Microsoft.EntityFrameworkCore;
using SchoolManagement.Models.Entities;
using SchoolManagement.Repositories.Context;
using SchoolManagement.Repositories.Interfaces;

namespace SchoolManagement.Repositories.Implementations
{
    public class AttendanceRepository : IAttendanceRepository
    {
        private readonly SchoolManagementDbContext _context;

        public AttendanceRepository(SchoolManagementDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Attendance>> GetAllAsync()
        {
            return await _context.Attendances
                .Include(a => a.Student)
                .Include(a => a.Class)
                .ThenInclude(c => c.Course)
                .Include(a => a.Semester)
                .ToListAsync();
        }

        public async Task<Attendance?> GetByIdAsync(int id)
        {
            return await _context.Attendances
                .Include(a => a.Student)
                .Include(a => a.Class)
                .ThenInclude(c => c.Course)
                .Include(a => a.Semester)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<Attendance> AddAsync(Attendance attendance)
        {
            _context.Attendances.Add(attendance);
            await _context.SaveChangesAsync();
            return attendance;
        }

        public async Task UpdateAsync(Attendance attendance)
        {
            _context.Entry(attendance).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Attendance attendance)
        {
            _context.Attendances.Remove(attendance);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Attendances.AnyAsync(a => a.Id == id);
        }

        public async Task<Attendance?> GetByStudentClassDateAsync(int studentId, int classId, int semesterId, DateTime date)
        {
            return await _context.Attendances
                .FirstOrDefaultAsync(a => a.StudentId == studentId 
                                       && a.ClassId == classId 
                                       && a.SemesterId == semesterId 
                                       && a.Date.Date == date.Date);
        }

        public async Task<IEnumerable<Attendance>> GetByStudentIdAsync(int studentId)
        {
            return await _context.Attendances
                .Where(a => a.StudentId == studentId)
                .Include(a => a.Class)
                .ThenInclude(c => c.Course)
                .Include(a => a.Semester)
                .ToListAsync();
        }

        public async Task<IEnumerable<Attendance>> GetByClassIdAsync(int classId)
        {
            return await _context.Attendances
                .Where(a => a.ClassId == classId)
                .Include(a => a.Student)
                .Include(a => a.Semester)
                .ToListAsync();
        }
    }
}