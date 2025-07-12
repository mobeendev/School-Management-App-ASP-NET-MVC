namespace SchoolManagement.Models.DTOs
{
    public class CourseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Code { get; set; }
        public int? Credits { get; set; }
        public string DisplayName => $"{Name} ({Code})";
    }
}