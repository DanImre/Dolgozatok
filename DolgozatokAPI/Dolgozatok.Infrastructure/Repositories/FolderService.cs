using System.Collections.Generic;
using System.Linq;
using Dolgozatok.Application.DTOs;
using Dolgozatok.Application.Enums;
using Dolgozatok.Application.Interfaces;
using Dolgozatok.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Dolgozatok.Infrastructure.Repositories
{
    public class FolderService : IFolderService
    {
        private readonly DolgozatokDbContext _context;

        public FolderService(DolgozatokDbContext context)
        {
            _context = context;
        }

        public async System.Threading.Tasks.Task<List<FolderContentDTO>> GetRootContentsAsync(int userId)
        {
            var folders = await _context.Folders
                .Where(f => f.OwnerId == userId && f.ParentId == null && !f.IsDeleted)
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
                .Where(t => t.FolderId == null && !t.IsDeleted)
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

        public async System.Threading.Tasks.Task<List<FolderContentDTO>?> GetFolderContentsAsync(int folderId, int userId)
        {
            // Verify folder belongs to user
            var folder = await _context.Folders.FirstOrDefaultAsync(f => f.Id == folderId && f.OwnerId == userId && !f.IsDeleted);
            if (folder == null) return null;

            var folders = await _context.Folders
                .Where(f => f.ParentId == folderId && !f.IsDeleted)
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
                .Where(t => t.FolderId == folderId && !t.IsDeleted)
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

        public async System.Threading.Tasks.Task<Folder> CreateFolderAsync(Folder folder)
        {
            await _context.Folders.AddAsync(folder);
            await _context.SaveChangesAsync();
            return folder;
        }

        public async System.Threading.Tasks.Task DeleteFolderAsync(int folderId, int userId)
        {
            var folder = await _context.Folders.FirstOrDefaultAsync(f => f.Id == folderId && f.OwnerId == userId);
            if (folder != null)
            {
                await SoftDeleteFolderRecursiveAsync(folderId);
                await _context.SaveChangesAsync();
            }
        }

        private async System.Threading.Tasks.Task SoftDeleteFolderRecursiveAsync(int folderId)
        {
            // Delete the folder itself
            var folder = await _context.Folders.FindAsync(folderId);
            if (folder != null)
                folder.IsDeleted = true;

            // Delete tests in this folder
            var tests = await _context.Tests.Where(t => t.FolderId == folderId && !t.IsDeleted).ToListAsync();
            foreach (var test in tests)
                test.IsDeleted = true;

            // Recursively delete child folders
            var childFolders = await _context.Folders.Where(f => f.ParentId == folderId && !f.IsDeleted).ToListAsync();
            foreach (var child in childFolders)
                await SoftDeleteFolderRecursiveAsync(child.Id);
        }
    }
}
