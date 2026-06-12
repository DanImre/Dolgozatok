using Dolgozatok.Domain.Entities;
using Dolgozatok.Infrastructure;
using Dolgozatok.Infrastructure.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using Task = System.Threading.Tasks.Task;

namespace Dolgozatok.API.Extensions
{
    public static class DbInitializer
    {
        public static async Task InitializeAsync(DolgozatokDbContext context, bool isDevelopment, UserManager<ApplicationIdentityUser> userManager)
        {
            if (!isDevelopment)
                return;

            // Ensure the database schema is created and up to date!
            await context.Database.MigrateAsync();

            // 1. Ensure Test Teacher
            var teacherEmail = "test.teacher@test.com";
            var teacherIdentityUser = await userManager.FindByEmailAsync(teacherEmail);
            int teacherId;
            
            if (teacherIdentityUser == null)
            {
                teacherIdentityUser = new ApplicationIdentityUser
                {
                    UserName = teacherEmail,
                    Email = teacherEmail,
                    SecurityStamp = Guid.NewGuid().ToString()
                };
                
                var hasher = new PasswordHasher<ApplicationIdentityUser>();
                teacherIdentityUser.PasswordHash = hasher.HashPassword(teacherIdentityUser, "test");
                
                var result = await userManager.CreateAsync(teacherIdentityUser);
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    throw new InvalidOperationException($"Failed to register Test Teacher: {errors}");
                }
                
                var teacherDomainUser = new User
                {
                    Id = teacherIdentityUser.Id,
                    RealName = "Test Teacher",
                };
                context.Users.Add(teacherDomainUser);
                await context.SaveChangesAsync();
            }
            teacherId = teacherIdentityUser.Id;

            // 3. Ensure Classes
            var teacherClass = await context.Classes.FirstOrDefaultAsync(c => c.ClassName == "Próba Tanár Osztály");
            if (teacherClass == null)
            {
                teacherClass = new Class
                {
                    ClassName = "Próba Tanár Osztály",
                    IsTeacherClass = true,
                    OwnerId = teacherId
                };
                context.Classes.Add(teacherClass);
            }
            else
                teacherClass.OwnerId = teacherId;

            var studentClass = await context.Classes.FirstOrDefaultAsync(c => c.ClassName == "Próba Diák Osztály");
            if (studentClass == null)
            {
                studentClass = new Class
                {
                    ClassName = "Próba Diák Osztály",
                    IsTeacherClass = false,
                    OwnerId = teacherId
                };
                context.Classes.Add(studentClass);
            }
            else
                studentClass.OwnerId = teacherId;

            await context.SaveChangesAsync();

            // 4. Update Teacher Domain User ClassId
            var tUser = await context.Users.FindAsync(teacherId);
            if (tUser != null)
                tUser.ClassId = teacherClass.Id;

            // 5. Ensure Test Student
            var studentEmail = "test.student@test.com";
            var studentIdentityUser = await userManager.FindByEmailAsync(studentEmail);
            
            if (studentIdentityUser == null)
            {
                studentIdentityUser = new ApplicationIdentityUser
                {
                    UserName = studentEmail,
                    Email = studentEmail,
                    SecurityStamp = Guid.NewGuid().ToString()
                };
                
                var hasher = new PasswordHasher<ApplicationIdentityUser>();
                studentIdentityUser.PasswordHash = hasher.HashPassword(studentIdentityUser, "test");
                
                var result = await userManager.CreateAsync(studentIdentityUser);
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    throw new InvalidOperationException($"Failed to register Test Student: {errors}");
                }
                
                var studentDomainUser = new User
                {
                    Id = studentIdentityUser.Id,
                    RealName = "Test Student",
                    ClassId = studentClass.Id
                };
                context.Users.Add(studentDomainUser);
            }
            else
            {
                var sUser = await context.Users.FindAsync(studentIdentityUser.Id);
                if (sUser != null)
                    sUser.ClassId = studentClass.Id;
            }

            await context.SaveChangesAsync();
        }
    }
}
