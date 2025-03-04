using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using SchoolManagementApp.Data;
using Microsoft.AspNetCore.Identity;
using SchoolManagementApp.Models;

namespace SchoolManagementApp.Controllers
{
    [Authorize(Roles = "Admin")]
    public class LecturersController : BaseController
    {
        private readonly SchoolManagementDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public LecturersController(SchoolManagementDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        // GET: Lecturers
        public async Task<IActionResult> Index()
        {
            return _context.Lecturers != null ?
                        View(await _context.Lecturers.Include(u => u.User).ToListAsync()) :
                        Problem("Entity set 'SchoolManagementDbContext.Lecturers'  is null.");
        }

        // GET: Lecturers/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.Lecturers == null)
            {
                return NotFound();
            }

            var lecturer = await _context.Lecturers.Include(u => u.User)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (lecturer == null)
            {
                return NotFound();
            }

            return View(lecturer);
        }

        // GET: Lecturers/Create
        public IActionResult Create()
        {
            ViewBag.Roles = _roleManager.Roles;
            // Define the list of genders
            ViewBag.Genders = new List<Gender>
                                    {
                                        new Gender { ID = 1, Name = "Male", Value = "Male" },
                                        new Gender { ID = 2, Name = "Female", Value = "Female" }
                                    };
            return View();
        }

        // POST: Lecturers/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        public async Task<IActionResult> Create(LecturerViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = new ApplicationUser
                {
                    UserName = model.Email,
                    Email = model.Email,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    Gender = model.Gender,
                    Address = "",
                    PhoneNumber = "000000",
                };

                var result = await _userManager.CreateAsync(user, model.Password);
                // var result = await _userManager.CreateAsync(newlecturerUser);
                if (result.Succeeded)
                {
                    if (!string.IsNullOrEmpty(model.Role))
                    {
                        await _userManager.AddToRoleAsync(user, model.Role);

                        var newLecturer = new Lecturer
                        {
                            UserId = user.Id, // Assign ApplicationUser's Id
                            Salary = model.Salary,
                            YearsOfExperience = model.YearsOfExperience,
                            WorkPhoneNumber = model.WorkPhoneNumber,
                            TeachingHoursPerWeek = 10,
                            Designation = model.Designation

                        };

                        _context.Lecturers.Add(newLecturer);
                        await _context.SaveChangesAsync(); // Save to DB
                    }
                    return RedirectToAction(nameof(Index));
                }

                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError("", error.Description);
                }
            }

            ViewBag.Roles = _roleManager.Roles;
            // Define the list of genders
            ViewBag.Genders = new List<Gender>
                                    {
                                        new Gender { ID = 1, Name = "Male", Value = "Male" },
                                        new Gender { ID = 2, Name = "Female", Value = "Female" }
                                    };

            return View(model);
        }
        // [ValidateAntiForgeryToken]
        // public async Task<IActionResult> Create([Bind("Id,FirstName,LastName")] Lecturer lecturer)
        // {
        //     if (ModelState.IsValid)
        //     {
        //         _context.Add(lecturer);
        //         await _context.SaveChangesAsync();

        //         SetSuccessMessage("Lecturer created successfully!"); // ✅ Centralized success message
        //         return RedirectToAction(nameof(Index));
        //     }

        //     return View(lecturer);
        // }

        // GET: Lecturers/Edit/5
        public async Task<IActionResult> Edit(int id)
        {
            var lecturer = await _context.Lecturers
                .Include(l => l.User)
                .FirstOrDefaultAsync(l => l.Id == id);

            if (lecturer == null)
            {
                return NotFound();
            }

            var model = new LecturerViewModel
            {
                Id = lecturer.Id, // ✅ Include the Id here
                FirstName = lecturer.User.FirstName,
                LastName = lecturer.User.LastName,
                Email = lecturer.User.Email,
                Gender = lecturer.User.Gender,
                Salary = lecturer.Salary,
                Qualification = lecturer.Qualification,
                YearsOfExperience = lecturer.YearsOfExperience,
                WorkPhoneNumber = lecturer.WorkPhoneNumber,
                Designation = lecturer.Designation,
                Role = (await _userManager.GetRolesAsync(lecturer.User)).FirstOrDefault()
            };

            ViewBag.Genders = new List<Gender>
                                    {
                                        new Gender { ID = 1, Name = "Male", Value = "Male" },
                                        new Gender { ID = 2, Name = "Female", Value = "Female" }
                                    };

            ViewBag.Roles = _roleManager.Roles;
            return View(model);
        }

        // POST: Lecturers/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, LecturerViewModel model)
        {
            ViewBag.Roles = _roleManager.Roles;
            ViewBag.Genders = new List<Gender>
                                    {
                                        new Gender { ID = 1, Name = "Male", Value = "Male" },
                                        new Gender { ID = 2, Name = "Female", Value = "Female" }
                                    };
            if (!ModelState.IsValid)
            {

                return View(model);
            }

            var lecturer = await _context.Lecturers
                .Include(l => l.User)
                .FirstOrDefaultAsync(l => l.Id == id);

            if (lecturer == null)
            {
                return NotFound();
            }

            var user = lecturer.User;

            // ✅ Ensure uniqueness check only happens if email is changed
            if (user.Email != model.Email)
            {
                var existingUser = await _userManager.FindByEmailAsync(model.Email);
                if (existingUser != null && existingUser.Id != user.Id)
                {
                    ModelState.AddModelError("Email", "This email is already in use by another user.");
                    ViewBag.Roles = _roleManager.Roles;
                    ViewBag.Genders = new List<Gender>
                                    {
                                        new Gender { ID = 1, Name = "Male", Value = "Male" },
                                        new Gender { ID = 2, Name = "Female", Value = "Female" }
                                    };
                    return View(model);
                }

                user.Email = model.Email;
                user.UserName = model.Email;
            }

            // ✅ Update user details
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.Gender = model.Gender;

            // ✅ Update lecturer details
            lecturer.Salary = model.Salary;
            lecturer.Qualification = model.Qualification;
            lecturer.YearsOfExperience = model.YearsOfExperience;
            lecturer.WorkPhoneNumber = model.WorkPhoneNumber;
            lecturer.Designation = model.Designation;

            // ✅ Update user role only if changed
            var currentRoles = await _userManager.GetRolesAsync(user);
            if (!currentRoles.Contains(model.Role))
            {
                await _userManager.RemoveFromRolesAsync(user, currentRoles);
                await _userManager.AddToRoleAsync(user, model.Role);
            }

            // ✅ Save user & lecturer updates
            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                foreach (var error in updateResult.Errors)
                {
                    ModelState.AddModelError("", error.Description);
                }
                return View(model);
            }

            _context.Update(lecturer);
            await _context.SaveChangesAsync();
            SetSuccessMessage("Lecturer updated successfully!");

            return RedirectToAction(nameof(Index));
        }


        // GET: Lecturers/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null || _context.Lecturers == null)
            {
                return NotFound();
            }

            var lecturer = await _context.Lecturers
                .FirstOrDefaultAsync(m => m.Id == id);
            if (lecturer == null)
            {
                return NotFound();
            }

            return View(lecturer);
        }

        // POST: Lecturers/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.Lecturers == null)
            {
                return Problem("Entity set 'SchoolManagementDbContext.Lecturers'  is null.");
            }
            var lecturer = await _context.Lecturers.FindAsync(id);
            if (lecturer != null)
            {
                _context.Lecturers.Remove(lecturer);
            }

            await _context.SaveChangesAsync();

            SetSuccessMessage("Lecturer deleted successfully!");
            return RedirectToAction(nameof(Index));
        }

        private bool LecturerExists(int id)
        {
            return (_context.Lecturers?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}