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
            // return new SelectList(_context.Courses, "Id", "Name");

            return new SelectList(_context.Courses.Select(c => new
            {
                Id = c.Id,
                Name = c.Name + " " + c.Code
            }), "Id", "Name");

        }

        public SelectList GetLecturers()
        {
            return new SelectList(_context.Lecturers.Select(l => new
            {
                Id = l.Id,
                FullName = l.FirstName + " " + l.LastName
            }), "Id", "FullName");
        }

        public SelectList GetStudents()
        {

            return new SelectList(_context.Students.Select(l => new
            {
                Id = l.Id,
                Name = l.FirstName + " " + l.LastName
            }), "Id", "Name");
        }

        public SelectList GetClasses()
        {
            return new SelectList(_context.Classes
                                    .Where(c => c.Course != null)
                                    .Select(c => new
                                    {
                                        c.Id,
                                        CourseName = c.Id + " " + c.Course!.Name + " " + c.Course!.Code
                                    }),
                                    "Id", "CourseName");
        }

    }
}



