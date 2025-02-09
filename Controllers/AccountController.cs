using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SchoolManagementApp.Data;
using SchoolManagementApp.ViewModels;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace SchoolManagementApp.Controllers
{
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
        public IActionResult Login(string? ReturnUrl = null)
        {
            var model = new LoginViewModel
            {
                ReturnUrl = ReturnUrl
            };

            return View(model);
        }


        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel loginViewModel)
        {
            var user = await userManager.FindByEmailAsync(loginViewModel.Email);
            if (user == null)
            {
                // User not found
                ModelState.AddModelError(string.Empty, "Invalid Email.");
                return View(loginViewModel);
            }

            if (await userManager.IsLockedOutAsync(user))
            {
                ModelState.AddModelError(string.Empty, "Account is locked.");
                return View(loginViewModel);
            }

            var isPasswordValid = await userManager.CheckPasswordAsync(user, loginViewModel.Password);
            if (!isPasswordValid)
            {
                // Password is incorrect
                ModelState.AddModelError(string.Empty, "Invalid password.");
                return View(loginViewModel);
            }

            if (!ModelState.IsValid)
            {
                return View();
            }

            var signInResult = await signInManager.PasswordSignInAsync(loginViewModel.Email,
                loginViewModel.Password, false, false);

            if (signInResult.IsLockedOut)
            {
                // Handle account lockout
                ModelState.AddModelError(string.Empty, "Account is locked.");
                return View(loginViewModel);
            }

            if (signInResult != null && signInResult.Succeeded)
            {
                if (!string.IsNullOrWhiteSpace(loginViewModel.ReturnUrl))
                {
                    return Redirect(loginViewModel.ReturnUrl);
                }

                return RedirectToAction("Index", "Home");
            }

            // Show errors
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Logout()
        {
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