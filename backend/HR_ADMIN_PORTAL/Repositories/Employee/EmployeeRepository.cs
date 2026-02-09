using HR_ADMIN_PORTAL.Data;
using HR_ADMIN_PORTAL.dto.EmployeeDtos;
using HR_ADMIN_PORTAL.Models;

namespace HR_ADMIN_PORTAL.Repositories.Employees
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly ApplicationDbContext _context;

        public EmployeeRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Employee> GetAll()
            => _context.Employees.ToList();

        public Employee GetById(int id)
            => _context.Employees.FirstOrDefault(e => e.Id == id);

        public void Add(Employee employee)
        {
            _context.Employees.Add(employee);
            _context.SaveChanges();
        }

        public void Update(Employee employee)
        {
            _context.Employees.Update(employee);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var employee = _context.Employees.Find(id);
            if (employee == null) return;

            _context.Employees.Remove(employee);
            _context.SaveChanges();
        }
    }
}
