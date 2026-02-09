using HR_ADMIN_PORTAL.dto.EmployeeDtos;
using HR_ADMIN_PORTAL.Models;

namespace HR_ADMIN_PORTAL.Services.EmployeeService
{
    public interface IEmployeeService
    {
        IEnumerable<EmployeeResponseDto> GetAll();
        EmployeeResponseDto GetById(int id);
        void Add(EmployeeCreateAndUpdateDto dto);
        void Update(int id, EmployeeCreateAndUpdateDto dto);
        void Delete(int id);
    }
}
