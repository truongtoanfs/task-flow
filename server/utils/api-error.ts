import type {
  ApiErrorCode,
  ApiErrorResponse,
  ApiErrorStatus,
} from '../contracts/api'

export class ApiError extends Error {
  readonly statusCode: ApiErrorStatus
  readonly code: ApiErrorCode
  readonly details?: unknown

  constructor(
    statusCode: ApiErrorStatus,
    code: ApiErrorCode,
    message: string,
    details?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.code = code
    this.details = details
  }
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  return new ApiError(
    500,
    'INTERNAL_ERROR',
    'An unexpected error occurred.',
  )
}

export function toApiErrorResponse(
  error: ApiError,
): ApiErrorResponse {
  return {
    error: {
      code: error.code,
      message: error.message,
      ...(error.details === undefined
        ? {}
        : { details: error.details }),
    },
  }
}