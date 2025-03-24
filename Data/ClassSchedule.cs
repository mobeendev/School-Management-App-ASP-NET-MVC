using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolManagementApp.Data
{
    public class ClassSchedule
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Class is required")]
        [Display(Name = "Class")]
        public int ClassId { get; set; }

        [Required(ErrorMessage = "Lecturer is required")]
        [Display(Name = "Lecturer")]
        public int LecturerId { get; set; }

        [Required(ErrorMessage = "Day of week is required")]
        [Display(Name = "Day of Week")]
        public DayOfWeek Day { get; set; } // Monday, Tuesday, etc.

        [Required(ErrorMessage = "Start time is required")]
        [DataType(DataType.Time)]
        [Display(Name = "Start Time")]
        public TimeSpan StartTime { get; set; }

        [Required(ErrorMessage = "End time is required")]
        [DataType(DataType.Time)]
        [Display(Name = "End Time")]
        public TimeSpan EndTime { get; set; }

        public virtual Class? Class { get; set; }

        public virtual Lecturer? Lecturer { get; set; }
    }
}