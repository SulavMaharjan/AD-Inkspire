using System.Net;
using System.Net.Mail;

namespace backend_inkspire.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendEmailAsync(string email, string subject, string message, bool isHtml = false)
        {
            try
            {
                _logger.LogInformation($"Preparing to send email to: {email}, Subject: {subject}");

                var smtpSettings = _configuration.GetSection("SmtpSettings");
                string host = smtpSettings["Host"];
                int port = int.Parse(smtpSettings["Port"]);
                string username = smtpSettings["Username"];
                string password = smtpSettings["Password"];
                string fromEmail = smtpSettings["FromEmail"];
                string fromName = smtpSettings["FromName"];
                bool enableSsl = bool.Parse(smtpSettings["EnableSsl"]);

                _logger.LogInformation($"SMTP Host: {host}, Port: {port}, EnableSsl: {enableSsl}, Username: {username}, FromEmail: {fromEmail}");

                using (var client = new SmtpClient())
                {
                    client.Host = host;
                    client.Port = port;
                    client.EnableSsl = enableSsl;
                    client.DeliveryMethod = SmtpDeliveryMethod.Network;
                    client.UseDefaultCredentials = false;
                    client.Credentials = new NetworkCredential(username, password);
                    client.Timeout = 30000;

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(fromEmail, fromName),
                        Subject = subject,
                        Body = message,
                        IsBodyHtml = isHtml
                    };

                    mailMessage.To.Add(email);

                    _logger.LogInformation("Sending email...");
                    await client.SendMailAsync(mailMessage);
                    _logger.LogInformation("Email sent successfully.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to send email: {ex.Message}");
                _logger.LogError($"Stack trace: {ex.StackTrace}");

                if (ex.InnerException != null)
                {
                    _logger.LogError($"Inner exception: {ex.InnerException.Message}");
                }

                throw;
            }
        }
    }
}