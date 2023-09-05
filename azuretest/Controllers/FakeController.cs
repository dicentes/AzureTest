using Microsoft.AspNetCore.Mvc;
using Azure.Data.Tables;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace azuretest.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FakeController : ControllerBase
    {
        private readonly TableClient UserGoalsTable;

        public FakeController()
        {
            // Initialize TableClient
            UserGoalsTable = new TableClient("DefaultEndpointsProtocol=https;AccountName=brocount;AccountKey=nzY3j2LKYZQiyLhFyaJ3K9QBHbceqyJto3dFL80bP9cBzdFmIOJubT04nZcF4EqokE7luJB8EKNMACDbuzKyDw==;TableEndpoint=https://brocount.table.cosmos.azure.com:443/", "UserGoals");
        }

        [HttpGet]
        public IActionResult GetAllUserGoals()
        {
            try
            {
                // Fetch all data from UserGoals table
                var userGoals = UserGoalsTable.Query<UserGoal>();

                // Collect into a list (consider pagination for large tables)
                List<UserGoal> result = new List<UserGoal>();
                foreach (UserGoal userGoal in userGoals)
                {
                    result.Add(userGoal);
                }

                return Ok(result);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex}");
            }
        }
    }

    public class UserGoal : ITableEntity
{
    public string? PartitionKey { get; set; }
    public string? RowKey { get; set; }
    public DateTimeOffset? Timestamp { get; set; }
    public Azure.ETag ETag { get; set; }
    public string? GoalTitle { get; set; }
    public string? GoalDesc { get; set; }
    public string? SubmittedBy { get; set; }
    public DateTimeOffset? TargetDate { get; set; }
    public bool? Completed { get; set; } 
}

}
