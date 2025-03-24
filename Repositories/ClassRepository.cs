using Microsoft.EntityFrameworkCore;
using SchoolManagementApp.Data;
using SchoolManagementApp.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolManagementApp.Repositories
{
    public class ClassRepository : IClassRepository
    {
        private readonly SchoolManagementDbContext _context;

        public ClassRepository(SchoolManagementDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Class>> GetAllAsync()
        {
            return await _context.Classes.ToListAsync();
        }

        public async Task<Class> GetByIdAsync(int id)
        {
            return await _context.Classes.FindAsync(id);
        }

        public async Task<Class> AddAsync(Class @class)
        {
            await _context.Classes.AddAsync(@class);
            await _context.SaveChangesAsync();
            return @class;
        }

        public async Task UpdateAsync(Class @class)
        {
            _context.Entry(@class).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Class @class)
        {
            _context.Classes.Remove(@class);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Classes.AnyAsync(e => e.Id == id);
        }

        public async Task<IEnumerable<Class>> GetAllClassesWithDetailsAsync()
        {
            return await _context.Classes
                .Include(q => q.Course)
                .Include(q => q.Lecturer)
                .ThenInclude(u => u.User)
                .ToListAsync();
        }

        public async Task<Class> GetClassWithDetailsAsync(int id)
        {
            return await _context.Classes
                .Include(q => q.Course)
                .Include(q => q.Lecturer)
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<bool> HasEnrollmentsAsync(int id)
        {
            return await _context.Enrollments.AnyAsync(e => e.ClassId == id);
        }
    }
}