using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SchoolManagementApp.Data;
using SchoolManagementApp.ViewModels;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Authorization;

namespace SchoolManagementApp.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly SchoolManagementDbContext _context;

        public AccountController(UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager, SchoolManagementDbContext _context)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this._context = _context;
        }

        [AllowAnonymous]
        [HttpGet]
        public IActionResult Register()
        {
            List<Gender> genderList = new List<Gender> {
                new Gender { Name = "Male", Value = "male" },
                new Gender { Name = "Female", Value = "female" }
            };

            ViewBag.Genders = new SelectList(genderList, "Value", "Name");

            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Register(RegisterViewModel registerViewModel)
        {
            // Check if the username already exists
            if (UsernameExists(registerViewModel.Username))
            {
                ModelState.AddModelError("Username", "The username is already taken.");
            }

            // Check if the email already exists
            if (EmailExists(registerViewModel.Email))
            {
                ModelState.AddModelError("Email", "The email address is already registered.");
            }


            if (ModelState.IsValid)
            {
                var identityUser = new ApplicationUser
                {
                    UserName = registerViewModel.Username,
                    Email = registerViewModel.Email,
                    FirstName = registerViewModel.FirstName,
                    LastName = registerViewModel.LastName,
                    DateOfBirth = registerViewModel.DateOfBirth,
                    Gender = registerViewModel.Gender, // This will store "Male" or "Female"
                    Address = registerViewModel.Address,
                    PhoneNumber = registerViewModel.PhoneNumber,
                };

                var identityResult = await userManager.CreateAsync(identityUser, registerViewModel.Password);

                if (identityResult.Succeeded)
                {
                    // assign this user the "User" role
                    var roleIdentityResult = await userManager.AddToRoleAsync(identityUser, "USER");
                    // var roleIdentityResult2 = await userManager.AddToRoleAsync(identityUser, "ADMIN");

                    if (roleIdentityResult.Succeeded)
                    {
                        // Show success notification
                        return RedirectToAction("Index", "Home");
                    }
                }

                foreach (var error in identityResult.Errors)
                {
                    ModelState.AddModelError("Password", error.Description);  // Specific error for password
                }
            }

            // Show error notification
            return View();
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult Login(string? returnUrl = null)
        {
            var model = new LoginViewModel
            {
                ReturnUrl = returnUrl
            };
            return View(model);
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var result = await signInManager.PasswordSignInAsync(model.Email, 
                    model.Password, 
                    isPersistent: false, 
                    lockoutOnFailure: false);

                if (result.Succeeded)
                {
                    if (!string.IsNullOrEmpty(model.ReturnUrl) && Url.IsLocalUrl(model.ReturnUrl))
                    {
                        return Redirect(model.ReturnUrl);
                    }
                    return RedirectToAction("Index", "Home");
                }
                
                ModelState.AddModelError(string.Empty, "Invalid login attempt.");
            }

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            // Clear the existing external cookie
            await signInManager.SignOutAsync();
            return RedirectToAction("Index", "Home");
        }

        private bool UsernameExists(string username)
        {
            // Simulate checking the database for the username (replace with actual logic)
            return _context.Users.Any(u => u.UserName == username);
        }

        private bool EmailExists(string email)
        {
            // Simulate checking the database for the email (replace with actual logic)
            return _context.Users.Any(u => u.Email == email);
        }
    }
}