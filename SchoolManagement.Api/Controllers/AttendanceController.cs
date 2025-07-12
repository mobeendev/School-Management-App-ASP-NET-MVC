using Microsoft.AspNetCore.Mvc;
using SchoolManagement.Models.Entities;
using SchoolManagement.Repositories.Interfaces;
using Asp.Versioning;

namespace SchoolManagement.Api.Controllers
{
    /// <summary>
    /// Controller for managing attendance records
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class AttendanceController : ControllerBase
    {
        private readonly IAttendanceRepository _attendanceRepository;

        public AttendanceController(IAttendanceRepository attendanceRepository)
        {
            _attendanceRepository = attendanceRepository;
        }

        /// <summary>
        /// Gets all attendance records
        /// </summary>
        /// <returns>List of all attendance records</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Attendance>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll()
        {
            var attendanceRecords = await _attendanceRepository.GetAllAsync();
            return Ok(attendanceRecords);
        }

        /// <summary>
        /// Gets an attendance record by ID
        /// </summary>
        /// <param name="id">Attendance ID</param>
        /// <returns>Attendance details</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Attendance), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var attendance = await _attendanceRepository.GetByIdAsync(id);
            if (attendance == null)
            {
                return NotFound();
            }

            return Ok(attendance);
        }

        /// <summary>
        /// Gets attendance records by student ID
        /// </summary>
        /// <param name="studentId">Student ID</param>
        /// <returns>List of attendance records for the student</returns>
        [HttpGet("student/{studentId}")]
        [ProducesResponseType(typeof(IEnumerable<Attendance>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByStudentId(int studentId)
        {
            var attendanceRecords = await _attendanceRepository.GetByStudentIdAsync(studentId);
            return Ok(attendanceRecords);
        }

        /// <summary>
        /// Gets attendance records by class ID
        /// </summary>
        /// <param name="classId">Class ID</param>
        /// <returns>List of attendance records for the class</returns>
        [HttpGet("class/{classId}")]
        [ProducesResponseType(typeof(IEnumerable<Attendance>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByClassId(int classId)
        {
            var attendanceRecords = await _attendanceRepository.GetByClassIdAsync(classId);
            return Ok(attendanceRecords);
        }

        /// <summary>
        /// Gets attendance record by student, class, and date
        /// </summary>
        /// <param name="studentId">Student ID</param>
        /// <param name="classId">Class ID</param>
        /// <param name="semesterId">Semester ID</param>
        /// <param name="date">Date (yyyy-MM-dd format)</param>
        /// <returns>Attendance record for the specific criteria</returns>
        [HttpGet("student/{studentId}/class/{classId}/semester/{semesterId}/date/{date}")]
        [ProducesResponseType(typeof(Attendance), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetByStudentClassDate(int studentId, int classId, int semesterId, DateTime date)
        {
            var attendance = await _attendanceRepository.GetByStudentClassDateAsync(studentId, classId, semesterId, date);
            if (attendance == null)
            {
                return NotFound();
            }
            return Ok(attendance);
        }

        /// <summary>
        /// Creates a new attendance record
        /// </summary>
        /// <param name="attendance">Attendance data</param>
        /// <returns>Created attendance record</returns>
        [HttpPost]
        [ProducesResponseType(typeof(Attendance), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] Attendance attendance)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdAttendance = await _attendanceRepository.AddAsync(attendance);
            return CreatedAtAction(nameof(GetById), new { id = createdAttendance.Id }, createdAttendance);
        }

        /// <summary>
        /// Updates an existing attendance record
        /// </summary>
        /// <param name="id">Attendance ID</param>
        /// <param name="attendance">Updated attendance data</param>
        /// <returns>No content if successful</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] Attendance attendance)
        {
            if (id != attendance.Id)
            {
                return BadRequest("ID mismatch");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!await _attendanceRepository.ExistsAsync(id))
            {
                return NotFound();
            }

            await _attendanceRepository.UpdateAsync(attendance);
            return NoContent();
        }

        /// <summary>
        /// Deletes an attendance record
        /// </summary>
        /// <param name="id">Attendance ID</param>
        /// <returns>No content if successful</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            var attendance = await _attendanceRepository.GetByIdAsync(id);
            if (attendance == null)
            {
                return NotFound();
            }

            await _attendanceRepository.DeleteAsync(attendance);
            return NoContent();
        }
    }
}