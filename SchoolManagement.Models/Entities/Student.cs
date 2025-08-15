using System;
using System.Collections.Generic;

namespace SchoolManagement.Models.Entities
{
    public class Student
    {
        public int Id { get; set; }
        public string UserId { get; set; } = null!; // FK to ApplicationUser
        public DateTime? EnrollmentDate { get; set; } = DateTime.Now;
        
        // Navigation Properties
        public virtual ApplicationUser User { get; set; } = null!;
        public virtual ICollection<Enrollment> Enrollments { get; } = new List<Enrollment>();
        public virtual ICollection<Attendance> Attendances { get; } = new List<Attendance>();
        
        // Helper property for display
        public override string ToString()
        {
            return User != null ? $"{User.FirstName} {User.LastName}" : "Unknown Student";
        }
    }
}