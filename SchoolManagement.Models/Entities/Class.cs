using System.Collections.Generic;

namespace SchoolManagement.Models.Entities
{
    public class Class
    {
        public int Id { get; set; }
        public int? LecturerId { get; set; }
        public int? CourseId { get; set; }
        public int SemesterId { get; set; }
        
        public virtual Course? Course { get; set; }
        public virtual Lecturer? Lecturer { get; set; }
        public virtual Semester Semester { get; set; } = null!;
        
        public virtual ICollection<Enrollment> Enrollments { get; } = new List<Enrollment>();
        public virtual ICollection<ClassSchedule> ClassSchedules { get; } = new List<ClassSchedule>();
        public virtual ICollection<Attendance> Attendances { get; } = new List<Attendance>();
    }
}