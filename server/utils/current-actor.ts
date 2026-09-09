import type { H3Event } from 'h3'
import { ApiError } from './api-error'

export interface AuthContext {
  userId: string
}

interface EventWithAuthContext {
  context: {
    auth?: AuthContext
  }
}

export function requireActorId(
  event: H3Event | EventWithAuthContext,
): string {
  const actorId = event.context.auth?.userId

  if (!actorId) {
    throw new ApiError(
      401,
      'AUTHENTICATION_REQUIRED',
      'Authentication is required.',
    )
  }

  return actorId
}