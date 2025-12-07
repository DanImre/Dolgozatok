using Dolgozatok.Application.Interfaces;
using Dolgozatok.Infrastructure;
using Dolgozatok.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

namespace Dolgozatok.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddDbContext<DolgozatokDbContext>(options =>
                options.UseNpgsql(connectionString));

            // Custom services
            builder.Services.AddScoped<ITestRepository, TestRepository>();

            builder.Services.AddControllers();
            builder.Services.AddOpenApi();

            // PostgreSQL
            // This wouldn't require DateTime's to be in UTC (but it's generally a good practice to store DateTime in UTC in the database)
            // AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.MapScalarApiReference(options =>
                {
                    options.WithTitle("Dolgozatok API");
                    options.WithTheme(ScalarTheme.DeepSpace);
                    options.HideSidebar();
                });
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
