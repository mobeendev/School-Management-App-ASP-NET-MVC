namespace SchoolManagement.Models.DTOs
{
    public class ScheduleDto
    {
        public int Id { get; set; }
        public int ClassId { get; set; }
        public int LecturerId { get; set; }
        public DayOfWeek Day { get; set; }
        public string StartTime { get; set; } = null!; // "HH:MM" format
        public string EndTime { get; set; } = null!;   // "HH:MM" format
        public string? ClassName { get; set; }    // For display
        public string? LecturerName { get; set; } // For display
    }
}