using Microsoft.EntityFrameworkCore;
using SchoolManagement.Models.Entities;
using SchoolManagement.Repositories.Context;
using SchoolManagement.Repositories.Interfaces;

namespace SchoolManagement.Repositories.Implementations
{
    public class EnrollmentRepository : IEnrollmentRepository
    {
        private readonly SchoolManagementDbContext _context;

        public EnrollmentRepository(SchoolManagementDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Enrollment>> GetAllAsync()
        {
            return await _context.Enrollments
                .Include(e => e.Student)
                .Include(e => e.Class)
                .ThenInclude(c => c!.Course)
                .Include(e => e.Semester)
                .ToListAsync();
        }

        public async Task<Enrollment?> GetByIdAsync(int id)
        {
            return await _context.Enrollments
                .Include(e => e.Student)
                .Include(e => e.Class)
                .ThenInclude(c => c!.Course)
                .Include(e => e.Semester)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<Enrollment> AddAsync(Enrollment enrollment)
        {
            _context.Enrollments.Add(enrollment);
            await _context.SaveChangesAsync();
            return enrollment;
        }

        public async Task UpdateAsync(Enrollment enrollment)
        {
            _context.Entry(enrollment).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Enrollment enrollment)
        {
            _context.Enrollments.Remove(enrollment);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Enrollments.AnyAsync(e => e.Id == id);
        }

        public async Task<IEnumerable<Enrollment>> GetByStudentIdAsync(int studentId)
        {
            return await _context.Enrollments
                .Where(e => e.StudentId == studentId)
                .Include(e => e.Class)
                .ThenInclude(c => c!.Course)
                .Include(e => e.Semester)
                .ToListAsync();
        }

        public async Task<IEnumerable<Enrollment>> GetByClassIdAsync(int classId)
        {
            return await _context.Enrollments
                .Where(e => e.ClassId == classId)
                .Include(e => e.Student)
                .Include(e => e.Semester)
                .ToListAsync();
        }
    }
}