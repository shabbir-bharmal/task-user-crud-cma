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
        [BsonElement("email")]
        public string? Email { get; set; }
        [BsonElement("password")]
        public string? Password { get; set; }

        public DateTime? CreationTime { get; set; } 
        public DateTime? LastLoginTime { get; set; } 
        public DateTime? LastModifiedTime { get; private set; }

    }
}
