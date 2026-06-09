namespace Dolgozatok.Application.DTOs
{
    public class RegisterDTO
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string RealName { get; set; } = string.Empty;
        public int? ClassId { get; set; }
    }
}
