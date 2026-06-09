using Dolgozatok.Application.DTOs;
using Dolgozatok.Application.Interfaces;
using Dolgozatok.Domain.Entities;
using Dolgozatok.Infrastructure.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Dolgozatok.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly IUserService _userService;
        private readonly UserManager<ApplicationIdentityUser> _userManager;

        public UserController(
            ILogger<UserController> logger, 
            IUserService userService, 
            UserManager<ApplicationIdentityUser> userManager)
        {
            _logger = logger;
            _userService = userService;
            _userManager = userManager;
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUserProfile()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            User? domainUser = await _userService.GetUserById(userId);
            if (domainUser == null)
            {
                return NotFound("Domain user profile not found.");
            }

            return Ok(domainUser);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO model)
        {
            if (model == null)
            {
                return BadRequest("Invalid registration data.");
            }

            // 1. Create the Security User in ASP.NET Core Identity
            var identityUser = new ApplicationIdentityUser 
            { 
                UserName = model.Email, 
                Email = model.Email 
            };
            
            var result = await _userManager.CreateAsync(identityUser, model.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            // 2. Create the corresponding Domain User Profile
            var domainUser = new User
            {
                Id = identityUser.Id, // Link both entities via the shared integer ID
                RealName = model.RealName,
                ClassId = model.ClassId
            };

            try
            {
                await _userService.AddUserAsync(domainUser);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create domain user profile for identity ID {Id}.", identityUser.Id);
                // Roll back Identity user if domain profile creation fails to prevent orphaned account
                await _userManager.DeleteAsync(identityUser);
                return StatusCode(500, "An error occurred while creating the user profile.");
            }

            return Ok(new { message = "User registered successfully" });
        }
    }
}
