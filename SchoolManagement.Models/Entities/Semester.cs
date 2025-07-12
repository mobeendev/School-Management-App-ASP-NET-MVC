using System;
using System.Collections.Generic;
using SchoolManagement.Models.Enums;

namespace SchoolManagement.Models.Entities
{
    public class Semester
    {
        public int Id { get; set; }
        public SemesterType Type { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        
        public virtual ICollection<Class> Classes { get; } = new List<Class>();
        public virtual ICollection<Enrollment> Enrollments { get; } = new List<Enrollment>();
        public virtual ICollection<Attendance> Attendances { get; } = new List<Attendance>();
        
        public override string ToString()
        {
            return $"{Type} {StartDate.Year}";
        }
    }
}