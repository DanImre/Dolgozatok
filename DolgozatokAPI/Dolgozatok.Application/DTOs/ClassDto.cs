namespace Dolgozatok.Application.DTOs
{
    public class ClassDto
    {
        public int Id { get; set; }
        public string ClassName { get; set; } = string.Empty;
        public int StudentCount { get; set; }
        public int TeacherCount { get; set; }
        public string JoinCode { get; set; } = string.Empty;
        public bool IsJoinCodeActive { get; set; }
    }
}
