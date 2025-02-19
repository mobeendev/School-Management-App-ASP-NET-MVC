using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace SchoolManagementApp.Data
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
                .WithMany()
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
                .WithMany()
                .HasForeignKey(cs => cs.LecturerId)
                .OnDelete(DeleteBehavior.Cascade);
        }

    }



}