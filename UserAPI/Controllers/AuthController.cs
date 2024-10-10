using Flurl.Http;
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
            var user = await _users.Find(u => u.Name == model.Name).FirstOrDefaultAsync();

            if (user != null && BCrypt.Net.BCrypt.Verify(model.Password, user.Password))
            {
                var token = GenerateJwtToken(user.Name);

                HttpContext.Session.SetString("AuthToken", token);

                HttpContext.Response.Cookies.Append("AuthToken", token, new CookieOptions
                {
                    HttpOnly = true,  
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTimeOffset.UtcNow.AddHours(1) 
                });

                return Ok(new { Token = token });
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
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
