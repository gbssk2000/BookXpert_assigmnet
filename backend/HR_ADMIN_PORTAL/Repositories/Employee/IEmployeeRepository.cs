using HR_ADMIN_PORTAL.dto.EmployeeDtos;
using HR_ADMIN_PORTAL.Models;

namespace HR_ADMIN_PORTAL.Repositories.Employees
{
    public interface IEmployeeRepository
    {
        IEnumerable<Employee> GetAll();
        Employee GetById(int id);
        void Add(Employee employee);
        void Update(Employee employee);
        void Delete(int id);
    }
}
