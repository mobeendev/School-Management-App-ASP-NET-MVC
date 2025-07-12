using SchoolManagement.Models.Enums;

namespace SchoolManagement.Models.DTOs
{
    public class SemesterDto
    {
        public int Id { get; set; }
        public SemesterType Type { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string DisplayName => $"{Type} {StartDate.Year}";
    }

    public class CreateSemesterDto
    {
        public SemesterType Type { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public class UpdateSemesterDto
    {
        public int Id { get; set; }
        public SemesterType Type { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}