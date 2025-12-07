using Dolgozatok.Application.Interfaces;
using Dolgozatok.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Dolgozatok.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DatabaseTestController : ControllerBase
    {
        private readonly ILogger<DatabaseTestController> _logger;
        private readonly ITestRepository _testRepository;

        public DatabaseTestController(ILogger<DatabaseTestController> logger, ITestRepository testRepository)
        {
            _logger = logger;
            _testRepository = testRepository;
        }

        [HttpGet(Name = "GetAllTests")]
        public async Task<ActionResult<List<Test>>> GetAllTests()
        {
            var tests = await _testRepository.GetAllTestsAsync();
            return Ok(tests);
        }

        [HttpPost(Name = "AddTest")]
        public async Task<IActionResult> AddTest([FromBody] Test test)
        {
            if (test == null) 
                return BadRequest();

            await _testRepository.AddTestAsync(test);
            return CreatedAtRoute("GetAllTests", null);
        }
    }
}
