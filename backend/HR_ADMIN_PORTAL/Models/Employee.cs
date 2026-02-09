namespace HR_ADMIN_PORTAL.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string EmployeeName { get; set; }
        public string EmployeeEmail { get; set; }
        public long Salary{ get; set; }
        public long phoneNo { get; set; }
        public Department Department { get; set; }
    }
    public enum Department
    {
        HR = 1,
        IT = 2,
        Finance = 3,
        Sales = 4,
        Operations = 5
    }
}
