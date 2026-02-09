using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using HR_ADMIN_PORTAL.Services.AttendanceService;
using HR_ADMIN_PORTAL.dto.AttendanceDto;
using Microsoft.AspNetCore.Authorization;

namespace HR_ADMIN_PORTAL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AttendanceController : ControllerBase
    {
        private readonly IAttendanceService _attendanceService;

        public AttendanceController(IAttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }

        // GET: api/Attendance
        [HttpGet]
        public ActionResult<IEnumerable<AttendanceResponseDto>> GetAll()
        {
            try
            {
                var attendance = _attendanceService.GetAll();
                return Ok(attendance);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching attendance records", error = ex.Message });
            }
        }

        // GET: api/Attendance/5
        [HttpGet("{id}")]
        public ActionResult<AttendanceResponseDto> GetById(int id)
        {
            try
            {
                var attendance = _attendanceService.GetById(id);
                if (attendance == null)
                    return NotFound(new { message = "Attendance record not found" });

                return Ok(attendance);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching attendance record", error = ex.Message });
            }
        }

        // POST: api/Attendance
        [HttpPost]
        public ActionResult Create([FromBody] AttendanceCreateDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                _attendanceService.Add(dto);
                return Ok(new { message = "Attendance record created successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating attendance record", error = ex.Message });
            }
        }
    }
}
