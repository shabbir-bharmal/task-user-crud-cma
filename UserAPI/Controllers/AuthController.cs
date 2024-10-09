using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
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
        [HttpPost("login")]
        public IActionResult Login([FromBody] User user)
        {
            // Validate user credentials (this should be replaced with your own logic)
            if (IsValidUser(user.Name, user.Password))
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes("QWERTYUIOPASDFGHJKLZXCVBNM1234567890!@#");
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[]
                    {
                 new Claim(ClaimTypes.Name, user.Name)
             }),
                    Expires = DateTime.UtcNow.AddHours(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                return Ok(new { Token = tokenHandler.WriteToken(token) });
            }
            return Unauthorized();
        }

        private bool IsValidUser(string username, string password)
        {
            if (username == null || password == null) // In production, check hashed password
            {
                return false;
            }
            // Replace this with your actual user validation logic
            return username == "test" && password == "password"; // Example hard-coded user
        }
    }
}
