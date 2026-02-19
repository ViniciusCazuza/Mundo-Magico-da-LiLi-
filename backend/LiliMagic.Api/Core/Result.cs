namespace LiliMagic.Api.Core;

public class Result<T>
{
    public bool Success { get; }
    public T? Data { get; }
    public string? Error { get; }
    public string? ErrorCode { get; }

    protected Result(bool success, T? data, string? error, string? errorCode)
    {
        Success = success;
        Data = data;
        Error = error;
        ErrorCode = errorCode;
    }

    public static Result<T> Ok(T data) => new(true, data, null, null);
    public static Result<T> Fail(string error, string? errorCode = null) => new(false, default, error, errorCode);
}
