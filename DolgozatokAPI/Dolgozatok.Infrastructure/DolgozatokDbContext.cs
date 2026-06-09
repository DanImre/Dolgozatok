using Dolgozatok.Domain.Entities;
using Dolgozatok.Infrastructure.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Task = Dolgozatok.Domain.Entities.Task;

namespace Dolgozatok.Infrastructure
{
    public class DolgozatokDbContext : IdentityDbContext<ApplicationIdentityUser, IdentityRole<int>, int>
    {
        public DbSet<Class> Classes { get; set; }
        public DbSet<ClassTeacher> ClassTeachers { get; set; }
        public DbSet<Folder> Folders { get; set; }
        public DbSet<OpenPeriod> OpenPeriods { get; set; }
        public DbSet<OpenPeriodClass> OpenPeriodClasses { get; set; }
        public DbSet<Page> Pages { get; set; }
        public DbSet<ReviewableTest> ReviewableTests { get; set; }
        public DbSet<Solution> Solutions { get; set; }
        public DbSet<Task> Tasks { get; set; }
        public DbSet<TaskElement> TaskElements { get; set; }
        public DbSet<Test> Tests { get; set; }
        public new DbSet<User> Users { get; set; }
        public DbSet<UserFolder> UserFolders { get; set; }
        public DolgozatokDbContext(DbContextOptions<DolgozatokDbContext> options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Forcing specific column types

            modelBuilder.Entity<OpenPeriod>(entity =>
            {
                // Explicitly map to 'interval' to store duration correctly
                entity.Property(e => e.TimeLimit)
                      .HasColumnType("interval");
            });

            // Composite keys

            modelBuilder.Entity<UserFolder>()
                .HasKey(uf => new { uf.UserId, uf.FolderId });

            modelBuilder.Entity<ClassTeacher>()
                .HasKey(ct => new { ct.TeacherId, ct.ClassId });

            modelBuilder.Entity<OpenPeriodClass>()
                .HasKey(opc => new { opc.OpenPeriodId, opc.ClassId });

            // Indexes for performance optimization
            modelBuilder.Entity<User>(entity =>
                entity.HasIndex(c => c.IsDeleted));

            modelBuilder.Entity<Class>(entity =>
                entity.HasIndex(c => c.IsDeleted));

            modelBuilder.Entity<ReviewableTest>(entity =>
                entity.HasIndex(rt => rt.OriginalTestId));

            modelBuilder.Entity<Test>(entity =>
                entity.HasIndex(t => t.OriginalTestId));

            modelBuilder.Entity<Solution>(entity =>
                entity.HasIndex(s => s.UserId));

            // Setting up relationships and delete behaviors

            // Teachers and Classes (Many-to-Many via ClassTeacher)
            modelBuilder.Entity<Class>(entity =>
            {
                entity.HasOne(c => c.Owner)
                  .WithMany()
                  .HasForeignKey(c => c.OwnerId)
                  .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(c => c.Students)
                  .WithOne(u => u.Class)
                  .HasForeignKey(u => u.ClassId)
                  .OnDelete(DeleteBehavior.SetNull);

                entity.HasMany(c => c.Teachers)
                  .WithMany()
                  .UsingEntity<ClassTeacher>(
                      etb => etb
                        .HasOne(ct => ct.Teacher)
                        .WithMany()
                        .HasForeignKey(ct => ct.TeacherId)
                        .OnDelete(DeleteBehavior.Cascade),
                      etb => etb
                        .HasOne(ct => ct.Class)
                        .WithMany()
                        .HasForeignKey(ct => ct.ClassId)
                        .OnDelete(DeleteBehavior.Cascade),
                      etb =>
                      {
                          etb.HasKey(t => new { t.TeacherId, t.ClassId });
                      });
            });

            // Users and Folders (Many-to-Many via UserFolder)
            modelBuilder.Entity<UserFolder>()
                .HasOne(uf => uf.User)
                .WithMany()
                .HasForeignKey(uf => uf.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserFolder>()
                .HasOne(uf => uf.Folder)
                .WithMany()
                .HasForeignKey(uf => uf.FolderId)
                .OnDelete(DeleteBehavior.Cascade);

            // Folder to User (Owner) relationship
            modelBuilder.Entity<Folder>()
                .HasOne(f => f.Owner)
                .WithMany()
                .HasForeignKey(f => f.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Test to folder relationship
            modelBuilder.Entity<Test>()
                .HasOne(t => t.Folder)
                .WithMany()
                .HasForeignKey(t => t.FolderId)
                .OnDelete(DeleteBehavior.Cascade);

            // OpenPeriod to Test relationship
            modelBuilder.Entity<OpenPeriod>()
                .HasOne(op => op.Test)
                .WithMany()
                .HasForeignKey(op => op.TestId)
                .OnDelete(DeleteBehavior.Cascade);

            // OpenPeriodClass relationship
            modelBuilder.Entity<OpenPeriodClass>(entity =>
            {
                entity.HasOne(opc => opc.OpenPeriod)
                      .WithMany()
                      .HasForeignKey(opc => opc.OpenPeriodId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(opc => opc.Class)
                      .WithMany()
                      .HasForeignKey(opc => opc.ClassId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Test to pages relationship
            modelBuilder.Entity<Test>()
                .HasMany(p => p.Pages)
                .WithOne(t => t.Test)
                .HasForeignKey(p => p.TestId)
                .OnDelete(DeleteBehavior.Cascade);

            // Page to tasks relationship
            modelBuilder.Entity<Page>()
                .HasMany(p => p.Tasks)
                .WithOne(t => t.Page)
                .HasForeignKey(t => t.PageId)
                .OnDelete(DeleteBehavior.Cascade);

            // Task to taskElements relationship
            modelBuilder.Entity<Task>()
                .HasMany(t => t.TaskElements)
                .WithOne(te => te.Task)
                .HasForeignKey(te => te.TaskId)
                .OnDelete(DeleteBehavior.Cascade);

            // TaskElements to solutions relationship
            modelBuilder.Entity<TaskElement>()
                .HasMany(te => te.Solutions)
                .WithOne(s => s.TaskElement)
                .HasForeignKey(s => s.TaskElementId)
                .OnDelete(DeleteBehavior.Cascade);

            // Solution to user relationship
            modelBuilder.Entity<Solution>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Automatically filter out deleted items

            // To ignore it in a query, use:
            // await _context.Classes
            //    .IgnoreQueryFilters()
            //    .ToListAsync();
            modelBuilder.Entity<User>(entity =>
                entity.HasQueryFilter(c => !c.IsDeleted));

            modelBuilder.Entity<Class>(entity =>
                entity.HasQueryFilter(c => !c.IsDeleted));
        }
    }
}
