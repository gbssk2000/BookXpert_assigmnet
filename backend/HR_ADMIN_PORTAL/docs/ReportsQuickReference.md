# Reports Quick Reference Guide

## ?? Quick Start

### 1. Authentication
```http
POST /api/Auth/login
Content-Type: application/json

{
  "email": "admin@hrportal.com",
  "password": "Admin@123"
}
```
Copy the JWT token from response.

### 2. Download Reports
Replace `{token}` with your JWT token.

---

## ?? Available Reports

### Employee Directory
```http
# PDF
GET /api/Reports/employee-directory/pdf
Authorization: Bearer {token}

# Excel
GET /api/Reports/employee-directory/excel
Authorization: Bearer {token}
```

**Contains:**
- All employees with ID, Name, Email, Department, Phone, Salary

---

### Department Statistics
```http
# PDF
GET /api/Reports/departments/pdf
Authorization: Bearer {token}

# Excel
GET /api/Reports/departments/excel
Authorization: Bearer {token}
```

**Contains:**
- Employee count per department
- Average salary per department
- Present/Absent counts

---

### Attendance Records
```http
# PDF
GET /api/Reports/attendance/pdf?startDate=2024-02-01&endDate=2024-02-28
Authorization: Bearer {token}

# Excel
GET /api/Reports/attendance/excel?startDate=2024-02-01&endDate=2024-02-28
Authorization: Bearer {token}
```

**Parameters:**
- `startDate`: Format YYYY-MM-DD (required)
- `endDate`: Format YYYY-MM-DD (required)

**Contains:**
- Employee name, Department, Date, Status, Working hours

---

### Salary Information
```http
# PDF
GET /api/Reports/salary/pdf?month=2&year=2024
Authorization: Bearer {token}

# Excel
GET /api/Reports/salary/excel?month=2&year=2024
Authorization: Bearer {token}
```

**Parameters:**
- `month`: 1-12 (required)
- `year`: 2000 or later (required)

**Contains:**
- Employee name, Department, Monthly salary, Working days, Daily rate

---

## ?? Using Browser

### Direct Download in Browser
1. Login to get token
2. Open browser
3. Navigate to: `http://localhost:5049/api/Reports/employee-directory/pdf`
4. Add header via browser extension or use curl

### Using cURL
```bash
curl -X GET "http://localhost:5049/api/Reports/employee-directory/pdf" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  --output employee-directory.pdf
```

---

## ?? File Downloads

### Automatic File Names
- **Employee Directory**: `employee-directory-20240208.pdf`
- **Department Report**: `department-report-20240208.xlsx`
- **Attendance Report**: `attendance-report-20240201-to-20240228.pdf`
- **Salary Report**: `salary-report-2024-02.xlsx`

---

## ?? Common Errors

### 401 Unauthorized
```json
// Missing or invalid token
```
**Solution**: Login again to get fresh JWT token

### 400 Bad Request
```json
{
  "message": "Start date must be before end date"
}
```
**Solution**: Check date parameters

```json
{
  "message": "Month must be between 1 and 12"
}
```
**Solution**: Use valid month (1-12)

### 500 Internal Server Error
```json
{
  "message": "Error generating PDF report",
  "error": "Error details..."
}
```
**Solution**: Check server logs for details

---

## ?? Report Formats

### PDF Reports
- Professional layout
- Page numbers
- Color-coded headers
- Bordered tables
- Paginated for printing

### Excel Reports
- Formatted headers
- Auto-fit columns
- Number formatting
- Color-coded sections
- Ready for data analysis

---

## ?? Testing with Visual Studio

### Using .http File
1. Open `HR_ADMIN_PORTAL.http`
2. Update `@token` variable with your JWT
3. Click "Send Request" above each endpoint
4. File downloads automatically

### Using Postman
1. Create GET request
2. Add URL: `http://localhost:5049/api/Reports/...`
3. Add Header: `Authorization: Bearer {token}`
4. Click "Send"
5. Save response as file

---

## ?? Report Types at a Glance

| Report | Format | Parameters | Use Case |
|--------|--------|------------|----------|
| Employee Directory | PDF/Excel | None | Complete employee list |
| Department Stats | PDF/Excel | None | Management overview |
| Attendance | PDF/Excel | Date range | Attendance tracking |
| Salary | PDF/Excel | Month, Year | Payroll processing |

---

## ?? Tips

### For Best Results
1. **Large Datasets**: Excel format is better for data analysis
2. **Printing**: PDF format is better for physical copies
3. **Sharing**: PDF format is more universally accessible
4. **Date Ranges**: Use full months for attendance reports
5. **Salary Reports**: Run at month-end for accurate working days

### Performance
- Reports generate on-demand (not cached)
- Large datasets may take a few seconds
- Excel files are typically larger than PDFs

---

## ??? Development Usage

### In Code (C#)
```csharp
// Inject service
private readonly IReportService _reportService;

// Generate report
var pdf = _reportService.GenerateEmployeeDirectoryPdf();
return File(pdf, "application/pdf", "report.pdf");
```

### Response Headers
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="employee-directory-20240208.pdf"
```

---

## ?? Support

**Issues?** Check:
1. JWT token is valid (not expired)
2. Employee/Attendance data exists in database
3. Date parameters are correct format
4. Server is running on correct port (5049)

**Documentation:**
- Full API docs: `docs/ReportsAPI.md`
- Implementation details: `docs/ReportsImplementationSummary.md`

---

**Last Updated**: February 8, 2024  
**Version**: 1.0.0
