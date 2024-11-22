using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SchoolManagementApp.Data
{
    public class Class
    {
        public int Id { get; set; }

        public int? LecturerId { get; set; }

        public int? CourseId { get; set; }

        public TimeSpan? Time { get; set; }

        public virtual Course? Course { get; set; }

        public virtual ICollection<Enrollment> Enrollments { get; } = new List<Enrollment>();

        public virtual Lecturer? Lecturer { get; set; }
    }
}