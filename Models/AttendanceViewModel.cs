namespace SchoolManagementApp.Models
{
    public class AttendanceViewModel
    {
        public int StudentId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public int ClassId { get; set; }
        public int SemesterId { get; set; }
        public DateTime Date { get; set; }
        public bool IsPresent { get; set; }
    }
}
