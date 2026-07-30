namespace Dolgozatok.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string RealName { get; set; } = string.Empty;
        public ICollection<Class> Classes { get; set; } = new List<Class>();
        public bool IsDeleted { get; set; }
    }
}
