using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Dolgozatok.Application.DTOs;
using Dolgozatok.Application.Enums;
using Dolgozatok.Application.Interfaces;
using Dolgozatok.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Dolgozatok.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Teacher")]
    public class FolderController : ControllerBase
    {
        private readonly IFolderService _folderService;

        public FolderController(IFolderService folderService)
        {
            _folderService = folderService;
        }

        private int GetCurrentUserId()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdString, out int userId))
                throw new UnauthorizedAccessException("Invalid user ID in token.");

            return userId;
        }

        [HttpGet("Root")]
        public async Task<ActionResult<List<FolderContentDTO>>> GetRootContents()
        {
            try
            {
                var userId = GetCurrentUserId();
                var contents = await _folderService.GetRootContentsAsync(userId);
                return Ok(contents);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        [HttpGet("{id}/Contents")]
        public async Task<ActionResult<List<FolderContentDTO>>> GetFolderContents(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var contents = await _folderService.GetFolderContentsAsync(id, userId);
                if (contents == null)
                    return NotFound("Folder not found or you don't have access.");
                
                return Ok(contents);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        public class CreateFolderRequest
        {
            public string Name { get; set; } = string.Empty;
            public int? ParentId { get; set; }
        }

        [HttpPost]
        public async Task<ActionResult<FolderContentDTO>> CreateFolder([FromBody] CreateFolderRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var newFolder = new Folder
                {
                    Name = request.Name,
                    ParentId = request.ParentId,
                    OwnerId = userId,
                    IsDeleted = false
                };

                var createdFolder = await _folderService.CreateFolderAsync(newFolder);
                return Ok(new FolderContentDTO 
                { 
                    Id = createdFolder.Id, 
                    Name = createdFolder.Name,
                    Type = ContentType.Folder,
                    Created = null,
                    Edited = null
                });
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFolder(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                await _folderService.DeleteFolderAsync(id, userId);
                return NoContent();
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }
    }
}
