using System.Collections.Concurrent;
using System.Net.WebSockets;
using backend_inkspire.Services;

namespace backend_inkspire.Services
{
    public class ConnectionManager : IConnectionManager
    {
        private readonly ConcurrentDictionary<string, WebSocket> _connections = new();
        private readonly ILogger<ConnectionManager> _logger;

        public ConnectionManager(ILogger<ConnectionManager> logger)
        {
            _logger = logger;
        }

        public void AddConnection(string userId, WebSocket socket)
        {
            if (_connections.TryGetValue(userId, out var existingSocket))
            {
                if (existingSocket.State == WebSocketState.Open)
                {
                    _logger.LogWarning($"User {userId} already has an active connection. Closing previous connection.");
                    // Close the existing connection
                    try
                    {
                        existingSocket.CloseAsync(
                            WebSocketCloseStatus.NormalClosure,
                            "New connection established",
                            CancellationToken.None)
                            .Wait();
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Error closing existing connection for user {userId}");
                    }
                }

                // Remove the existing connection
                _connections.TryRemove(userId, out _);
            }

            // Add the new connection
            _connections.TryAdd(userId, socket);
            _logger.LogInformation($"Added connection for user {userId}. Active connections: {_connections.Count}");
        }

        public void RemoveConnection(string userId)
        {
            if (_connections.TryRemove(userId, out _))
            {
                _logger.LogInformation($"Removed connection for user {userId}. Active connections: {_connections.Count}");
            }
        }

        public WebSocket GetConnectionById(string userId)
        {
            if (_connections.TryGetValue(userId, out var socket))
            {
                return socket;
            }
            return null;
        }

        public bool ConnectionExists(string userId)
        {
            return _connections.ContainsKey(userId);
        }

        public Dictionary<string, WebSocket> GetAllConnections()
        {
            return _connections.ToDictionary(kv => kv.Key, kv => kv.Value);
        }
    }
}