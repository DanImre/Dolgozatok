using System.Threading.Tasks;

namespace Dolgozatok.Application.Interfaces
{
    public interface IEmailService
    {
        Task<bool> SendRegistrationEmailAsync(string recipientEmail, string recipientName, string token, string className);
    }
}
