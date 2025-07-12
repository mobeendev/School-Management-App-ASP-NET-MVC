using System;
using System.Collections.Generic;

namespace SchoolManagement.Models.Entities
{
    public class Student
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public DateTime? DateOfBirth { get; set; }
        
        public virtual ICollection<Enrollment> Enrollments { get; } = new List<Enrollment>();
        public virtual ICollection<Attendance> Attendances { get; } = new List<Attendance>();
    }
}