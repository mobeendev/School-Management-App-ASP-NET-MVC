using Microsoft.EntityFrameworkCore;
using SchoolManagementApp.Data;
using SchoolManagementApp.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolManagementApp.Repositories
{
    public class ClassScheduleRepository : IClassScheduleRepository
    {
        private readonly SchoolManagementDbContext _context;

        public ClassScheduleRepository(SchoolManagementDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ClassSchedule>> GetAllAsync()
        {
            return await _context.ClassSchedules.ToListAsync();
        }

        public async Task<ClassSchedule> GetByIdAsync(int id)
        {
            return await _context.ClassSchedules.FindAsync(id);
        }

        public async Task<ClassSchedule> AddAsync(ClassSchedule classSchedule)
        {
            await _context.ClassSchedules.AddAsync(classSchedule);
            await _context.SaveChangesAsync();
            return classSchedule;
        }

        public async Task UpdateAsync(ClassSchedule classSchedule)
        {
            _context.Entry(classSchedule).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(ClassSchedule classSchedule)
        {
            _context.ClassSchedules.Remove(classSchedule);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.ClassSchedules.AnyAsync(e => e.Id == id);
        }

        public async Task<IEnumerable<ClassSchedule>> GetAllSchedulesWithDetailsAsync()
        {
            return await _context.ClassSchedules
                .Include(q => q.Class)
                .ThenInclude(c => c.Course)
                .Include(q => q.Lecturer)
                .ToListAsync();
        }

        public async Task<ClassSchedule> GetScheduleWithDetailsAsync(int id)
        {
            return await _context.ClassSchedules
                .Include(q => q.Class)
                .ThenInclude(c => c.Course)
                .Include(q => q.Lecturer)
                .FirstOrDefaultAsync(m => m.Id == id);
        }
    }
} 