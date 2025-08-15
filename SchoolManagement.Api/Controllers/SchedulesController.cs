using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Models.DTOs;
using SchoolManagement.Services.Interfaces;

namespace SchoolManagement.Api.Controllers
{
    /// <summary>
    /// Controller for managing class schedules
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class SchedulesController : ControllerBase
    {
        private readonly IScheduleService _scheduleService;

        public SchedulesController(IScheduleService scheduleService)
        {
            _scheduleService = scheduleService;
        }

        /// <summary>
        /// Gets all schedules
        /// </summary>
        /// <returns>List of all schedules</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<ScheduleDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll()
        {
            var schedules = await _scheduleService.GetAllSchedulesAsync();
            return Ok(schedules);
        }

        /// <summary>
        /// Gets a schedule by ID
        /// </summary>
        /// <param name="id">Schedule ID</param>
        /// <returns>Schedule details</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ScheduleDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var schedule = await _scheduleService.GetScheduleByIdAsync(id);
            if (schedule == null)
            {
                return NotFound();
            }

            return Ok(schedule);
        }

        /// <summary>
        /// Gets schedules by class ID
        /// </summary>
        /// <param name="classId">Class ID</param>
        /// <returns>List of schedules for the class</returns>
        [HttpGet("class/{classId}")]
        [ProducesResponseType(typeof(IEnumerable<ScheduleDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByClassId(int classId)
        {
            var schedules = await _scheduleService.GetSchedulesByClassIdAsync(classId);
            return Ok(schedules);
        }

        /// <summary>
        /// Gets schedules by lecturer ID
        /// </summary>
        /// <param name="lecturerId">Lecturer ID</param>
        /// <returns>List of schedules for the lecturer</returns>
        [HttpGet("lecturer/{lecturerId}")]
        [ProducesResponseType(typeof(IEnumerable<ScheduleDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByLecturerId(int lecturerId)
        {
            var schedules = await _scheduleService.GetSchedulesByLecturerIdAsync(lecturerId);
            return Ok(schedules);
        }

        /// <summary>
        /// Creates a new schedule
        /// </summary>
        /// <param name="createScheduleDto">Schedule data</param>
        /// <returns>Created schedule</returns>
        [HttpPost]
        [ProducesResponseType(typeof(ScheduleDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateScheduleDto createScheduleDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var createdSchedule = await _scheduleService.CreateScheduleAsync(createScheduleDto);
                return CreatedAtAction(nameof(GetById), new { id = createdSchedule.Id }, createdSchedule);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Updates an existing schedule
        /// </summary>
        /// <param name="id">Schedule ID</param>
        /// <param name="updateScheduleDto">Updated schedule data</param>
        /// <returns>Updated schedule</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ScheduleDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateScheduleDto updateScheduleDto)
        {
            if (id != updateScheduleDto.Id)
            {
                return BadRequest("ID mismatch");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                if (!await _scheduleService.ScheduleExistsAsync(id))
                {
                    return NotFound();
                }

                var updatedSchedule = await _scheduleService.UpdateScheduleAsync(updateScheduleDto);
                return Ok(updatedSchedule);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Deletes a schedule
        /// </summary>
        /// <param name="id">Schedule ID</param>
        /// <returns>No content if successful</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _scheduleService.DeleteScheduleAsync(id);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}