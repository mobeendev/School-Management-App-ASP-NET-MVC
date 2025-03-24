using Microsoft.EntityFrameworkCore;
using SchoolManagementApp.Data;
using SchoolManagementApp.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolManagementApp.Repositories
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
            return await _context.Lecturers.ToListAsync();
        }

        public async Task<Lecturer> GetByIdAsync(int id)
        {
            return await _context.Lecturers.FindAsync(id);
        }

        public async Task<Lecturer> AddAsync(Lecturer lecturer)
        {
            await _context.Lecturers.AddAsync(lecturer);
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
            return await _context.Lecturers.AnyAsync(e => e.Id == id);
        }

        public async Task<IEnumerable<Lecturer>> GetAllLecturersWithDetailsAsync()
        {
            return await _context.Lecturers
                .Include(l => l.User)
                .ToListAsync();
        }

        public async Task<Lecturer> GetLecturerWithDetailsAsync(int id)
        {
            return await _context.Lecturers
                .Include(l => l.User)
                .FirstOrDefaultAsync(m => m.Id == id);
        }
    }
} 