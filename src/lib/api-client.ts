import { logger } from './logger';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown, context?: string): never {
  logger.error(`API Error${context ? ` in ${context}` : ''}`, {
    error: error instanceof Error ? error.message : String(error),
  });

  if (error instanceof ApiError) {
    throw error;
  }

  if (error instanceof Error) {
    throw new ApiError(error.message);
  }

  throw new ApiError('An unexpected error occurred');
}

export function createApiResponse<T>(data: T | null, error: Error | null) {
  return {
    data,
    error,
    isSuccess: !error && data !== null,
    isError: !!error,
  };
}
