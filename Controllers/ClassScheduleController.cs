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
    public class ClassScheduleController : BaseController
    {
        private readonly IClassScheduleRepository _classScheduleRepository;
        private readonly ILecturerRepository _lecturerRepository;
        private readonly IClassRepository _classRepository;
        private readonly DropdownService _dropdownService;

        public ClassScheduleController(
            IClassScheduleRepository classScheduleRepository,
            ILecturerRepository lecturerRepository,
            IClassRepository classRepository,
            DropdownService dropdownService)
        {
            _classScheduleRepository = classScheduleRepository;
            _lecturerRepository = lecturerRepository;
            _classRepository = classRepository;
            _dropdownService = dropdownService;
        }

        // GET: Classes
        public async Task<IActionResult> Index()
        {
            var schedules = await _classScheduleRepository.GetAllSchedulesWithDetailsAsync();
            return View(schedules);
        }

        // GET: Classes/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var schedule = await _classScheduleRepository.GetScheduleWithDetailsAsync(id.Value);
            if (schedule == null)
            {
                return NotFound();
            }

            return View(schedule);
        }

        // GET: Classes/Create
        public IActionResult Create()
        {
            ViewBag.LecturerId = _dropdownService.GetLecturers();
            ViewBag.ClassId = _dropdownService.GetClasses();
            return View();
        }

        // POST: Classes/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(ClassSchedule classSchedule)
        {
            // Debug logging
            Console.WriteLine($"ModelState.IsValid: {ModelState.IsValid}");
            Console.WriteLine($"ClassId: {classSchedule.ClassId}");
            Console.WriteLine($"LecturerId: {classSchedule.LecturerId}");
            Console.WriteLine($"Day: {classSchedule.Day}");
            Console.WriteLine($"StartTime: {classSchedule.StartTime}");
            Console.WriteLine($"EndTime: {classSchedule.EndTime}");

            foreach (var modelError in ModelState.Values.SelectMany(v => v.Errors))
            {
                Console.WriteLine($"Validation Error: {modelError.ErrorMessage}");
            }

            if (ModelState.IsValid)
            {
                try
                {
                    // Get the lecturer and class using their respective repositories
                    var lecturer = await _lecturerRepository.GetByIdAsync(classSchedule.LecturerId);
                    var classEntity = await _classRepository.GetByIdAsync(classSchedule.ClassId);

                    if (lecturer == null)
                    {
                        ModelState.AddModelError("LecturerId", "Selected lecturer not found");
                        ViewBag.LecturerId = _dropdownService.GetLecturers();
                        ViewBag.ClassId = _dropdownService.GetClasses();
                        return View(classSchedule);
                    }

                    if (classEntity == null) 
                    {
                        ModelState.AddModelError("ClassId", "Selected class not found");
                        ViewBag.LecturerId = _dropdownService.GetLecturers();
                        ViewBag.ClassId = _dropdownService.GetClasses();
                        return View(classSchedule);
                    }

                    // Validate time range
                    if (classSchedule.EndTime <= classSchedule.StartTime)
                    {
                        ModelState.AddModelError("EndTime", "End time must be after start time");
                        ViewBag.LecturerId = _dropdownService.GetLecturers();
                        ViewBag.ClassId = _dropdownService.GetClasses();
                        return View(classSchedule);
                    }

                    // Check for schedule conflicts
                    var existingSchedules = await _classScheduleRepository.GetAllSchedulesWithDetailsAsync();
                    var conflict = existingSchedules.Any(s => 
                        s.Day == classSchedule.Day &&
                        s.LecturerId == classSchedule.LecturerId &&
                        ((classSchedule.StartTime >= s.StartTime && classSchedule.StartTime < s.EndTime) ||
                         (classSchedule.EndTime > s.StartTime && classSchedule.EndTime <= s.EndTime)));

                    if (conflict)
                    {
                        ModelState.AddModelError("", "This time slot conflicts with an existing schedule");
                        ViewBag.LecturerId = _dropdownService.GetLecturers();
                        ViewBag.ClassId = _dropdownService.GetClasses();
                        return View(classSchedule);
                    }

                    await _classScheduleRepository.AddAsync(classSchedule);
                    SetSuccessMessage("Class Schedule created successfully!");
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", "An error occurred while creating the schedule: " + ex.Message);
                }
            }
            else
            {
                // Log validation errors
                foreach (var modelError in ModelState.Values.SelectMany(v => v.Errors))
                {
                    ModelState.AddModelError("", modelError.ErrorMessage);
                }
            }

            SetErrorMessage("Error! Class Schedule not created!");
            ViewBag.LecturerId = _dropdownService.GetLecturers();
            ViewBag.ClassId = _dropdownService.GetClasses();
            return View(classSchedule);
        }

        // GET: Classes/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var schedule = await _classScheduleRepository.GetByIdAsync(id.Value);
            if (schedule == null)
            {
                return NotFound();
            }

            ViewData["LecturerId"] = _dropdownService.GetLecturers();
            ViewData["ClassId"] = _dropdownService.GetClasses();
            return View(schedule);
        }

        // POST: Classes/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,LecturerId,ClassId,Day,StartTime,EndTime")] ClassSchedule classSchedule)
        {
            if (id != classSchedule.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    await _classScheduleRepository.UpdateAsync(classSchedule);
                    SetSuccessMessage("Class Schedule updated successfully!");
                    return RedirectToAction(nameof(Index));
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!await _classScheduleRepository.ExistsAsync(classSchedule.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
            }

            SetErrorMessage("Class Schedule not found!");
            ViewData["LecturerId"] = _dropdownService.GetLecturers();
            ViewData["ClassId"] = _dropdownService.GetClasses();
            return View(classSchedule);
        }
    }
}