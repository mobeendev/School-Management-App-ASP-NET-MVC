using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace SchoolManagementApp.Data
{
    public class Semester
    {
        public int Id { get; set; }

        public SemesterType Type { get; set; } // Spring, Summer, Fall, Winter

        [DataType(DataType.Date)]
        public DateTime StartDate { get; set; }

        [DataType(DataType.Date)]  // Ensures the date-only format in UI

        public DateTime EndDate { get; set; }

        public virtual ICollection<Class> Classes { get; } = new List<Class>();

        public virtual ICollection<Enrollment> Enrollments { get; } = new List<Enrollment>();

        public override string ToString()
        {
            return $"{Type} {StartDate.Year}";
        }
    }

    public enum SemesterType
    {
        Spring,
        Summer,
        Fall,
        Winter
    }

}