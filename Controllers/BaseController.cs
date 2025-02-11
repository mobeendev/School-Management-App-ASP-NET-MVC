using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace SchoolManagementApp.Controllers
{
    public class BaseController : Controller
    {
        /// <summary>
        /// Sets a success message using TempData
        /// </summary>
        /// <param name="message">The success message to display</param>
        protected void SetSuccessMessage(string message)
        {
            TempData["SuccessMessage"] = message;
        }

        /// <summary>
        /// Sets an error message using TempData
        /// </summary>
        /// <param name="message">The error message to display</param>
        protected void SetErrorMessage(string message)
        {
            TempData["ErrorMessage"] = message;
        }
    }
}