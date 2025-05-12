using System.Net.WebSockets;
using System.Text;
using System.Text.Json;

namespace backend_inkspire.Services
{
    public interface INotificationService
    {
        Task SendNotificationAsync(string userId, object notification);
        Task BroadcastNotificationAsync(object notification);
    }

}