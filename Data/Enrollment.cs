using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;


namespace SchoolManagementApp.Data
{
    public class Enrollment
    {
        public int Id { get; set; }

        public int? StudentId { get; set; }

        public int? ClassId { get; set; }

        [Required]
        public int SemesterId { get; set; }

        public string? Grade { get; set; }

        public virtual Class? Class { get; set; }

        public virtual Student? Student { get; set; }

        [ValidateNever]
        public virtual Semester Semester { get; set; } = null!;
    }
}
