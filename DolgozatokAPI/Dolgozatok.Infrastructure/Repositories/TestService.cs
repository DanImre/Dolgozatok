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

        public async Task AddTest(Test test)
        {
            await _context.Tests.AddAsync(test);
            await _context.SaveChangesAsync();

            if (test.OriginalTestId != 0)
                return;

            test.OriginalTestId = test.Id;
            await _context.SaveChangesAsync();
        }

        public async Task<List<Test>> GetAllTests()
        {
            return await _context.Tests.ToListAsync();
        }

        public async Task<Test?> GetTestById(int id)
        {
            return await _context.Tests
                .Include(t => t.Pages)
                    .ThenInclude(p => p.Tasks)
                        .ThenInclude(t => t.TaskElements)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task UpdateTest(Test updatedTest, int userId)
        {
            var existingTest = await _context.Tests.FirstOrDefaultAsync(t => t.Id == updatedTest.Id);

            if (existingTest == null)
                throw new Exception("Test not found");

            bool hasSolutions = await _context.Solutions.AnyAsync(s => s.TaskElement.Task.Page.TestId == updatedTest.Id);

            if (hasSolutions)
            {
                // Create a new version
                var newTest = new Test
                {
                    Name = updatedTest.Name,
                    Created = existingTest.Created,
                    Edited = DateTime.UtcNow,
                    FolderId = updatedTest.FolderId,
                    OriginalTestId = existingTest.OriginalTestId != 0 ? existingTest.OriginalTestId : existingTest.Id,
                    IsDeleted = false,
                    Pages = updatedTest.Pages.Select(p => new Page
                    {
                        Number = p.Number,
                        IsRandomized = p.IsRandomized,
                        Tasks = p.Tasks.Select(t => new Domain.Entities.Task
                        {
                            Header = t.Header,
                            Number = t.Number,
                            IsRandomized = t.IsRandomized,
                            Type = t.Type,
                            TaskElements = t.TaskElements.Select(te => new TaskElement
                            {
                                Body = te.Body,
                                CorrectAnswer = te.CorrectAnswer,
                                Points = te.Points,
                                RequiresManualGrading = te.RequiresManualGrading,
                                IsRandomized = te.IsRandomized
                            }).ToList()
                        }).ToList()
                    }).ToList()
                };

                await _context.Tests.AddAsync(newTest);
                await _context.SaveChangesAsync(); // Save to generate newTest.Id

                // Mark original test as deleted
                existingTest.IsDeleted = true;
                
                // Efficiently update OpenPeriods and ReviewableTests in the database directly
                await _context.OpenPeriods
                    .Where(op => op.TestId == existingTest.Id)
                    .ExecuteUpdateAsync(s => s.SetProperty(op => op.TestId, newTest.Id));

                await _context.ReviewableTests
                    .Where(rt => rt.OriginalTestId == existingTest.Id)
                    .ExecuteUpdateAsync(s => s.SetProperty(rt => rt.OriginalTestId, newTest.Id));

                await _context.SaveChangesAsync(); // Save the IsDeleted flag
            }
            else
            {
                // Efficiently delete all old pages (cascades to tasks and task elements in DB)
                await _context.Pages.Where(p => p.TestId == existingTest.Id).ExecuteDeleteAsync();

                // Update in place
                existingTest.Name = updatedTest.Name;
                existingTest.Edited = DateTime.UtcNow;
                existingTest.FolderId = updatedTest.FolderId;
                
                existingTest.Pages = updatedTest.Pages.Select(p => new Page
                {
                    Number = p.Number,
                    IsRandomized = p.IsRandomized,
                    Tasks = p.Tasks.Select(t => new Domain.Entities.Task
                    {
                        Header = t.Header,
                        Number = t.Number,
                        IsRandomized = t.IsRandomized,
                        Type = t.Type,
                        TaskElements = t.TaskElements.Select(te => new TaskElement
                        {
                            Body = te.Body,
                            CorrectAnswer = te.CorrectAnswer,
                            Points = te.Points,
                            RequiresManualGrading = te.RequiresManualGrading,
                            IsRandomized = te.IsRandomized
                        }).ToList()
                    }).ToList()
                }).ToList();

                await _context.SaveChangesAsync();
            }
        }
    }
}
