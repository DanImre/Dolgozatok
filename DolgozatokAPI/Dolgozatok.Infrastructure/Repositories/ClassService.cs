using Dolgozatok.Application.Interfaces;
using Dolgozatok.Domain.Entities;
using Dolgozatok.Infrastructure.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dolgozatok.Application.DTOs;
using Task = System.Threading.Tasks.Task;

namespace Dolgozatok.Infrastructure.Repositories
{
    public class ClassService : IClassService
    {
        private readonly DolgozatokDbContext _context;
        private readonly UserManager<ApplicationIdentityUser> _userManager;

        public ClassService(DolgozatokDbContext context, UserManager<ApplicationIdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<IEnumerable<ClassDto>> GetTeacherClassesAsync(int teacherId)
        {
            return await _context.Classes
                .Where(c => !c.IsDeleted && c.Teachers.Any(t => t.Id == teacherId))
                .Select(c => new ClassDto
                {
                    Id = c.Id,
                    ClassName = c.ClassName,
                    StudentCount = c.Students.Count(),
                    TeacherCount = c.Teachers.Count(),
                    JoinCode = c.JoinCode,
                    IsJoinCodeActive = c.IsJoinCodeActive
                })
                .ToListAsync();
        }

        public async Task<Class> CreateClassAsync(string className, int teacherId)
        {
            var user = await _context.Users.FindAsync(teacherId);
            if (user == null)
                throw new Exception("Teacher not found");

            var newClass = new Class
            {
                ClassName = className,
                OwnerId = teacherId,
                Owner = user,
                IsTeacherClass = false
            };

            // Add the teacher to the class's teachers collection as well, since they own it
            newClass.Teachers.Add(user);

            _context.Classes.Add(newClass);
            await _context.SaveChangesAsync();
            return newClass;
        }

        private async Task EnsureTeacherOwnsClass(int classId, int teacherId)
        {
            Class? classObj = await _context.Classes
                .Include(c => c.Teachers)
                .FirstOrDefaultAsync(c => c.Id == classId && !c.IsDeleted);

            if (classObj == null)
                throw new Exception("Class not found");
            if (classObj.OwnerId != teacherId && !classObj.Teachers.Any(t => t.Id == teacherId))
                throw new Exception("You do not have permission to manage this class.");
        }

        public async Task<string> GenerateJoinCodeAsync(int classId, int teacherId)
        {
            await EnsureTeacherOwnsClass(classId, teacherId);

            Class? classObj = await _context.Classes.FindAsync(classId);
            if (classObj == null)
                throw new Exception("Class not found");

            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            string newCode;
            
            while (true)
            {
                newCode = new string(Enumerable.Repeat(chars, 6).Select(s => s[random.Next(s.Length)]).ToArray());
                // Check if any other class is already using this code
                bool exists = await _context.Classes.AnyAsync(c => c.JoinCode == newCode && c.Id != classId);
                if (!exists)
                    break;
            }

            classObj.JoinCode = newCode;
            classObj.IsJoinCodeActive = true;
            await _context.SaveChangesAsync();
            return newCode;
        }

        public async Task ToggleJoinCodeAsync(int classId, bool isActive, int teacherId)
        {
            await EnsureTeacherOwnsClass(classId, teacherId);
            Class? classObj = await _context.Classes.FindAsync(classId);
            if (classObj == null)
                return;

            classObj.IsJoinCodeActive = isActive;
            await _context.SaveChangesAsync();
        }

        public async Task RenameClassAsync(int classId, string newName, int teacherId)
        {
            await EnsureTeacherOwnsClass(classId, teacherId);
            Class? classObj = await _context.Classes.FindAsync(classId);
            if (classObj == null)
                throw new Exception("Class not found");

            if (string.IsNullOrWhiteSpace(newName))
                throw new Exception("Class name cannot be empty");

            classObj.ClassName = newName.Trim();
            await _context.SaveChangesAsync();
        }

        public async Task JoinClassWithCodeAsync(int studentId, string joinCode)
        {
            if (string.IsNullOrWhiteSpace(joinCode))
                throw new Exception("Invalid code");

            Class? classObj = await _context.Classes
                .Include(c => c.Students)
                .FirstOrDefaultAsync(c => c.JoinCode == joinCode && c.IsJoinCodeActive && !c.IsDeleted);

            if (classObj == null)
                throw new Exception("Invalid or inactive join code.");

            User? student = await _context.Users
                .Include(u => u.Classes)
                .FirstOrDefaultAsync(u => u.Id == studentId && !u.IsDeleted);

            if (student == null)
                throw new Exception("User not found");

            if (!student.Classes.Any(c => c.Id == classObj.Id))
            {
                student.Classes.Add(classObj);
                await _context.SaveChangesAsync();
            }
        }

        public async Task RemoveStudentAsync(int classId, int studentId, int teacherId)
        {
            await EnsureTeacherOwnsClass(classId, teacherId);

            User? student = await _context.Users
                .Include(u => u.Classes)
                .FirstOrDefaultAsync(u => u.Id == studentId && !u.IsDeleted);

            if (student == null)
                return;

            Class? classToRemove = student.Classes.FirstOrDefault(c => c.Id == classId);
            if (classToRemove == null)
                return;

            student.Classes.Remove(classToRemove);
            await _context.SaveChangesAsync();
        }

        public async Task<string> ManuallyCreateStudentAsync(int classId, string name, string email, int teacherId)
        {
            await EnsureTeacherOwnsClass(classId, teacherId);
            Class? classObj = await _context.Classes.FindAsync(classId);
            if (classObj == null)
                throw new Exception("Class not found");

            ApplicationIdentityUser identityUser = new()
            {
                UserName = email,
                Email = email
            };

            string tempPass = Guid.NewGuid().ToString() + "A1!";
            IdentityResult result = await _userManager.CreateAsync(identityUser, tempPass);
            if (!result.Succeeded) 
                throw new Exception("Failed to create user account: " + string.Join(", ", result.Errors.Select(e => e.Description)));

            await _userManager.AddToRoleAsync(identityUser, "Student");

            User domainUser = new()
            {
                Id = identityUser.Id,
                RealName = name
            };
            domainUser.Classes.Add(classObj);

            _context.Users.Add(domainUser);
            await _context.SaveChangesAsync();

            var token = await _userManager.GeneratePasswordResetTokenAsync(identityUser);
            return token;
        }

        public async Task<IEnumerable<StudentDto>> GetClassStudentsAsync(int classId, int teacherId)
        {
            await EnsureTeacherOwnsClass(classId, teacherId);

            var classObj = await _context.Classes
                .Include(c => c.Students)
                .FirstOrDefaultAsync(c => c.Id == classId);

            if (classObj == null)
            {
                throw new Exception("Class not found.");
            }

            var studentIds = classObj.Students.Select(s => s.Id).ToList();
            Dictionary<int, string> emails = await _userManager.Users
                .Where(u => studentIds.Contains(u.Id))
                .Where(u => !string.IsNullOrEmpty(u.Email))
                .ToDictionaryAsync(u => u.Id, u => u.Email!);

            return classObj.Students.Select(s => new StudentDto
            {
                Id = s.Id,
                Name = s.RealName,
                Email = emails.ContainsKey(s.Id) ? emails[s.Id] : string.Empty
            });
        }
    }
}
