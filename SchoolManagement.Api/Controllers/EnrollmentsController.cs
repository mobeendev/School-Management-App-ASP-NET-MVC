using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Models.DTOs;
using SchoolManagement.Services.Interfaces;
using Asp.Versioning;

namespace SchoolManagement.Api.Controllers
{
    /// <summary>
    /// Controller for managing enrollments
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class EnrollmentsController : ControllerBase
    {
        private readonly IEnrollmentService _enrollmentService;

        public EnrollmentsController(IEnrollmentService enrollmentService)
        {
            _enrollmentService = enrollmentService;
        }

        /// <summary>
        /// Gets all enrollments
        /// </summary>
        /// <returns>List of all enrollments</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<EnrollmentDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll()
        {
            var enrollments = await _enrollmentService.GetAllAsync();
            return Ok(enrollments);
        }

        /// <summary>
        /// Gets an enrollment by ID
        /// </summary>
        /// <param name="id">Enrollment ID</param>
        /// <returns>Enrollment details</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(EnrollmentDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var enrollment = await _enrollmentService.GetByIdAsync(id);
            if (enrollment == null)
            {
                return NotFound();
            }

            return Ok(enrollment);
        }

        /// <summary>
        /// Gets enrollments by student ID
        /// </summary>
        /// <param name="studentId">Student ID</param>
        /// <returns>List of enrollments for the student</returns>
        [HttpGet("student/{studentId}")]
        [ProducesResponseType(typeof(IEnumerable<EnrollmentDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByStudentId(int studentId)
        {
            var enrollments = await _enrollmentService.GetByStudentIdAsync(studentId);
            return Ok(enrollments);
        }

        /// <summary>
        /// Gets enrollments by class ID
        /// </summary>
        /// <param name="classId">Class ID</param>
        /// <returns>List of enrollments for the class</returns>
        [HttpGet("class/{classId}")]
        [ProducesResponseType(typeof(IEnumerable<EnrollmentDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByClassId(int classId)
        {
            var enrollments = await _enrollmentService.GetByClassIdAsync(classId);
            return Ok(enrollments);
        }

        /// <summary>
        /// Creates a new enrollment
        /// </summary>
        /// <param name="createEnrollmentDto">Enrollment data</param>
        /// <returns>Created enrollment</returns>
        [HttpPost]
        [ProducesResponseType(typeof(EnrollmentDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateEnrollmentDto createEnrollmentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdEnrollment = await _enrollmentService.CreateAsync(createEnrollmentDto);
            return CreatedAtAction(nameof(GetById), new { id = createdEnrollment.Id }, createdEnrollment);
        }

        /// <summary>
        /// Updates an existing enrollment
        /// </summary>
        /// <param name="id">Enrollment ID</param>
        /// <param name="updateEnrollmentDto">Updated enrollment data</param>
        /// <returns>Updated enrollment</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(EnrollmentDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateEnrollmentDto updateEnrollmentDto)
        {
            if (id != updateEnrollmentDto.Id)
            {
                return BadRequest("ID mismatch");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updatedEnrollment = await _enrollmentService.UpdateAsync(updateEnrollmentDto);
                return Ok(updatedEnrollment);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        /// <summary>
        /// Deletes an enrollment
        /// </summary>
        /// <param name="id">Enrollment ID</param>
        /// <returns>No content if successful</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _enrollmentService.DeleteAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}