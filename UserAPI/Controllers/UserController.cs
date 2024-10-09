using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using UserAPI.Models;

namespace UserAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IMongoCollection<User> _users;


        public UserController(IMongoClient client)
        {
            // Initialize the database and collection
            var database = client.GetDatabase("sample_mflix");
            _users = database.GetCollection<User>("users");
        }

        [HttpPost]
        public async Task<IActionResult> Create(User user)
        {
            try
            {

                // Insert the user to the MongoDB collection
                await _users.InsertOneAsync(user);

                return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
            }
            catch (Exception ex)
            {
                // Handle any potential errors and return a friendly message
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
    }
}
