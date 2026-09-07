import {
  defineEventHandler,
  setResponseStatus,
  type H3Event,
} from 'h3'
import type { ApiSuccessResponse } from '../contracts/api'
import {
  ApiError,
  normalizeApiError,
  toApiErrorResponse,
} from './api-error'

export function defineApiHandler<T>(
  handler: (event: H3Event) => Promise<T> | T,
) {
  return defineEventHandler(async (event) => {
    try {
      const data = await handler(event)

      return {
        data,
      } satisfies ApiSuccessResponse<T>
    }
    catch (error: unknown) {
      if (!(error instanceof ApiError)) {
        console.error('Unhandled API error.', error)
      }

      const apiError = normalizeApiError(error)
      setResponseStatus(event, apiError.statusCode)

      return toApiErrorResponse(apiError)
    }
  })
}