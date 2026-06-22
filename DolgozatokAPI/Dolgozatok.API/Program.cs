using Dolgozatok.Application.Interfaces;
using Dolgozatok.Infrastructure;
using Dolgozatok.Infrastructure.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using System;
using Dolgozatok.Domain.Entities;
using Dolgozatok.API.Extensions;
using Dolgozatok.Infrastructure.Repositories;
using Microsoft.AspNetCore.DataProtection;
using System.IO;
using Task = System.Threading.Tasks.Task;

namespace Dolgozatok.API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            // Load environment variables from the .env file at the project root
            DotNetEnv.Env.TraversePath().Load();

            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            
            // If running standalone (native), connectionString will be null. Fallback to constructing it using .env values
            if (string.IsNullOrEmpty(connectionString))
            {
                var dbServer = Environment.GetEnvironmentVariable("DB_SERVER") ?? "localhost";
                var dbUser = Environment.GetEnvironmentVariable("DB_USER");
                var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");
                var dbName = Environment.GetEnvironmentVariable("DB_NAME");
                connectionString = $"Server={dbServer};Port=5432;Database={dbName};User Id={dbUser};Password={dbPassword};";
            }

            builder.Services.AddDbContext<DolgozatokDbContext>(options =>
                options.UseNpgsql(connectionString));

            // Custom services
            builder.Services.AddScoped<ITestService, TestService>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IFolderService, FolderService>();

            builder.Services.AddControllers(options =>
            {
                options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true;
            })
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
            });
            builder.Services.AddOpenApi();

            // PostgreSQL
            // This wouldn't require DateTime's to be in UTC (but it's generally a good practice to store DateTime in UTC in the database)
            // AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

            // Authentication and Authorization
            builder.Services.AddDataProtection()
                .PersistKeysToFileSystem(new DirectoryInfo(@"/app/DataProtection-Keys"))
                .SetApplicationName("DolgozatokApp");

            builder.Services.AddIdentityApiEndpoints<ApplicationIdentityUser>()
                .AddRoles<IdentityRole<int>>()
                .AddEntityFrameworkStores<DolgozatokDbContext>()
                .AddClaimsPrincipalFactory<CustomUserClaimsPrincipalFactory>();

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

            // This automatically creates /api/register, /api/login, /api/refresh endpoints
            // that return JSON Tokens for your frontend!
            app.MapGroup("/api").MapIdentityApi<ApplicationIdentityUser>();

            using (var serviceScope = app.Services.CreateScope())
            using (var context = serviceScope.ServiceProvider.GetRequiredService<DolgozatokDbContext>())
            using (var userManager = serviceScope.ServiceProvider.GetRequiredService<UserManager<ApplicationIdentityUser>>())
            {
                await DbInitializer.InitializeAsync(context, app.Environment.IsDevelopment(), userManager);
            }

            await app.RunAsync();
        }
    }
}
