using System;
using Dolgozatok.Application.Enums;

namespace Dolgozatok.Application.DTOs
{
    public class FolderContentDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public ContentType Type { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Edited { get; set; }
    }
}
