using HR_ADMIN_PORTAL.dto.AuthDtos;

namespace HR_ADMIN_PORTAL.Services.AuthService
{
    public interface IAuthService
    {
        string Login(LoginRequest dto);
        void Register(RegisterDto dto);
    }
}
