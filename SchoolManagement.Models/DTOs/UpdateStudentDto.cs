using System;
using System.ComponentModel.DataAnnotations;

namespace SchoolManagement.Models.DTOs
{
    public class UpdateStudentDto
    {
        [Required(ErrorMessage = "Student ID is required.")]
        public int Id { get; set; }
        
        public DateTime? EnrollmentDate { get; set; }
        
        // Note: User information is updated separately through User Management
    }
}