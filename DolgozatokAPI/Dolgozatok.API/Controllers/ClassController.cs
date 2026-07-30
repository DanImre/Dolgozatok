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
        public async Task<IActionResult> RemoveStudent(int classId, int studentId)
        {
            try
            {
                await _classService.RemoveStudentAsync(classId, studentId, GetUserId());
                return Ok();
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
    }

    public class ToggleCodeRequest { public bool IsActive { get; set; } }
    public class JoinClassRequest { public string Code { get; set; } = string.Empty; }
    public class ManualStudentRequest { public string Name { get; set; } = string.Empty; public string Email { get; set; } = string.Empty; }
    public class CreateClassRequest { public string ClassName { get; set; } = string.Empty; }
    public class RenameClassRequest { public string Name { get; set; } = string.Empty; }
}
