# Future Enhancement: Reports Module

## Overview
This document outlines how to implement the Reports functionality for generating PDF/Excel reports for employee directory, departments, attendance, and salary data.

## Recommended NuGet Packages

### For PDF Generation
```bash
dotnet add package iTextSharp.LGPLv2.Core
# OR
dotnet add package QuestPDF
```

### For Excel Generation
```bash
dotnet add package EPPlus
# OR
dotnet add package ClosedXML
```

## Proposed Implementation

### 1. Create Report DTOs

```csharp
// dto/ReportDtos/ReportDto.cs
namespace HR_ADMIN_PORTAL.dto.ReportDtos
{
    public class EmployeeReportDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Department { get; set; }
        public long PhoneNo { get; set; }
        public long Salary { get; set; }
    }

    public class AttendanceReportDto
    {
        public string EmployeeName { get; set; }
        public string Department { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; }
        public TimeSpan? WorkingHours { get; set; }
    }

    public class DepartmentReportDto
    {
        public string Department { get; set; }
        public int EmployeeCount { get; set; }
        public decimal AverageSalary { get; set; }
        public int PresentCount { get; set; }
        public int AbsentCount { get; set; }
    }

    public class SalaryReportDto
    {
        public string EmployeeName { get; set; }
        public string Department { get; set; }
        public long Salary { get; set; }
        public int WorkingDays { get; set; }
        public decimal DailySalary { get; set; }
    }
}
```

### 2. Create Report Service Interface

```csharp
// Services/ReportService/IReportService.cs
namespace HR_ADMIN_PORTAL.Services.ReportService
{
    public interface IReportService
    {
        // PDF Reports
        byte[] GenerateEmployeeDirectoryPdf();
        byte[] GenerateDepartmentReportPdf();
        byte[] GenerateAttendanceReportPdf(DateTime startDate, DateTime endDate);
        byte[] GenerateSalaryReportPdf(int month, int year);

        // Excel Reports
        byte[] GenerateEmployeeDirectoryExcel();
        byte[] GenerateDepartmentReportExcel();
        byte[] GenerateAttendanceReportExcel(DateTime startDate, DateTime endDate);
        byte[] GenerateSalaryReportExcel(int month, int year);
    }
}
```

### 3. Implement Report Service

```csharp
// Services/ReportService/ReportService.cs
using HR_ADMIN_PORTAL.Repositories.Employees;
using HR_ADMIN_PORTAL.Repositories.Attendancerepo;
using OfficeOpenXml; // EPPlus

namespace HR_ADMIN_PORTAL.Services.ReportService
{
    public class ReportService : IReportService
    {
        private readonly IEmployeeRepository _employeeRepo;
        private readonly IAttendanceRepository _attendanceRepo;

        public ReportService(
            IEmployeeRepository employeeRepo,
            IAttendanceRepository attendanceRepo)
        {
            _employeeRepo = employeeRepo;
            _attendanceRepo = attendanceRepo;
        }

        public byte[] GenerateEmployeeDirectoryExcel()
        {
            var employees = _employeeRepo.GetAll();
            
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add("Employees");

            // Headers
            worksheet.Cells[1, 1].Value = "ID";
            worksheet.Cells[1, 2].Value = "Name";
            worksheet.Cells[1, 3].Value = "Email";
            worksheet.Cells[1, 4].Value = "Department";
            worksheet.Cells[1, 5].Value = "Phone";
            worksheet.Cells[1, 6].Value = "Salary";

            // Data
            int row = 2;
            foreach (var emp in employees)
            {
                worksheet.Cells[row, 1].Value = emp.Id;
                worksheet.Cells[row, 2].Value = emp.EmployeeName;
                worksheet.Cells[row, 3].Value = emp.EmployeeEmail;
                worksheet.Cells[row, 4].Value = emp.Department.ToString();
                worksheet.Cells[row, 5].Value = emp.phoneNo;
                worksheet.Cells[row, 6].Value = emp.Salary;
                row++;
            }

            worksheet.Cells.AutoFitColumns();
            return package.GetAsByteArray();
        }

        // Implement other methods similarly...
    }
}
```

### 4. Create Reports Controller

```csharp
// Controllers/ReportsController.cs
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
            var pdf = _reportService.GenerateEmployeeDirectoryPdf();
            return File(pdf, "application/pdf", "employee-directory.pdf");
        }

        [HttpGet("employee-directory/excel")]
        public IActionResult GetEmployeeDirectoryExcel()
        {
            var excel = _reportService.GenerateEmployeeDirectoryExcel();
            return File(excel, 
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "employee-directory.xlsx");
        }

        // Attendance Reports
        [HttpGet("attendance/pdf")]
        public IActionResult GetAttendanceReportPdf(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            var pdf = _reportService.GenerateAttendanceReportPdf(startDate, endDate);
            return File(pdf, "application/pdf", 
                $"attendance-report-{startDate:yyyy-MM-dd}-to-{endDate:yyyy-MM-dd}.pdf");
        }

        [HttpGet("attendance/excel")]
        public IActionResult GetAttendanceReportExcel(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            var excel = _reportService.GenerateAttendanceReportExcel(startDate, endDate);
            return File(excel,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                $"attendance-report-{startDate:yyyy-MM-dd}-to-{endDate:yyyy-MM-dd}.xlsx");
        }

        // Department Reports
        [HttpGet("departments/pdf")]
        public IActionResult GetDepartmentReportPdf()
        {
            var pdf = _reportService.GenerateDepartmentReportPdf();
            return File(pdf, "application/pdf", "department-report.pdf");
        }

        [HttpGet("departments/excel")]
        public IActionResult GetDepartmentReportExcel()
        {
            var excel = _reportService.GenerateDepartmentReportExcel();
            return File(excel,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "department-report.xlsx");
        }

        // Salary Reports
        [HttpGet("salary/pdf")]
        public IActionResult GetSalaryReportPdf(
            [FromQuery] int month,
            [FromQuery] int year)
        {
            var pdf = _reportService.GenerateSalaryReportPdf(month, year);
            return File(pdf, "application/pdf", 
                $"salary-report-{year}-{month:D2}.pdf");
        }

        [HttpGet("salary/excel")]
        public IActionResult GetSalaryReportExcel(
            [FromQuery] int month,
            [FromQuery] int year)
        {
            var excel = _reportService.GenerateSalaryReportExcel(month, year);
            return File(excel,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                $"salary-report-{year}-{month:D2}.xlsx");
        }
    }
}
```

### 5. Register in Program.cs

```csharp
builder.Services.AddScoped<IReportService, ReportService>();
```

### 6. Example HTTP Requests

```http
### Get Employee Directory PDF
GET {{HR_ADMIN_PORTAL_HostAddress}}/api/Reports/employee-directory/pdf
Authorization: Bearer {{token}}

### Get Employee Directory Excel
GET {{HR_ADMIN_PORTAL_HostAddress}}/api/Reports/employee-directory/excel
Authorization: Bearer {{token}}

### Get Attendance Report PDF
GET {{HR_ADMIN_PORTAL_HostAddress}}/api/Reports/attendance/pdf?startDate=2024-02-01&endDate=2024-02-28
Authorization: Bearer {{token}}

### Get Attendance Report Excel
GET {{HR_ADMIN_PORTAL_HostAddress}}/api/Reports/attendance/excel?startDate=2024-02-01&endDate=2024-02-28
Authorization: Bearer {{token}}

### Get Department Report PDF
GET {{HR_ADMIN_PORTAL_HostAddress}}/api/Reports/departments/pdf
Authorization: Bearer {{token}}

### Get Department Report Excel
GET {{HR_ADMIN_PORTAL_HostAddress}}/api/Reports/departments/excel
Authorization: Bearer {{token}}

### Get Salary Report PDF
GET {{HR_ADMIN_PORTAL_HostAddress}}/api/Reports/salary/pdf?month=2&year=2024
Authorization: Bearer {{token}}

### Get Salary Report Excel
GET {{HR_ADMIN_PORTAL_HostAddress}}/api/Reports/salary/excel?month=2&year=2024
Authorization: Bearer {{token}}
```

## Report Types to Implement

### 1. Employee Directory Report
- List all employees with contact details
- Group by department
- Include total employee count

### 2. Department Report
- Employee count per department
- Average salary per department
- Attendance statistics per department

### 3. Attendance Report
- Date range based attendance
- Employee-wise attendance summary
- Department-wise attendance
- Present/Absent/Leave counts

### 4. Salary Report
- Monthly salary breakdown
- Salary by department
- Total salary expense
- Individual employee salary slips

## Advanced Features to Consider

1. **Scheduled Reports** - Generate and email reports automatically
2. **Report Templates** - Customizable report layouts
3. **Charts & Graphs** - Visual data representation
4. **Filters** - Department, date range, employee filters
5. **Report History** - Store generated reports
6. **Bulk Download** - Download multiple reports as ZIP

## Installation Steps

```bash
# Navigate to project directory
cd HR_ADMIN_PORTAL

# Install required packages
dotnet add package EPPlus
dotnet add package QuestPDF

# Build the project
dotnet build

# Run the project
dotnet run
```

## Testing Reports

1. Use Postman or browser to download PDF/Excel files
2. Verify data accuracy
3. Check formatting and styling
4. Test with different date ranges and filters
5. Validate file downloads and MIME types

---

**Note:** This is a blueprint for implementing the Reports module. Follow similar patterns used in the Attendance module for consistency.
