using System.Collections.Concurrent;
using LiliMagic.Api.Core;
using LiliMagic.Api.DTOs;

namespace LiliMagic.Api.Services;

/// <summary>
/// Interface para repositório de desenhos.
/// </summary>
public interface IDrawingRepository
{
    /// <summary>
    /// Cria um novo desenho.
    /// </summary>
    /// <param name="drawing">O desenho a ser criado</param>
    /// <returns>Resultado da operação com o desenho criado</returns>
    Task<Result<DrawingDto>> CreateAsync(DrawingDto drawing);
    
    /// <summary>
    /// Obtém um desenho por ID.
    /// </summary>
    /// <param name="id">ID do desenho</param>
    /// <returns>Resultado da operação com o desenho encontrado</returns>
    Task<Result<DrawingDto>> GetByIdAsync(Guid id);
    
    /// <summary>
    /// Atualiza um desenho existente.
    /// </summary>
    /// <param name="drawing">O desenho atualizado</param>
    /// <returns>Resultado da operação com o desenho atualizado</returns>
    Task<Result<DrawingDto>> UpdateAsync(DrawingDto drawing);
    
    /// <summary>
    /// Exclui um desenho por ID.
    /// </summary>
    /// <param name="id">ID do desenho</param>
    /// <returns>Resultado da operação</returns>
    Task<Result<bool>> DeleteAsync(Guid id);
    
    /// <summary>
    /// Lista desenhos de um autor com paginação.
    /// </summary>
    /// <param name="authorId">ID do autor</param>
    /// <param name="page">Número da página</param>
    /// <param name="pageSize">Tamanho da página</param>
    /// <returns>Resultado da operação com lista paginada de desenhos</returns>
    Task<Result<PagedList<DrawingDto>>> GetByAuthorAsync(Guid authorId, int page, int pageSize);
    
    /// <summary>
    /// Adiciona uma camada a um desenho existente.
    /// </summary>
    /// <param name="drawingId">ID do desenho</param>
    /// <param name="layer">Camada a ser adicionada</param>
    /// <returns>Resultado da operação com o desenho atualizado</returns>
    Task<Result<DrawingDto>> AddLayerAsync(Guid drawingId, LayerBaseDto layer);
}