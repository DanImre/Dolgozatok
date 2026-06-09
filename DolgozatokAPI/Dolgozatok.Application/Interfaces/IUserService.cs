using Dolgozatok.Domain.Entities;
using Task = System.Threading.Tasks.Task;

namespace Dolgozatok.Application.Interfaces
{
    public interface IUserService
    {
        public Task<User?> GetUserById(int Id);
        public Task AddUserAsync(User user);
    }
}
