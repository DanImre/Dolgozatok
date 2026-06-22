using Microsoft.AspNetCore.Mvc;

namespace Dolgozatok.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public abstract class BaseApiController : ControllerBase
    {
    }
}
