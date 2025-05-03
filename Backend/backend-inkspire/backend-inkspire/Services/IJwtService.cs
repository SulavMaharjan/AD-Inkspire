using backend_inkspire.Entities;

namespace backend_inkspire.Services
{
    public interface IJwtService
    {
        string GenerateJwtToken(User user, IList<string> roles);
    }
}
