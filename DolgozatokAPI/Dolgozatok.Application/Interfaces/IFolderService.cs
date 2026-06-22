using Dolgozatok.Application.DTOs;
using Dolgozatok.Domain.Entities;
using Task = System.Threading.Tasks.Task;

namespace Dolgozatok.Application.Interfaces
{
    public interface IFolderService
    {
        Task<List<FolderContentDTO>> GetRootContents(int userId);
        Task<List<FolderContentDTO>?> GetFolderContents(int folderId, int userId);
        Task<Folder> CreateFolder(Folder folder);
        Task DeleteFolder(int folderId, int userId);
        Task<Folder> RenameFolder(int folderId, string newName, int userId);
    }
}
