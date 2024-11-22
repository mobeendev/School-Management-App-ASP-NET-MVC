using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SchoolManagementApp.Data
{
    public class Course
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string? Code { get; set; }

        public int? Credits { get; set; }

        public virtual ICollection<Class> Classes { get; } = new List<Class>();
    }
}