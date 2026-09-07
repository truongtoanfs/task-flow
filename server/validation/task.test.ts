import { describe, expect, it } from 'vitest'
import {
  createTaskBodySchema,
  projectParamsSchema,
  taskListQuerySchema,
  updateTaskBodySchema,
} from './task'

const projectId
  = '20000000-0000-4000-8000-000000000001'

describe('createTaskBodySchema', () => {
  it('accepts, trims, and applies defaults', () => {
    const result = createTaskBodySchema.parse({
      title: '  Prepare API contract  ',
      description: '   ',
    })

    expect(result).toEqual({
      title: 'Prepare API contract',
      description: null,
      status: 'todo',
      priority: 'medium',
    })
  })

  it('rejects an empty title', () => {
    const result = createTaskBodySchema.safeParse({
      title: '   ',
    })

    expect(result.success).toBe(false)
  })

  it('rejects title longer than 200', () => {
    const result = createTaskBodySchema.safeParse({
      title: 'T'.repeat(201),
    })

    expect(result.success).toBe(false)
  })

  it('rejects an invalid status', () => {
    const result = createTaskBodySchema.safeParse({
      title: 'Prepare API contract',
      status: 'blocked',
    })

    expect(result.success).toBe(false)
  })

  it('rejects unknown fields', () => {
    const result = createTaskBodySchema.safeParse({
      title: 'Prepare API contract',
      createdBy: projectId,
    })

    expect(result.success).toBe(false)
  })
})

describe('route params and query schemas', () => {
  it('accepts a valid project UUID', () => {
    expect(
      projectParamsSchema.parse({ projectId }),
    ).toEqual({ projectId })
  })

  it('rejects an invalid project UUID', () => {
    const result = projectParamsSchema.safeParse({
      projectId: 'not-a-uuid',
    })

    expect(result.success).toBe(false)
  })

  it('coerces pagination and applies defaults', () => {
    expect(
      taskListQuerySchema.parse({ page: '2' }),
    ).toEqual({
      page: 2,
      pageSize: 20,
    })
  })

  it('rejects unknown query fields', () => {
    const result = taskListQuerySchema.safeParse({
      sortBy: 'createdAt',
    })

    expect(result.success).toBe(false)
  })
})

describe('updateTaskBodySchema', () => {
  it('requires the current version', () => {
    const result = updateTaskBodySchema.safeParse({
      status: 'done',
    })

    expect(result.success).toBe(false)
  })

  it('requires a mutable field', () => {
    const result = updateTaskBodySchema.safeParse({
      version: 1,
    })

    expect(result.success).toBe(false)
  })

  it('accepts a valid update', () => {
    expect(
      updateTaskBodySchema.parse({
        status: 'done',
        version: 1,
      }),
    ).toEqual({
      status: 'done',
      version: 1,
    })
  })
})