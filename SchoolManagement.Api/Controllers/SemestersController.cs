using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Models.DTOs;
using SchoolManagement.Services.Interfaces;

namespace SchoolManagement.Api.Controllers
{
    /// <summary>
    /// Controller for managing semesters
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Require authentication for all semester operations
    [Produces("application/json")]
    public class SemestersController : ControllerBase
    {
        private readonly ISemesterService _semesterService;

        public SemestersController(ISemesterService semesterService)
        {
            _semesterService = semesterService;
        }

        /// <summary>
        /// Gets all semesters
        /// </summary>
        /// <returns>List of all semesters</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<SemesterDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll()
        {
            var semesters = await _semesterService.GetAllSemestersAsync();
            return Ok(semesters);
        }

        /// <summary>
        /// Gets a semester by ID
        /// </summary>
        /// <param name="id">Semester ID</param>
        /// <returns>Semester details</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(SemesterDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var semester = await _semesterService.GetSemesterByIdAsync(id);
            if (semester == null)
            {
                return NotFound();
            }

            return Ok(semester);
        }

        /// <summary>
        /// Creates a new semester
        /// </summary>
        /// <param name="createSemesterDto">Semester data</param>
        /// <returns>Created semester</returns>
        [HttpPost]
        [Authorize(Roles = "Admin")] // Only admins can create semesters
        [ProducesResponseType(typeof(SemesterDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateSemesterDto createSemesterDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdSemester = await _semesterService.CreateSemesterAsync(createSemesterDto);
            return CreatedAtAction(nameof(GetById), new { id = createdSemester.Id }, createdSemester);
        }

        /// <summary>
        /// Updates an existing semester
        /// </summary>
        /// <param name="id">Semester ID</param>
        /// <param name="updateSemesterDto">Updated semester data</param>
        /// <returns>Updated semester</returns>
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")] // Only admins can update semesters
        [ProducesResponseType(typeof(SemesterDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateSemesterDto updateSemesterDto)
        {
            if (id != updateSemesterDto.Id)
            {
                return BadRequest("ID mismatch");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updatedSemester = await _semesterService.UpdateSemesterAsync(updateSemesterDto);
                return Ok(updatedSemester);
            }
            catch (Exception)
            {
                if (!await _semesterService.SemesterExistsAsync(updateSemesterDto.Id))
                {
                    return NotFound();
                }
                throw;
            }
        }

        /// <summary>
        /// Deletes a semester
        /// </summary>
        /// <param name="id">Semester ID</param>
        /// <returns>No content if successful</returns>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // Only admins can delete semesters
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _semesterService.DeleteSemesterAsync(id);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}