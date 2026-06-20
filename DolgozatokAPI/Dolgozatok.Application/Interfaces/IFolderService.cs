using Dolgozatok.Application.DTOs;
using Dolgozatok.Domain.Entities;
using Task = System.Threading.Tasks.Task;

namespace Dolgozatok.Application.Interfaces
{
    public interface IFolderService
    {
        Task<List<FolderContentDTO>> GetRootContentsAsync(int userId);
        Task<List<FolderContentDTO>?> GetFolderContentsAsync(int folderId, int userId);
        Task<Folder> CreateFolderAsync(Folder folder);
        Task DeleteFolderAsync(int folderId, int userId);
    }
}
