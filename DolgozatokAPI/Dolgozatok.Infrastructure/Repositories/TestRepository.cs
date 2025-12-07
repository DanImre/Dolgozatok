using Dolgozatok.Application.Interfaces;
using Dolgozatok.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Dolgozatok.Infrastructure.Repositories
{
    public class TestRepository : ITestRepository
    {
        private readonly DolgozatokDbContext _context;

        public TestRepository(DolgozatokDbContext context)
        {
            _context = context;
        }

        public async Task AddTestAsync(Test test)
        {
            await _context.Tests.AddAsync(test);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Test>> GetAllTestsAsync()
        {
            return await _context.Tests.ToListAsync();
        }
    }
}
