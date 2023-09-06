using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Azure.Data.Tables;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace azuretest.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserGoalController : ControllerBase
    {
        private readonly ILogger<UserGoalController> _logger;
        
        // Define the TableClient directly inside the controller
        private readonly TableClient UserGoalsTable;

        public UserGoalController(ILogger<UserGoalController> logger)
        {
            _logger = logger;

            // Initialize TableClient with the hardcoded connection string
            UserGoalsTable = new TableClient("DefaultEndpointsProtocol=https;AccountName=brocount;AccountKey=nzY3j2LKYZQiyLhFyaJ3K9QBHbceqyJto3dFL80bP9cBzdFmIOJubT04nZcF4EqokE7luJB8EKNMACDbuzKyDw==;TableEndpoint=https://brocount.table.cosmos.azure.com:443/", "UserGoals");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserGoal>>> Get()
        {
            List<UserGoal> goals = new List<UserGoal>();

            // Use the directly defined TableClient for querying
            await foreach (var entity in UserGoalsTable.QueryAsync<UserGoal>()) 
            {
                goals.Add(entity);
            }

            if (!goals.Any())
            {
                return Ok("Database is empty");
            }
            Console.WriteLine("User fetched existing goals.");
            return Ok(goals);
        }
    }
}
