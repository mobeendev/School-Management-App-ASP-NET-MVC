using SchoolManagement.Models.Enums;

namespace SchoolManagement.Models.DTOs
{
    public class LecturerDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public int Salary { get; set; }
        public string Designation { get; set; } = null!;
        public Qualification Qualification { get; set; }
        public int YearsOfExperience { get; set; }
        public string? WorkPhoneNumber { get; set; }
        public int TeachingHoursPerWeek { get; set; }
        public string Status { get; set; } = "Active";
        public string FullName => $"{FirstName} {LastName}";
    }
}