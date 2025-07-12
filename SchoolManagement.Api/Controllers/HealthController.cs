using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagement.Repositories.Context;

namespace SchoolManagement.Api.Controllers
{
    /// <summary>
    /// Health check controller for API and database connectivity
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class HealthController : ControllerBase
    {
        private readonly SchoolManagementDbContext _context;

        public HealthController(SchoolManagementDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Basic health check endpoint
        /// </summary>
        /// <returns>API status</returns>
        [HttpGet]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        public IActionResult Get()
        {
            return Ok(new { status = "API is running", timestamp = DateTime.UtcNow });
        }

        /// <summary>
        /// Database connectivity check
        /// </summary>
        /// <returns>Database connection status</returns>
        [HttpGet("database")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DatabaseCheck()
        {
            try
            {
                var canConnect = await _context.Database.CanConnectAsync();
                var studentsCount = await _context.Students.CountAsync();
                var coursesCount = await _context.Courses.CountAsync();
                
                return Ok(new 
                { 
                    status = "Database connection successful",
                    canConnect = canConnect,
                    studentsCount = studentsCount,
                    coursesCount = coursesCount,
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new 
                { 
                    status = "Database connection failed",
                    error = ex.Message,
                    timestamp = DateTime.UtcNow
                });
            }
        }
    }
}