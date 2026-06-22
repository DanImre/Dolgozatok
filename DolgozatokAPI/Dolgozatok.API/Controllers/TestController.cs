using Dolgozatok.Application.Interfaces;
using Dolgozatok.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Dolgozatok.API.Controllers
{
    public class TestController : BaseApiController
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
            var tests = await _testRepository.GetAllTests();
            return Ok(tests);
        }

        [HttpPost(Name = "AddTest")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> AddTest([FromBody] Test test)
        {
            if (test == null) 
                return BadRequest();

            await _testRepository.AddTest(test);
            return CreatedAtRoute("GetAllTests", null);
        }

        [HttpGet("{id}", Name = "GetTestById")]
        public async Task<ActionResult<Test>> GetTestById(int id)
        {
            var test = await _testRepository.GetTestById(id);
            if (test == null)
                return NotFound();
            return Ok(test);
        }

        [HttpPut("{id}", Name = "UpdateTest")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> UpdateTest(int id, [FromBody] Test test)
        {
            if (test == null || test.Id != id)
                return BadRequest();

            try
            {
                // In a real app we'd get the user ID from claims. Let's assume 0 for now if not needed, 
                // but actually we can parse it if needed. The TestService currently doesn't use userId.
                await _testRepository.UpdateTest(test, 0); 
                return NoContent();
            }
            catch (Exception ex)
            {
                if (ex.Message == "Test not found")
                    return NotFound();
                return StatusCode(500, ex.Message);
            }
        }
    }
}
