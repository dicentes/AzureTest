using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace azuretest.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FakeController : ControllerBase
    {
        private readonly ILogger<FakeController> _logger;
        private readonly HttpClient _httpClient;

        // Inject logger and HttpClient via constructor
        public FakeController(ILogger<FakeController> logger, HttpClient httpClient)
        {
            _logger = logger;
            _httpClient = httpClient;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            // Declare variable to hold the result from the external API
            string result;

            try
            {
                // Make the API call to the external service
                HttpResponseMessage response = await _httpClient.GetAsync("https://jsonplaceholder.typicode.com/todos/1");

                // Ensure the request was successful
                response.EnsureSuccessStatusCode();

                // Read the response as a string
                result = await response.Content.ReadAsStringAsync();
            }
            catch (HttpRequestException e)
            {
                _logger.LogError($"Request error: {e.Message}");
                return BadRequest("Unable to fetch data from external API");
            }

            // Return the string to the frontend
            return Ok(result);
        }
    }
}
