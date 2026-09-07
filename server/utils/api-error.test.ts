import { describe, expect, it } from 'vitest'
import {
  ApiError,
  normalizeApiError,
  toApiErrorResponse,
} from './api-error'

describe('API error convention', () => {
  it('serializes a known application error', () => {
    const error = new ApiError(
      409,
      'VERSION_CONFLICT',
      'The task has already changed.',
    )

    expect(toApiErrorResponse(error)).toEqual({
      error: {
        code: 'VERSION_CONFLICT',
        message: 'The task has already changed.',
      },
    })
  })

  it('does not expose unexpected errors', () => {
    const databaseError = new Error(
      'SQL failed at /secret/server/file.ts:42',
    )

    const normalized
      = normalizeApiError(databaseError)

    const response
      = toApiErrorResponse(normalized)

    const serializedResponse
      = JSON.stringify(response)

    expect(normalized.statusCode).toBe(500)

    expect(response).toEqual({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred.',
      },
    })

    expect(serializedResponse)
      .not.toContain('SQL failed')

    expect(serializedResponse)
      .not.toContain('/secret/server')
  })
})