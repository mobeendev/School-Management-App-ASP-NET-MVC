using System.ComponentModel.DataAnnotations;
using SchoolManagementApp.Data;

namespace SchoolManagementApp.Models;
public class LecturerViewModel
{
    public int Id { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [DataType(DataType.Password)]
    public string? Password { get; set; }

    [Display(Name = "First Name")]
    public string FirstName { get; set; } = null!;

    [Display(Name = "Last Name")]
    public string LastName { get; set; } = null!;

    [Display(Name = "Role")]
    public string Role { get; set; } = null!;

    public int Salary { get; set; }

    [MaxLength(20)]
    public string Gender { get; set; }

    public Qualification Qualification { get; set; } = Qualification.None;
    public int YearsOfExperience { get; set; }
    public string? WorkPhoneNumber { get; set; }

    public string Designation { get; set; } = null!;



}
