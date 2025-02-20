using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementApp.Data;
using System;
using System.Linq;
using System.Threading.Tasks;
using SchoolManagementApp.Models;
namespace SchoolManagementApp.Controllers
{
    public class AttendanceController : BaseController
    {
        private readonly SchoolManagementDbContext _context;

        public AttendanceController(SchoolManagementDbContext context)
        {
            _context = context;
        }


        public async Task<IActionResult> Index(int? semesterId, int? lecturerId, int? courseId)
        {
            // Load initial semesters
            ViewBag.Semesters = await _context.Semesters.ToListAsync();

            // Load students if all filters are selected
            if (semesterId.HasValue && lecturerId.HasValue && courseId.HasValue)
            {
                var students = await _context.Enrollments
                    .Where(e => e.SemesterId == semesterId &&
                               e.Class.CourseId == courseId &&
                               e.Class.LecturerId == lecturerId)
                    .Select(e => new AttendanceViewModel
                    {
                        StudentId = e.StudentId ?? 0,
                        StudentName = e.Student.FirstName + " " + e.Student.LastName,
                        ClassId = e.ClassId ?? 0,
                        SemesterId = e.SemesterId,
                        IsPresent = false,
                        Date = DateTime.Today
                    })
                    .ToListAsync();

                return View(students);
            }

            return View(new List<AttendanceViewModel>());
        }

        [HttpPost]
        public async Task<IActionResult> MarkAttendance(List<AttendanceViewModel> attendanceList)
        {
            if (attendanceList == null || !attendanceList.Any())
            {
                return BadRequest("Invalid attendance data.");
            }

            foreach (var record in attendanceList)
            {
                var attendance = new Attendance
                {
                    StudentId = record.StudentId,
                    ClassId = record.ClassId,
                    SemesterId = record.SemesterId,
                    Date = record.Date,
                    IsPresent = record.IsPresent
                };

                _context.Attendances.Add(attendance);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }


        [HttpGet]
        public async Task<IActionResult> GetClassesBySemester(int semesterId)
        {
            var classes = await _context.Classes
                .Where(c => c.SemesterId == semesterId)
                .Select(c => new { Id = c.Id, Name = $"Class {c.Id}" })
                .ToListAsync();
            return Json(classes);
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
