using Microsoft.AspNetCore.Identity;
namespace SchoolManagementApp.Data
{
    public class DataSeeder
    {
        private readonly SchoolManagementDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IPasswordHasher<ApplicationUser> _passwordHasher;

        public DataSeeder(SchoolManagementDbContext context,
                     UserManager<ApplicationUser> userManager,
                     RoleManager<IdentityRole> roleManager,
                     IPasswordHasher<ApplicationUser> passwordHasher)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _passwordHasher = passwordHasher;
        }
        public async Task SeedRolesAndUsers()
        {
            // var scope = app.Services.CreateScope();
            // var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            // var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            // var passwordHasher = new PasswordHasher<ApplicationUser>();

            // Seed Admin role if it doesn't exist
            if (await _roleManager.FindByNameAsync("Admin") == null)
            {
                var adminRole = new IdentityRole("Admin");
                await _roleManager.CreateAsync(adminRole);
            }

            // Seed Lecturer role if it doesn't exist
            if (await _roleManager.FindByNameAsync("Lecturer") == null)
            {
                var lecturerRole = new IdentityRole("Lecturer");
                await _roleManager.CreateAsync(lecturerRole);
            }

            // Seed User role if it doesn't exist
            if (await _roleManager.FindByNameAsync("User") == null)
            {
                var userRole = new IdentityRole("User");
                await _roleManager.CreateAsync(userRole);
            }

            // Create an Admin user if it doesn't exist
            var adminUser = await _userManager.FindByEmailAsync("admin@admin.com");
            if (adminUser == null)
            {
                var newAdminUser = new ApplicationUser
                {
                    UserName = "admin@admin.com",
                    Email = "admin@admin.com",
                    FirstName = "admin",
                    LastName = "user",
                    Gender = "male", // This will store "Male" or "Female"
                    Address = "online",
                    PhoneNumber = "523123",

                };

                // Hash the password manually using PasswordHasher
                var password = "Admin123!";
                var hashedPassword = _passwordHasher.HashPassword(newAdminUser, password);

                newAdminUser.PasswordHash = hashedPassword;

                var result = await _userManager.CreateAsync(newAdminUser);
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(newAdminUser, "Admin");
                }
            }


            // Create a User user if it doesn't exist
            var lecturerUser = await _userManager.FindByEmailAsync("lec1@lec.com");
            if (lecturerUser == null)
            {
                var newlecturerUser = new ApplicationUser
                {
                    UserName = "lec1@lec.com",
                    Email = "lec1@lec.com",
                    FirstName = "dummy",
                    LastName = "lecturer",
                    Gender = "male", // This will store "Male" or "Female"
                    Address = "living in university",
                    PhoneNumber = "23941233",
                };

                // Hash the password manually using PasswordHasher
                var password = "Lec123!";
                var hashedPassword = _passwordHasher.HashPassword(newlecturerUser, password);

                newlecturerUser.PasswordHash = hashedPassword;

                var result = await _userManager.CreateAsync(newlecturerUser);
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(newlecturerUser, "Lecturer");
                    // Insert Lecturer entry after user creation
                    var newLecturer = new Lecturer
                    {
                        UserId = newlecturerUser.Id, // Assign ApplicationUser's Id
                        Salary = 5000,  // Dummy salary
                        YearsOfExperience = 7,
                        WorkPhoneNumber = "9822123",
                        TeachingHoursPerWeek = 10,
                        Designation = "Lecturer"


                    };

                    _context.Lecturers.Add(newLecturer);
                    await _context.SaveChangesAsync(); // Save to DB

                }
            }

            // Create a User user if it doesn't exist
            var regularUser = await _userManager.FindByEmailAsync("user@user.com");
            if (regularUser == null)
            {
                var newRegularUser = new ApplicationUser
                {
                    UserName = "user@user.com",
                    Email = "user@user.com",
                    FirstName = "user",
                    LastName = "first",
                    Gender = "male", // This will store "Male" or "Female"
                    Address = "online",
                    PhoneNumber = "123123",
                };

                // Hash the password manually using PasswordHasher
                var password = "User123!";
                var hashedPassword = _passwordHasher.HashPassword(newRegularUser, password);

                newRegularUser.PasswordHash = hashedPassword;

                var result = await _userManager.CreateAsync(newRegularUser);
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(newRegularUser, "User");
                }
            }
        }
    }
}