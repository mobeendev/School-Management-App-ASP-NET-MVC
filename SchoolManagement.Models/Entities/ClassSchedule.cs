using System;

namespace SchoolManagement.Models.Entities
{
    public class ClassSchedule
    {
        public int Id { get; set; }
        public int ClassId { get; set; }
        public int LecturerId { get; set; }
        public DayOfWeek Day { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        
        public virtual Class? Class { get; set; }
        public virtual Lecturer? Lecturer { get; set; }
    }
}