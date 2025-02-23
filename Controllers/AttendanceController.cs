using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using SchoolManagementApp.Data;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SchoolManagementApp.Controllers
{
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
                 .Select(c => new { c.Id, Name = $"Class {c.Course.Code} by {c.Lecturer.FirstName} {c.Lecturer.LastName}  " })
                .ToListAsync();


            if (classes == null || classes.Count == 0)
            {
                var data = new
                {
                    message = "Class not found",
                    success = false
                };

                return Json(data);
            }

            return Json(classes);

        }

        [HttpGet]
        public async Task<JsonResult> GetStudents(int classId)
        {
            var students = await _context.Enrollments
                .Where(e => e.ClassId == classId)
               .Include(e => e.Class)
                    .ThenInclude(e => e.Course)

                .Select(e => new
                {
                    e.Student.Id,
                    FullName = e.Student.FirstName + " " + e.Student.LastName,
                    SemesterType = e.Semester.Type,
                    ClassName = $"{e.Class.Course.Code} by {e.Class.Lecturer.FirstName} {e.Class.Lecturer.LastName}  "
                })
                .ToListAsync();

            if (students == null || students.Count == 0)
            {
                var data = new
                {
                    message = "Students not found",
                    success = false
                };

                return Json(data);
            }
            return Json(students);
        }

        [HttpPost]
        public async Task<IActionResult> MarkAttendance(int studentId, int classId, int semesterId, bool isPresent)
        {
            var date = DateTime.UtcNow.Date;
            var attendance = await _context.Attendances
                .FirstOrDefaultAsync(a => a.StudentId == studentId
                                       && a.ClassId == classId
                                       && a.SemesterId == semesterId
                                       && a.Date == date);

            if (attendance != null)
            {
                // Update the existing record
                attendance.IsPresent = isPresent;
                _context.Attendances.Update(attendance);
            }
            else
            {
                // Insert a new record
                attendance = new Attendance
                {
                    StudentId = studentId,
                    ClassId = classId,
                    SemesterId = semesterId,
                    Date = date,
                    IsPresent = isPresent
                };
                _context.Attendances.Add(attendance);
            }

            await _context.SaveChangesAsync();
            return Json(new { success = true });
        }
    }
}
