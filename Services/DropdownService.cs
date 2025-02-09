using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SchoolManagementApp.Data;
using Microsoft.AspNetCore.Mvc.Rendering;


namespace SchoolManagementApp.Services
{
    public class DropdownService
    {
        private readonly SchoolManagementDbContext _context;

        public DropdownService(SchoolManagementDbContext context)
        {
            _context = context;
        }

        public SelectList GetCourses()
        {
            return new SelectList(_context.Courses, "Id", "Name");
        }

        public SelectList GetLecturers()
        {
            return new SelectList(_context.Lecturers.Select(l => new
            {
                Id = l.Id,
                FullName = l.FirstName + " " + l.LastName
            }), "Id", "FullName");
        }
    }
}



