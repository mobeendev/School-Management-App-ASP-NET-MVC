using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using SchoolManagement.Models.Entities;
using Microsoft.AspNetCore.Identity;

namespace SchoolManagement.Repositories.Context
{
    public class SchoolManagementDbContext : IdentityDbContext<ApplicationUser>
    {
        public SchoolManagementDbContext(DbContextOptions<SchoolManagementDbContext> options) : base(options)
        {
        }

        public virtual DbSet<Class> Classes { get; set; }
        public virtual DbSet<Course> Courses { get; set; }
        public virtual DbSet<Enrollment> Enrollments { get; set; }
        public virtual DbSet<Lecturer> Lecturers { get; set; }
        public virtual DbSet<Student> Students { get; set; }
        public virtual DbSet<ClassSchedule> ClassSchedules { get; set; }
        public virtual DbSet<Semester> Semesters { get; set; }
        public virtual DbSet<Attendance> Attendances { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // One-to-Many: Class <-> Semester
            modelBuilder.Entity<Class>()
                .HasOne(c => c.Semester)
                .WithMany(s => s.Classes)
                .HasForeignKey(c => c.SemesterId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-Many: Enrollment <-> Semester
            modelBuilder.Entity<Enrollment>()
                .HasOne(e => e.Semester)
                .WithMany(s => s.Enrollments)
                .HasForeignKey(e => e.SemesterId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-Many: Attendance <-> Semester
            modelBuilder.Entity<Attendance>()
                .HasOne(a => a.Semester)
                .WithMany(s => s.Attendances)
                .HasForeignKey(a => a.SemesterId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-Many: Class <-> ClassSchedule
            modelBuilder.Entity<ClassSchedule>()
                .HasOne(cs => cs.Class)
                .WithMany(c => c.ClassSchedules)
                .HasForeignKey(cs => cs.ClassId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-Many: Lecturer <-> ClassSchedule
            modelBuilder.Entity<ClassSchedule>()
                .HasOne(cs => cs.Lecturer)
                .WithMany(l => l.ClassSchedules)
                .HasForeignKey(cs => cs.LecturerId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-One: Lecturer <-> ApplicationUser
            modelBuilder.Entity<Lecturer>()
                .HasOne(l => l.User)
                .WithOne()
                .HasForeignKey<Lecturer>(l => l.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // One-to-One: Student <-> ApplicationUser
            modelBuilder.Entity<Student>()
                .HasOne(s => s.User)
                .WithOne()
                .HasForeignKey<Student>(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Unique constraint: One student per user
            modelBuilder.Entity<Student>()
                .HasIndex(s => s.UserId)
                .IsUnique();

            // Rename default Identity tables
            modelBuilder.Entity<ApplicationUser>().ToTable("Users");
            modelBuilder.Entity<IdentityRole>().ToTable("Roles");
            modelBuilder.Entity<IdentityUserClaim<string>>().ToTable("UserClaims");
            modelBuilder.Entity<IdentityUserRole<string>>().ToTable("UserRoles");
            modelBuilder.Entity<IdentityUserLogin<string>>().ToTable("UserLogins");
            modelBuilder.Entity<IdentityRoleClaim<string>>().ToTable("RoleClaims");
            modelBuilder.Entity<IdentityUserToken<string>>().ToTable("UserTokens");
        }
    }
}