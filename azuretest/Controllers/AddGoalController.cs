using Microsoft.AspNetCore.Mvc;
using Azure.Data.Tables;
using System;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace azuretest.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AddGoalController : ControllerBase
    {
        // Directly create a TableClient instance
        private readonly TableClient tableClient = new TableClient("DefaultEndpointsProtocol=https;AccountName=brocount;AccountKey=nzY3j2LKYZQiyLhFyaJ3K9QBHbceqyJto3dFL80bP9cBzdFmIOJubT04nZcF4EqokE7luJB8EKNMACDbuzKyDw==;TableEndpoint=https://brocount.table.cosmos.azure.com:443/", "UserGoals");

        [HttpPost("addgoal")]
        public async Task<IActionResult> AddGoal(AddGoalModel model)
        {
            // Log that a POST request has been made
            Console.WriteLine("User has made a POST request to add a new goal.");

            // Create a new UserGoal instance
            var newUserGoal = new TableEntity
            {
                PartitionKey = "UserGoalsPartition",
                RowKey = Guid.NewGuid().ToString()
            };

            newUserGoal.Add("GoalTitle", model.GoalTitle);
            newUserGoal.Add("GoalDesc", model.GoalDesc);
            newUserGoal.Add("SubmittedBy", model.SubmittedBy);
            newUserGoal.Add("TargetDate", model.TargetDate);
            newUserGoal.Add("Completed", model.Completed ?? false);

            // Log the entity being added
            Console.WriteLine($"Adding the following entity to Azure Table: {JsonConvert.SerializeObject(newUserGoal)}");

            // Add the new goal entity to the Azure Table
            await tableClient.AddEntityAsync(newUserGoal);

            // Log that the goal has been added
            Console.WriteLine("New goal has been added to the database.");

            return Ok(new { message = "Goal added successfully" });
        }
    }

    // The model class remains the same
    public class AddGoalModel
    {
        public string? GoalTitle { get; set; }
        public string? GoalDesc { get; set; }
        public string? SubmittedBy { get; set; }
        public DateTimeOffset? TargetDate { get; set; }
        public bool? Completed { get; set; }
    }
}
