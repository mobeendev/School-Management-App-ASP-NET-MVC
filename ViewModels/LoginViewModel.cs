using System.ComponentModel.DataAnnotations;

namespace SchoolManagementApp.ViewModels
{
    public class LoginViewModel
    {
        [Required]
        public string Email { get; set; }

        [Required]
        [MinLength(6, ErrorMessage = "Password has to be at least 6 characters")]
        public string Password { get; set; }

        public string? ReturnUrl { get; set; }
    }
}
