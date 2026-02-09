using HR_ADMIN_PORTAL.Models;
using HR_ADMIN_PORTAL.Repositories.Users;
using HR_ADMIN_PORTAL.Services.JwtTokenService.JwtTokenServices;
using HR_ADMIN_PORTAL.Repositories;
using HR_ADMIN_PORTAL.helper;
using HR_ADMIN_PORTAL.dto.AuthDtos;

namespace HR_ADMIN_PORTAL.Services.AuthService
{

     public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtTokenService _jwtService;

        public AuthService(
            IUserRepository userRepository,
            IJwtTokenService jwtService)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
        }

        public void Register(RegisterDto dto)
        {
            if (_userRepository.UsernameExists(dto.Username))
                throw new Exception("Username already exists");

            if (_userRepository.EmailExists(dto.Email))
                throw new Exception("Email already registered");

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = PasswordHasher.HashPassword(dto.Password)
            };

            _userRepository.Add(user);
        }

        public string Login(LoginRequest dto)
        {
            var user = _userRepository.GetByUsername(dto.Username);

            if (user == null)
                throw new Exception("Invalid username or password");

            var hashedPassword = PasswordHasher.HashPassword(dto.Password);

            if (user.PasswordHash != hashedPassword)
                throw new Exception("Invalid username or password");

            return _jwtService.GenerateToken(user);
        }
    }

}
