using System.Collections.Generic;
using System.Linq;
using Dolgozatok.Application.DTOs;
using Dolgozatok.Application.Enums;
using Dolgozatok.Application.Interfaces;
using Dolgozatok.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Task = System.Threading.Tasks.Task;

namespace Dolgozatok.Infrastructure.Repositories
{
    public class FolderService : IFolderService
    {
        private readonly DolgozatokDbContext _context;

        public FolderService(DolgozatokDbContext context)
        {
            _context = context;
        }

        public async Task<List<FolderContentDTO>> GetRootContents(int userId)
        {
            var folders = await _context.Folders
                .Where(f => f.OwnerId == userId && f.ParentId == null)
                .Select(f => new FolderContentDTO
                {
                    Id = f.Id,
                    Name = f.Name,
                    Type = ContentType.Folder,
                    Created = null,
                    Edited = null
                })
                .ToListAsync();

            var tests = await _context.Tests
                .Where(t => t.FolderId == null)
                .Select(t => new FolderContentDTO
                {
                    Id = t.Id,
                    Name = t.Name,
                    Type = ContentType.Test,
                    Created = t.Created,
                    Edited = t.Edited
                })
                .ToListAsync();

            var combined = new List<FolderContentDTO>();
            combined.AddRange(folders);
            combined.AddRange(tests);

            return combined.OrderBy(c => c.Type).ThenBy(c => c.Name).ToList();
        }

        public async Task<List<FolderContentDTO>?> GetFolderContents(int folderId, int userId)
        {
            // Verify folder belongs to user
            var folder = await _context.Folders.FirstOrDefaultAsync(f => f.Id == folderId && f.OwnerId == userId);
            if (folder == null) return null;

            var folders = await _context.Folders
                .Where(f => f.ParentId == folderId)
                .Select(f => new FolderContentDTO
                {
                    Id = f.Id,
                    Name = f.Name,
                    Type = ContentType.Folder,
                    Created = null,
                    Edited = null
                })
                .ToListAsync();

            var tests = await _context.Tests
                .Where(t => t.FolderId == folderId)
                .Select(t => new FolderContentDTO
                {
                    Id = t.Id,
                    Name = t.Name,
                    Type = ContentType.Test,
                    Created = t.Created,
                    Edited = t.Edited
                })
                .ToListAsync();

            var combined = new List<FolderContentDTO>();
            combined.AddRange(folders);
            combined.AddRange(tests);

            return combined.OrderBy(c => c.Type).ThenBy(c => c.Name).ToList();
        }

        public async Task<Folder> CreateFolder(Folder folder)
        {
            await _context.Folders.AddAsync(folder);
            await _context.SaveChangesAsync();
            return folder;
        }

        public async Task DeleteFolder(int folderId, int userId)
        {
            var folder = await _context.Folders.FirstOrDefaultAsync(f => f.Id == folderId && f.OwnerId == userId);
            if (folder != null)
            {
                await SoftDeleteFolderRecursive(folderId);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Folder> RenameFolder(int folderId, string newName, int userId)
        {
            var folder = await _context.Folders.FirstOrDefaultAsync(f => f.Id == folderId && f.OwnerId == userId);
            
            if (folder == null)
                throw new System.UnauthorizedAccessException("Folder not found or unauthorized");
                
            folder.Name = newName;
            await _context.SaveChangesAsync();
            return folder;
        }

        private async Task SoftDeleteFolderRecursive(int folderId)
        {
            // Delete the folder itself
            var folder = await _context.Folders.FindAsync(folderId);
            if (folder != null)
                folder.IsDeleted = true;

            // Delete tests in this folder
            var tests = await _context.Tests.Where(t => t.FolderId == folderId).ToListAsync();
            foreach (var test in tests)
                test.IsDeleted = true;

            // Recursively delete child folders
            var childFolders = await _context.Folders.Where(f => f.ParentId == folderId).ToListAsync();
            foreach (var child in childFolders)
                await SoftDeleteFolderRecursive(child.Id);
        }
    }
}
