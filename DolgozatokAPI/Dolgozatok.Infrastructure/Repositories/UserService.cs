using Dolgozatok.Application.Interfaces;
using Dolgozatok.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Dolgozatok.Infrastructure.Repositories
{
    public class UserService : IUserService
    {
        private readonly DolgozatokDbContext _context;

        public UserService(DolgozatokDbContext context)
        {
            _context = context;
        }
        public async Task<User?> GetUserById(int Id)
        {
            return await _context.Users
                .Include(u => u.Class)
                .FirstOrDefaultAsync(u => u.Id == Id && !u.IsDeleted);
        }

        public async System.Threading.Tasks.Task AddUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }
    }
}
