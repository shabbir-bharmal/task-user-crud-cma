﻿namespace UserAPI.Models
{
    public class JwtSettings
    {
        public string Secret { get; set; }
        public int ExpirationMinutes { get; set; }
    }
}
