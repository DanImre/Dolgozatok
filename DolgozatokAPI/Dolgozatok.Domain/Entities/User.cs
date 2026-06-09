namespace Dolgozatok.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string RealName { get; set; } = string.Empty;
        public int? ClassId { get; set; }
        public Class? Class { get; set; }
        public bool IsDeleted { get; set; }
    }
}
