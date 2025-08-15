using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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

        public static async Task SeedTestDataAsync(IServiceProvider serviceProvider)
        {
            Console.WriteLine("\n" + new string('=', 60));
            Console.WriteLine("🌱 STARTING TEST DATA SEEDING");
            Console.WriteLine(new string('=', 60));

            try
            {
                using var scope = serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<SchoolManagementDbContext>();
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

                Console.WriteLine("📦 Services initialized successfully");

                // Phase 1: Create Semesters
                await SeedSemestersAsync(context);

                // Phase 2: Create Courses
                await SeedCoursesAsync(context);

                // Phase 3: Create Lecturers
                await SeedLecturersAsync(context, userManager);

                // Phase 4: Create Students
                await SeedStudentsAsync(context, userManager);

                // Phase 5: Create Classes
                await SeedClassesAsync(context);

                // Phase 6: Create Class Schedules
                await SeedClassSchedulesAsync(context);

                // Phase 7: Create Enrollments
                await SeedEnrollmentsAsync(context);

                Console.WriteLine(new string('=', 60));
                Console.WriteLine("✅ TEST DATA SEEDING COMPLETED SUCCESSFULLY!");
                Console.WriteLine(new string('=', 60) + "\n");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"💥 TEST DATA SEEDING ERROR: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                Console.WriteLine(new string('=', 60) + "\n");
                throw;
            }
        }

        private static async Task SeedSemestersAsync(SchoolManagementDbContext context)
        {
            Console.WriteLine("\n🗓️ CREATING SEMESTERS (2 records)");
            Console.WriteLine(new string('-', 40));

            if (!context.Semesters.Any())
            {
                var semesters = new List<Semester>
                {
                    new Semester
                    {
                        Type = SemesterType.Summer,
                        StartDate = new DateTime(2025, 5, 1),
                        EndDate = new DateTime(2025, 8, 31)
                    },
                    new Semester
                    {
                        Type = SemesterType.Winter,
                        StartDate = new DateTime(2026, 1, 1),
                        EndDate = new DateTime(2026, 4, 30)
                    }
                };

                context.Semesters.AddRange(semesters);
                await context.SaveChangesAsync();

                foreach (var semester in semesters)
                {
                    Console.WriteLine($"✅ Created {semester.Type} {semester.StartDate.Year}");
                }
            }
            else
            {
                Console.WriteLine("ℹ️  Semesters already exist");
            }
        }

        private static async Task SeedCoursesAsync(SchoolManagementDbContext context)
        {
            Console.WriteLine("\n📚 CREATING COURSES (10 records)");
            Console.WriteLine(new string('-', 40));

            if (!context.Courses.Any())
            {
                var courses = new List<Course>
                {
                    // Computer Science
                    new Course { Code = "CS101", Name = "Introduction to Programming", Credits = 3 },
                    new Course { Code = "CS201", Name = "Data Structures & Algorithms", Credits = 4 },
                    new Course { Code = "CS301", Name = "Web Development", Credits = 3 },
                    new Course { Code = "CS401", Name = "Database Systems", Credits = 4 },
                    
                    // Mathematics
                    new Course { Code = "MATH101", Name = "Calculus I", Credits = 4 },
                    new Course { Code = "MATH201", Name = "Statistics", Credits = 3 },
                    new Course { Code = "MATH301", Name = "Linear Algebra", Credits = 3 },
                    
                    // Business
                    new Course { Code = "BUS101", Name = "Introduction to Accounting", Credits = 3 },
                    new Course { Code = "BUS201", Name = "Marketing Principles", Credits = 3 },
                    
                    // English
                    new Course { Code = "ENG101", Name = "Technical Writing", Credits = 2 }
                };

                context.Courses.AddRange(courses);
                await context.SaveChangesAsync();

                foreach (var course in courses)
                {
                    Console.WriteLine($"✅ Created {course.Code}: {course.Name} ({course.Credits} credits)");
                }
            }
            else
            {
                Console.WriteLine("ℹ️  Courses already exist");
            }
        }

        private static async Task SeedLecturersAsync(SchoolManagementDbContext context, UserManager<ApplicationUser> userManager)
        {
            Console.WriteLine("\n👨‍🏫 CREATING LECTURERS (10 records)");
            Console.WriteLine(new string('-', 40));

            if (!context.Lecturers.Any())
            {
                var lecturerData = new[]
                {
                    new { FirstName = "John", LastName = "Smith", Email = "john.smith@school.com", Subject = "CS", Qualification = Qualification.DoctorateDegree, Designation = "Professor", Salary = 120000, Experience = 15 },
                    new { FirstName = "Sarah", LastName = "Johnson", Email = "sarah.johnson@school.com", Subject = "Math", Qualification = Qualification.DoctorateDegree, Designation = "Professor", Salary = 115000, Experience = 12 },
                    new { FirstName = "Michael", LastName = "Brown", Email = "michael.brown@school.com", Subject = "CS", Qualification = Qualification.Master, Designation = "Associate Professor", Salary = 95000, Experience = 8 },
                    new { FirstName = "Emily", LastName = "Davis", Email = "emily.davis@school.com", Subject = "Math", Qualification = Qualification.DoctorateDegree, Designation = "Professor", Salary = 110000, Experience = 10 },
                    new { FirstName = "David", LastName = "Wilson", Email = "david.wilson@school.com", Subject = "Business", Qualification = Qualification.DoctorateDegree, Designation = "Professor", Salary = 105000, Experience = 14 },
                    new { FirstName = "Lisa", LastName = "Anderson", Email = "lisa.anderson@school.com", Subject = "CS", Qualification = Qualification.DoctorateDegree, Designation = "Professor", Salary = 118000, Experience = 16 },
                    new { FirstName = "James", LastName = "Taylor", Email = "james.taylor@school.com", Subject = "Math", Qualification = Qualification.Master, Designation = "Associate Professor", Salary = 88000, Experience = 6 },
                    new { FirstName = "Maria", LastName = "Garcia", Email = "maria.garcia@school.com", Subject = "Business", Qualification = Qualification.Master, Designation = "Assistant Professor", Salary = 75000, Experience = 4 },
                    new { FirstName = "Robert", LastName = "Lee", Email = "robert.lee@school.com", Subject = "English", Qualification = Qualification.DoctorateDegree, Designation = "Professor", Salary = 95000, Experience = 11 },
                    new { FirstName = "Jennifer", LastName = "White", Email = "jennifer.white@school.com", Subject = "CS", Qualification = Qualification.Master, Designation = "Associate Professor", Salary = 92000, Experience = 7 }
                };

                foreach (var data in lecturerData)
                {
                    // Create user
                    var user = new ApplicationUser
                    {
                        UserName = data.Email,
                        Email = data.Email,
                        FirstName = data.FirstName,
                        LastName = data.LastName,
                        PhoneNumber = GeneratePhoneNumber(),
                        Address = GenerateAddress(),
                        DateOfBirth = GenerateDateOfBirth(35, 65),
                        Gender = new Random().Next(2) == 0 ? "Male" : "Female",
                        EmailConfirmed = true
                    };

                    var result = await userManager.CreateAsync(user, "Lecturer@123!");
                    if (result.Succeeded)
                    {
                        await userManager.AddToRoleAsync(user, "Lecturer");

                        // Create lecturer record
                        var lecturer = new Lecturer
                        {
                            UserId = user.Id,
                            Qualification = data.Qualification,
                            Designation = data.Designation,
                            Salary = data.Salary,
                            YearsOfExperience = data.Experience,
                            TeachingHoursPerWeek = new Random().Next(12, 21),
                            Status = "Active",
                            WorkPhoneNumber = GenerateWorkPhone()
                        };

                        context.Lecturers.Add(lecturer);
                        Console.WriteLine($"✅ Created {data.Designation} {data.FirstName} {data.LastName} ({data.Subject})");
                    }
                }

                await context.SaveChangesAsync();
            }
            else
            {
                Console.WriteLine("ℹ️  Lecturers already exist");
            }
        }

        private static async Task SeedStudentsAsync(SchoolManagementDbContext context, UserManager<ApplicationUser> userManager)
        {
            Console.WriteLine("\n👨‍🎓 CREATING STUDENTS (20 records)");
            Console.WriteLine(new string('-', 40));

            var existingStudentCount = context.Students.Count();
            Console.WriteLine($"ℹ️  Found {existingStudentCount} existing students");

            if (existingStudentCount < 20)
            {
                var studentNames = new[]
                {
                    new { FirstName = "Alice", LastName = "Johnson", Email = "alice.johnson@school.com" },
                    new { FirstName = "Bob", LastName = "Smith", Email = "bob.smith@school.com" },
                    new { FirstName = "Carol", LastName = "Davis", Email = "carol.davis@school.com" },
                    new { FirstName = "David", LastName = "Wilson", Email = "david.wilson.student@school.com" },
                    new { FirstName = "Emma", LastName = "Brown", Email = "emma.brown@school.com" },
                    new { FirstName = "Frank", LastName = "Miller", Email = "frank.miller@school.com" },
                    new { FirstName = "Grace", LastName = "Lee", Email = "grace.lee@school.com" },
                    new { FirstName = "Henry", LastName = "Taylor", Email = "henry.taylor@school.com" },
                    new { FirstName = "Ivy", LastName = "Chen", Email = "ivy.chen@school.com" },
                    new { FirstName = "Jack", LastName = "Anderson", Email = "jack.anderson@school.com" },
                    new { FirstName = "Kate", LastName = "Roberts", Email = "kate.roberts@school.com" },
                    new { FirstName = "Liam", LastName = "Garcia", Email = "liam.garcia@school.com" },
                    new { FirstName = "Mia", LastName = "White", Email = "mia.white@school.com" },
                    new { FirstName = "Noah", LastName = "Martinez", Email = "noah.martinez@school.com" },
                    new { FirstName = "Olivia", LastName = "Thompson", Email = "olivia.thompson@school.com" },
                    new { FirstName = "Paul", LastName = "Harris", Email = "paul.harris@school.com" },
                    new { FirstName = "Quinn", LastName = "Clark", Email = "quinn.clark@school.com" },
                    new { FirstName = "Ruby", LastName = "Lewis", Email = "ruby.lewis@school.com" },
                    new { FirstName = "Sam", LastName = "Walker", Email = "sam.walker@school.com" },
                    new { FirstName = "Tina", LastName = "Hall", Email = "tina.hall@school.com" }
                };

                foreach (var data in studentNames)
                {
                    // Check if user already exists
                    var existingUser = await userManager.FindByEmailAsync(data.Email);
                    if (existingUser != null)
                    {
                        Console.WriteLine($"ℹ️  User {data.Email} already exists, skipping");
                        continue;
                    }

                    var user = new ApplicationUser
                    {
                        UserName = data.Email,
                        Email = data.Email,
                        FirstName = data.FirstName,
                        LastName = data.LastName,
                        PhoneNumber = GeneratePhoneNumber(),
                        Address = GenerateAddress(),
                        DateOfBirth = GenerateDateOfBirth(18, 25),
                        Gender = new Random().Next(2) == 0 ? "Male" : "Female",
                        EmailConfirmed = true
                    };

                    var result = await userManager.CreateAsync(user, "Student@123!");
                    if (result.Succeeded)
                    {
                        await userManager.AddToRoleAsync(user, "Student");

                        var student = new Student
                        {
                            UserId = user.Id,
                            EnrollmentDate = GenerateEnrollmentDate()
                        };

                        context.Students.Add(student);
                        Console.WriteLine($"✅ Created student {data.FirstName} {data.LastName}");
                    }
                    else
                    {
                        Console.WriteLine($"❌ Failed to create user {data.FirstName} {data.LastName}:");
                        foreach (var error in result.Errors)
                        {
                            Console.WriteLine($"   - {error.Description}");
                        }
                    }
                }

                await context.SaveChangesAsync();
                
                var finalStudentCount = context.Students.Count();
                Console.WriteLine($"✅ Total students in database: {finalStudentCount}");
            }
            else
            {
                Console.WriteLine("ℹ️  Already have 20 or more students, skipping student creation");
            }
        }

        private static async Task SeedClassesAsync(SchoolManagementDbContext context)
        {
            Console.WriteLine("\n🏛️ CREATING CLASSES (12 records)");
            Console.WriteLine(new string('-', 40));

            if (!context.Classes.Any())
            {
                var courses = await context.Courses.ToListAsync();
                var lecturers = await context.Lecturers.ToListAsync();
                var semesters = await context.Semesters.ToListAsync();

                var summerSemester = semesters.First(s => s.Type == SemesterType.Summer);
                var winterSemester = semesters.First(s => s.Type == SemesterType.Winter);

                var classes = new List<Class>
                {
                    // Summer 2025 Classes
                    new Class { Name = "CS101-SUM25", CourseId = courses.First(c => c.Code == "CS101").Id, LecturerId = lecturers.First(l => l.User.FirstName == "John").Id, SemesterId = summerSemester.Id, MaxStudents = 30 },
                    new Class { Name = "MATH101-SUM25", CourseId = courses.First(c => c.Code == "MATH101").Id, LecturerId = lecturers.First(l => l.User.FirstName == "Sarah").Id, SemesterId = summerSemester.Id, MaxStudents = 25 },
                    new Class { Name = "BUS101-SUM25", CourseId = courses.First(c => c.Code == "BUS101").Id, LecturerId = lecturers.First(l => l.User.FirstName == "David").Id, SemesterId = summerSemester.Id, MaxStudents = 35 },
                    new Class { Name = "ENG101-SUM25", CourseId = courses.First(c => c.Code == "ENG101").Id, LecturerId = lecturers.First(l => l.User.FirstName == "Robert").Id, SemesterId = summerSemester.Id, MaxStudents = 20 },
                    new Class { Name = "CS201-SUM25", CourseId = courses.First(c => c.Code == "CS201").Id, LecturerId = lecturers.First(l => l.User.FirstName == "Michael").Id, SemesterId = summerSemester.Id, MaxStudents = 25 },
                    new Class { Name = "MATH201-SUM25", CourseId = courses.First(c => c.Code == "MATH201").Id, LecturerId = lecturers.First(l => l.User.FirstName == "Emily").Id, SemesterId = summerSemester.Id, MaxStudents = 30 },

                    // Winter 2026 Classes
                    new Class { Name = "CS301-WIN26", CourseId = courses.First(c => c.Code == "CS301").Id, LecturerId = lecturers.First(l => l.User.FirstName == "Lisa").Id, SemesterId = winterSemester.Id, MaxStudents = 25 },
                    new Class { Name = "CS401-WIN26", CourseId = courses.First(c => c.Code == "CS401").Id, LecturerId = lecturers.First(l => l.User.FirstName == "Jennifer").Id, SemesterId = winterSemester.Id, MaxStudents = 20 },
                    new Class { Name = "MATH301-WIN26", CourseId = courses.First(c => c.Code == "MATH301").Id, LecturerId = lecturers.First(l => l.User.FirstName == "James").Id, SemesterId = winterSemester.Id, MaxStudents = 25 },
                    new Class { Name = "BUS201-WIN26", CourseId = courses.First(c => c.Code == "BUS201").Id, LecturerId = lecturers.First(l => l.User.FirstName == "Maria").Id, SemesterId = winterSemester.Id, MaxStudents = 30 },
                    new Class { Name = "CS101-WIN26", CourseId = courses.First(c => c.Code == "CS101").Id, LecturerId = lecturers.First(l => l.User.FirstName == "John").Id, SemesterId = winterSemester.Id, MaxStudents = 30 },
                    new Class { Name = "MATH101-WIN26", CourseId = courses.First(c => c.Code == "MATH101").Id, LecturerId = lecturers.First(l => l.User.FirstName == "Sarah").Id, SemesterId = winterSemester.Id, MaxStudents = 25 }
                };

                context.Classes.AddRange(classes);
                await context.SaveChangesAsync();

                foreach (var cls in classes)
                {
                    Console.WriteLine($"✅ Created class {cls.Name} (Max: {cls.MaxStudents})");
                }
            }
            else
            {
                Console.WriteLine("ℹ️  Classes already exist");
            }
        }

        private static async Task SeedClassSchedulesAsync(SchoolManagementDbContext context)
        {
            Console.WriteLine("\n⏰ CREATING CLASS SCHEDULES (12 records)");
            Console.WriteLine(new string('-', 40));

            if (!context.ClassSchedules.Any())
            {
                var classes = await context.Classes.Include(c => c.Lecturer).ToListAsync();
                var schedules = new List<ClassSchedule>();

                var timeSlots = new[]
                {
                    new { StartTime = new TimeSpan(9, 0, 0), EndTime = new TimeSpan(10, 30, 0) },
                    new { StartTime = new TimeSpan(11, 0, 0), EndTime = new TimeSpan(12, 30, 0) },
                    new { StartTime = new TimeSpan(14, 0, 0), EndTime = new TimeSpan(15, 30, 0) },
                    new { StartTime = new TimeSpan(16, 0, 0), EndTime = new TimeSpan(17, 30, 0) }
                };

                for (int i = 0; i < classes.Count; i++)
                {
                    var cls = classes[i];
                    var timeSlot = timeSlots[i % timeSlots.Length];
                    var dayOfWeek = (DayOfWeek)(i % 5 + 1); // Monday to Friday

                    var schedule = new ClassSchedule
                    {
                        ClassId = cls.Id,
                        LecturerId = cls.LecturerId!.Value,
                        Day = dayOfWeek,
                        StartTime = timeSlot.StartTime,
                        EndTime = timeSlot.EndTime
                    };

                    schedules.Add(schedule);
                    Console.WriteLine($"✅ Scheduled {cls.Name} on {dayOfWeek} {timeSlot.StartTime:hh\\:mm}-{timeSlot.EndTime:hh\\:mm}");
                }

                context.ClassSchedules.AddRange(schedules);
                await context.SaveChangesAsync();
            }
            else
            {
                Console.WriteLine("ℹ️  Class schedules already exist");
            }
        }

        private static async Task SeedEnrollmentsAsync(SchoolManagementDbContext context)
        {
            Console.WriteLine("\n📝 CREATING ENROLLMENTS (~70 records)");
            Console.WriteLine(new string('-', 40));

            if (!context.Enrollments.Any())
            {
                var students = await context.Students.ToListAsync();
                var classes = await context.Classes.Include(c => c.Semester).ToListAsync();
                var enrollments = new List<Enrollment>();
                var random = new Random();

                var summerClasses = classes.Where(c => c.Semester.Type == SemesterType.Summer).ToList();
                var winterClasses = classes.Where(c => c.Semester.Type == SemesterType.Winter).ToList();

                // Enroll each student in 3-5 classes
                foreach (var student in students)
                {
                    var numClasses = random.Next(3, 6); // 3-5 classes per student
                    var availableClasses = new List<Class>();
                    
                    // Randomly decide if student takes summer, winter, or both
                    var semesterChoice = random.Next(3);
                    if (semesterChoice == 0) availableClasses.AddRange(summerClasses);
                    else if (semesterChoice == 1) availableClasses.AddRange(winterClasses);
                    else availableClasses.AddRange(classes);

                    var selectedClasses = availableClasses.OrderBy(x => random.Next()).Take(numClasses);

                    foreach (var cls in selectedClasses)
                    {
                        var enrollment = new Enrollment
                        {
                            StudentId = student.Id,
                            ClassId = cls.Id,
                            SemesterId = cls.SemesterId,
                            Grade = null // No grades assigned yet
                        };

                        enrollments.Add(enrollment);
                    }
                }

                context.Enrollments.AddRange(enrollments);
                await context.SaveChangesAsync();

                Console.WriteLine($"✅ Created {enrollments.Count} enrollments");
                
                // Show enrollment statistics
                foreach (var cls in classes)
                {
                    var enrollmentCount = enrollments.Count(e => e.ClassId == cls.Id);
                    Console.WriteLine($"   - {cls.Name}: {enrollmentCount} students enrolled");
                }
            }
            else
            {
                Console.WriteLine("ℹ️  Enrollments already exist");
            }
        }

        // Helper methods for generating realistic data
        private static string GeneratePhoneNumber()
        {
            var random = new Random();
            return $"+1 ({random.Next(200, 999)}) {random.Next(200, 999)}-{random.Next(1000, 9999)}";
        }

        private static string GenerateWorkPhone()
        {
            var random = new Random();
            return $"+1 ({random.Next(200, 999)}) {random.Next(200, 999)}-{random.Next(1000, 9999)} ext.{random.Next(100, 999)}";
        }

        private static string GenerateAddress()
        {
            var random = new Random();
            var streets = new[] { "Main St", "Oak Ave", "Pine Rd", "Cedar Ln", "Maple Dr", "Elm St", "Park Ave", "First St", "Second St", "Third Ave" };
            var cities = new[] { "Springfield", "Madison", "Georgetown", "Franklin", "Clinton", "Riverside", "Fairview", "Midway", "Kingston", "Salem" };
            var states = new[] { "CA", "NY", "TX", "FL", "IL", "PA", "OH", "MI", "GA", "NC" };
            
            return $"{random.Next(100, 9999)} {streets[random.Next(streets.Length)]}, {cities[random.Next(cities.Length)]}, {states[random.Next(states.Length)]} {random.Next(10000, 99999)}";
        }

        private static DateTime GenerateDateOfBirth(int minAge, int maxAge)
        {
            var random = new Random();
            var age = random.Next(minAge, maxAge + 1);
            return DateTime.Now.AddYears(-age).AddDays(random.Next(-365, 365));
        }

        private static DateTime GenerateEnrollmentDate()
        {
            var random = new Random();
            var startDate = new DateTime(2024, 1, 1);
            var endDate = new DateTime(2025, 12, 31);
            var range = (endDate - startDate).Days;
            return startDate.AddDays(random.Next(range));
        }
    }
}