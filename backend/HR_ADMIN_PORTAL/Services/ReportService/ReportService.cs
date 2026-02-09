using HR_ADMIN_PORTAL.dto.ReportDtos;
using HR_ADMIN_PORTAL.Repositories.Employees;
using HR_ADMIN_PORTAL.Repositories.Attendancerepo;
using OfficeOpenXml;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

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

        #region Excel Reports

        public byte[] GenerateEmployeeDirectoryExcel()
        {
            var employees = _employeeRepo.GetAll();
            
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add("Employee Directory");

            // Style the header
            worksheet.Cells[1, 1].Value = "ID";
            worksheet.Cells[1, 2].Value = "Name";
            worksheet.Cells[1, 3].Value = "Email";
            worksheet.Cells[1, 4].Value = "Department";
            worksheet.Cells[1, 5].Value = "Phone";
            worksheet.Cells[1, 6].Value = "Salary";

            using (var range = worksheet.Cells[1, 1, 1, 6])
            {
                range.Style.Font.Bold = true;
                range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                range.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightBlue);
            }

            // Add data
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

        public byte[] GenerateDepartmentReportExcel()
        {
            var employees = _employeeRepo.GetAll();
            var attendance = _attendanceRepo.GetAll();

            var departmentStats = employees
                .GroupBy(e => e.Department)
                .Select(g => new DepartmentReportDto
                {
                    Department = g.Key.ToString(),
                    EmployeeCount = g.Count(),
                    AverageSalary = (decimal)g.Average(e => e.Salary),
                    PresentCount = attendance.Count(a => 
                        g.Any(e => e.Id == a.EmployeeId) && 
                        a.Status == Models.AttendanceStatus.Present),
                    AbsentCount = attendance.Count(a => 
                        g.Any(e => e.Id == a.EmployeeId) && 
                        a.Status == Models.AttendanceStatus.Absent)
                })
                .ToList();

            ExcelPackage.License.SetNonCommercialPersonal("ForTesting");
            using var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add("Department Report");

            // Headers
            worksheet.Cells[1, 1].Value = "Department";
            worksheet.Cells[1, 2].Value = "Employee Count";
            worksheet.Cells[1, 3].Value = "Average Salary";
            worksheet.Cells[1, 4].Value = "Present Count";
            worksheet.Cells[1, 5].Value = "Absent Count";

            using (var range = worksheet.Cells[1, 1, 1, 5])
            {
                range.Style.Font.Bold = true;
                range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                range.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightGreen);
            }

            // Data
            int row = 2;
            foreach (var dept in departmentStats)
            {
                worksheet.Cells[row, 1].Value = dept.Department;
                worksheet.Cells[row, 2].Value = dept.EmployeeCount;
                worksheet.Cells[row, 3].Value = dept.AverageSalary;
                worksheet.Cells[row, 3].Style.Numberformat.Format = "#,##0.00";
                worksheet.Cells[row, 4].Value = dept.PresentCount;
                worksheet.Cells[row, 5].Value = dept.AbsentCount;
                row++;
            }

            worksheet.Cells.AutoFitColumns();
            return package.GetAsByteArray();
        }

        public byte[] GenerateAttendanceReportExcel(DateTime startDate, DateTime endDate)
        {
            var attendanceRecords = _attendanceRepo.GetAll()
                .Where(a => a.CheckInTime.Date >= startDate.Date && a.CheckInTime.Date <= endDate.Date)
                .Select(a => new AttendanceReportDto
                {
                    EmployeeName = a.Employee.EmployeeName,
                    Department = a.Employee.Department.ToString(),
                    Date = a.CheckInTime.Date,
                    Status = a.Status.ToString(),
                    WorkingHours = a.CheckOutTime.HasValue 
                        ? a.CheckOutTime.Value - a.CheckInTime 
                        : null
                })
                .ToList();

            ExcelPackage.License.SetNonCommercialPersonal("ForTesting");
            using var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add("Attendance Report");

            // Headers
            worksheet.Cells[1, 1].Value = "Employee Name";
            worksheet.Cells[1, 2].Value = "Department";
            worksheet.Cells[1, 3].Value = "Date";
            worksheet.Cells[1, 4].Value = "Status";
            worksheet.Cells[1, 5].Value = "Working Hours";

            using (var range = worksheet.Cells[1, 1, 1, 5])
            {
                range.Style.Font.Bold = true;
                range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                range.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightYellow);
            }

            // Data
            int row = 2;
            foreach (var record in attendanceRecords)
            {
                worksheet.Cells[row, 1].Value = record.EmployeeName;
                worksheet.Cells[row, 2].Value = record.Department;
                worksheet.Cells[row, 3].Value = record.Date.ToString("yyyy-MM-dd");
                worksheet.Cells[row, 4].Value = record.Status;
                worksheet.Cells[row, 5].Value = record.WorkingHours?.ToString(@"hh\:mm") ?? "N/A";
                row++;
            }

            worksheet.Cells.AutoFitColumns();
            return package.GetAsByteArray();
        }

        public byte[] GenerateSalaryReportExcel(int month, int year)
        {
            var employees = _employeeRepo.GetAll();
            var attendance = _attendanceRepo.GetAll()
                .Where(a => a.CheckInTime.Month == month && a.CheckInTime.Year == year)
                .ToList();

            var salaryData = employees.Select(e => new SalaryReportDto
            {
                EmployeeName = e.EmployeeName,
                Department = e.Department.ToString(),
                Salary = e.Salary,
                WorkingDays = attendance.Count(a => 
                    a.EmployeeId == e.Id && 
                    a.Status == Models.AttendanceStatus.Present),
                DailySalary = e.Salary / 30m
            }).ToList();

            //ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add("Salary Report");

            // Headers
            worksheet.Cells[1, 1].Value = "Employee Name";
            worksheet.Cells[1, 2].Value = "Department";
            worksheet.Cells[1, 3].Value = "Monthly Salary";
            worksheet.Cells[1, 4].Value = "Working Days";
            worksheet.Cells[1, 5].Value = "Daily Salary";

            using (var range = worksheet.Cells[1, 1, 1, 5])
            {
                range.Style.Font.Bold = true;
                range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                range.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightCoral);
            }

            // Data
            int row = 2;
            foreach (var salary in salaryData)
            {
                worksheet.Cells[row, 1].Value = salary.EmployeeName;
                worksheet.Cells[row, 2].Value = salary.Department;
                worksheet.Cells[row, 3].Value = salary.Salary;
                worksheet.Cells[row, 3].Style.Numberformat.Format = "#,##0";
                worksheet.Cells[row, 4].Value = salary.WorkingDays;
                worksheet.Cells[row, 5].Value = salary.DailySalary;
                worksheet.Cells[row, 5].Style.Numberformat.Format = "#,##0.00";
                row++;
            }

            worksheet.Cells.AutoFitColumns();
            return package.GetAsByteArray();
        }

        #endregion

        #region PDF Reports

        public byte[] GenerateEmployeeDirectoryPdf()
        {
            var employees = _employeeRepo.GetAll().ToList();

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(12));

                    page.Header()
                        .Text("Employee Directory Report")
                        .SemiBold().FontSize(20).FontColor(Colors.Blue.Medium);

                    page.Content()
                        .PaddingVertical(1, Unit.Centimetre)
                        .Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.ConstantColumn(40);
                                columns.RelativeColumn(2);
                                columns.RelativeColumn(2);
                                columns.RelativeColumn(1.5f);
                                columns.RelativeColumn(1.5f);
                                columns.RelativeColumn(1.5f);
                            });

                            // Header
                            table.Header(header =>
                            {
                                header.Cell().Element(CellStyle).Text("ID");
                                header.Cell().Element(CellStyle).Text("Name");
                                header.Cell().Element(CellStyle).Text("Email");
                                header.Cell().Element(CellStyle).Text("Department");
                                header.Cell().Element(CellStyle).Text("Phone");
                                header.Cell().Element(CellStyle).Text("Salary");

                                static IContainer CellStyle(IContainer container)
                                {
                                    return container.DefaultTextStyle(x => x.SemiBold())
                                        .PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Black);
                                }
                            });

                            // Data
                            foreach (var emp in employees)
                            {
                                table.Cell().Element(CellStyle).Text(emp.Id);
                                table.Cell().Element(CellStyle).Text(emp.EmployeeName);
                                table.Cell().Element(CellStyle).Text(emp.EmployeeEmail);
                                table.Cell().Element(CellStyle).Text(emp.Department.ToString());
                                table.Cell().Element(CellStyle).Text(emp.phoneNo.ToString());
                                table.Cell().Element(CellStyle).Text(emp.Salary.ToString("N0"));

                                static IContainer CellStyle(IContainer container)
                                {
                                    return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2)
                                        .PaddingVertical(5);
                                }
                            }
                        });

                    page.Footer()
                        .AlignCenter()
                        .Text(x =>
                        {
                            x.Span("Page ");
                            x.CurrentPageNumber();
                            x.Span(" of ");
                            x.TotalPages();
                        });
                });
            });

            return document.GeneratePdf();
        }

        public byte[] GenerateDepartmentReportPdf()
        {
            var employees = _employeeRepo.GetAll();
            var attendance = _attendanceRepo.GetAll();

            var departmentStats = employees
                .GroupBy(e => e.Department)
                .Select(g => new DepartmentReportDto
                {
                    Department = g.Key.ToString(),
                    EmployeeCount = g.Count(),
                    AverageSalary = (decimal)g.Average(e => e.Salary),
                    PresentCount = attendance.Count(a => 
                        g.Any(e => e.Id == a.EmployeeId) && 
                        a.Status == Models.AttendanceStatus.Present),
                    AbsentCount = attendance.Count(a => 
                        g.Any(e => e.Id == a.EmployeeId) && 
                        a.Status == Models.AttendanceStatus.Absent)
                })
                .ToList();

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(12));

                    page.Header()
                        .Text("Department Report")
                        .SemiBold().FontSize(20).FontColor(Colors.Green.Medium);

                    page.Content()
                        .PaddingVertical(1, Unit.Centimetre)
                        .Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn(2);
                                columns.RelativeColumn(1.5f);
                                columns.RelativeColumn(2);
                                columns.RelativeColumn(1.5f);
                                columns.RelativeColumn(1.5f);
                            });

                            // Header
                            table.Header(header =>
                            {
                                header.Cell().Element(CellStyle).Text("Department");
                                header.Cell().Element(CellStyle).Text("Employees");
                                header.Cell().Element(CellStyle).Text("Avg Salary");
                                header.Cell().Element(CellStyle).Text("Present");
                                header.Cell().Element(CellStyle).Text("Absent");

                                static IContainer CellStyle(IContainer container)
                                {
                                    return container.DefaultTextStyle(x => x.SemiBold())
                                        .PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Black);
                                }
                            });

                            // Data
                            foreach (var dept in departmentStats)
                            {
                                table.Cell().Element(CellStyle).Text(dept.Department);
                                table.Cell().Element(CellStyle).Text(dept.EmployeeCount);
                                table.Cell().Element(CellStyle).Text(dept.AverageSalary.ToString("N2"));
                                table.Cell().Element(CellStyle).Text(dept.PresentCount);
                                table.Cell().Element(CellStyle).Text(dept.AbsentCount);

                                static IContainer CellStyle(IContainer container)
                                {
                                    return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2)
                                        .PaddingVertical(5);
                                }
                            }
                        });

                    page.Footer()
                        .AlignCenter()
                        .Text(x =>
                        {
                            x.Span("Page ");
                            x.CurrentPageNumber();
                        });
                });
            });

            return document.GeneratePdf();
        }

        public byte[] GenerateAttendanceReportPdf(DateTime startDate, DateTime endDate)
        {
            var attendanceRecords = _attendanceRepo.GetAll()
                .Where(a => a.CheckInTime.Date >= startDate.Date && a.CheckInTime.Date <= endDate.Date)
                .Select(a => new AttendanceReportDto
                {
                    EmployeeName = a.Employee.EmployeeName,
                    Department = a.Employee.Department.ToString(),
                    Date = a.CheckInTime.Date,
                    Status = a.Status.ToString(),
                    WorkingHours = a.CheckOutTime.HasValue 
                        ? a.CheckOutTime.Value - a.CheckInTime 
                        : null
                })
                .ToList();

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(11));

                    page.Header()
                        .Column(column =>
                        {
                            column.Item().Text("Attendance Report")
                                .SemiBold().FontSize(20).FontColor(Colors.Orange.Medium);
                            column.Item().Text($"Period: {startDate:yyyy-MM-dd} to {endDate:yyyy-MM-dd}")
                                .FontSize(12).FontColor(Colors.Grey.Darken2);
                        });

                    page.Content()
                        .PaddingVertical(1, Unit.Centimetre)
                        .Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn(2);
                                columns.RelativeColumn(1.5f);
                                columns.RelativeColumn(1.5f);
                                columns.RelativeColumn(1.5f);
                                columns.RelativeColumn(1.5f);
                            });

                            // Header
                            table.Header(header =>
                            {
                                header.Cell().Element(CellStyle).Text("Employee");
                                header.Cell().Element(CellStyle).Text("Department");
                                header.Cell().Element(CellStyle).Text("Date");
                                header.Cell().Element(CellStyle).Text("Status");
                                header.Cell().Element(CellStyle).Text("Hours");

                                static IContainer CellStyle(IContainer container)
                                {
                                    return container.DefaultTextStyle(x => x.SemiBold())
                                        .PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Black);
                                }
                            });

                            // Data
                            foreach (var record in attendanceRecords)
                            {
                                table.Cell().Element(CellStyle).Text(record.EmployeeName);
                                table.Cell().Element(CellStyle).Text(record.Department);
                                table.Cell().Element(CellStyle).Text(record.Date.ToString("yyyy-MM-dd"));
                                table.Cell().Element(CellStyle).Text(record.Status);
                                table.Cell().Element(CellStyle).Text(record.WorkingHours?.ToString(@"hh\:mm") ?? "N/A");

                                static IContainer CellStyle(IContainer container)
                                {
                                    return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2)
                                        .PaddingVertical(5);
                                }
                            }
                        });

                    page.Footer()
                        .AlignCenter()
                        .Text(x =>
                        {
                            x.Span("Page ");
                            x.CurrentPageNumber();
                            x.Span(" of ");
                            x.TotalPages();
                        });
                });
            });

            return document.GeneratePdf();
        }

        public byte[] GenerateSalaryReportPdf(int month, int year)
        {
            var employees = _employeeRepo.GetAll();
            var attendance = _attendanceRepo.GetAll()
                .Where(a => a.CheckInTime.Month == month && a.CheckInTime.Year == year)
                .ToList();

            var salaryData = employees.Select(e => new SalaryReportDto
            {
                EmployeeName = e.EmployeeName,
                Department = e.Department.ToString(),
                Salary = e.Salary,
                WorkingDays = attendance.Count(a => 
                    a.EmployeeId == e.Id && 
                    a.Status == Models.AttendanceStatus.Present),
                DailySalary = e.Salary / 30m
            }).ToList();

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(12));

                    page.Header()
                        .Column(column =>
                        {
                            column.Item().Text("Salary Report")
                                .SemiBold().FontSize(20).FontColor(Colors.Red.Medium);
                            column.Item().Text($"Month: {month}/{year}")
                                .FontSize(12).FontColor(Colors.Grey.Darken2);
                        });

                    page.Content()
                        .PaddingVertical(1, Unit.Centimetre)
                        .Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn(2);
                                columns.RelativeColumn(1.5f);
                                columns.RelativeColumn(1.5f);
                                columns.RelativeColumn(1.2f);
                                columns.RelativeColumn(1.5f);
                            });

                            // Header
                            table.Header(header =>
                            {
                                header.Cell().Element(CellStyle).Text("Employee");
                                header.Cell().Element(CellStyle).Text("Department");
                                header.Cell().Element(CellStyle).Text("Salary");
                                header.Cell().Element(CellStyle).Text("Days");
                                header.Cell().Element(CellStyle).Text("Daily Rate");

                                static IContainer CellStyle(IContainer container)
                                {
                                    return container.DefaultTextStyle(x => x.SemiBold())
                                        .PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Black);
                                }
                            });

                            // Data
                            foreach (var salary in salaryData)
                            {
                                table.Cell().Element(CellStyle).Text(salary.EmployeeName);
                                table.Cell().Element(CellStyle).Text(salary.Department);
                                table.Cell().Element(CellStyle).Text(salary.Salary.ToString("N0"));
                                table.Cell().Element(CellStyle).Text(salary.WorkingDays);
                                table.Cell().Element(CellStyle).Text(salary.DailySalary.ToString("N2"));

                                static IContainer CellStyle(IContainer container)
                                {
                                    return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2)
                                        .PaddingVertical(5);
                                }
                            }
                        });

                    page.Footer()
                        .AlignCenter()
                        .Text(x =>
                        {
                            x.Span("Page ");
                            x.CurrentPageNumber();
                            x.Span(" of ");
                            x.TotalPages();
                        });
                });
            });

            return document.GeneratePdf();
        }

        #endregion
    }
}
