namespace Dolgozatok.Application.DTOs
{
    public class CheckStudentResultDto
    {
        public bool Exists { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool IsAlreadyInClass { get; set; }
    }
}
