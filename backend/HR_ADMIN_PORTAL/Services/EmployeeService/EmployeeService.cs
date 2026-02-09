using HR_ADMIN_PORTAL.dto.EmployeeDtos;
using HR_ADMIN_PORTAL.Models;
using HR_ADMIN_PORTAL.Repositories.Employees;

namespace HR_ADMIN_PORTAL.Services.EmployeeService
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _repository;

        public EmployeeService(IEmployeeRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<EmployeeResponseDto> GetAll()
        {
            return _repository.GetAll()
                .Select(e => new EmployeeResponseDto
                {
                    Id = e.Id,
                    Name = e.EmployeeName,
                    Email = e.EmployeeEmail,
                    PhoneNo=e.phoneNo,
                    Salary=e.Salary,
                    Department = e.Department.ToString()
                });
        }

        public EmployeeResponseDto GetById(int id)
        {
            var employee = _repository.GetById(id);
            if (employee == null) return null;

            return new EmployeeResponseDto
            {
                Id = employee.Id,
                Name = employee.EmployeeName,
                Email = employee.EmployeeEmail,
                PhoneNo = employee.phoneNo,
                Salary = employee.Salary,
                Department = employee.Department.ToString()
            };
        }

        public void Add(EmployeeCreateAndUpdateDto dto)
        {
            var employee = new Employee
            {
                EmployeeName = dto.Name,
                EmployeeEmail = dto.Email,
                Salary=dto.salary,
                phoneNo=dto.PhoneNo,
                Department = dto.Department
            };

            _repository.Add(employee);
        }

        public void Update(int id, EmployeeCreateAndUpdateDto dto)
        {
            var employee = _repository.GetById(id);
            if (employee == null)
                throw new Exception("Employee not found");

            employee.EmployeeName = dto.Name;
            employee.EmployeeEmail = dto.Email;
            employee.Department = dto.Department;
            employee.phoneNo = dto.PhoneNo;
            employee.Salary = dto.salary;

            _repository.Update(employee);
        }

        public void Delete(int id)
        {
            _repository.Delete(id);
        }
    }
}
