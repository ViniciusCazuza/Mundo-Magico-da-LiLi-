using Microsoft.AspNetCore.SignalR;
using LiliMagic.Api.DTOs;

namespace LiliMagic.Api.Hubs;

/// <summary>
/// Hub do SignalR para sincronização em tempo real do Ateliê.
/// </summary>
public class DrawingHub : Hub
{
    private readonly ILogger<DrawingHub> _logger;

    public DrawingHub(ILogger<DrawingHub> logger)
    {
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        try 
        {
            _logger.LogInformation("[SignalR] Cliente tentando conectar: {ConnectionId}", Context.ConnectionId);
            await base.OnConnectedAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[SignalR] Erro crítico em OnConnectedAsync para {ConnectionId}. Abortando.", Context.ConnectionId);
            Context.Abort(); // Fecha de forma limpa para o pipeline se houver erro fatal
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (exception != null)
        {
            _logger.LogError(exception, "[SignalR] Conexão encerrada com erro crítico para {ConnectionId}. Motivo: {Message}. Detalhes: {StackTrace}", 
                Context.ConnectionId, exception.Message, exception.StackTrace);
        }
        else
        {
            _logger.LogInformation("[SignalR] Cliente desconectado normalmente: {ConnectionId}", Context.ConnectionId);
        }
        await base.OnDisconnectedAsync(exception);
    }

    /// <summary>
    /// Entra no grupo de um desenho específico.
    /// </summary>
    public async Task JoinDrawing(string drawingId)
    {
        if (string.IsNullOrEmpty(drawingId))
        {
            _logger.LogWarning("[SignalR] Tentativa de JoinDrawing com ID nulo ou vazio. ConnectionId: {ConnectionId}", Context.ConnectionId);
            return;
        }

        try 
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, drawingId);
            _logger.LogInformation("[SignalR] Usuário {ConnectionId} entrou no desenho {DrawingId}", Context.ConnectionId, drawingId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[SignalR] Erro fatal ao tentar JoinDrawing para {DrawingId}. ConnectionId: {ConnectionId}", drawingId, Context.ConnectionId);
        }
    }

    /// <summary>
    /// Sai do grupo de um desenho específico.
    /// </summary>
    public async Task LeaveDrawing(string drawingId)
    {
        if (string.IsNullOrEmpty(drawingId)) return;
        
        try
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, drawingId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[SignalR] Erro ao sair do grupo {DrawingId}", drawingId);
        }
    }

    /// <summary>
    /// Transmite uma atualização de traço/camada para os outros usuários no mesmo desenho.
    /// </summary>
    public async Task SendUpdate(string drawingId, object payload)
    {
        if (string.IsNullOrEmpty(drawingId) || payload == null) return;

        try
        {
            await Clients.OthersInGroup(drawingId).SendAsync("ReceiveUpdate", payload);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[SignalR] Falha no SendUpdate para o desenho {DrawingId}", drawingId);
        }
    }

    /// <summary>
    /// Transmite a posição do cursor para os outros usuários.
    /// </summary>
    public async Task SendCursorPosition(string drawingId, string userId, string userName, double x, double y)
    {
        if (string.IsNullOrEmpty(drawingId) || string.IsNullOrEmpty(userId)) return;

        try
        {
            await Clients.OthersInGroup(drawingId).SendAsync("ReceiveCursorPosition", new { userId, userName, x, y });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[SignalR] Falha no SendCursorPosition para o usuário {UserId} no desenho {DrawingId}", userId, drawingId);
        }
    }
}
