using Dolgozatok.Domain.Entities;
using Task = System.Threading.Tasks.Task;

namespace Dolgozatok.Application.Interfaces
{
    public interface ITestService
    {
        Task AddTestAsync(Test test);
        Task<List<Test>> GetAllTestsAsync();
    }
}
