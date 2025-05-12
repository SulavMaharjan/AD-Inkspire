using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using backend_inkspire.Services;
using Microsoft.AspNetCore.Http;

namespace backend_inkspire.Middleware
{
    public class WebSocketMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IConnectionManager _connectionManager;
        private readonly ILogger<WebSocketMiddleware> _logger;

        public WebSocketMiddleware(RequestDelegate next, IConnectionManager connectionManager, 
            ILogger<WebSocketMiddleware> logger)
        {
            _next = next;
            _connectionManager = connectionManager;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            _logger.LogInformation($"Request path: {context.Request.Path}, WebSocket request: {context.WebSockets.IsWebSocketRequest}");

            if (context.WebSockets.IsWebSocketRequest)
            {
                _logger.LogInformation($"Headers: {string.Join(", ", context.Request.Headers.Select(h => $"{h.Key}={h.Value}"))}");
                
                if (!context.Request.Query.TryGetValue("userId", out var userIdValues))
                {
                    _logger.LogWarning("No userId provided in query string");
                    context.Response.StatusCode = 400; 
                    await context.Response.WriteAsync("User ID is required");
                    return;
                }

                string userId = userIdValues.FirstOrDefault();
                if (string.IsNullOrEmpty(userId))
                {
                    _logger.LogWarning("Empty userId provided");
                    context.Response.StatusCode = 400;
                    await context.Response.WriteAsync("Invalid User ID");
                    return;
                }

                try
                {
                    _logger.LogInformation($"Accepting WebSocket connection for user {userId}");
                    WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync();
                    _logger.LogInformation($"WebSocket connection established for user {userId}");

                    _connectionManager.AddConnection(userId, webSocket);

                    try
                    {
                        await HandleWebSocket(webSocket, userId);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Error in WebSocket connection for user {userId}");
                    }
                    finally
                    {
                        _connectionManager.RemoveConnection(userId);

                        if (webSocket.State != WebSocketState.Closed &&
                            webSocket.State != WebSocketState.Aborted)
                        {
                            await webSocket.CloseAsync(
                                WebSocketCloseStatus.NormalClosure,
                                "Connection closed by the server",
                                CancellationToken.None);
                        }

                        _logger.LogInformation($"WebSocket connection closed for user {userId}");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error accepting WebSocket connection for user {userId}");
                    context.Response.StatusCode = 500;
                    await context.Response.WriteAsync("Internal server error establishing WebSocket connection");
                }
            }
            else
            {
                await _next(context);
            }
        }

        private async Task HandleWebSocket(WebSocket webSocket, string userId)
        {
            var buffer = new byte[1024 * 4];
            
            try
            {
                string welcomeMessage = JsonSerializer.Serialize(new {
                    type = "SYSTEM",
                    message = "Connection established"
                });
                byte[] welcomeBytes = Encoding.UTF8.GetBytes(welcomeMessage);
                await webSocket.SendAsync(
                    new ArraySegment<byte>(welcomeBytes),
                    WebSocketMessageType.Text,
                    true,
                    CancellationToken.None);
                
                _logger.LogInformation($"Welcome message sent to user {userId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error sending welcome message to user {userId}");
            }

            WebSocketReceiveResult result = await webSocket.ReceiveAsync(
                new ArraySegment<byte>(buffer), CancellationToken.None);

            while (!result.CloseStatus.HasValue)
            {
                try
                {
                    string receivedMessage = Encoding.UTF8.GetString(buffer, 0, result.Count);
                    _logger.LogInformation($"Received message from user {userId}: {receivedMessage}");

                    await webSocket.SendAsync(
                        new ArraySegment<byte>(buffer, 0, result.Count),
                        result.MessageType,
                        result.EndOfMessage,
                        CancellationToken.None);

                    result = await webSocket.ReceiveAsync(
                        new ArraySegment<byte>(buffer), CancellationToken.None);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error processing WebSocket message from user {userId}");
                    break;
                }
            }

            if (result.CloseStatus.HasValue)
            {
                _logger.LogInformation($"Closing WebSocket connection for user {userId}. Status: {result.CloseStatus.Value}, Description: {result.CloseStatusDescription}");
                
                try
                {
                    await webSocket.CloseAsync(
                        result.CloseStatus.Value,
                        result.CloseStatusDescription,
                        CancellationToken.None);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error closing WebSocket connection for user {userId}");
                }
            }
        }
    }

    public static class WebSocketMiddlewareExtensions
    {
        public static IApplicationBuilder UseWebSocketNotifications(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<WebSocketMiddleware>();
        }
    }
}