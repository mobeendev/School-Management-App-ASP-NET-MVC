using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using SchoolManagementApp.Data;
using SchoolManagementApp.Services;

namespace SchoolManagementApp.Controllers
{
    [Authorize]
    public class ClassScheduleController : BaseController
    {
        private readonly SchoolManagementDbContext _context;
        private readonly DropdownService _dropdownService;

        public ClassScheduleController(SchoolManagementDbContext context, DropdownService dropdownService)
        {
            _context = context;
            _dropdownService = dropdownService;
        }

        // GET: Classes
        public async Task<IActionResult> Index()
        {
            var result = await _context.ClassSchedules.Include(q => q.Class)
                    .ThenInclude(c => c.Course) // Include Course inside Class
                    .Include(q => q.Lecturer).ToListAsync();

            return result != null ?
                   View(result) :
                   Problem("Entity set 'ClassSchedule'  is null.");
        }

        // GET: Classes/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.Classes == null)
            {
                return NotFound();
            }

            var @class = await _context.Classes
                .Include(q => q.Course)
                .Include(q => q.Lecturer)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (@class == null)
            {
                return NotFound();
            }

            return View(@class);
        }

        // GET: Classes/Create
        public IActionResult Create()
        {

            ViewData["LecturerId"] = _dropdownService.GetLecturers();
            ViewData["ClassId"] = _dropdownService.GetClasses();
            return View();
        }

        // POST: Classes/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(ClassSchedule @classSecSchedule)
        {
            if (ModelState.IsValid)
            {
                _context.Add(@classSecSchedule);
                await _context.SaveChangesAsync();

                SetSuccessMessage("Class Schedule created successfully!"); // ✅ Centralized success message
                return RedirectToAction(nameof(Index));
            }

            SetErrorMessage("Error! Class Schedule not created!"); // ✅ Centralized success message
            ViewData["LecturerId"] = _dropdownService.GetLecturers();
            ViewData["ClassId"] = _dropdownService.GetClasses();
            return View();


        }


        // GET: Classes/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {

            if (id == null || _context.ClassSchedules == null)
            {
                return NotFound();
            }

            var classSecSchedule = await _context.ClassSchedules.FindAsync(id);
            if (classSecSchedule == null)
            {
                return NotFound();
            }
            ViewData["LecturerId"] = _dropdownService.GetLecturers();
            ViewData["ClassId"] = _dropdownService.GetClasses();

            return View(classSecSchedule);
        }

        // POST: Classes/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id, LecturerId, ClassId, Day, StartTime, EndTime")] ClassSchedule classSecSchedule)
        {
            if (id != classSecSchedule.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                _context.Update(classSecSchedule);
                await _context.SaveChangesAsync();

                SetSuccessMessage("Class Schedule updated successfully!");
                return RedirectToAction(nameof(Index));
            }

            SetErrorMessage("Class Schedule not found!");

            ViewData["LecturerId"] = _dropdownService.GetLecturers();
            ViewData["ClassId"] = _dropdownService.GetClasses();

            return View();
        }



    }
}