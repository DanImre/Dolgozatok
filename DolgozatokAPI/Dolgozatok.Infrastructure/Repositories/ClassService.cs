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
        private readonly IEmailService _emailService;

        public ClassService(DolgozatokDbContext context, UserManager<ApplicationIdentityUser> userManager, IEmailService emailService)
        {
            _context = context;
            _userManager = userManager;
            _emailService = emailService;
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

        public async Task RemoveStudentAsync(int classId, int studentId, int teacherId, bool isInvited = false)
        {
            await EnsureTeacherOwnsClass(classId, teacherId);

            if (isInvited)
            {
                var registration = await _context.StudentRegistrations
                    .FirstOrDefaultAsync(r => r.Id == studentId && r.ClassId == classId && !r.IsDeleted);

                if (registration != null)
                {
                    registration.ClassId = null;
                    registration.Class = null;
                    await _context.SaveChangesAsync();
                }
                return;
            }

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

            var result = classObj.Students.Select(s => new StudentDto
            {
                Id = s.Id,
                Name = s.RealName,
                Email = emails.ContainsKey(s.Id) ? emails[s.Id] : string.Empty,
                IsInvited = false
            }).ToList();

            var pendingRegistrations = await _context.StudentRegistrations
                .Where(r => r.ClassId == classId && !r.IsCompleted && r.ExpiresAt > DateTime.UtcNow && !r.IsDeleted)
                .ToListAsync();

            foreach (var reg in pendingRegistrations)
            {
                if (!result.Any(s => s.Email.Equals(reg.Email, StringComparison.OrdinalIgnoreCase)))
                {
                    result.Add(new StudentDto
                    {
                        Id = reg.Id,
                        Name = reg.Name,
                        Email = reg.Email,
                        IsInvited = true
                    });
                }
            }

            return result;
        }

        public async Task<CheckStudentResultDto> CheckStudentEmailAsync(int classId, string email, int teacherId)
        {
            await EnsureTeacherOwnsClass(classId, teacherId);

            var cleanEmail = email.Trim().ToLowerInvariant();
            var identityUser = await _userManager.FindByEmailAsync(cleanEmail);

            if (identityUser != null)
            {
                var domainUser = await _context.Users
                    .Include(u => u.Classes)
                    .FirstOrDefaultAsync(u => u.Id == identityUser.Id && !u.IsDeleted);

                if (domainUser != null)
                {
                    return new CheckStudentResultDto
                    {
                        Exists = true,
                        Name = domainUser.RealName,
                        IsAlreadyInClass = domainUser.Classes.Any(c => c.Id == classId)
                    };
                }
            }

            var pendingReg = await _context.StudentRegistrations
                .Where(r => r.Email.ToLower() == cleanEmail && !r.IsCompleted && r.ExpiresAt > DateTime.UtcNow && !r.IsDeleted)
                .OrderByDescending(r => r.CreatedAt)
                .FirstOrDefaultAsync();

            bool alreadyPendingForThisClass = await _context.StudentRegistrations
                .AnyAsync(r => r.Email.ToLower() == cleanEmail && r.ClassId == classId && !r.IsCompleted && r.ExpiresAt > DateTime.UtcNow && !r.IsDeleted);

            return new CheckStudentResultDto
            {
                Exists = false,
                Name = pendingReg?.Name ?? string.Empty,
                IsAlreadyInClass = alreadyPendingForThisClass
            };
        }

        public async Task AddExistingStudentAsync(int classId, string email, int teacherId)
        {
            await EnsureTeacherOwnsClass(classId, teacherId);

            var classObj = await _context.Classes.Include(c => c.Students).FirstOrDefaultAsync(c => c.Id == classId && !c.IsDeleted);
            if (classObj == null)
                throw new Exception("Class not found");

            var cleanEmail = email.Trim().ToLowerInvariant();
            var identityUser = await _userManager.FindByEmailAsync(cleanEmail);
            if (identityUser == null)
                throw new Exception("User not found with this email");

            var domainUser = await _context.Users.Include(u => u.Classes).FirstOrDefaultAsync(u => u.Id == identityUser.Id && !u.IsDeleted);
            if (domainUser == null)
                throw new Exception("User profile not found");

            if (!domainUser.Classes.Any(c => c.Id == classId))
            {
                domainUser.Classes.Add(classObj);
                await _context.SaveChangesAsync();
            }
        }

        public async Task RegisterStudentAsync(int classId, string name, string email, int teacherId)
        {
            await EnsureTeacherOwnsClass(classId, teacherId);

            var classObj = await _context.Classes.FindAsync(classId);
            if (classObj == null)
                throw new Exception("Class not found");

            var cleanEmail = email.Trim().ToLowerInvariant();
            var cleanName = name.Trim();

            if (string.IsNullOrWhiteSpace(cleanEmail))
                throw new Exception("Email cannot be empty");
            if (string.IsNullOrWhiteSpace(cleanName))
                throw new Exception("Student name cannot be empty");

            var existingIdentityUser = await _userManager.FindByEmailAsync(cleanEmail);
            if (existingIdentityUser != null)
            {
                await AddExistingStudentAsync(classId, cleanEmail, teacherId);
                return;
            }

            var existingRegForClass = await _context.StudentRegistrations
                .FirstOrDefaultAsync(r => r.Email.ToLower() == cleanEmail && r.ClassId == classId && !r.IsCompleted && r.ExpiresAt > DateTime.UtcNow && !r.IsDeleted);

            string token;
            if (existingRegForClass != null)
            {
                existingRegForClass.Name = cleanName;
                existingRegForClass.ExpiresAt = DateTime.UtcNow.AddDays(7);
                token = existingRegForClass.Token;
            }
            else
            {
                token = Guid.NewGuid().ToString("N");
                var registration = new StudentRegistration
                {
                    Email = cleanEmail,
                    Name = cleanName,
                    Token = token,
                    ClassId = classId,
                    CreatedAt = DateTime.UtcNow,
                    ExpiresAt = DateTime.UtcNow.AddDays(7),
                    IsCompleted = false,
                    IsDeleted = false
                };
                _context.StudentRegistrations.Add(registration);
            }

            await _context.SaveChangesAsync();

            await _emailService.SendRegistrationEmailAsync(cleanEmail, cleanName, token, classObj.ClassName);
        }

        public async Task DeleteClassAsync(int classId, int teacherId)
        {
            var classObj = await _context.Classes
                .Include(c => c.Teachers)
                .Include(c => c.Students)
                .FirstOrDefaultAsync(c => c.Id == classId && !c.IsDeleted);

            if (classObj == null)
                throw new Exception("Class not found");

            if (classObj.OwnerId != teacherId && !classObj.Teachers.Any(t => t.Id == teacherId))
                throw new Exception("You do not have permission to delete this class.");

            // Soft-delete the class
            classObj.IsDeleted = true;
            classObj.IsJoinCodeActive = false;

            // Detach any pending invitations for this class
            var pendingRegistrations = await _context.StudentRegistrations
                .Where(r => r.ClassId == classId && !r.IsCompleted && !r.IsDeleted)
                .ToListAsync();

            foreach (var reg in pendingRegistrations)
            {
                reg.ClassId = null;
            }

            await _context.SaveChangesAsync();
        }
    }
}
