using HR_ADMIN_PORTAL.Models;

namespace HR_ADMIN_PORTAL.dto.EmployeeDtos
{
    public class EmployeeCreateAndUpdateDto
    {
        public string Name { get; set; }
        public string Email { get; set; }

        public long PhoneNo { get; set; }
        public long salary{ get; set; }
        public Department Department { get; set; }
    }
   
    public class EmployeeResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Department { get; set; }
        public long PhoneNo { get; set; }
        public long Salary { get; set; }
    }

}
