using Microsoft.EntityFrameworkCore;
using SchoolManagement.Models.Entities;
using SchoolManagement.Repositories.Context;
using SchoolManagement.Repositories.Interfaces;

namespace SchoolManagement.Repositories.Implementations
{
    public class SemesterRepository : ISemesterRepository
    {
        private readonly SchoolManagementDbContext _context;

        public SemesterRepository(SchoolManagementDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Semester>> GetAllAsync()
        {
            return await _context.Semesters
                .OrderBy(s => s.StartDate)
                .ToListAsync();
        }

        public async Task<Semester?> GetByIdAsync(int id)
        {
            return await _context.Semesters
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<Semester> AddAsync(Semester semester)
        {
            _context.Semesters.Add(semester);
            await _context.SaveChangesAsync();
            return semester;
        }

        public async Task UpdateAsync(Semester semester)
        {
            _context.Entry(semester).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Semester semester)
        {
            _context.Semesters.Remove(semester);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Semesters.AnyAsync(s => s.Id == id);
        }
    }
}