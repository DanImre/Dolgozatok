using Dolgozatok.Application.Interfaces;
using Dolgozatok.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Task = System.Threading.Tasks.Task;

namespace Dolgozatok.Infrastructure.Repositories
{
    public class TestService : ITestService
    {
        private readonly DolgozatokDbContext _context;

        public TestService(DolgozatokDbContext context)
        {
            _context = context;
        }

        public async Task AddTestAsync(Test test)
        {
            await _context.Tests.AddAsync(test);
            await _context.SaveChangesAsync();

            if (test.OriginalTestId != 0)
                return;

            test.OriginalTestId = test.Id;
            await _context.SaveChangesAsync();
        }

        public async Task<List<Test>> GetAllTestsAsync()
        {
            return await _context.Tests.ToListAsync();
        }
    }
}
