using System;
using System.ComponentModel.DataAnnotations;

namespace SchoolManagement.Models.DTOs
{
    public class CreateStudentDto
    {
        [Required(ErrorMessage = "User ID is required.")]
        public string UserId { get; set; } = null!;
        
        public DateTime? EnrollmentDate { get; set; }
    }
}