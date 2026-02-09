using HR_ADMIN_PORTAL.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace HR_ADMIN_PORTAL.Data
{
    public class ApplicationDbContext: DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Attendance> Attendance { get; set; }
    }
}
