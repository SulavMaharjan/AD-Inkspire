using System.Net.WebSockets;

namespace backend_inkspire.Services
{
    public interface IConnectionManager
    {
        void AddConnection(string userId, WebSocket socket);
        void RemoveConnection(string userId);
        WebSocket GetConnectionById(string userId);
        bool ConnectionExists(string userId);
        Dictionary<string, WebSocket> GetAllConnections();
    }
}