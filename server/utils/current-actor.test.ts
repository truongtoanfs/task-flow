import { describe, expect, it } from 'vitest'
import { ApiError } from './api-error'
import { requireActorId } from './current-actor'

const actorId
  = '10000000-0000-4000-8000-000000000001'

describe('requireActorId', () => {
  it('returns the server-authenticated actor ID', () => {
    expect(
      requireActorId({
        context: {
          auth: { userId: actorId },
        },
      }),
    ).toBe(actorId)
  })

  it('rejects a request without authentication', () => {
    try {
      requireActorId({ context: {} })

      throw new Error(
        'Expected authentication to fail.',
      )
    }
    catch (error: unknown) {
      expect(error).toBeInstanceOf(ApiError)

      if (!(error instanceof ApiError)) {
        throw error
      }

      expect(error.statusCode).toBe(401)
      expect(error.code)
        .toBe('AUTHENTICATION_REQUIRED')
    }
  })
})