using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementApp.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;

namespace SchoolManagementApp.Controllers.APIs
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class CoursesController : ControllerBase
    {
        private readonly SchoolManagementDbContext _context;

        public CoursesController(SchoolManagementDbContext context)
        {
            _context = context;
        }

        // GET: api/courses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Course>>> GetCourses()
        {
            if (_context.Courses == null)
            {
                return NotFound("Courses not found.");
            }

            var courses = await _context.Courses.ToListAsync();
            return Ok(courses); // Returns JSON response
        }

        // 📌 GET: api/courses/{id} - Get a single course by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Course>> GetCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);

            if (course == null)
            {
                return BadRequest(new { Status = "Error", Message = "Course not found." });
            }

            return Ok(course);
        }

        [HttpPost]
        public async Task<ActionResult<Course>> CreateCourse([FromBody] Course course)
        {
            if (string.IsNullOrWhiteSpace(course.Name))
            {
                return BadRequest("Course name is required.");
            }

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCourse), new { id = course.Id }, course);
        }

        // 📌 PUT: api/courses/{id} - Update an existing course
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCourse(int id, [FromBody] Course updatedCourse)
        {
            var existingCourse = await _context.Courses.FindAsync(id);
            if (existingCourse == null)
            {
                return NotFound("Course not found.");
            }

            // Update fields without checking body ID
            existingCourse.Name = updatedCourse.Name;
            existingCourse.Code = updatedCourse.Code;
            existingCourse.Credits = updatedCourse.Credits;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // 📌 DELETE: api/courses/{id} - Delete a course
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
            {
                return NotFound("Course not found.");
            }

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}