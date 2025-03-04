using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using SchoolManagementApp.Data;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;


namespace SchoolManagementApp.Controllers
{
    [Authorize]
    public class AttendanceController : Controller
    {
        private readonly SchoolManagementDbContext _context;

        public AttendanceController(SchoolManagementDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            ViewData["Courses"] = new SelectList(await _context.Courses.ToListAsync(), "Id", "Name");
            ViewData["Semesters"] = new SelectList(
                _context.Semesters.Select(l => new
                {
                    Id = l.Id,
                    DisplayValue = l.Type + " (" + l.StartDate.ToString("yyyy-MM-dd") + " - " + l.EndDate.ToString("yyyy-MM-dd") + ")"
                }),
                "Id",
                "DisplayValue"
            );

            return View();
        }

        [HttpGet]
        public async Task<JsonResult> GetClasses(int courseId, int semesterId)
        {
            var classes = await _context.Classes
                .Where(c => c.CourseId == courseId && c.SemesterId == semesterId)
                .Include(c => c.Lecturer)
                .Include(c => c.Course)
                .Select(c => new
                {
                    c.Id,
                    c.SemesterId,  // Added SemesterId
                    Name = $"Class {c.Course.Code} by {c.Lecturer.Id} {c.Lecturer.Id}"
                })
                .ToListAsync();

            if (!classes.Any())
            {
                return Json(new { message = "Class not found", success = false });
            }

            return Json(classes);
        }

        [HttpGet]
        public async Task<JsonResult> GetStudents(int classId, DateTime? date)
        {
            if (!date.HasValue)
            {
                date = DateTime.UtcNow.Date; // Default to today if no date is provided
            }

            var students = await _context.Enrollments
                .Where(e => e.ClassId == classId)
                .Include(e => e.Class)
                        .ThenInclude(c => c.Course) // Include Course details
                .Include(e => e.Class)
                    .ThenInclude(c => c.Lecturer) // Include Lecturer
                        .ThenInclude(l => l.User) // Include ApplicationUser for FirstName & LastName
                .Include(e => e.Student)
                .Include(e => e.Semester)
                .Select(e => new
                {
                    e.Student.Id,
                    FullName = e.Student.FirstName + " " + e.Student.LastName,
                    SemesterInfo = e.Semester.Type + "(" + e.Semester.StartDate.ToString("yyyy-MM") + ")-(" + e.Semester.EndDate.ToString("yyyy-MM") + ")",
                    ClassName = $"{e.Class.Course.Code} by {e.Class.Lecturer.User.FirstName} {e.Class.Lecturer.User.LastName}",
                    Attendance = _context.Attendances
                        .Where(a => a.StudentId == e.Student.Id && a.ClassId == classId && a.SemesterId == e.SemesterId && a.Date.Date == date.Value.Date)
                        .Select(a => new { a.IsPresent })
                        .FirstOrDefault()
                })
                .ToListAsync();

            if (!students.Any())
            {
                return Json(new { success = false, message = "No students found for the selected class and date." });
            }

            return Json(students);
        }

        [HttpPost]
        [HttpPost]
        public async Task<IActionResult> MarkAttendance(int studentId, int classId, int semesterId, bool isPresent, DateTime? date)
        {
            if (!date.HasValue)
            {
                return Json(new { success = false, message = "Date is required." });
            }

            var normalizedDate = date.Value.Date;
            var threeHoursAgo = DateTime.UtcNow.AddHours(-3);

            var attendance = await _context.Attendances
                .FirstOrDefaultAsync(a => a.StudentId == studentId
                                       && a.ClassId == classId
                                       && a.SemesterId == semesterId
                                       && a.Date.Date == normalizedDate);

            if (attendance != null)
            {
                // For existing records, only update if within 3-hour window from original timestamp
                if (attendance.Date >= threeHoursAgo)
                {
                    attendance.IsPresent = isPresent;
                    _context.Attendances.Update(attendance);
                }
                else
                {
                    return Json(new { success = false, message = "Attendance can only be updated within 3 hours of marking." });
                }
            }
            else
            {
                // For new records: Store full datetime if today, date-only if past/future
                var currentDate = DateTime.UtcNow;
                var storeDate = normalizedDate == currentDate.Date
                    ? currentDate // Include current time for today
                    : normalizedDate; // Store only date for other days

                attendance = new Attendance
                {
                    StudentId = studentId,
                    ClassId = classId,
                    SemesterId = semesterId,
                    Date = storeDate,
                    IsPresent = isPresent
                };
                _context.Attendances.Add(attendance);
            }

            await _context.SaveChangesAsync();
            return Json(new { success = true });
        }
    }
}