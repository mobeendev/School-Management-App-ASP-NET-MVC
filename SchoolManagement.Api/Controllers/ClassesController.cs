using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Models.DTOs;
using SchoolManagement.Services.Interfaces;
using Asp.Versioning;

namespace SchoolManagement.Api.Controllers
{
    /// <summary>
    /// Controller for managing classes
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class ClassesController : ControllerBase
    {
        private readonly IClassService _classService;

        public ClassesController(IClassService classService)
        {
            _classService = classService;
        }

        /// <summary>
        /// Gets all classes
        /// </summary>
        /// <returns>List of all classes</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<ClassDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll()
        {
            var classes = await _classService.GetAllClassesAsync();
            return Ok(classes);
        }

        /// <summary>
        /// Gets a class by ID
        /// </summary>
        /// <param name="id">Class ID</param>
        /// <returns>Class details</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ClassDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var classDto = await _classService.GetClassByIdAsync(id);
            if (classDto == null)
            {
                return NotFound();
            }

            return Ok(classDto);
        }

        /// <summary>
        /// Creates a new class
        /// </summary>
        /// <param name="createClassDto">Class creation data</param>
        /// <returns>Created class</returns>
        [HttpPost]
        [ProducesResponseType(typeof(ClassDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateClassDto createClassDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdClass = await _classService.CreateClassAsync(createClassDto);
            return CreatedAtAction(nameof(GetById), new { id = createdClass.Id }, createdClass);
        }

        /// <summary>
        /// Updates an existing class
        /// </summary>
        /// <param name="id">Class ID</param>
        /// <param name="updateClassDto">Class update data</param>
        /// <returns>Updated class</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ClassDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateClassDto updateClassDto)
        {
            if (id != updateClassDto.Id)
            {
                return BadRequest("ID mismatch");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingClass = await _classService.GetClassByIdAsync(id);
            if (existingClass == null)
            {
                return NotFound();
            }

            var updatedClass = await _classService.UpdateClassAsync(updateClassDto);
            return Ok(updatedClass);
        }

        /// <summary>
        /// Deletes a class
        /// </summary>
        /// <param name="id">Class ID</param>
        /// <returns>No content if successful</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _classService.DeleteClassAsync(id);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}