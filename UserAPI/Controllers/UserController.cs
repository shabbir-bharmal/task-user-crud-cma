using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
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
                var IsEmailExist = await GetUserByEmail(user.Email);
                if (!IsEmailExist)
                {
                    user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
                    user.CreatedAt = DateTime.UtcNow;
                    await _users.InsertOneAsync(user);

                    return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
                }
                else
                {
                    return NotFound(new { errorType = "duplicate_email" });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { errorType = "invalid_data", error = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var users = await _users.Find(user => true).SortByDescending(user => user.CreatedAt) .ToListAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to retrieve users.", error = ex.Message });
            }
        }

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
                return NoContent();
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
                // Trim the input values to remove any leading/trailing spaces
                var trimmedName = name?.Trim();

                // Define regex for 'LIKE' behavior (%value%) with case-insensitive option
                var nameFilter = Builders<User>.Filter.Regex(u => u.Name, new BsonRegularExpression(trimmedName, "i"));
                var emailFilter = Builders<User>.Filter.Regex(u => u.Email, new BsonRegularExpression(trimmedName, "i"));

                // Combine filters using OR condition (matching name or email)
                var filter = Builders<User>.Filter.Or(nameFilter, emailFilter);

                // Query with the filter
                var users = await _users.Find(filter).ToListAsync();

                if (users == null || users.Count == 0)
                {
                    return Ok(null);
                }

                return Ok(users);
            }
            catch (Exception ex)
            {
                // Log the error if necessary
                return StatusCode(500, new { message = "Failed to retrieve user.", error = ex.Message });
            }

        }

        [HttpGet("GetUserByEmail{email}")]
        public async Task<bool> GetUserByEmail(string email)
        {
            try
            {
                var user = await _users.Find(u => u.Email == email).FirstOrDefaultAsync();
                return user != null;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        [HttpPut("{id}")]
        public async Task<bool> UpdateUserAsync(string id, User updatedUser)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Id, id);
            var update = Builders<User>.Update
                            .Set(u => u.Name, updatedUser.Name)
                            .Set(u => u.Email, updatedUser.Email)
                            .Set(u => u.DateOfBirth, updatedUser.DateOfBirth)
                            .Set(u => u.UpdatedAt, DateTime.Now);
            var result = await _users.UpdateOneAsync(filter, update);
            return result.ModifiedCount > 0;
        }
    }
}
