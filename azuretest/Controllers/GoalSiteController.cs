using Microsoft.AspNetCore.Mvc;
using Azure.Data.Tables;
using System;
using System.Threading.Tasks;

namespace azuretest.Controllers
{
    [ApiController]
    [Route("api/goal")]
    public class GoalSiteController : ControllerBase
    {
        // Define the TableClient directly in the controller
        private readonly TableClient UserGoalsTable;

        public GoalSiteController()
        {
            // Initialize TableClient with the hardcoded connection string
            UserGoalsTable = new TableClient("DefaultEndpointsProtocol=https;AccountName=brocount;AccountKey=nzY3j2LKYZQiyLhFyaJ3K9QBHbceqyJto3dFL80bP9cBzdFmIOJubT04nZcF4EqokE7luJB8EKNMACDbuzKyDw==;TableEndpoint=https://brocount.table.cosmos.azure.com:443/", "UserGoals");
        }

        [HttpGet("{rowKey}")]
        public async Task<IActionResult> GetGoalByRowKey(string rowKey)
        {
            try
            {
                Console.WriteLine($"Attempting to get goal information for {rowKey}");

                // Fetch the goal from UserGoalsTable by RowKey using the directly defined TableClient
                var response = await UserGoalsTable.GetEntityAsync<UserGoal>("UserGoalsPartition", rowKey);
                
                if (response == null)
                {
                    return NotFound();
                }
                
                return Ok(response.Value);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex}");
            }
        }
    }
}
