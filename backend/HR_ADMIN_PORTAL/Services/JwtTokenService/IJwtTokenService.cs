using HR_ADMIN_PORTAL.Models;

namespace HR_ADMIN_PORTAL.Services.JwtTokenService.JwtTokenServices
{
    public interface IJwtTokenService
    {
        string GenerateToken(User user);
    }
}
