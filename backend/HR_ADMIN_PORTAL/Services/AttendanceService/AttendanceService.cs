using HR_ADMIN_PORTAL.dto.AttendanceDto;
using HR_ADMIN_PORTAL.Models;
using HR_ADMIN_PORTAL.Repositories.Attendancerepo;
using HR_ADMIN_PORTAL.Repositories.Employees;

namespace HR_ADMIN_PORTAL.Services.AttendanceService
{
    public class AttendanceService : IAttendanceService
    {
        private readonly IAttendanceRepository _attendanceRepository;
        private readonly IEmployeeRepository _employeeRepository;

        public AttendanceService(IAttendanceRepository attendanceRepository, IEmployeeRepository employeeRepository)
        {
            _attendanceRepository = attendanceRepository;
            _employeeRepository = employeeRepository;
        }

        public IEnumerable<AttendanceResponseDto> GetAll()
        {
            return _attendanceRepository.GetAll()
                .Select(a => new AttendanceResponseDto
                {
                    Id = a.Id,
                    EmployeeId = a.EmployeeId,
                    EmployeeName = a.Employee?.EmployeeName ?? "Unknown",
                    Department = a.Employee?.Department.ToString() ?? "Unknown",
                    CheckInTime = a.CheckInTime,
                    CheckOutTime = a.CheckOutTime,
                    Status = a.Status.ToString()
                });
        }

        public AttendanceResponseDto GetById(int id)
        {
            var attendance = _attendanceRepository.GetById(id);
            if (attendance == null) return null;

            return new AttendanceResponseDto
            {
                Id = attendance.Id,
                EmployeeId = attendance.EmployeeId,
                EmployeeName = attendance.Employee?.EmployeeName ?? "Unknown",
                Department = attendance.Employee?.Department.ToString() ?? "Unknown",
                CheckInTime = attendance.CheckInTime,
                CheckOutTime = attendance.CheckOutTime,
                Status = attendance.Status.ToString()
            };
        }

        public void Add(AttendanceCreateDto dto)
        {
            // Validate employee exists
            var employee = _employeeRepository.GetById(dto.EmployeeId);
            if (employee == null)
                throw new Exception("Employee not found");

            var attendance = new Attendance
            {
                EmployeeId = dto.EmployeeId,
                CheckInTime = dto.CheckInTime,
                CheckOutTime = dto.CheckOutTime,
                Status = dto.Status
            };

            _attendanceRepository.Add(attendance);
        }
    }
}
