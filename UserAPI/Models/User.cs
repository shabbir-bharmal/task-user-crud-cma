﻿using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace UserAPI.Models
{
    [BsonIgnoreExtraElements]

    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        [BsonElement("name")]
        public string? Name { get; set; }
        [BsonElement("DateOfBirth")]
        public DateTime? DateOfBirth { get; set; }
        [BsonElement("email")]
        public string? Email { get; set; }
        [BsonElement("password")]
        public string? Password { get; set; }
        [BsonElement("dateCreated")]
        public DateTime? CreatedAt { get; set; } 
        public DateTime? LastLoginAt { get; set; } 
        public DateTime? UpdatedAt { get; private set; }
    }
}
