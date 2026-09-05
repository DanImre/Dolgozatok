using System;
using System.Linq;
using System.Threading.Tasks;
using Dolgozatok.Domain.Entities;
using Dolgozatok.Infrastructure;
using Dolgozatok.Infrastructure.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Dolgozatok.API.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class RegisterController : ControllerBase
    {
        private readonly DolgozatokDbContext _context;
        private readonly UserManager<ApplicationIdentityUser> _userManager;

        public RegisterController(DolgozatokDbContext context, UserManager<ApplicationIdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet("{token}")]
        public async Task<IActionResult> GetRegistrationDetails(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
                return BadRequest(new { message = "Token is required." });

            var registration = await _context.StudentRegistrations
                .Include(r => r.Class)
                .FirstOrDefaultAsync(r => r.Token == token && !r.IsDeleted);

            if (registration == null)
                return NotFound(new { message = "Invalid registration link." });

            if (registration.IsCompleted)
                return Ok(new { 
                    status = "AlreadyRegistered",
                    email = registration.Email,
                    name = registration.Name
                });

            if (registration.ExpiresAt < DateTime.UtcNow)
                return Ok(new { 
                    status = "Expired",
                    email = registration.Email,
                    name = registration.Name
                });

            var allRegistrations = await _context.StudentRegistrations
                .Include(r => r.Class)
                .Where(r => r.Email.ToLower() == registration.Email.ToLower() && !r.IsCompleted && r.ExpiresAt > DateTime.UtcNow && !r.IsDeleted)
                .ToListAsync();

            var classNames = allRegistrations
                .Where(r => r.Class != null && !r.Class.IsDeleted)
                .Select(r => r.Class!.ClassName)
                .Distinct()
                .ToList();

            return Ok(new
            {
                status = "Valid",
                email = registration.Email,
                name = registration.Name,
                classes = classNames
            });
        }

        [HttpPost("{token}/complete")]
        public async Task<IActionResult> CompleteRegistration(string token, [FromBody] CompleteRegistrationRequest request)
        {
            if (string.IsNullOrWhiteSpace(token))
                return BadRequest(new { code = "TOKEN_REQUIRED", message = "Token is required." });

            if (request == null || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest(new { code = "PASSWORD_REQUIRED", message = "Password is required." });

            if (request.Password != request.ConfirmPassword)
                return BadRequest(new { code = "PASSWORD_MISMATCH", message = "Passwords do not match." });

            if (request.Password.Length < 8)
                return BadRequest(new { code = "PASSWORD_MIN_LENGTH", message = "Password must be at least 8 characters long." });

            var registration = await _context.StudentRegistrations
                .Include(r => r.Class)
                .FirstOrDefaultAsync(r => r.Token == token && !r.IsDeleted);

            if (registration == null)
                return NotFound(new { code = "INVALID_LINK", message = "Invalid registration link." });

            if (registration.IsCompleted)
                return BadRequest(new { code = "ALREADY_COMPLETED", message = "Registration has already been completed." });

            if (registration.ExpiresAt < DateTime.UtcNow)
                return BadRequest(new { code = "LINK_EXPIRED", message = "Registration link has expired." });

            var existingIdentity = await _userManager.FindByEmailAsync(registration.Email);
            if (existingIdentity != null)
                return BadRequest(new { code = "EMAIL_ALREADY_EXISTS", message = "An account with this email already exists." });

            var identityUser = new ApplicationIdentityUser
            {
                UserName = registration.Email,
                Email = registration.Email
            };

            var createResult = await _userManager.CreateAsync(identityUser, request.Password);
            if (!createResult.Succeeded)
            {
                var firstError = createResult.Errors.FirstOrDefault();
                var errors = string.Join(", ", createResult.Errors.Select(e => e.Description));
                return BadRequest(new { code = firstError?.Code ?? "IDENTITY_ERROR", message = errors });
            }

            await _userManager.AddToRoleAsync(identityUser, "Student");

            var domainUser = new User
            {
                Id = identityUser.Id,
                RealName = registration.Name
            };

            var allPendingRegistrations = await _context.StudentRegistrations
                .Include(r => r.Class)
                .Where(r => r.Email.ToLower() == registration.Email.ToLower() && !r.IsCompleted && !r.IsDeleted)
                .ToListAsync();

            foreach (var reg in allPendingRegistrations)
            {
                if (reg.Class != null && !reg.Class.IsDeleted && !domainUser.Classes.Any(c => c.Id == reg.ClassId))
                {
                    domainUser.Classes.Add(reg.Class);
                }
                reg.IsCompleted = true;
                reg.CompletedAt = DateTime.UtcNow;
            }

            _context.Users.Add(domainUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration completed successfully.", email = registration.Email });
        }
    }

    public class CompleteRegistrationRequest
    {
        public string Password { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
