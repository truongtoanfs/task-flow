import {
  getQuery,
  getRouterParams,
  readBody,
  type H3Event,
} from 'h3'
import { z } from 'zod'
import type { ValidationIssue } from '../contracts/api'
import { ApiError } from './api-error'

function toValidationIssues(
  error: z.ZodError,
): ValidationIssue[] {
  return error.issues.map(issue => ({
    path: issue.path.length === 0
      ? '$'
      : issue.path.map(String).join('.'),
    code: issue.code,
    message: issue.message,
  }))
}

export function parseRequestData<
  TSchema extends z.ZodType,
>(
  schema: TSchema,
  input: unknown,
): z.output<TSchema> {
  const result = schema.safeParse(input)

  if (!result.success) {
    throw new ApiError(
      422,
      'VALIDATION_ERROR',
      'Request validation failed.',
      toValidationIssues(result.error),
    )
  }

  return result.data
}

export async function parseRequestBody<
  TSchema extends z.ZodType,
>(
  event: H3Event,
  schema: TSchema,
): Promise<z.output<TSchema>> {
  let body: unknown

  try {
    body = await readBody(event)
  }
  catch {
    throw new ApiError(
      400,
      'BAD_REQUEST',
      'Request body is not valid JSON.',
    )
  }

  return parseRequestData(schema, body)
}

export function parseRequestParams<
  TSchema extends z.ZodType,
>(
  event: H3Event,
  schema: TSchema,
): z.output<TSchema> {
  return parseRequestData(
    schema,
    getRouterParams(event),
  )
}

export function parseRequestQuery<
  TSchema extends z.ZodType,
>(
  event: H3Event,
  schema: TSchema,
): z.output<TSchema> {
  return parseRequestData(
    schema,
    getQuery(event),
  )
}