using Microsoft.AspNetCore.Identity;
using SchoolManagement.Models.Entities;
using SchoolManagement.Models.Enums;
using SchoolManagement.Repositories.Context;

namespace SchoolManagement.Api.Extensions
{
    public static class DatabaseSeeder
    {
        public static async Task SeedRolesAndAdminAsync(IServiceProvider serviceProvider)
        {
            Console.WriteLine("\n" + new string('=', 60));
            Console.WriteLine("🌱 STARTING DATABASE SEEDING");
            Console.WriteLine(new string('=', 60));

            try
            {
                using var scope = serviceProvider.CreateScope();
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

                Console.WriteLine("📦 Services initialized successfully");

                // Create roles
                string[] roles = { "Admin", "Lecturer", "Student", "Staff" };
                Console.WriteLine($"\n🎭 CREATING ROLES ({roles.Length} roles)");
                Console.WriteLine(new string('-', 40));

                foreach (var role in roles)
                {
                    if (!await roleManager.RoleExistsAsync(role))
                    {
                        var createResult = await roleManager.CreateAsync(new IdentityRole(role));
                        if (createResult.Succeeded)
                        {
                            Console.WriteLine($"✅ Created role: {role}");
                        }
                        else
                        {
                            Console.WriteLine($"❌ Failed to create role {role}:");
                            foreach (var error in createResult.Errors)
                            {
                                Console.WriteLine($"   - {error.Description}");
                            }
                        }
                    }
                    else
                    {
                        Console.WriteLine($"ℹ️  Role already exists: {role}");
                    }
                }

                // Create admin user
                Console.WriteLine($"\n👤 CREATING ADMIN USER");
                Console.WriteLine(new string('-', 40));
                
                var adminEmail = "admin@school.com";
                var adminPassword = "Admin@123!";
                
                Console.WriteLine($"📧 Admin Email: {adminEmail}");
                Console.WriteLine($"🔐 Admin Password: {adminPassword}");
                
                var adminUser = await userManager.FindByEmailAsync(adminEmail);

                // Force recreate admin user (for troubleshooting)
                if (adminUser != null)
                {
                    Console.WriteLine("🗑️  Deleting existing admin user to recreate...");
                    var deleteResult = await userManager.DeleteAsync(adminUser);
                    if (deleteResult.Succeeded)
                    {
                        Console.WriteLine("✅ Existing admin user deleted");
                        adminUser = null; // Reset to null so it gets recreated
                    }
                    else
                    {
                        Console.WriteLine("❌ Failed to delete existing admin user");
                        foreach (var error in deleteResult.Errors)
                        {
                            Console.WriteLine($"   - {error.Description}");
                        }
                    }
                }

                if (adminUser == null)
                {
                    Console.WriteLine("👤 Admin user not found, creating new user...");
                    
                    adminUser = new ApplicationUser
                    {
                        UserName = adminEmail,
                        Email = adminEmail,
                        FirstName = "System",
                        LastName = "Administrator",
                        EmailConfirmed = true
                    };

                    Console.WriteLine($"📝 User object created:");
                    Console.WriteLine($"   - UserName: {adminUser.UserName}");
                    Console.WriteLine($"   - Email: {adminUser.Email}");
                    Console.WriteLine($"   - EmailConfirmed: {adminUser.EmailConfirmed}");

                    var result = await userManager.CreateAsync(adminUser, adminPassword);

                    if (result.Succeeded)
                    {
                        Console.WriteLine("✅ Admin user created successfully!");
                        
                        // Add to Admin role
                        var roleResult = await userManager.AddToRoleAsync(adminUser, "Admin");
                        if (roleResult.Succeeded)
                        {
                            Console.WriteLine("✅ Admin role assigned successfully!");
                        }
                        else
                        {
                            Console.WriteLine("❌ Failed to assign Admin role:");
                            foreach (var error in roleResult.Errors)
                            {
                                Console.WriteLine($"   - {error.Description}");
                            }
                        }

                        // Verify user creation
                        var createdUser = await userManager.FindByEmailAsync(adminEmail);
                        Console.WriteLine($"✅ User verification - Found: {createdUser != null}");
                        if (createdUser != null)
                        {
                            Console.WriteLine($"   - ID: {createdUser.Id}");
                            Console.WriteLine($"   - Email: {createdUser.Email}");
                            Console.WriteLine($"   - UserName: {createdUser.UserName}");
                            
                            var userRoles = await userManager.GetRolesAsync(createdUser);
                            Console.WriteLine($"   - Roles: [{string.Join(", ", userRoles)}]");
                        }
                    }
                    else
                    {
                        Console.WriteLine($"❌ Failed to create admin user:");
                        foreach (var error in result.Errors)
                        {
                            Console.WriteLine($"   - {error.Code}: {error.Description}");
                        }
                    }
                }
                else
                {
                    Console.WriteLine("ℹ️  Admin user already exists");
                    Console.WriteLine($"   - ID: {adminUser.Id}");
                    Console.WriteLine($"   - Email: {adminUser.Email}");
                    Console.WriteLine($"   - UserName: {adminUser.UserName}");
                    Console.WriteLine($"   - EmailConfirmed: {adminUser.EmailConfirmed}");
                    
                    // Check if admin has the role
                    var isInRole = await userManager.IsInRoleAsync(adminUser, "Admin");
                    Console.WriteLine($"   - Has Admin role: {isInRole}");
                    
                    if (!isInRole)
                    {
                        Console.WriteLine("🔧 Adding Admin role to existing user...");
                        var roleResult = await userManager.AddToRoleAsync(adminUser, "Admin");
                        if (roleResult.Succeeded)
                        {
                            Console.WriteLine("✅ Admin role added successfully!");
                        }
                        else
                        {
                            Console.WriteLine("❌ Failed to add Admin role:");
                            foreach (var error in roleResult.Errors)
                            {
                                Console.WriteLine($"   - {error.Description}");
                            }
                        }
                    }
                    
                    var userRoles = await userManager.GetRolesAsync(adminUser);
                    Console.WriteLine($"   - Current roles: [{string.Join(", ", userRoles)}]");
                }

                Console.WriteLine($"\n🔍 FINAL VERIFICATION");
                Console.WriteLine(new string('-', 40));
                
                // Final verification
                var finalUser = await userManager.FindByEmailAsync(adminEmail);
                if (finalUser != null)
                {
                    Console.WriteLine($"✅ Final check - User exists: {finalUser.Email}");
                    var finalRoles = await userManager.GetRolesAsync(finalUser);
                    Console.WriteLine($"✅ Final roles: [{string.Join(", ", finalRoles)}]");
                    
                    // Test password
                    var passwordCheck = await userManager.CheckPasswordAsync(finalUser, adminPassword);
                    Console.WriteLine($"✅ Password validation: {passwordCheck}");
                }
                else
                {
                    Console.WriteLine("❌ Final check - User NOT found!");
                }

                Console.WriteLine(new string('=', 60));
                Console.WriteLine("✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!");
                Console.WriteLine(new string('=', 60) + "\n");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"💥 SEEDING ERROR: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                Console.WriteLine(new string('=', 60) + "\n");
                throw;
            }
        }
    }
}