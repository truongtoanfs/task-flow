import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { ApiError } from './api-error'
import { parseRequestData } from './request-validation'

describe('parseRequestData', () => {
  const schema = z.strictObject({
    title: z.string().trim().min(1),
  })

  it('returns transformed data', () => {
    expect(
      parseRequestData(schema, {
        title: '  Valid title  ',
      }),
    ).toEqual({
      title: 'Valid title',
    })
  })

  it('throws a standardized 422 error', () => {
    try {
      parseRequestData(schema, {
        title: '',
      })

      throw new Error(
        'Expected validation to fail.',
      )
    }
    catch (error: unknown) {
      expect(error).toBeInstanceOf(ApiError)

      if (!(error instanceof ApiError)) {
        throw error
      }

      expect(error.statusCode).toBe(422)
      expect(error.code).toBe('VALIDATION_ERROR')

      expect(error.details).toEqual([
        expect.objectContaining({
          path: 'title',
          code: 'too_small',
        }),
      ])
    }
  })
})