using Microsoft.EntityFrameworkCore;
using SchoolManagement.Models.Entities;
using SchoolManagement.Repositories.Context;
using SchoolManagement.Repositories.Interfaces;

namespace SchoolManagement.Repositories.Implementations
{
    public class CourseRepository : ICourseRepository
    {
        private readonly SchoolManagementDbContext _context;

        public CourseRepository(SchoolManagementDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Course>> GetAllAsync()
        {
            return await _context.Courses.ToListAsync();
        }

        public async Task<Course?> GetByIdAsync(int id)
        {
            return await _context.Courses.FindAsync(id);
        }

        public async Task<Course> AddAsync(Course course)
        {
            _context.Courses.Add(course);
            await _context.SaveChangesAsync();
            return course;
        }

        public async Task UpdateAsync(Course course)
        {
            _context.Entry(course).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Course course)
        {
            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Courses.AnyAsync(e => e.Id == id);
        }
    }
}