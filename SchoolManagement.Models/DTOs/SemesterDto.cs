using SchoolManagement.Models.Enums;
using System.ComponentModel.DataAnnotations;

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

    public class CreateSemesterDto : IValidatableObject
    {
        [Required(ErrorMessage = "Semester type is required.")]
        public SemesterType Type { get; set; }

        [Required(ErrorMessage = "Start date is required.")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "End date is required.")]
        public DateTime EndDate { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (StartDate >= EndDate)
            {
                yield return new ValidationResult(
                    "Start date must be before the end date.",
                    new[] { nameof(StartDate), nameof(EndDate) });
            }

            if (StartDate.Date < DateTime.Today)
            {
                yield return new ValidationResult(
                    "Start date cannot be in the past.",
                    new[] { nameof(StartDate) });
            }
        }
    }

    public class UpdateSemesterDto : IValidatableObject
    {
        [Required(ErrorMessage = "Semester ID is required.")]
        public int Id { get; set; }

        [Required(ErrorMessage = "Semester type is required.")]
        public SemesterType Type { get; set; }

        [Required(ErrorMessage = "Start date is required.")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "End date is required.")]
        public DateTime EndDate { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (StartDate >= EndDate)
            {
                yield return new ValidationResult(
                    "Start date must be before the end date.",
                    new[] { nameof(StartDate), nameof(EndDate) });
            }
        }
    }
}