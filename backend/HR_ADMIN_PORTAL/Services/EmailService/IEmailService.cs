namespace HR_ADMIN_PORTAL.Services.EmailService
{
    public interface IEmailService
    {
        public void SendEmail(string toEmail, string subject, string body);
    }
}
