namespace Dolgozatok.Domain.Entities
{
    public class Test
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        // "datetime" in C# maps to "timestamp" in Postgres
        public DateTime Created { get; set; }
        public DateTime Edited { get; set; }
        public int OriginalTestId { get; set; }
        public int FolderId { get; set; }
        public Folder Folder { get; set; } = null!;
        public ICollection<Page> Pages { get; set; } = new List<Page>();
        public bool IsDeleted { get; set; }
    }
}
