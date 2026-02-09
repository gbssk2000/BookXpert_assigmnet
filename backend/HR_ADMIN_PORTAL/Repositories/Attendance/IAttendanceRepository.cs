using HR_ADMIN_PORTAL.Models;

namespace HR_ADMIN_PORTAL.Repositories.Attendancerepo
{
    public interface IAttendanceRepository
    {
        IEnumerable<Attendance> GetAll();
        Attendance GetById(int id);
        void Add(Attendance attendance);
    }
}
