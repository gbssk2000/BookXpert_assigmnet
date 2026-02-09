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
