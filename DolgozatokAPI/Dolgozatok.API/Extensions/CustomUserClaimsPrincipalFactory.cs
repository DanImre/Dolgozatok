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

            var domainUser = await _dbContext.Set<Domain.Entities.User>()
                .Include(u => u.Class)
                .FirstOrDefaultAsync(u => u.Id == user.Id);

            if (domainUser != null)
            {
                if (domainUser.Class == null || domainUser.Class.IsTeacherClass)
                {
                    identity.AddClaim(new Claim(ClaimTypes.Role, "Teacher"));
                }
                else
                {
                    identity.AddClaim(new Claim(ClaimTypes.Role, "Student"));
                }
            }

            return identity;
        }
    }
}
