using HR_ADMIN_PORTAL.Models;

namespace HR_ADMIN_PORTAL.Repositories.Users
{
    public interface IUserRepository
    {
        User GetByUsername(string username);
        bool UsernameExists(string username);
        bool EmailExists(string email);
        void Add(User user);
    }
}
