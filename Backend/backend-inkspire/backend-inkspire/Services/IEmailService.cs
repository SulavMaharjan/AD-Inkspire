namespace backend_inkspire.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string email, string subject, string message, bool isHtml = false);
    }
}