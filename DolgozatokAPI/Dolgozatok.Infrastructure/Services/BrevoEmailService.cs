using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Dolgozatok.Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace Dolgozatok.Infrastructure.Services
{
    public class BrevoEmailService : IEmailService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<BrevoEmailService> _logger;

        public BrevoEmailService(HttpClient httpClient, ILogger<BrevoEmailService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<bool> SendRegistrationEmailAsync(string recipientEmail, string recipientName, string token, string className)
        {
            var apiKey = Environment.GetEnvironmentVariable("BREVO_EMAIL_API_KEY");
            var frontendUrl = Environment.GetEnvironmentVariable("SITE_URL") ?? Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "http://localhost:5173";
            if (!frontendUrl.StartsWith("http://", StringComparison.OrdinalIgnoreCase) && !frontendUrl.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
            {
                frontendUrl = "https://" + frontendUrl;
            }
            var registrationLink = $"{frontendUrl.TrimEnd('/')}/register?token={Uri.EscapeDataString(token)}";

            if (string.IsNullOrWhiteSpace(apiKey))
            {
                _logger.LogWarning("BREVO_EMAIL_API_KEY is not set. Invitation email was not sent. Registration link: {RegistrationLink}", registrationLink);
                return false;
            }

            var htmlContent = $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <title>Meghívás - Dolgozatok</title>
</head>
<body style='font-family: Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 24px; color: #333;'>
    <div style='max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);'>
        <div style='text-align: center; margin-bottom: 24px;'>
            <a href='{frontendUrl.TrimEnd('/')}' style='color: #059669; text-decoration: none; font-size: 34px; font-weight: 800; letter-spacing: -0.5px; font-family: ""Outfit"", ""Inter"", -apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, Helvetica, Arial, sans-serif; display: inline-block;'>
                Dolgozatok
            </a>
        </div>
        <hr style='border: none; border-top: 1px solid #e2e8f0; margin-bottom: 24px;' />
        <p style='font-size: 16px; line-height: 1.6; margin-bottom: 16px;'>Kedves <strong>{System.Net.WebUtility.HtmlEncode(recipientName)}</strong>!</p>
        <p style='font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 20px;'>
            Meghívást kaptál a Dolgozatok rendszerbe a következő osztályhoz: <strong>{System.Net.WebUtility.HtmlEncode(className)}</strong>.
        </p>
        <p style='font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 24px;'>
            A regisztrációd befejezéséhez és fiókod aktiválásához kérjük, kattints az alábbi gombra és add meg a jelszavadat:
        </p>
        <div style='text-align: center; margin-bottom: 28px;'>
            <a href='{registrationLink}' style='background-color: #059669; color: #ffffff; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 8px; display: inline-block; font-size: 15px;'>
                Regisztráció befejezése
            </a>
        </div>
        <div style='background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 24px;'>
            <p style='font-size: 13px; color: #64748b; margin: 0;'>
                <strong>Fontos:</strong> Ez a regisztrációs link <strong>1 hétig</strong> érvényes. Ha a fenti gomb nem működne, másold be a böngésződbe az alábbi címet:
            </p>
            <p style='font-size: 12px; color: #0284c7; word-break: break-all; margin: 8px 0 0 0;'>
                <a href='{registrationLink}' style='color: #0284c7;'>{registrationLink}</a>
            </p>
        </div>
        <hr style='border: none; border-top: 1px solid #e2e8f0; margin-bottom: 16px;' />
        <p style='font-size: 12px; color: #94a3b8; text-align: center; margin: 0;'>
            Ha ezt a meghívót tévedésből kaptad, hagyd figyelmen kívül ezt a levelet.
        </p>
    </div>
</body>
</html>";

            var payload = new
            {
                sender = new { email = "noreply@danimre.com", name = "Dolgozatok" },
                to = new[] { new { email = recipientEmail, name = recipientName } },
                subject = $"Meghívás a(z) {className} osztályba - Dolgozatok",
                htmlContent = htmlContent
            };

            try
            {
                using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.brevo.com/v3/smtp/email");
                request.Headers.Add("api-key", apiKey);
                request.Headers.Add("accept", "application/json");
                request.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

                var response = await _httpClient.SendAsync(request);
                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation("Registration email sent successfully to {Email} for class {ClassName}", recipientEmail, className);
                    return true;
                }

                var error = await response.Content.ReadAsStringAsync();
                _logger.LogError("Failed to send Brevo registration email. Status: {StatusCode}, Error: {Error}", response.StatusCode, error);
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception while sending Brevo registration email to {Email}", recipientEmail);
                return false;
            }
        }
    }
}
