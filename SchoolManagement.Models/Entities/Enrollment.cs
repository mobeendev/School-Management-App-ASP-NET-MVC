namespace SchoolManagement.Models.Entities
{
    public class Enrollment
    {
        public int Id { get; set; }
        public int? StudentId { get; set; }
        public int? ClassId { get; set; }
        public int SemesterId { get; set; }
        public string? Grade { get; set; }
        
        public virtual Class? Class { get; set; }
        public virtual Student? Student { get; set; }
        public virtual Semester Semester { get; set; } = null!;
    }
}