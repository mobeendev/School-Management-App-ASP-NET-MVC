using System;

namespace SchoolManagement.Models.DTOs
{
    public class StudentDto
    {
        public int Id { get; set; }
        public string UserId { get; set; } = null!;
        public DateTime? EnrollmentDate { get; set; }
        
        // User information (from navigation)
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Address { get; set; }
        
        public string FullName => $"{FirstName} {LastName}";
    }
}