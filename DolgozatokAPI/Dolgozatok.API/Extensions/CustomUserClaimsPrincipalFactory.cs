using Dolgozatok.Infrastructure;
using Dolgozatok.Infrastructure.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Dolgozatok.API.Extensions
{
    public class CustomUserClaimsPrincipalFactory : UserClaimsPrincipalFactory<ApplicationIdentityUser, IdentityRole<int>>
    {
        private readonly DolgozatokDbContext _dbContext;

        public CustomUserClaimsPrincipalFactory(
            UserManager<ApplicationIdentityUser> userManager,
            RoleManager<IdentityRole<int>> roleManager,
            IOptions<IdentityOptions> optionsAccessor,
            DolgozatokDbContext dbContext)
            : base(userManager, roleManager, optionsAccessor)
        {
            _dbContext = dbContext;
        }

        protected override async Task<ClaimsIdentity> GenerateClaimsAsync(ApplicationIdentityUser user)
        {
            var identity = await base.GenerateClaimsAsync(user);

            var roles = await UserManager.GetRolesAsync(user);
            string roleToAssign;

            if (roles != null && roles.Contains("Teacher"))
            {
                roleToAssign = "Teacher";
            }
            else if (roles != null && roles.Contains("Student"))
            {
                roleToAssign = "Student";
            }
            else
            {
                // Check if user owns or teaches any class
                bool isTeacher = await _dbContext.Classes.AnyAsync(c => c.OwnerId == user.Id || c.Teachers.Any(t => t.Id == user.Id))
                    || await _dbContext.ClassTeachers.AnyAsync(ct => ct.TeacherId == user.Id);

                if (isTeacher)
                {
                    roleToAssign = "Teacher";
                }
                else
                {
                    var domainUser = await _dbContext.Set<Domain.Entities.User>()
                        .Include(u => u.Classes)
                        .FirstOrDefaultAsync(u => u.Id == user.Id);

                    if (domainUser != null && domainUser.Classes != null && domainUser.Classes.Any(c => c.IsTeacherClass))
                    {
                        roleToAssign = "Teacher";
                    }
                    else
                    {
                        roleToAssign = "Student";
                    }
                }
            }

            var existingRoleClaims = identity.FindAll(ClaimTypes.Role).ToList();
            foreach (var claim in existingRoleClaims)
            {
                identity.RemoveClaim(claim);
            }
            identity.AddClaim(new Claim(ClaimTypes.Role, roleToAssign));

            return identity;
        }
    }
}
