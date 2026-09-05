using Dolgozatok.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Dolgozatok.API.Controllers
{
    [Authorize]
    public class ClassController : BaseApiController
    {
        private readonly IClassService _classService;

        public ClassController(IClassService classService)
        {
            _classService = classService;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }

        [HttpGet]
        public async Task<IActionResult> GetClasses()
        {
            try
            {
                var classes = await _classService.GetTeacherClassesAsync(GetUserId());
                return Ok(classes);
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateClass([FromBody] CreateClassRequest request)
        {
            try
            {
                var newClass = await _classService.CreateClassAsync(request.ClassName, GetUserId());
                return Ok(new { id = newClass.Id, className = newClass.ClassName, joinCode = newClass.JoinCode });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{classId}/generate-code")]
        public async Task<IActionResult> GenerateJoinCode(int classId)
        {
            try
            {
                var code = await _classService.GenerateJoinCodeAsync(classId, GetUserId());
                return Ok(new { code });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{classId}/toggle-code")]
        public async Task<IActionResult> ToggleJoinCode(int classId, [FromBody] ToggleCodeRequest request)
        {
            try
            {
                await _classService.ToggleJoinCodeAsync(classId, request.IsActive, GetUserId());
                return Ok();
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{classId}/rename")]
        public async Task<IActionResult> RenameClass(int classId, [FromBody] RenameClassRequest request)
        {
            try
            {
                await _classService.RenameClassAsync(classId, request.Name, GetUserId());
                return Ok();
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("join")]
        public async Task<IActionResult> JoinClass([FromBody] JoinClassRequest request)
        {
            try
            {
                await _classService.JoinClassWithCodeAsync(GetUserId(), request.Code);
                return Ok(new { message = "Joined class successfully." });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{classId}/students/{studentId}")]
        public async Task<IActionResult> RemoveStudent(int classId, int studentId, [FromQuery] bool isInvited = false)
        {
            try
            {
                await _classService.RemoveStudentAsync(classId, studentId, GetUserId(), isInvited);
                return Ok();
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{classId}/check-student")]
        public async Task<IActionResult> CheckStudentEmail(int classId, [FromQuery] string email)
        {
            try
            {
                var result = await _classService.CheckStudentEmailAsync(classId, email, GetUserId());
                return Ok(result);
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{classId}/students/add-existing")]
        public async Task<IActionResult> AddExistingStudent(int classId, [FromBody] AddExistingStudentRequest request)
        {
            try
            {
                await _classService.AddExistingStudentAsync(classId, request.Email, GetUserId());
                return Ok(new { message = "Student added successfully." });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{classId}/students/register")]
        public async Task<IActionResult> RegisterStudent(int classId, [FromBody] RegisterStudentRequest request)
        {
            try
            {
                await _classService.RegisterStudentAsync(classId, request.Name, request.Email, GetUserId());
                return Ok(new { message = "Registration email sent." });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{classId}/students/manual")]
        public async Task<IActionResult> ManuallyCreateStudent(int classId, [FromBody] ManualStudentRequest request)
        {
            try
            {
                var token = await _classService.ManuallyCreateStudentAsync(classId, request.Name, request.Email, GetUserId());
                return Ok(new { token });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{classId}/students")]
        public async Task<IActionResult> GetClassStudents(int classId)
        {
            try
            {
                var students = await _classService.GetClassStudentsAsync(classId, GetUserId());
                return Ok(students);
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{classId}")]
        public async Task<IActionResult> DeleteClass(int classId)
        {
            try
            {
                await _classService.DeleteClassAsync(classId, GetUserId());
                return Ok(new { message = "Class deleted successfully." });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }

    public class ToggleCodeRequest { public bool IsActive { get; set; } }
    public class JoinClassRequest { public string Code { get; set; } = string.Empty; }
    public class ManualStudentRequest { public string Name { get; set; } = string.Empty; public string Email { get; set; } = string.Empty; }
    public class CreateClassRequest { public string ClassName { get; set; } = string.Empty; }
    public class RenameClassRequest { public string Name { get; set; } = string.Empty; }
    public class AddExistingStudentRequest { public string Email { get; set; } = string.Empty; }
    public class RegisterStudentRequest { public string Email { get; set; } = string.Empty; public string Name { get; set; } = string.Empty; }
}
