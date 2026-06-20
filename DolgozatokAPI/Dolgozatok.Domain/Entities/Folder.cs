namespace Dolgozatok.Domain.Entities
{
    public class Folder
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? ParentId { get; set; }
        public Folder? Parent { get; set; }
        public int? OwnerId { get; set; }
        public User? Owner { get; set; }
        public bool IsDeleted { get; set; }
    }
}
