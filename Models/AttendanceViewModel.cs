namespace SchoolManagementApp.Models
{
    public class AttendanceViewModel
    {
        public int AttendanceId { get; set; }
        public string StudentName { get; set; } // Combined FirstName + LastName
        public string CourseName { get; set; }  // From Class → Course
        public string CourseCode { get; set; }  // From Class → Course
        public string ClassName { get; set; }    // Derived from Class ID
        public string Semester { get; set; }     // From Semester.Type + Year
        public DateTime Date { get; set; }
        public bool IsPresent { get; set; }
    }
}