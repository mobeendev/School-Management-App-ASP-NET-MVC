using Microsoft.EntityFrameworkCore;
using SchoolManagement.Models.Entities;
using SchoolManagement.Repositories.Context;
using SchoolManagement.Repositories.Interfaces;

namespace SchoolManagement.Repositories.Implementations
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
            return await _context.Classes
                .Include(c => c.Course)
                .Include(c => c.Semester)
                .Include(c => c.Lecturer)
                .ToListAsync();
        }

        public async Task<Class?> GetByIdAsync(int id)
        {
            return await _context.Classes.FindAsync(id);
        }

        public async Task<Class?> GetByIdWithIncludesAsync(int id)
        {
            return await _context.Classes
                .Include(c => c.Course)
                .Include(c => c.Semester)
                .Include(c => c.Lecturer)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Class> CreateAsync(Class classEntity)
        {
            _context.Classes.Add(classEntity);
            await _context.SaveChangesAsync();
            return classEntity;
        }

        public async Task<Class> UpdateAsync(Class classEntity)
        {
            _context.Classes.Update(classEntity);
            await _context.SaveChangesAsync();
            return classEntity;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var classEntity = await _context.Classes.FindAsync(id);
            if (classEntity == null)
            {
                return false;
            }

            _context.Classes.Remove(classEntity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Classes.AnyAsync(c => c.Id == id);
        }
    }
}