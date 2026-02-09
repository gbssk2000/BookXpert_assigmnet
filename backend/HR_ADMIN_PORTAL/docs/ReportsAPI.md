# Reports API Documentation

## Overview
The Reports module generates PDF and Excel reports for employee directory, departments, attendance, and salary data.

## Endpoints

### 1. Employee Directory Report

#### Get Employee Directory PDF
**GET** `/api/Reports/employee-directory/pdf`

**Authorization:** Bearer Token Required

**Description:** Downloads a PDF report containing all employees with their details.

**Response:** PDF file download

**Example:**
```
GET /api/Reports/employee-directory/pdf
Authorization: Bearer {your-token}
```

#### Get Employee Directory Excel
**GET** `/api/Reports/employee-directory/excel`

**Authorization:** Bearer Token Required

**Description:** Downloads an Excel spreadsheet containing all employees with their details.

**Response:** Excel file (.xlsx) download

**Example:**
```
GET /api/Reports/employee-directory/excel
Authorization: Bearer {your-token}
```

---

### 2. Department Report

#### Get Department Report PDF
**GET** `/api/Reports/departments/pdf`

**Authorization:** Bearer Token Required

**Description:** Downloads a PDF report with department statistics including:
- Employee count per department
- Average salary per department
- Present/Absent counts per department

**Response:** PDF file download

**Example:**
```
GET /api/Reports/departments/pdf
Authorization: Bearer {your-token}
```

#### Get Department Report Excel
**GET** `/api/Reports/departments/excel`

**Authorization:** Bearer Token Required

**Description:** Downloads an Excel report with department statistics.

**Response:** Excel file (.xlsx) download

**Example:**
```
GET /api/Reports/departments/excel
Authorization: Bearer {your-token}
```

---

### 3. Attendance Report

#### Get Attendance Report PDF
**GET** `/api/Reports/attendance/pdf?startDate={startDate}&endDate={endDate}`

**Authorization:** Bearer Token Required

**Query Parameters:**
- `startDate` (required): Start date in format `YYYY-MM-DD`
- `endDate` (required): End date in format `YYYY-MM-DD`

**Description:** Downloads a PDF report with attendance records for the specified date range.

**Response:** PDF file download

**Example:**
```
GET /api/Reports/attendance/pdf?startDate=2024-02-01&endDate=2024-02-28
Authorization: Bearer {your-token}
```

#### Get Attendance Report Excel
**GET** `/api/Reports/attendance/excel?startDate={startDate}&endDate={endDate}`

**Authorization:** Bearer Token Required

**Query Parameters:**
- `startDate` (required): Start date in format `YYYY-MM-DD`
- `endDate` (required): End date in format `YYYY-MM-DD`

**Description:** Downloads an Excel report with attendance records for the specified date range.

**Response:** Excel file (.xlsx) download

**Example:**
```
GET /api/Reports/attendance/excel?startDate=2024-02-01&endDate=2024-02-28
Authorization: Bearer {your-token}
```

---

### 4. Salary Report

#### Get Salary Report PDF
**GET** `/api/Reports/salary/pdf?month={month}&year={year}`

**Authorization:** Bearer Token Required

**Query Parameters:**
- `month` (required): Month number (1-12)
- `year` (required): Year (2000 or later)

**Description:** Downloads a PDF report with salary information for the specified month and year, including:
- Employee salary details
- Working days count
- Daily salary rate

**Response:** PDF file download

**Example:**
```
GET /api/Reports/salary/pdf?month=2&year=2024
Authorization: Bearer {your-token}
```

#### Get Salary Report Excel
**GET** `/api/Reports/salary/excel?month={month}&year={year}`

**Authorization:** Bearer Token Required

**Query Parameters:**
- `month` (required): Month number (1-12)
- `year` (required): Year (2000 or later)

**Description:** Downloads an Excel report with salary information for the specified month and year.

**Response:** Excel file (.xlsx) download

**Example:**
```
GET /api/Reports/salary/excel?month=2&year=2024
Authorization: Bearer {your-token}
```

---

## Report Contents

### Employee Directory Report
Contains:
- Employee ID
- Name
- Email
- Department
- Phone Number
- Salary

### Department Report
Contains:
- Department Name
- Employee Count
- Average Salary
- Present Count (total attendance marked as Present)
- Absent Count (total attendance marked as Absent)

### Attendance Report
Contains:
- Employee Name
- Department
- Date
- Status (Present/Absent/HalfDay/Leave)
- Working Hours (calculated from check-in and check-out times)

### Salary Report
Contains:
- Employee Name
- Department
- Monthly Salary
- Working Days (present days in the month)
- Daily Salary Rate (Monthly Salary / 30)

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Start date must be before end date"
}
```

```json
{
  "message": "Month must be between 1 and 12"
}
```

```json
{
  "message": "Invalid year"
}
```

### 401 Unauthorized
No token or invalid token provided

### 500 Internal Server Error
```json
{
  "message": "Error generating PDF report",
  "error": "Error details..."
}
```

---

## Usage Examples

### 1. Download Employee Directory PDF
```bash
curl -X GET "http://localhost:5049/api/Reports/employee-directory/pdf" \
  -H "Authorization: Bearer {your-token}" \
  --output employee-directory.pdf
```

### 2. Download Attendance Excel Report
```bash
curl -X GET "http://localhost:5049/api/Reports/attendance/excel?startDate=2024-02-01&endDate=2024-02-28" \
  -H "Authorization: Bearer {your-token}" \
  --output attendance-report.xlsx
```

### 3. Download Department Report
```bash
curl -X GET "http://localhost:5049/api/Reports/departments/excel" \
  -H "Authorization: Bearer {your-token}" \
  --output department-report.xlsx
```

### 4. Download Salary Report
```bash
curl -X GET "http://localhost:5049/api/Reports/salary/pdf?month=2&year=2024" \
  -H "Authorization: Bearer {your-token}" \
  --output salary-report.pdf
```

---

## Technical Details

### Libraries Used
- **EPPlus 8.4.2** - Excel generation (Non-commercial license)
- **QuestPDF 2202.8.2** - PDF generation (Community license)

### File Naming Convention
Generated files follow this pattern:
- Employee Directory: `employee-directory-{yyyyMMdd}.pdf/xlsx`
- Department Report: `department-report-{yyyyMMdd}.pdf/xlsx`
- Attendance Report: `attendance-report-{yyyyMMdd}-to-{yyyyMMdd}.pdf/xlsx`
- Salary Report: `salary-report-{yyyy}-{MM}.pdf/xlsx`

### Response Headers
- **Content-Type** (PDF): `application/pdf`
- **Content-Type** (Excel): `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- **Content-Disposition**: `attachment; filename="{filename}"`

---

## Notes
- All reports require JWT authentication
- Reports are generated on-demand (not cached)
- Large datasets may take longer to generate
- Excel reports support cell formatting and auto-fit columns
- PDF reports include page numbers and headers
- Working hours in attendance reports are calculated as `CheckOutTime - CheckInTime`
- Daily salary is calculated as `Monthly Salary / 30`
