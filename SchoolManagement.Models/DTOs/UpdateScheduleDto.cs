using System.ComponentModel.DataAnnotations;

namespace SchoolManagement.Models.DTOs
{
    public class UpdateScheduleDto
    {
        [Required(ErrorMessage = "Schedule ID is required.")]
        public int Id { get; set; }

        [Required(ErrorMessage = "Class ID is required.")]
        public int ClassId { get; set; }

        [Required(ErrorMessage = "Lecturer ID is required.")]
        public int LecturerId { get; set; }

        [Required(ErrorMessage = "Day is required.")]
        public DayOfWeek Day { get; set; }

        [Required(ErrorMessage = "Start time is required.")]
        [RegularExpression(@"^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$", ErrorMessage = "Start time must be in HH:MM format.")]
        public string StartTime { get; set; } = null!;

        [Required(ErrorMessage = "End time is required.")]
        [RegularExpression(@"^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$", ErrorMessage = "End time must be in HH:MM format.")]
        public string EndTime { get; set; } = null!;
    }
}