using Microsoft.AspNetCore.Mvc;
using Azure.Data.Tables;
using System;
using System.Threading.Tasks;

namespace azuretest.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EditGoalController : ControllerBase
    {
        // Define the TableClient directly in the controller
        private readonly TableClient UserGoalsTable;

        public EditGoalController()
        {
            // Initialize TableClient with the hardcoded connection string
            UserGoalsTable = new TableClient("DefaultEndpointsProtocol=https;AccountName=brocount;AccountKey=nzY3j2LKYZQiyLhFyaJ3K9QBHbceqyJto3dFL80bP9cBzdFmIOJubT04nZcF4EqokE7luJB8EKNMACDbuzKyDw==;TableEndpoint=https://brocount.table.cosmos.azure.com:443/", "UserGoals");
        }

        [HttpPut("editgoal")]
        public async Task<IActionResult> EditGoal(UpdateGoalModel model)
        {
            Console.WriteLine($"User has made a PUT request to edit the goal with RowKey {model.RowKey}.");

            try
            {
                // Fetch the existing goal by RowKey from the Azure Table using the directly defined TableClient
                var fetchResponse = await UserGoalsTable.GetEntityAsync<UserGoal>("UserGoalsPartition", model.RowKey);

                // Check if the goal exists
                if (fetchResponse == null)
                {
                    Console.WriteLine("I couldn't find that goal to edit.");
                    return NotFound(new { message = "Goal not found" });
                }

                var existingGoal = fetchResponse.Value;

                // Update fields based on the provided model
                existingGoal.GoalTitle = model.GoalTitle ?? existingGoal.GoalTitle;
                existingGoal.GoalDesc = model.GoalDesc ?? existingGoal.GoalDesc;
                existingGoal.Completed = model.Completed ?? existingGoal.Completed;

                // Save changes back to Azure Table, using the fetched ETag
                await UserGoalsTable.UpdateEntityAsync(existingGoal, existingGoal.ETag, TableUpdateMode.Replace);

                Console.WriteLine("Goal has been successfully updated.");

                return Ok(new { message = "Goal updated successfully" });
            }
            catch (Exception ex)
            {
                // Log any exceptions for debugging
                Console.WriteLine($"An error occurred: {ex}");
                return StatusCode(500, $"Internal Server Error: {ex}");
            }
        }
    }

    public class UpdateGoalModel
    {
        public string RowKey { get; set; }
        public string? GoalTitle { get; set; }
        public string? GoalDesc { get; set; }

        public bool? Completed { get; set; }
    }
}
