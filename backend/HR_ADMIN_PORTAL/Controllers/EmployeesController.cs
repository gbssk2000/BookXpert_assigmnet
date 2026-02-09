using HR_ADMIN_PORTAL.dto.EmployeeDtos;
using HR_ADMIN_PORTAL.Models;
using HR_ADMIN_PORTAL.Services.EmployeeService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HR_ADMIN_PORTAL.Controllers
{
    [ApiController]
    [Route("api/employees")]
    [Authorize]
    public class EmployeesController : Controller
    {
        [HttpGet("secure-test")]
        public IActionResult GetSecureData()
        {
            return Ok("This is protected data");
        }
        private readonly IEmployeeService _employeeService;

        public EmployeesController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_employeeService.GetAll());
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var employee = _employeeService.GetById(id);
            if (employee == null)
                return NotFound("Employee not found");

            return Ok(employee);
        }

        [HttpPost]
        public IActionResult Add(EmployeeCreateAndUpdateDto dto)
        {
            _employeeService.Add(dto);
            return Ok("Employee created successfully");
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, EmployeeCreateAndUpdateDto dto)
        {
            _employeeService.Update(id, dto);
            return Ok("Employee updated successfully");
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _employeeService.Delete(id);
            return Ok("Employee deleted successfully");
        }
    }
}
