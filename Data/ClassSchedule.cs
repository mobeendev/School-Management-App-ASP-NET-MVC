using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SchoolManagementApp.Data
{
    public class ClassSchedule
    {
        public int Id { get; set; }

        public int ClassId { get; set; }

        public int LecturerId { get; set; }

        public DayOfWeek Day { get; set; } // Monday, Tuesday, etc.

        public TimeSpan StartTime { get; set; }

        public TimeSpan EndTime { get; set; }

        public virtual Class Class { get; set; } = null!;

        public virtual Lecturer Lecturer { get; set; } = null!;
    }

}