import { describe, expect, it } from 'vitest'
import { ApiError } from '../utils/api-error'
import { assertCanCreateTask } from './task-service'

describe('assertCanCreateTask', () => {
  it.each(['owner', 'member'] as const)(
    'allows the %s role',
    (role) => {
      expect(
        () => assertCanCreateTask(role),
      ).not.toThrow()
    },
  )

  it('rejects the viewer role', () => {
    try {
      assertCanCreateTask('viewer')

      throw new Error(
        'Expected authorization to fail.',
      )
    }
    catch (error: unknown) {
      expect(error).toBeInstanceOf(ApiError)

      if (!(error instanceof ApiError)) {
        throw error
      }

      expect(error.statusCode).toBe(403)
      expect(error.code).toBe('FORBIDDEN')
    }
  })

  it('hides projects outside the actor membership', () => {
    try {
      assertCanCreateTask(null)

      throw new Error(
        'Expected project lookup to fail.',
      )
    }
    catch (error: unknown) {
      expect(error).toBeInstanceOf(ApiError)

      if (!(error instanceof ApiError)) {
        throw error
      }

      expect(error.statusCode).toBe(404)
      expect(error.code)
        .toBe('RESOURCE_NOT_FOUND')
    }
  })
})