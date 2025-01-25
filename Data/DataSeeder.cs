using Microsoft.AspNetCore.Identity;
namespace SchoolManagementApp.Data
{
    public static class DataSeeder
    {
        public static async Task SeedRolesAndUsers(WebApplication app)
        {
            var scope = app.Services.CreateScope();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var passwordHasher = new PasswordHasher<ApplicationUser>();

            // Seed Admin role if it doesn't exist
            if (await roleManager.FindByNameAsync("Admin") == null)
            {
                var adminRole = new IdentityRole("Admin");
                await roleManager.CreateAsync(adminRole);
            }

            // Seed User role if it doesn't exist
            if (await roleManager.FindByNameAsync("User") == null)
            {
                var userRole = new IdentityRole("User");
                await roleManager.CreateAsync(userRole);
            }

            // Create an Admin user if it doesn't exist
            var adminUser = await userManager.FindByEmailAsync("admin@admin.com");
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
                var hashedPassword = passwordHasher.HashPassword(newAdminUser, password);

                newAdminUser.PasswordHash = hashedPassword;

                var result = await userManager.CreateAsync(newAdminUser);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(newAdminUser, "Admin");
                }
            }

            // Create a User user if it doesn't exist
            var regularUser = await userManager.FindByEmailAsync("user@user.com");
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
                var hashedPassword = passwordHasher.HashPassword(newRegularUser, password);

                newRegularUser.PasswordHash = hashedPassword;

                var result = await userManager.CreateAsync(newRegularUser);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(newRegularUser, "User");
                }
            }
        }
    }
}