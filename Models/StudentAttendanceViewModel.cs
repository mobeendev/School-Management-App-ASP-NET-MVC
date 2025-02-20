namespace SchoolManagementApp.Models
{
    public class StudentAttendanceViewModel
    {
        public int StudentId { get; set; }
        public string FullName { get; set; }
        public bool IsPresent { get; set; }
        public int? ExistingAttendanceId { get; set; }
    }
}