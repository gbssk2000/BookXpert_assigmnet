using HR_ADMIN_PORTAL.dto.AttendanceDto;

namespace HR_ADMIN_PORTAL.Services.AttendanceService
{
    public interface IAttendanceService
    {
        IEnumerable<AttendanceResponseDto> GetAll();
        AttendanceResponseDto GetById(int id);
        void Add(AttendanceCreateDto dto);
    }
}
