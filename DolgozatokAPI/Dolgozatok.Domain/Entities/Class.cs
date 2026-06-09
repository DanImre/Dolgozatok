namespace Dolgozatok.Domain.Entities
{
    public class Class
    {
        public int Id { get; set; }
        public string ClassName { get; set; } = string.Empty;
        public bool IsTeacherClass { get; set; }
        public int? OwnerId { get; set; }
        public User? Owner { get; set; }
        public ICollection<User> Students { get; set; } = new List<User>();
        public ICollection<User> Teachers { get; set; } = new List<User>();
        public bool IsDeleted { get; set; }
    }
}
