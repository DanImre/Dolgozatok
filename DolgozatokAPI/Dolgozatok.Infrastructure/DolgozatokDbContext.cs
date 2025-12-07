using Dolgozatok.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Dolgozatok.Infrastructure
{
    public class DolgozatokDbContext : DbContext
    {
        public DbSet<Test> Tests { get; set; }
        public DolgozatokDbContext(DbContextOptions<DolgozatokDbContext> options) : base(options)
        {

        }
    }
}
