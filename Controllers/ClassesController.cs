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
using SchoolManagementApp.Interfaces;

namespace SchoolManagementApp.Controllers
{
    [Authorize]
    public class ClassesController : BaseController
    {
        private readonly IClassRepository _classRepository;
        private readonly DropdownService _dropdownService;

        public ClassesController(IClassRepository classRepository, DropdownService dropdownService)
        {
            _classRepository = classRepository;
            _dropdownService = dropdownService;
        }

        // GET: Classes
        public async Task<IActionResult> Index()
        {
            var classes = await _classRepository.GetAllClassesWithDetailsAsync();
            return View(classes);
        }

        // GET: Classes/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var @class = await _classRepository.GetClassWithDetailsAsync(id.Value);
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
            if (ModelState.IsValid)
            {
                await _classRepository.AddAsync(@class);
                SetSuccessMessage("Class created successfully!");
                return RedirectToAction(nameof(Index));
            }

            ViewData["CourseId"] = _dropdownService.GetCourses();
            ViewData["LecturerId"] = _dropdownService.GetLecturers();
            ViewData["SemesterId"] = _dropdownService.GetSemesters();
            return View(@class);
        }

        // GET: Classes/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var @class = await _classRepository.GetByIdAsync(id.Value);
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
                    await _classRepository.UpdateAsync(@class);
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!await _classRepository.ExistsAsync(@class.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                SetSuccessMessage("Class updated successfully!");
                return RedirectToAction(nameof(Index));
            }

            ViewData["CourseId"] = _dropdownService.GetCourses();
            ViewData["LecturerId"] = _dropdownService.GetLecturers();
            return View(@class);
        }

        // GET: Classes/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var @class = await _classRepository.GetClassWithDetailsAsync(id.Value);
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
                if (await _classRepository.HasEnrollmentsAsync(id))
                {
                    SetErrorMessage("Unable to delete the class because it has associated enrollments.");
                    return RedirectToAction(nameof(Index));
                }

                var @class = await _classRepository.GetByIdAsync(id);
                if (@class != null)
                {
                    await _classRepository.DeleteAsync(@class);
                    SetSuccessMessage("Class deleted successfully!");
                }

                return RedirectToAction(nameof(Index));
            }
            catch (Exception)
            {
                SetErrorMessage("An error occurred while deleting the class.");
                return RedirectToAction(nameof(Index));
            }
        }
    }
}