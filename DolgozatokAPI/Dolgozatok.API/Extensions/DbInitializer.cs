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

            var email = "test@gmail.com";
            
            var existingUser = await userManager.FindByEmailAsync(email);
            
            if (existingUser == null)
            {
                var identityUser = new ApplicationIdentityUser
                {
                    UserName = email,
                    Email = email,
                    SecurityStamp = Guid.NewGuid().ToString()
                };
                
                // Manually hash to bypass UserManager validation policies
                var hasher = new PasswordHasher<ApplicationIdentityUser>();
                identityUser.PasswordHash = hasher.HashPassword(identityUser, "test");
                
                // Create without string password parameter
                var result = await userManager.CreateAsync(identityUser);
                
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    throw new InvalidOperationException($"Failed to register the default user in Identity: {errors}");
                }
                
                var domainUser = new User
                {
                    Id = identityUser.Id,
                    RealName = "Dán Imre",
                    ClassId = null
                };
                
                context.Users.Add(domainUser);
                
                await context.SaveChangesAsync();
            }
        }
    }
}
