using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementApp.Data;
using System;
using System.Linq;
using System.Threading.Tasks;
using SchoolManagementApp.Models;
namespace SchoolManagementApp.Controllers
{
    public class ReportsController : BaseController
    {
        private readonly SchoolManagementDbContext _context;

        public ReportsController(SchoolManagementDbContext context)
        {
            _context = context;
        }


        public async Task<IActionResult> Index(int? semesterId, int? classId, int? courseId)
        {
            // Load dropdown data (unchanged)
            ViewBag.Semesters = await _context.Semesters.ToListAsync();
            ViewBag.SelectedSemester = semesterId;
            ViewBag.SelectedCourseId = courseId;
            ViewBag.SelectedClassId = classId;

            // Build the query with eager loading
            IQueryable<Attendance> query = _context.Attendances
                .Include(a => a.Student)
                .Include(a => a.Class)
                    .ThenInclude(c => c.Course)
                .Include(a => a.Semester);

            // Apply filters 
            if (semesterId.HasValue) query = query.Where(a => a.SemesterId == semesterId);
            if (classId.HasValue) query = query.Where(a => a.ClassId == classId);
            if (courseId.HasValue) query = query.Where(a => a.Class.CourseId == courseId);

            // Project entities into the ViewModel
            var attendances = await query
                .Select(a => new AttendanceViewModel
                {
                    AttendanceId = a.Id,
                    StudentName = $"{a.Student.FirstName} {a.Student.LastName}",
                    CourseName = a.Class.Course.Name,
                    CourseCode = a.Class.Course.Code,
                    ClassName = $"Class {a.Class.Id}",
                    Semester = $"{a.Semester.Type} {a.Semester.StartDate.Year}",
                    Date = a.Date,
                    IsPresent = a.IsPresent
                })
                .ToListAsync();

            return View(attendances); // Pass ViewModel to the view
        }

        [HttpGet]
        public async Task<IActionResult> GetCoursesBySemester(int semesterId)
        {
            var courses = await _context.Classes
                .Where(c => c.SemesterId == semesterId)
                .Select(c => c.Course) // Select Course from Class
                .Distinct()
                .Select(course => new { course.Id, course.Name })
                .ToListAsync();

            return Json(courses);
        }

        [HttpGet]
        public async Task<IActionResult> GetClassesByCourseAndSemester(int courseId, int semesterId)
        {
            var classes = await _context.Classes
                .Where(c => c.CourseId == courseId && c.SemesterId == semesterId)
                .Select(c => new { c.Id, Name = $"Class {c.Id}" })
                .ToListAsync();

            return Json(classes);
        }


        [HttpGet]
        public async Task<IActionResult> GetLecturersByCourseAndClass(int courseId, int semesterId)
        {
            var lecturers = await _context.Classes
                .Where(c => c.CourseId == courseId && c.SemesterId == semesterId)
                .Select(c => new { Id = c.Lecturer.Id, Name = $"{c.Lecturer.FirstName} {c.Lecturer.LastName}" })
                .Distinct()
                .ToListAsync();
            return Json(lecturers);
        }

        [HttpGet]
        public async Task<IActionResult> GetCourseByClass(int classId)
        {
            var course = await _context.Classes
                .Where(c => c.Id == classId)
                .Select(c => new { Id = c.Course.Id, Name = c.Course.Name })
                .FirstOrDefaultAsync();
            return Json(course);
        }

        [HttpGet]
        public async Task<IActionResult> GetLecturersByCourse(int courseId, int semesterId)
        {
            var lecturers = await _context.Classes
                .Where(c => c.CourseId == courseId && c.SemesterId == semesterId)
                .Select(c => new { Id = c.Lecturer.Id, Name = $"{c.Lecturer.FirstName} {c.Lecturer.LastName}" })
                .Distinct()
                .ToListAsync();
            return Json(lecturers);
        }

        [HttpGet]
        public async Task<IActionResult> GetStudentsByLecturer(int lecturerId, int courseId, int semesterId)
        {
            var students = await _context.Enrollments
                .Where(e => e.Class.LecturerId == lecturerId &&
                           e.Class.CourseId == courseId &&
                           e.SemesterId == semesterId)
                .Select(e => new
                {
                    Id = e.Student.Id,
                    Name = $"{e.Student.FirstName} {e.Student.LastName}"
                })
                .Distinct()
                .ToListAsync();
            return Json(students);
        }


    }
}
