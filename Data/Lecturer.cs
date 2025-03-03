using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SchoolManagementApp.Data
{
    public partial class Lecturer
    {

        public int Id { get; set; }

        public int Salary { get; set; }

        public string Designation { get; set; } = null!;
        public Qualification Qualification { get; set; } = Qualification.None;
        public int YearsOfExperience { get; set; }
        public string? WorkPhoneNumber { get; set; }
        public int TeachingHoursPerWeek { get; set; }
        public string Status { get; set; } = "Active";

        public string UserId { get; set; } = null!;
        public virtual ApplicationUser User { get; set; } = null!;

        public virtual ICollection<Class> Classes { get; } = new List<Class>();

        public override string ToString()
        {
            return User != null ? $"{User.FirstName} {User.LastName} --" : "Unknown Lecturer";
        }
    }

}