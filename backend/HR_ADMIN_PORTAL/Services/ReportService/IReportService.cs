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
