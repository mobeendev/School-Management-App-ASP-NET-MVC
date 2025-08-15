using Microsoft.EntityFrameworkCore;
using SchoolManagement.Models.Entities;
using SchoolManagement.Repositories.Context;
using SchoolManagement.Repositories.Interfaces;

namespace SchoolManagement.Repositories.Implementations
{
    public class LecturerRepository : ILecturerRepository
    {
        private readonly SchoolManagementDbContext _context;

        public LecturerRepository(SchoolManagementDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Lecturer>> GetAllAsync()
        {
            return await _context.Lecturers
                .Include(l => l.User)
                .ToListAsync();
        }

        public async Task<Lecturer?> GetByIdAsync(int id)
        {
            return await _context.Lecturers
                .Include(l => l.User)
                .FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<Lecturer> AddAsync(Lecturer lecturer)
        {
            _context.Lecturers.Add(lecturer);
            await _context.SaveChangesAsync();
            return lecturer;
        }

        public async Task UpdateAsync(Lecturer lecturer)
        {
            _context.Entry(lecturer).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Lecturer lecturer)
        {
            _context.Lecturers.Remove(lecturer);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Lecturers.AnyAsync(l => l.Id == id);
        }

        public async Task<bool> ExistsByUserIdAsync(string userId)
        {
            return await _context.Lecturers.AnyAsync(l => l.UserId == userId);
        }
    }
}