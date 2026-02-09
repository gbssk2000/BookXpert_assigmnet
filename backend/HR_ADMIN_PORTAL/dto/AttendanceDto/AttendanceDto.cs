using HR_ADMIN_PORTAL.Models;
using System.ComponentModel.DataAnnotations;

namespace HR_ADMIN_PORTAL.dto.AttendanceDto
{
    public class AttendanceCreateDto
    {
        [Required]
        public int EmployeeId { get; set; }

        [Required]
        public DateTime CheckInTime { get; set; }

        public DateTime? CheckOutTime { get; set; }

        [Required]
        [EnumDataType(typeof(AttendanceStatus))]
        public AttendanceStatus Status { get; set; }
    }

    public class AttendanceResponseDto
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }

        public string EmployeeName { get; set; }
        public string Department { get; set; }

        public DateTime CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }

        public string Status { get; set; }
    }
}
