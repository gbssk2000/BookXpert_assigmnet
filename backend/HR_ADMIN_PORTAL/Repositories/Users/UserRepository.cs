using HR_ADMIN_PORTAL.Data;
using HR_ADMIN_PORTAL.Models;

namespace HR_ADMIN_PORTAL.Repositories.Users
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public User GetByUsername(string username)
            => _context.Users.FirstOrDefault(u => u.Username == username);

        public bool UsernameExists(string username)
            => _context.Users.Any(u => u.Username == username);

        public bool EmailExists(string email)
            => _context.Users.Any(u => u.Email == email);

        public void Add(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
        }
    }
}
