using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Models.DTOs;
using SchoolManagement.Services.Interfaces;
using Asp.Versioning;

namespace SchoolManagement.Api.Controllers
{
    /// <summary>
    /// Controller for managing courses
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class CoursesController : ControllerBase
    {
        private readonly ICourseService _courseService;

        public CoursesController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        /// <summary>
        /// Gets all courses
        /// </summary>
        /// <returns>List of all courses</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<CourseDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll()
        {
            var courses = await _courseService.GetAllCoursesAsync();
            return Ok(courses);
        }

        /// <summary>
        /// Gets a course by ID
        /// </summary>
        /// <param name="id">Course ID</param>
        /// <returns>Course details</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(CourseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var course = await _courseService.GetCourseByIdAsync(id);
            if (course == null)
            {
                return NotFound();
            }

            return Ok(course);
        }

        /// <summary>
        /// Creates a new course
        /// </summary>
        /// <param name="courseDto">Course data</param>
        /// <returns>Created course</returns>
        [HttpPost]
        [ProducesResponseType(typeof(CourseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CourseDto courseDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdCourse = await _courseService.CreateCourseAsync(courseDto);
            return CreatedAtAction(nameof(GetById), new { id = createdCourse.Id }, createdCourse);
        }

        /// <summary>
        /// Updates an existing course
        /// </summary>
        /// <param name="id">Course ID</param>
        /// <param name="courseDto">Updated course data</param>
        /// <returns>Updated course</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(CourseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] CourseDto courseDto)
        {
            if (id != courseDto.Id)
            {
                return BadRequest("ID mismatch");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updatedCourse = await _courseService.UpdateCourseAsync(courseDto);
                return Ok(updatedCourse);
            }
            catch (Exception)
            {
                if (!await _courseService.CourseExistsAsync(courseDto.Id))
                {
                    return NotFound();
                }
                throw;
            }
        }

        /// <summary>
        /// Deletes a course
        /// </summary>
        /// <param name="id">Course ID</param>
        /// <returns>No content if successful</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _courseService.DeleteCourseAsync(id);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}