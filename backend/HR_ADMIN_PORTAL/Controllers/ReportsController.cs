using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HR_ADMIN_PORTAL.Services.ReportService;

namespace HR_ADMIN_PORTAL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportsController(IReportService reportService)
        {
            _reportService = reportService;
        }

        // Employee Directory Reports
        [HttpGet("employee-directory/pdf")]
        public IActionResult GetEmployeeDirectoryPdf()
        {
            try
            {
                var pdf = _reportService.GenerateEmployeeDirectoryPdf();
                return File(pdf, "application/pdf", $"employee-directory-{DateTime.Now:yyyyMMdd}.pdf");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error generating PDF report", error = ex.Message });
            }
        }

        [HttpGet("employee-directory/excel")]
        public IActionResult GetEmployeeDirectoryExcel()
        {
            try
            {
                var excel = _reportService.GenerateEmployeeDirectoryExcel();
                return File(excel, 
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    $"employee-directory-{DateTime.Now:yyyyMMdd}.xlsx");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error generating Excel report", error = ex.Message });
            }
        }

        // Attendance Reports
        [HttpGet("attendance/pdf")]
        public IActionResult GetAttendanceReportPdf(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            try
            {
                if (startDate > endDate)
                    return BadRequest(new { message = "Start date must be before end date" });

                var pdf = _reportService.GenerateAttendanceReportPdf(startDate, endDate);
                return File(pdf, "application/pdf", 
                    $"attendance-report-{startDate:yyyyMMdd}-to-{endDate:yyyyMMdd}.pdf");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error generating PDF report", error = ex.Message });
            }
        }

        [HttpGet("attendance/excel")]
        public IActionResult GetAttendanceReportExcel(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            try
            {
                if (startDate > endDate)
                    return BadRequest(new { message = "Start date must be before end date" });

                var excel = _reportService.GenerateAttendanceReportExcel(startDate, endDate);
                return File(excel,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    $"attendance-report-{startDate:yyyyMMdd}-to-{endDate:yyyyMMdd}.xlsx");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error generating Excel report", error = ex.Message });
            }
        }

        // Department Reports
        [HttpGet("departments/pdf")]
        public IActionResult GetDepartmentReportPdf()
        {
            try
            {
                var pdf = _reportService.GenerateDepartmentReportPdf();
                return File(pdf, "application/pdf", $"department-report-{DateTime.Now:yyyyMMdd}.pdf");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error generating PDF report", error = ex.Message });
            }
        }

        [HttpGet("departments/excel")]
        public IActionResult GetDepartmentReportExcel()
        {
            try
            {
                var excel = _reportService.GenerateDepartmentReportExcel();
                return File(excel,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    $"department-report-{DateTime.Now:yyyyMMdd}.xlsx");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error generating Excel report", error = ex.Message });
            }
        }

        // Salary Reports
        [HttpGet("salary/pdf")]
        public IActionResult GetSalaryReportPdf(
            [FromQuery] int month,
            [FromQuery] int year)
        {
            try
            {
                if (month < 1 || month > 12)
                    return BadRequest(new { message = "Month must be between 1 and 12" });

                if (year < 2000 || year > DateTime.Now.Year)
                    return BadRequest(new { message = "Invalid year" });

                var pdf = _reportService.GenerateSalaryReportPdf(month, year);
                return File(pdf, "application/pdf", 
                    $"salary-report-{year}-{month:D2}.pdf");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error generating PDF report", error = ex.Message });
            }
        }

        [HttpGet("salary/excel")]
        public IActionResult GetSalaryReportExcel(
            [FromQuery] int month,
            [FromQuery] int year)
        {
            try
            {
                if (month < 1 || month > 12)
                    return BadRequest(new { message = "Month must be between 1 and 12" });

                if (year < 2000 || year > DateTime.Now.Year)
                    return BadRequest(new { message = "Invalid year" });

                var excel = _reportService.GenerateSalaryReportExcel(month, year);
                return File(excel,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    $"salary-report-{year}-{month:D2}.xlsx");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error generating Excel report", error = ex.Message });
            }
        }
    }
}
