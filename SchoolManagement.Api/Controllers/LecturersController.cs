using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Models.DTOs;
using SchoolManagement.Services.Interfaces;
using Asp.Versioning;

namespace SchoolManagement.Api.Controllers
{
    /// <summary>
    /// Controller for managing lecturers
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class LecturersController : ControllerBase
    {
        private readonly ILecturerService _lecturerService;

        public LecturersController(ILecturerService lecturerService)
        {
            _lecturerService = lecturerService;
        }

        /// <summary>
        /// Gets all lecturers
        /// </summary>
        /// <returns>List of all lecturers</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<LecturerDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll()
        {
            var lecturers = await _lecturerService.GetAllLecturersAsync();
            return Ok(lecturers);
        }

        /// <summary>
        /// Gets a lecturer by ID
        /// </summary>
        /// <param name="id">Lecturer ID</param>
        /// <returns>Lecturer details</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(LecturerDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var lecturer = await _lecturerService.GetLecturerByIdAsync(id);
            if (lecturer == null)
            {
                return NotFound();
            }

            return Ok(lecturer);
        }

        /// <summary>
        /// Creates a new lecturer
        /// </summary>
        /// <param name="lecturerDto">Lecturer data</param>
        /// <returns>Created lecturer</returns>
        [HttpPost]
        [ProducesResponseType(typeof(LecturerDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] LecturerDto lecturerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdLecturer = await _lecturerService.CreateLecturerAsync(lecturerDto);
            return CreatedAtAction(nameof(GetById), new { id = createdLecturer.Id }, createdLecturer);
        }

        /// <summary>
        /// Updates an existing lecturer
        /// </summary>
        /// <param name="id">Lecturer ID</param>
        /// <param name="lecturerDto">Updated lecturer data</param>
        /// <returns>Updated lecturer</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(LecturerDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] LecturerDto lecturerDto)
        {
            if (id != lecturerDto.Id)
            {
                return BadRequest("ID mismatch");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updatedLecturer = await _lecturerService.UpdateLecturerAsync(lecturerDto);
                return Ok(updatedLecturer);
            }
            catch (Exception)
            {
                if (!await _lecturerService.LecturerExistsAsync(lecturerDto.Id))
                {
                    return NotFound();
                }
                throw;
            }
        }

        /// <summary>
        /// Deletes a lecturer
        /// </summary>
        /// <param name="id">Lecturer ID</param>
        /// <returns>No content if successful</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _lecturerService.DeleteLecturerAsync(id);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}