using Microsoft.AspNetCore.Mvc;
using Azure.Data.Tables;
using System;
using System.Threading.Tasks;

namespace azuretest.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GoalController : ControllerBase
    {
        // Initialize TableClient directly in the controller
        private readonly TableClient UserGoalsTable;

        public GoalController()
        {
            // Initialize TableClient with the hardcoded connection string
            UserGoalsTable = new TableClient("DefaultEndpointsProtocol=https;AccountName=brocount;AccountKey=nzY3j2LKYZQiyLhFyaJ3K9QBHbceqyJto3dFL80bP9cBzdFmIOJubT04nZcF4EqokE7luJB8EKNMACDbuzKyDw==;TableEndpoint=https://brocount.table.cosmos.azure.com:443/", "UserGoals");
        }

        // Using HttpDelete for semantic correctness
        [HttpDelete("{goalId}")]
        public async Task<IActionResult> DeleteGoal(string goalId)
        {
            Console.WriteLine($"User has made a DELETE request to delete the goal with ID {goalId}.");

            try
            {
                // Fetch the goal entity by partition key and row key (assuming goalId is the row key)
                var response = await UserGoalsTable.GetEntityAsync<UserGoal>("UserGoalsPartition", goalId);
                
                if(response == null || response.Value == null)
                {
                    Console.WriteLine("Goal not found.");
                    return NotFound(new { message = "Goal not found" });
                }

                var goalEntity = response.Value;

                // Delete the goal entity using the directly defined TableClient
                await UserGoalsTable.DeleteEntityAsync(goalEntity.PartitionKey, goalEntity.RowKey);

                Console.WriteLine("Goal has been successfully deleted.");
                return Ok(new { message = "Goal deleted successfully." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to delete goal: {ex}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}
