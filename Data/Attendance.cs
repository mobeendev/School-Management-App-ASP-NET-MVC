using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SchoolManagementApp.Data
{
    public class Attendance
    {
        public int Id { get; set; }

        public int StudentId { get; set; }

        public int ClassId { get; set; }

        public int SemesterId { get; set; }

        public DateTime Date { get; set; }

        public bool IsPresent { get; set; }

        public virtual Student Student { get; set; } = null!;

        public virtual Class Class { get; set; } = null!;

        public virtual Semester Semester { get; set; } = null!;
    }

}