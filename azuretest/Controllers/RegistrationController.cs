using Microsoft.AspNetCore.Mvc;
using Azure.Data.Tables;
using System;
using System.Threading.Tasks;
using System.Linq;  // Required for LINQ query

namespace azuretest.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistrationController : ControllerBase
    {
        // Define the TableClient directly inside the controller
        private readonly TableClient UserCredentialsTable;

        public RegistrationController()
        {
            // Initialize TableClient with the hardcoded connection string
            UserCredentialsTable = new TableClient("DefaultEndpointsProtocol=https;AccountName=brocount;AccountKey=nzY3j2LKYZQiyLhFyaJ3K9QBHbceqyJto3dFL80bP9cBzdFmIOJubT04nZcF4EqokE7luJB8EKNMACDbuzKyDw==;TableEndpoint=https://brocount.table.cosmos.azure.com:443/", "UserCredentials");
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegistrationModel model)
        {
            Console.WriteLine("User has made a POST request for registration.");

            // Query the table to find if the username already exists
            var query = UserCredentialsTable.Query<TableEntity>(filter: $"Username eq '{model.Username}'");
            foreach (var entity in query)
            {
                if (entity != null)
                {
                    // Duplicate username found, return BadRequest
                    return BadRequest(new { message = "Username & password combination unavailable. Try a different combination." });
                }
            }

            // If this point is reached, username is unique, proceed with registration
            // Create a new entity object that aligns with Cosmos DB Table schema
            var newUser = new TableEntity("UserCredentialsPartition", Guid.NewGuid().ToString())
            {
                {"Username", model.Username },
                {"Password", model.Password } // Note: Password should be hashed before storing
            };

            // Add the new user to the Cosmos DB Table
            await UserCredentialsTable.AddEntityAsync(newUser);

            Console.WriteLine("New username and password has been added to the database.");

            return Ok(new { message = "Registration successful" });
        }
    }

    public class RegistrationModel
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
    }
}
