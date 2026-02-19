
export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

export const Result = {
  ok: <T>(data: T): Result<T, never> => ({ success: true, data }),
  fail: <E>(error: E): Result<never, E> => ({ success: false, error }),
  
  // High-order utility
  tryCatch: async <T>(promise: Promise<T>): Promise<Result<T, Error>> => {
    try {
      const data = await promise;
      return Result.ok(data);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error(String(error)));
    }
  }
};
