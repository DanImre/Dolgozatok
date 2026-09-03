using System.Text;
using System.Text.Json;
using DotNetEnv;

namespace EmailTest
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Env.TraversePath().Load();
            var sender = new EmailSender();
            sender.SendTestEmail().Wait();
        }

        internal class EmailSender  
        {
            public async Task SendTestEmail()
            {
                string? apiKey = Environment.GetEnvironmentVariable("BREVO_EMAIL_API_KEY");

                if (string.IsNullOrEmpty(apiKey))
                {
                    Console.WriteLine("Error: BREVO_API_KEY is not set in the .env file.");
                    return;
                }

                string? recipientEmail = Environment.GetEnvironmentVariable("PERSONAL_EMAIL");

                if (string.IsNullOrEmpty(recipientEmail))
                {
                    Console.WriteLine("Error: PERSONAL_EMAIL is not set in the .env file.");
                    return;
                }

                var payload = new
                {
                    sender = new { email = "noreply@danimre.com", name = "Dán Imre" },
                    to = new[] { new { email = recipientEmail } },
                    subject = "Brevo API Test via .env",
                    htmlContent = "<h1>Success!</h1><p style=\"color: blue;\">Your API key was successfully loaded from the .env file.</p>"
                };

                using var client = new HttpClient();
                client.DefaultRequestHeaders.Add("api-key", apiKey);
                client.DefaultRequestHeaders.Add("accept", "application/json");

                var json = JsonSerializer.Serialize(payload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                Console.WriteLine("Sending test email...");
                var response = await client.PostAsync("https://api.brevo.com/v3/smtp/email", content);

                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine("Email sent successfully! Check your inbox.");
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Failed to send email. Status: {response.StatusCode}\nError: {error}");
                }
            }
        }
    }
}
