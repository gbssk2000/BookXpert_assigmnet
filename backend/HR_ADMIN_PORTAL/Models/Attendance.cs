namespace HR_ADMIN_PORTAL.Models
{
    public class Attendance
    {
        public int Id { get; set; }

        // 🔑 Foreign Key
        public int EmployeeId { get; set; }

        // Navigation property
        public Employee Employee { get; set; }

        public DateTime CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }

        public AttendanceStatus Status { get; set; }
    }
    public enum AttendanceStatus
    {
        Present = 1,
        Absent = 2,
        HalfDay = 3,
        Leave = 4
    }
}
