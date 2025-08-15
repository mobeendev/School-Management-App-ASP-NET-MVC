using System;

namespace SchoolManagement.Models.DTOs
{
    public class ClassDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int CourseId { get; set; }
        public string CourseName { get; set; } = string.Empty;
        public int SemesterId { get; set; }
        public string SemesterName { get; set; } = string.Empty;
        public int MaxStudents { get; set; }
    }

    public class CreateClassDto
    {
        public string Name { get; set; } = string.Empty;
        public int CourseId { get; set; }
        public int SemesterId { get; set; }
        public int MaxStudents { get; set; }
    }

    public class UpdateClassDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int CourseId { get; set; }
        public int SemesterId { get; set; }
        public int MaxStudents { get; set; }
    }
}