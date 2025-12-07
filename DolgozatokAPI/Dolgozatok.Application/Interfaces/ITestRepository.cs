using Dolgozatok.Domain.Entities;

namespace Dolgozatok.Application.Interfaces
{
    public interface ITestRepository
    {
        Task AddTestAsync(Test test);
        Task<List<Test>> GetAllTestsAsync();
    }
}
