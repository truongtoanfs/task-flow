import { z } from 'zod'
import {
  taskPriorities,
  taskStatuses,
} from '../database/schema'

const taskTitleSchema = z
  .string()
  .trim()
  .min(1, 'Title is required.')
  .max(
    200,
    'Title must not exceed 200 characters.',
  )

const taskDescriptionSchema = z.preprocess(
  (value) => {
    if (typeof value !== 'string') {
      return value
    }

    const trimmedValue = value.trim()

    return trimmedValue === ''
      ? null
      : trimmedValue
  },
  z
    .string()
    .max(
      10_000,
      'Description must not exceed 10000 characters.',
    )
    .nullable()
    .optional(),
)

export const projectParamsSchema = z.strictObject({
  projectId: z.uuid(),
})

export const taskParamsSchema = z.strictObject({
  projectId: z.uuid(),
  taskId: z.uuid(),
})

export const taskListQuerySchema = z.strictObject({
  status: z.enum(taskStatuses).optional(),
  priority: z.enum(taskPriorities).optional(),
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20),
})

export const createTaskBodySchema = z.strictObject({
  title: taskTitleSchema,
  description: taskDescriptionSchema,
  status: z.enum(taskStatuses).default('todo'),
  priority: z.enum(taskPriorities).default('medium'),
})

export const updateTaskBodySchema = z
  .strictObject({
    title: taskTitleSchema.optional(),
    description: taskDescriptionSchema,
    status: z.enum(taskStatuses).optional(),
    priority: z.enum(taskPriorities).optional(),
    version: z.number().int().min(1),
  })
  .refine(
    data => data.title !== undefined
      || data.description !== undefined
      || data.status !== undefined
      || data.priority !== undefined,
    {
      message:
        'At least one task field must be provided.',
      path: [],
    },
  )

export type ProjectParams = z.output<
  typeof projectParamsSchema
>

export type TaskParams = z.output<
  typeof taskParamsSchema
>

export type TaskListQuery = z.output<
  typeof taskListQuerySchema
>

export type CreateTaskBody = z.output<
  typeof createTaskBodySchema
>

export type UpdateTaskBody = z.output<
  typeof updateTaskBodySchema
>