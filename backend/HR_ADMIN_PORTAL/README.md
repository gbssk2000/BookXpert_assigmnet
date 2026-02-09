# HR Admin Portal - Complete HR Management System

## ?? Overview
A comprehensive HR Admin Portal built with ASP.NET Core 9.0 that manages employees, attendance records, and generates detailed reports. The system provides RESTful APIs for employee management, attendance tracking, report generation, and JWT-based authentication.

## ? Features Implemented

### ?? Authentication & Authorization
- JWT Bearer token authentication
- User registration and login
- Secure password hashing
- Role-based authorization

### ?? Employee Management
- Create, Read, Update, Delete (CRUD) operations
- Department management (HR, IT, Finance, Sales, Operations)
- Employee directory with contact details
- Salary information tracking

### ?? Attendance Management
- Record employee attendance (Check-in/Check-out)
- Multiple attendance statuses:
  - Present
  - Absent
  - Half Day
  - Leave
- View all attendance records with employee details
- Individual attendance record retrieval
- Employee validation before attendance creation

### ?? Reports Generation
- **Employee Directory Reports** - Complete employee listings with details
- **Department Reports** - Statistics by department (employee count, average salary, attendance)
- **Attendance Reports** - Date-range based attendance tracking with working hours
- **Salary Reports** - Monthly salary breakdown with working days
- **Export Formats**: PDF and Excel (both formats available for all report types)

## ??? Architecture

### Layered Architecture Pattern
```
???????????????????
?   Controllers   ?  ? HTTP Endpoints (API Layer)
???????????????????
?    Services     ?  ? Business Logic
???????????????????
?  Repositories   ?  ? Data Access
???????????????????
?  EF Core + SQL  ?  ? Database
???????????????????
```

## ?? Project Structure
```
HR_ADMIN_PORTAL/
??? Controllers/
?   ??? AuthController.cs          # Authentication endpoints
?   ??? EmployeesController.cs     # Employee CRUD operations
?   ??? AttendanceController.cs    # Attendance management
?   ??? ReportsController.cs       # PDF/Excel report generation
?
??? Services/
?   ??? AuthService/               # Authentication logic
?   ??? EmployeeService/           # Employee business logic
?   ??? AttendanceService/         # Attendance business logic
?   ??? ReportService/             # Report generation (PDF/Excel)
?   ??? JwtTokenService/           # JWT token generation
?   ??? EmailService/              # Email notifications
?
??? Repositories/
?   ??? Users/                     # User data access
?   ??? Employee/                  # Employee data access
?   ??? Attendance/                # Attendance data access
?
??? Models/
?   ??? User.cs                    # User entity
?   ??? Employee.cs                # Employee entity
?   ??? Attendance.cs              # Attendance entity
?
??? dto/
?   ??? AuthDtos/                  # Auth DTOs
?   ??? EmployeeDtos/              # Employee DTOs
?   ??? AttendanceDto/             # Attendance DTOs
?   ??? ReportDtos/                # Report DTOs
?
??? Data/
?   ??? ApplicationDbContext.cs    # EF Core DbContext
?
??? Migrations/                    # Database migrations
?
??? docs/                          # Documentation
?   ??? AttendanceAPI.md           # Attendance API docs
?   ??? ReportsAPI.md              # Reports API docs
?   ??? AttendanceQuickReference.md
?   ??? AttendanceImplementationSummary.md
?
??? Program.cs                     # Application entry point
```

## ?? Getting Started

### Prerequisites
- .NET 9.0 SDK
- SQL Server
- Visual Studio 2022 or VS Code
- Postman or similar API testing tool (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gbssk2000/HR_Admin_Portal_Assigment
   cd HR_ADMIN_PORTAL
   ```

2. **Update connection string**
   
   Edit `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=YOUR_SERVER;Database=HRAdminDB;Trusted_Connection=True;TrustServerCertificate=True"
     },
     "Jwt": {
       "Key": "YOUR_SECRET_KEY_HERE_AT_LEAST_32_CHARACTERS",
       "Issuer": "HRAdminPortal",
       "Audience": "HRAdminPortalUsers"
     }
   }
   ```

3. **Apply database migrations**
   ```bash
   dotnet ef database update
   ```

4. **Run the application**
   ```bash
   dotnet run
   ```

5. **Access the API**
   - API Base URL: `http://localhost:5049`
   - OpenAPI/Swagger: `http://localhost:5049/scalar/v1` (if configured)

## ?? API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/Auth/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@hrportal.com",
  "password": "Admin@123"
}
```

#### Login
```http
POST /api/Auth/login
Content-Type: application/json

{
  "email": "admin@hrportal.com",
  "password": "Admin@123"
}
```

### Employee Endpoints

All employee endpoints require authentication header:
```
Authorization: Bearer {your-jwt-token}
```

#### Get All Employees
```http
GET /api/Employees
```

#### Get Employee by ID
```http
GET /api/Employees/{id}
```

#### Create Employee
```http
POST /api/Employees
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@company.com",
  "phoneNo": 1234567890,
  "salary": 75000,
  "department": 2
}
```

#### Update Employee
```http
PUT /api/Employees/{id}
Content-Type: application/json

{
  "name": "John Doe Updated",
  "email": "john.doe@company.com",
  "phoneNo": 1234567890,
  "salary": 85000,
  "department": 2
}
```

#### Delete Employee
```http
DELETE /api/Employees/{id}
```

### Attendance Endpoints

#### Get All Attendance Records
```http
GET /api/Attendance
Authorization: Bearer {token}
```

#### Get Attendance by ID
```http
GET /api/Attendance/{id}
Authorization: Bearer {token}
```

#### Create Attendance Record
```http
POST /api/Attendance
Content-Type: application/json
Authorization: Bearer {token}

{
  "employeeId": 1,
  "checkInTime": "2024-02-07T09:00:00",
  "checkOutTime": "2024-02-07T17:00:00",
  "status": 1
}
```

### Reports Endpoints

#### Employee Directory Reports
```http
GET /api/Reports/employee-directory/pdf
GET /api/Reports/employee-directory/excel
Authorization: Bearer {token}
```

#### Department Reports
```http
GET /api/Reports/departments/pdf
GET /api/Reports/departments/excel
Authorization: Bearer {token}
```

#### Attendance Reports (with date range)
```http
GET /api/Reports/attendance/pdf?startDate=2024-02-01&endDate=2024-02-28
GET /api/Reports/attendance/excel?startDate=2024-02-01&endDate=2024-02-28
Authorization: Bearer {token}
```

#### Salary Reports (by month/year)
```http
GET /api/Reports/salary/pdf?month=2&year=2024
GET /api/Reports/salary/excel?month=2&year=2024
Authorization: Bearer {token}
```

For detailed report documentation, see `docs/ReportsAPI.md`

## ?? Data Models

### Department Enum
```csharp
HR = 1
IT = 2
Finance = 3
Sales = 4
Operations = 5
```

### Attendance Status Enum
```csharp
Present = 1   // Employee is present
Absent = 2    // Employee is absent
HalfDay = 3   // Employee worked half day
Leave = 4     // Employee on leave
```

## ?? Testing

### Using the HTTP File
The project includes `HR_ADMIN_PORTAL.http` with pre-configured requests:

1. Open the file in Visual Studio or VS Code with REST Client extension
2. Update the `@token` variable with your JWT token
3. Execute requests directly from the file

### Manual Testing with Postman
1. Import the API endpoints into Postman
2. Authenticate to get JWT token
3. Add token to Authorization header
4. Test all endpoints

## ?? Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password hashing
- **Authorization**: Protected endpoints require valid JWT
- **Input Validation**: Model validation on all inputs
- **SQL Injection Protection**: Entity Framework parameterized queries

## ??? Technologies Used

- **Framework**: ASP.NET Core 9.0
- **Language**: C# 13.0
- **Database**: SQL Server
- **ORM**: Entity Framework Core
- **Authentication**: JWT Bearer
- **PDF Generation**: QuestPDF 2202.8.2
- **Excel Generation**: EPPlus 8.4.2
- **Architecture**: Repository Pattern, Service Layer Pattern
- **API Style**: RESTful

## ?? NuGet Packages

### Core Packages
- Microsoft.AspNetCore.Authentication.JwtBearer
- Microsoft.EntityFrameworkCore.SqlServer
- Microsoft.EntityFrameworkCore.Tools

### Report Generation
- **EPPlus 8.4.2** - Excel spreadsheet generation (Non-commercial license)
- **QuestPDF 2202.8.2** - PDF document generation (Community license)

## ?? Feature Summary

### ? Completed Features
- [x] Authentication & Authorization (JWT)
- [x] Employee CRUD operations
- [x] Attendance tracking
- [x] PDF report generation (4 types)
- [x] Excel report generation (4 types)
- [x] Department statistics
- [x] Salary calculations
- [x] Working hours calculation
- [x] Date range filtering for reports

### ?? Report Types Available
1. **Employee Directory** - All employees with complete details
2. **Department Statistics** - Employee count, average salary, attendance stats
3. **Attendance Records** - Detailed attendance with working hours (date range)
4. **Salary Information** - Monthly salary with working days calculation

## ?? Development Guidelines

### Code Style
- Follow C# naming conventions
- Use async/await for database operations (can be added)
- Implement proper error handling
- Add XML documentation comments
- Keep controllers thin, services fat

### Git Workflow
- Create feature branches
- Write descriptive commit messages
- Use pull requests for code review
- Keep commits atomic and focused

### Testing Best Practices
- Write unit tests for services
- Integration tests for repositories
- API tests for controllers
- Maintain high code coverage

## ?? Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ?? License

This project is part of the HR Admin Portal assignment.

**Library Licenses:**
- EPPlus: Non-commercial use (Polyform Noncommercial License)
- QuestPDF: Community License (free for open-source projects)

## ?? Authors

- **Developer**: GitHub Copilot Integration
- **Repository**: https://github.com/gbssk2000/HR_Admin_Portal_Assigment

## ?? Support

For issues, questions, or contributions, please open an issue in the GitHub repository.

---

**Last Updated**: February 8, 2024
**Version**: 2.0.0
**Status**: ? Production Ready with Reports Module
