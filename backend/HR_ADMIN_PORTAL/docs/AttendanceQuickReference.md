# Attendance API Quick Reference

## Base URL
```
http://localhost:5049/api/Attendance
```

## Authentication
All requests require JWT Bearer token in header:
```
Authorization: Bearer {your-jwt-token}
```

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/Attendance` | Get all attendance records |
| GET | `/api/Attendance/{id}` | Get attendance by ID |
| POST | `/api/Attendance` | Create new attendance record |

## Request/Response Examples

### Create Attendance (Present)
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

### Response
```json
{
  "message": "Attendance record created successfully"
}
```

### Get All Attendance
```http
GET /api/Attendance
Authorization: Bearer {token}
```

### Response
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

## Status Values
| Value | Name | Description |
|-------|------|-------------|
| 1 | Present | Employee is present |
| 2 | Absent | Employee is absent |
| 3 | HalfDay | Employee worked half day |
| 4 | Leave | Employee on leave |

## Field Validations
| Field | Required | Type | Notes |
|-------|----------|------|-------|
| employeeId | Yes | int | Must exist in database |
| checkInTime | Yes | DateTime | ISO 8601 format |
| checkOutTime | No | DateTime? | Can be null |
| status | Yes | int | Must be 1-4 |

## Common Errors

### 400 - Invalid Employee
```json
{
  "message": "An error occurred while creating attendance record",
  "error": "Employee not found"
}
```

### 401 - Unauthorized
No token or invalid token provided

### 404 - Not Found
```json
{
  "message": "Attendance record not found"
}
```

## Tips
1. Always authenticate first to get JWT token
2. Ensure employee exists before creating attendance
3. CheckOutTime can be null for pending check-outs
4. Use proper DateTime format: `YYYY-MM-DDTHH:mm:ss`
