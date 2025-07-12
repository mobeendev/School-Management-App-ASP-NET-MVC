using Microsoft.AspNetCore.Mvc;

namespace SchoolManagement.Api.Controllers
{
    public class BaseController : Controller
    {
        protected void SetSuccessMessage(string message)
        {
            TempData["SuccessMessage"] = message;
        }

        protected void SetErrorMessage(string message)
        {
            TempData["ErrorMessage"] = message;
        }
    }
}