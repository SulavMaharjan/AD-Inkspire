using backend_inkspire.Services;
using System.Net.WebSockets;
using System.Text.Json;
using System.Text;

public class NotificationService : INotificationService
{
    private readonly IConnectionManager _connectionManager;
    private readonly ILogger<NotificationService> _logger;

    public NotificationService(IConnectionManager connectionManager, ILogger<NotificationService> logger)
    {
        _connectionManager = connectionManager;
        _logger = logger;
    }

    public async Task SendNotificationAsync(string userId, object notification)
    {
        if (_connectionManager.ConnectionExists(userId))
        {
            var socket = _connectionManager.GetConnectionById(userId);
            if (socket != null && socket.State == WebSocketState.Open)
            {
                try
                {
                    string jsonMessage = JsonSerializer.Serialize(notification);
                    byte[] bytes = Encoding.UTF8.GetBytes(jsonMessage);
                    await socket.SendAsync(
                        new ArraySegment<byte>(bytes),
                        WebSocketMessageType.Text,
                        true,
                        CancellationToken.None);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error sending notification to user {userId}");
                }
            }
        }
    }

    public async Task BroadcastNotificationAsync(object notification)
    {
        string jsonMessage = JsonSerializer.Serialize(notification);
        byte[] bytes = Encoding.UTF8.GetBytes(jsonMessage);

        var connections = _connectionManager.GetAllConnections();
        var tasks = new List<Task>();

        foreach (var connection in connections)
        {
            if (connection.Value.State == WebSocketState.Open)
            {
                tasks.Add(connection.Value.SendAsync(
                    new ArraySegment<byte>(bytes),
                    WebSocketMessageType.Text,
                    true,
                    CancellationToken.None));
            }
        }

        await Task.WhenAll(tasks);
    }
}