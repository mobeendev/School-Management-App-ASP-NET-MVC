using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Models.Entities;
using SchoolManagement.Repositories.Interfaces;
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
        private readonly IEnrollmentRepository _enrollmentRepository;

        public EnrollmentsController(IEnrollmentRepository enrollmentRepository)
        {
            _enrollmentRepository = enrollmentRepository;
        }

        /// <summary>
        /// Gets all enrollments
        /// </summary>
        /// <returns>List of all enrollments</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Enrollment>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll()
        {
            var enrollments = await _enrollmentRepository.GetAllAsync();
            return Ok(enrollments);
        }

        /// <summary>
        /// Gets an enrollment by ID
        /// </summary>
        /// <param name="id">Enrollment ID</param>
        /// <returns>Enrollment details</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Enrollment), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var enrollment = await _enrollmentRepository.GetByIdAsync(id);
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
        [ProducesResponseType(typeof(IEnumerable<Enrollment>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByStudentId(int studentId)
        {
            var enrollments = await _enrollmentRepository.GetByStudentIdAsync(studentId);
            return Ok(enrollments);
        }

        /// <summary>
        /// Gets enrollments by class ID
        /// </summary>
        /// <param name="classId">Class ID</param>
        /// <returns>List of enrollments for the class</returns>
        [HttpGet("class/{classId}")]
        [ProducesResponseType(typeof(IEnumerable<Enrollment>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByClassId(int classId)
        {
            var enrollments = await _enrollmentRepository.GetByClassIdAsync(classId);
            return Ok(enrollments);
        }

        /// <summary>
        /// Creates a new enrollment
        /// </summary>
        /// <param name="enrollment">Enrollment data</param>
        /// <returns>Created enrollment</returns>
        [HttpPost]
        [ProducesResponseType(typeof(Enrollment), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] Enrollment enrollment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdEnrollment = await _enrollmentRepository.AddAsync(enrollment);
            return CreatedAtAction(nameof(GetById), new { id = createdEnrollment.Id }, createdEnrollment);
        }

        /// <summary>
        /// Updates an existing enrollment
        /// </summary>
        /// <param name="id">Enrollment ID</param>
        /// <param name="enrollment">Updated enrollment data</param>
        /// <returns>No content if successful</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] Enrollment enrollment)
        {
            if (id != enrollment.Id)
            {
                return BadRequest("ID mismatch");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!await _enrollmentRepository.ExistsAsync(id))
            {
                return NotFound();
            }

            await _enrollmentRepository.UpdateAsync(enrollment);
            return NoContent();
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
            var enrollment = await _enrollmentRepository.GetByIdAsync(id);
            if (enrollment == null)
            {
                return NotFound();
            }

            await _enrollmentRepository.DeleteAsync(enrollment);
            return NoContent();
        }
    }
}