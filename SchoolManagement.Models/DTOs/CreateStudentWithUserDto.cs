using System;
using System.ComponentModel.DataAnnotations;

namespace SchoolManagement.Models.DTOs
{
    public class CreateStudentWithUserDto
    {
        // User Information
        [Required(ErrorMessage = "First name is required.")]
        public string FirstName { get; set; } = null!;
        
        [Required(ErrorMessage = "Last name is required.")]
        public string LastName { get; set; } = null!;
        
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public string Email { get; set; } = null!;
        
        [Required(ErrorMessage = "Password is required.")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
        public string Password { get; set; } = null!;
        
        [Required(ErrorMessage = "Password confirmation is required.")]
        [Compare("Password", ErrorMessage = "Passwords do not match.")]
        public string ConfirmPassword { get; set; } = null!;
        
        [Phone(ErrorMessage = "Invalid phone number.")]
        public string? PhoneNumber { get; set; }
        
        public DateTime? DateOfBirth { get; set; }
        
        public string? Address { get; set; }
        
        // Student Information
        public DateTime? EnrollmentDate { get; set; }
    }
}