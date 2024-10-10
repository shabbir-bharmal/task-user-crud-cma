using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using UserAPI.Models;

namespace UserAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IMongoCollection<User> _users;

        public UserController(IMongoClient client)
        {
            var database = client.GetDatabase("sample_mflix");
            _users = database.GetCollection<User>("users");
        }

        [HttpPost]
        public async Task<IActionResult> Create(User user)
        {
            try
            {
                user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
                user.CreationTime = DateTime.UtcNow;
                await _users.InsertOneAsync(user);

                return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to create user. Please try again.", error = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var users = await _users.Find(user => true).ToListAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to retrieve users.", error = ex.Message });
            }
        }

        //[Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var user = await _users.Find(u => u.Id == id).FirstOrDefaultAsync();
                if (user == null)
                {
                    return NotFound(new { message = "User not found." });
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to retrieve user.", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var result = await _users.DeleteOneAsync(u => u.Id == id);
                if (result.DeletedCount == 0)
                {
                    return NotFound(new { message = "User not found or already deleted." });
                }
                return NoContent(); // Success
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to delete user.", error = ex.Message });
            }
        }

        [HttpGet("GetUserByName{name}")]
        public async Task<IActionResult> GetUserByName(string name)
        {
            try
            {
                var user = await _users.Find(u => u.Name == name).FirstOrDefaultAsync();
                if (user == null)
                {
                    return NotFound(new { message = "User not found." });
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to retrieve user.", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<bool> UpdateUserAsync(string id, User updatedUser)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Id, id);
            var update = Builders<User>.Update
                            .Set(u => u.Name, updatedUser.Name)
                            .Set(u => u.Email, updatedUser.Email)
                            .Set(u => u.LastModifiedTime, DateTime.Now);
            var result = await _users.UpdateOneAsync(filter, update);
            return result.ModifiedCount > 0;
        }
    }
}
