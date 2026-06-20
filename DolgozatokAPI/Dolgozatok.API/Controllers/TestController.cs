using Dolgozatok.Application.Interfaces;
using Dolgozatok.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Dolgozatok.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TestController : ControllerBase
    {
        private readonly ILogger<TestController> _logger;
        private readonly ITestService _testRepository;

        public TestController(ILogger<TestController> logger, ITestService testRepository)
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
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> AddTest([FromBody] Test test)
        {
            if (test == null) 
                return BadRequest();

            await _testRepository.AddTestAsync(test);
            return CreatedAtRoute("GetAllTests", null);
        }
    }
}
