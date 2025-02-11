using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using SchoolManagementApp.Data;
using SchoolManagementApp.Services;

namespace SchoolManagementApp.Controllers
{
    [Authorize]
    public class EnrollmentsController : BaseController
    {
        private readonly SchoolManagementDbContext _context;
        private readonly DropdownService _dropdownService;

        public EnrollmentsController(SchoolManagementDbContext context, DropdownService dropdownService)
        {
            _context = context;
            _dropdownService = dropdownService;
        }

        // GET: Enrollments
        public async Task<IActionResult> Index()
        {
            var enrollments = await _context.Enrollments
                                            .Include(e => e.Student)
                                            .Include(e => e.Class)
                                            .ThenInclude(c => c.Course)
                                            .ToListAsync();



            return View(enrollments);

        }

        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var enrollment = await _context.Enrollments
                   .Include(e => e.Class)
                       .ThenInclude(c => c.Course)
                   .Include(e => e.Class)
                       .ThenInclude(c => c.Lecturer) // Ensure Lecturer is loaded
                   .Include(e => e.Student)
                   .FirstOrDefaultAsync(m => m.Id == id);
            if (enrollment == null)
            {
                return NotFound();
            }

            return View(enrollment);
        }


        // GET: Enrollments/Create
        public IActionResult Create()
        {
            ViewData["ClassId"] = _dropdownService.GetClasses();
            ViewData["StudentId"] = _dropdownService.GetStudents();

            return View();
        }

        // POST: Enrollments/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,StudentId,ClassId,Grade")] Enrollment enrollment)
        {
            if (ModelState.IsValid)
            {
                _context.Add(enrollment);
                await _context.SaveChangesAsync();
                SetSuccessMessage("Enrollment created successfully!"); // ✅ Centralized success message
                return RedirectToAction(nameof(Index));
            }
            ViewData["ClassId"] = _dropdownService.GetClasses();
            ViewData["StudentId"] = _dropdownService.GetStudents();
            return View(enrollment);
        }

        // GET: Enrollments/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.Enrollments == null)
            {
                return NotFound();
            }

            var enrollment = await _context.Enrollments.FindAsync(id);
            if (enrollment == null)
            {
                return NotFound();
            }
            ViewData["ClassId"] = _dropdownService.GetClasses();
            ViewData["StudentId"] = _dropdownService.GetStudents();

            return View(enrollment);
        }

        // POST: Enrollments/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,StudentId,ClassId,Grade")] Enrollment enrollment)
        {
            if (id != enrollment.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(enrollment);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!EnrollmentExists(enrollment.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                SetSuccessMessage("Enrollment updated successfully!");
                return RedirectToAction(nameof(Index));
            }
            ViewData["ClassId"] = new SelectList(_context.Classes, "Id", "Id", enrollment.ClassId);
            ViewData["StudentId"] = new SelectList(_context.Students, "Id", "Id", enrollment.StudentId);
            return View(enrollment);
        }

        // GET: Enrollments/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null || _context.Enrollments == null)
            {
                return NotFound();
            }

            var enrollment = await _context.Enrollments
                .Include(e => e.Class)
                .Include(e => e.Student)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (enrollment == null)
            {
                return NotFound();
            }

            return View(enrollment);
        }

        // POST: Enrollments/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.Enrollments == null)
            {
                return Problem("Entity set 'SchoolManagementDbContext.Enrollments'  is null.");
            }
            var enrollment = await _context.Enrollments.FindAsync(id);
            if (enrollment != null)
            {
                _context.Enrollments.Remove(enrollment);
            }

            await _context.SaveChangesAsync();
            SetSuccessMessage("Enrollment deleted successfully!");
            return RedirectToAction(nameof(Index));
        }

        private bool EnrollmentExists(int id)
        {
            return (_context.Enrollments?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}