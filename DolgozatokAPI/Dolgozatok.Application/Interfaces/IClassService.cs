using Dolgozatok.Domain.Entities;
using Dolgozatok.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;
using Task = System.Threading.Tasks.Task;

namespace Dolgozatok.Application.Interfaces
{
    public interface IClassService
    {
        Task<IEnumerable<ClassDto>> GetTeacherClassesAsync(int teacherId);
        Task<Class> CreateClassAsync(string className, int teacherId);
        Task<string> GenerateJoinCodeAsync(int classId, int teacherId);
        Task ToggleJoinCodeAsync(int classId, bool isActive, int teacherId);
        Task RenameClassAsync(int classId, string newName, int teacherId);
        Task JoinClassWithCodeAsync(int studentId, string joinCode);
        Task RemoveStudentAsync(int classId, int studentId, int teacherId);
        Task<string> ManuallyCreateStudentAsync(int classId, string name, string email, int teacherId);
        Task<IEnumerable<StudentDto>> GetClassStudentsAsync(int classId, int teacherId);
    }
}
