# Attendance Management API

## Overview
The Attendance module allows you to manage employee attendance records including check-in/check-out times and attendance status.

## Endpoints

### 1. Get All Attendance Records
**GET** `/api/Attendance`

**Authorization:** Bearer Token Required

**Response:**
```json
[
  {
    "id": 1,
    "employeeId": 1,
    "employeeName": "John Doe",
    "department": "IT",
    "checkInTime": "2024-02-07T09:00:00",
    "checkOutTime": "2024-02-07T17:00:00",
    "status": "Present"
  }
]
```

### 2. Get Attendance Record by ID
**GET** `/api/Attendance/{id}`

**Authorization:** Bearer Token Required

**Response:**
```json
{
  "id": 1,
  "employeeId": 1,
  "employeeName": "John Doe",
  "department": "IT",
  "checkInTime": "2024-02-07T09:00:00",
  "checkOutTime": "2024-02-07T17:00:00",
  "status": "Present"
}
```

### 3. Create Attendance Record
**POST** `/api/Attendance`

**Authorization:** Bearer Token Required

**Request Body:**
```json
{
  "employeeId": 1,
  "checkInTime": "2024-02-07T09:00:00",
  "checkOutTime": "2024-02-07T17:00:00",
  "status": 1
}
```

**Response:**
```json
{
  "message": "Attendance record created successfully"
}
```

## Attendance Status Enum
- `1` - Present
- `2` - Absent
- `3` - HalfDay
- `4` - Leave

## Validation Rules
1. **EmployeeId** - Required, must reference an existing employee
2. **CheckInTime** - Required
3. **CheckOutTime** - Optional
4. **Status** - Required, must be a valid AttendanceStatus enum value

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation failed"
}
```

### 404 Not Found
```json
{
  "message": "Attendance record not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "An error occurred while creating attendance record",
  "error": "Error details..."
}
```

## Project Structure

```
HR_ADMIN_PORTAL/
??? Controllers/
?   ??? AttendanceController.cs
??? Services/
?   ??? AttendanceService/
?       ??? IAttendanceService.cs
?       ??? AttendanceService.cs
??? Repositories/
?   ??? Attendance/
?       ??? IAttendanceRepository.cs
?       ??? AttendanceRepository.cs
??? Models/
?   ??? Attendance.cs
??? dto/
    ??? AttendanceDto/
        ??? AttendanceDto.cs
```

## Dependencies Registered in Program.cs
```csharp
builder.Services.AddScoped<IAttendanceRepository, AttendanceRepository>();
builder.Services.AddScoped<IAttendanceService, AttendanceService>();
```

## Usage Example

1. **First, authenticate to get JWT token:**
```bash
POST /api/Auth/login
{
  "email": "admin@hrportal.com",
  "password": "Admin@123"
}
```

2. **Create an attendance record:**
```bash
POST /api/Attendance
Authorization: Bearer {your-token}
{
  "employeeId": 1,
  "checkInTime": "2024-02-07T09:00:00",
  "checkOutTime": "2024-02-07T17:00:00",
  "status": 1
}
```

3. **Retrieve all attendance records:**
```bash
GET /api/Attendance
Authorization: Bearer {your-token}
```

## Notes
- All endpoints require JWT authentication
- The `checkOutTime` is optional and can be `null`
- The system automatically includes employee details (name, department) in the response
- Attendance records are linked to employees via foreign key relationship
