using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UserAPI.Models;

namespace UserAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public AuthController(IConfiguration configuration, IMongoClient client)
        {
            _configuration = configuration;
            var database = client.GetDatabase("sample_mflix");
            _users = database.GetCollection<User>("users");
        }

        private readonly IMongoCollection<User> _users;

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User model)
        {
            var user = await _users.Find(u => u.Email == model.Email).FirstOrDefaultAsync();

            if (user != null && BCrypt.Net.BCrypt.Verify(model.Password, user.Password))
            {
                var token = GenerateJwtToken(user.Email);

                HttpContext.Session.SetString("AuthToken", token);

                UpdateLastLoginDate(user.Id);

                return Ok(new { Token = token , Id = user.Id, ExpiresAt = DateTime.Now.AddHours(10) });

            }

            return Unauthorized();
        }


        private string GenerateJwtToken(string userId)
        {
            var jwtKey = _configuration["Jwt:Key"];
            var key = Encoding.ASCII.GetBytes(jwtKey);

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("id", userId) }),
                Expires = DateTime.UtcNow.AddHours(10),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        [HttpPut("UpdateLastLoginDate{id}")]
        private async void UpdateLastLoginDate(string id)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Id, id);
            var update = Builders<User>.Update
                            .Set(u => u.LastLoginAt, DateTime.Now);
            var result = await _users.UpdateOneAsync(filter, update);
        }
    }
}
