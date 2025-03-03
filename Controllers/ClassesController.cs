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
    public class ClassesController : BaseController
    {
        private readonly SchoolManagementDbContext _context;
        private readonly DropdownService _dropdownService;

        public ClassesController(SchoolManagementDbContext context, DropdownService dropdownService)
        {
            _context = context;
            _dropdownService = dropdownService;
        }

        // GET: Classes
        public async Task<IActionResult> Index()
        {
            var schoolManagementDbContext = _context.Classes.Include(q => q.Course).Include(q => q.Lecturer).ThenInclude(u => u.User);

            return schoolManagementDbContext != null ?
                   View(await schoolManagementDbContext.ToListAsync()) :
                   Problem("Entity set 'SchoolManagementDbContext.Courses'  is null.");


            // return View(await schoolManagementDbContext.ToListAsync());
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

            ViewData["CourseId"] = _dropdownService.GetCourses();
            ViewData["LecturerId"] = _dropdownService.GetLecturers();
            ViewData["SemesterId"] = _dropdownService.GetSemesters();


            return View();
        }

        // POST: Classes/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Class @class)
        {
            // if (ModelState.IsValid)
            // {
            _context.Add(@class);
            await _context.SaveChangesAsync();

            SetSuccessMessage("Class created successfully!"); // ✅ Centralized success message
            return RedirectToAction(nameof(Index));
            // }

            // SetErrorMessage("Error! Creating class!"); // ✅ Centralized error message
            // return View(@class); // Return the view with the current model to show validation errors
        }


        // GET: Classes/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.Classes == null)
            {
                return NotFound();
            }

            var @class = await _context.Classes.FindAsync(id);
            if (@class == null)
            {
                return NotFound();
            }

            ViewData["CourseId"] = _dropdownService.GetCourses();
            ViewData["LecturerId"] = _dropdownService.GetLecturers();

            return View(@class);
        }

        // POST: Classes/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,LecturerId,CourseId,Time")] Class @class)
        {
            if (id != @class.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(@class);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ClassExists(@class.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                SetSuccessMessage("Class updated successfully!"); // ✅ Centralized success message
                return RedirectToAction(nameof(Index));
            }

            ViewData["CourseId"] = _dropdownService.GetCourses();
            ViewData["LecturerId"] = _dropdownService.GetLecturers();

            return View(@class);
        }

        // GET: Classes/Delete/5
        public async Task<IActionResult> Delete(int? id)
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

        // POST: Classes/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            try
            {
                if (_context.Classes == null)
                {
                    return Problem("Entity set 'SchoolManagementDbContext.Classes' is null.");
                }
                var @class = await _context.Classes.FindAsync(id);
                if (@class != null)
                {
                    _context.Classes.Remove(@class);
                }

                await _context.SaveChangesAsync();
                SetSuccessMessage("Class deleted successfully!"); // ✅ Centralized success message
                return RedirectToAction(nameof(Index));
            }
            catch (DbUpdateException ex)
            {
                TempData["ErrorMessage"] = "Error: Unable to delete the class because it has associated enrollments.";
                return RedirectToAction("Index");
            }
        }

        private bool ClassExists(int id)
        {
            return (_context.Classes?.Any(e => e.Id == id)).GetValueOrDefault();
        }

    }
}