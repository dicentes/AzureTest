using Microsoft.AspNetCore.Mvc;

namespace azuretest.Controllers;

[ApiController]
[Route("[controller]")]
public class FakeController : ControllerBase
{
    
    private readonly ILogger<FakeController> _logger;

    public FakeController(ILogger<FakeController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    // make an API call to https://jsonplaceholder.typicode.com/todos/1
    //put everything that it outputs, no matter what it outputs, into one string 
    //return that string to the frontend 
    
}
