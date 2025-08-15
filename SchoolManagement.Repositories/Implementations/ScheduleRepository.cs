using Microsoft.EntityFrameworkCore;
using SchoolManagement.Models.Entities;
using SchoolManagement.Repositories.Context;
using SchoolManagement.Repositories.Interfaces;

namespace SchoolManagement.Repositories.Implementations
{
    public class ScheduleRepository : IScheduleRepository
    {
        private readonly SchoolManagementDbContext _context;

        public ScheduleRepository(SchoolManagementDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ClassSchedule>> GetAllAsync()
        {
            return await _context.ClassSchedules
                .Include(cs => cs.Class)
                .Include(cs => cs.Lecturer)
                    .ThenInclude(l => l!.User)
                .ToListAsync();
        }

        public async Task<ClassSchedule?> GetByIdAsync(int id)
        {
            return await _context.ClassSchedules
                .Include(cs => cs.Class)
                .Include(cs => cs.Lecturer)
                    .ThenInclude(l => l!.User)
                .FirstOrDefaultAsync(cs => cs.Id == id);
        }

        public async Task<IEnumerable<ClassSchedule>> GetByClassIdAsync(int classId)
        {
            return await _context.ClassSchedules
                .Include(cs => cs.Class)
                .Include(cs => cs.Lecturer)
                    .ThenInclude(l => l!.User)
                .Where(cs => cs.ClassId == classId)
                .ToListAsync();
        }

        public async Task<IEnumerable<ClassSchedule>> GetByLecturerIdAsync(int lecturerId)
        {
            return await _context.ClassSchedules
                .Include(cs => cs.Class)
                .Include(cs => cs.Lecturer)
                    .ThenInclude(l => l!.User)
                .Where(cs => cs.LecturerId == lecturerId)
                .ToListAsync();
        }

        public async Task<ClassSchedule> AddAsync(ClassSchedule schedule)
        {
            _context.ClassSchedules.Add(schedule);
            await _context.SaveChangesAsync();
            return schedule;
        }

        public async Task UpdateAsync(ClassSchedule schedule)
        {
            _context.Entry(schedule).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(ClassSchedule schedule)
        {
            _context.ClassSchedules.Remove(schedule);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.ClassSchedules.AnyAsync(cs => cs.Id == id);
        }
    }
}