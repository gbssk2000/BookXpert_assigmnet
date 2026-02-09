using HR_ADMIN_PORTAL.Data;
using HR_ADMIN_PORTAL.Models;
using Microsoft.EntityFrameworkCore;

namespace HR_ADMIN_PORTAL.Repositories.Attendancerepo
{
    public class AttendanceRepository : IAttendanceRepository
    {
        private readonly ApplicationDbContext _context;

        public AttendanceRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Attendance> GetAll()
            => _context.Attendance.Include(a => a.Employee).ToList();

        public Attendance GetById(int id)
            => _context.Attendance.Include(a => a.Employee).FirstOrDefault(a => a.Id == id);

        public void Add(Attendance attendance)
        {
            _context.Attendance.Add(attendance);
            _context.SaveChanges();
        }
    }
}
