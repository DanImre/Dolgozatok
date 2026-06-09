namespace Dolgozatok.Domain.Entities
{
    public class UserFolder
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public int FolderId { get; set; }
        public Folder Folder { get; set; } = null!;
        /// <summary>
        /// NULL = no access, FALSE = read only, TRUE = read and write
        /// </summary>
        public bool? ReadWritePermission { get; set; }
    }
}
