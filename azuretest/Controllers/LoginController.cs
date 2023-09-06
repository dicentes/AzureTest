using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Azure.Data.Tables;

namespace Brocountability.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly TableClient UserCredentialsTable;

        public LoginController()
        {
            // Initialize TableClient with hardcoded connection string
            UserCredentialsTable = new TableClient("DefaultEndpointsProtocol=https;AccountName=brocount;AccountKey=nzY3j2LKYZQiyLhFyaJ3K9QBHbceqyJto3dFL80bP9cBzdFmIOJubT04nZcF4EqokE7luJB8EKNMACDbuzKyDw==;TableEndpoint=https://brocount.table.cosmos.azure.com:443/", "UserCredentials");
        }

        private const string SecretKey = "I believe in God, the Father almighty, and in Jesus Christ..."; // Replace with a secure secret key
        private readonly SymmetricSecurityKey _signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(SecretKey));

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            if (model.Username == null || model.Password == null)
            {
                return BadRequest(new { message = "Username or password cannot be null" });
            }

            if (await IsValidCredentials(model.Username, model.Password))
            {
                var token = GenerateToken(model.Username);
                return Ok(new { message = "Login successful", token });
            }
            else
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }
        }

        private async Task<bool> IsValidCredentials(string username, string password)
        {
            // Query Cosmos DB to check if the username and password match
            var filter = $"PartitionKey eq 'UserCredentialsPartition' and Username eq '{username}' and Password eq '{password}'";
            await foreach (var entity in UserCredentialsTable.QueryAsync<TableEntity>(filter))
            {
                if (entity != null)
                {
                    return true;
                }
            }
            return false;
        }

        private string GenerateToken(string username)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, username)
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: new SigningCredentials(_signingKey, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class LoginModel
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
    }
}
