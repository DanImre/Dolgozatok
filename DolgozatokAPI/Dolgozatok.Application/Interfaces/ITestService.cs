using Dolgozatok.Domain.Entities;
using Task = System.Threading.Tasks.Task;

namespace Dolgozatok.Application.Interfaces
{
    public interface ITestService
    {
        Task AddTest(Test test);
        Task<List<Test>> GetAllTests();
        Task<Test?> GetTestById(int id);
        Task UpdateTest(Test test, int userId);
    }
}
