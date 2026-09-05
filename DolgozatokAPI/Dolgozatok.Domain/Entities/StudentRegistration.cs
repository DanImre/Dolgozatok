using System;

namespace Dolgozatok.Domain.Entities
{
    public class StudentRegistration
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public int? ClassId { get; set; }
        public Class? Class { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? CompletedAt { get; set; }
        public bool IsDeleted { get; set; }
    }
}
